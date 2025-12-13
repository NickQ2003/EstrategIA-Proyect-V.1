from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count
from django.db.models.functions import TruncDay
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Huesped, Invitado, ActivityLog
from .serializers import HuespedSerializer, InvitadoSerializer

class HuespedViewSet(viewsets.ModelViewSet):
    queryset = Huesped.objects.all()
    serializer_class = HuespedSerializer

class InvitadoViewSet(viewsets.ModelViewSet):
    queryset = Invitado.objects.all()
    serializer_class = InvitadoSerializer

    def get_queryset(self):
        queryset = Invitado.objects.filter(is_active=True)
        
        # Filtering
        nombre = self.request.query_params.get('nombre', None)
        cedula = self.request.query_params.get('cedula', None)
        fecha = self.request.query_params.get('fecha', None)
        
        if nombre:
            queryset = queryset.filter(nombre_completo__icontains=nombre)
        if cedula:
            queryset = queryset.filter(numero_cedula__icontains=cedula)
        if fecha:
            # Assumes format YYYY-MM-DD
            queryset = queryset.filter(registrado_en__date=fecha)
            
        return queryset

    @action(detail=False, methods=['get'])
    def verify(self, request):
        doc_id = request.query_params.get('doc_id')
        if not doc_id:
            return Response({'error': 'doc_id parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            invitado = Invitado.objects.get(numero_cedula=doc_id)
            serializer = self.get_serializer(invitado)
            return Response({'status': 'found', 'data': serializer.data})
        except Invitado.DoesNotExist:
            return Response({'status': 'not_found', 'error': 'Invitado no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    # Logging Overrides
    def perform_create(self, serializer):
        instance = serializer.save()
        ActivityLog.objects.create(
            target_name=instance.nombre_completo,
            action='CREATE',
            status='SUCCESS'
        )

    def perform_update(self, serializer):
        instance = serializer.save()
        ActivityLog.objects.create(
            target_name=instance.nombre_completo,
            action='UPDATE',
            status='SUCCESS'
        )

    def perform_destroy(self, instance):
        ActivityLog.objects.create(
            target_name=instance.nombre_completo,
            action='DELETE',
            status='SUCCESS'
        )
        instance.delete()

    def partial_update(self, request, *args, **kwargs):
        # Specific handling for 'HIDE' action if is_active is set to false
        instance = self.get_object()
        if 'is_active' in request.data and request.data['is_active'] is False:
             ActivityLog.objects.create(
                target_name=instance.nombre_completo,
                action='HIDE',
                status='SUCCESS'
            )
        return super().partial_update(request, *args, **kwargs)

class DashboardView(APIView):
    def get(self, request):
        # ?month=YYYY-MM
        month_str = request.query_params.get('month', datetime.now().strftime('%Y-%m'))
        try:
            target_date = datetime.strptime(month_str, '%Y-%m')
        except ValueError:
            target_date = datetime.now()

        # Define ranges
        start_of_month = target_date.replace(day=1)
        # End of month handling logic
        next_month = start_of_month.replace(day=28) + timedelta(days=4)
        end_of_month = next_month - timedelta(days=next_month.day)

        # Previous month
        prev_month_date = start_of_month - timedelta(days=1)
        start_prev_month = prev_month_date.replace(day=1)
        end_prev_month = prev_month_date # already end of prev month

        # Stats
        # 1. Total Interactions (Create/Update/Delete/Hide) All Time or filtered?
        # Requirement: "conteo real de usuarios contando todas las interacciones"
        # We'll treat this as "Total Registrations All Time" vs "Total in Month"?
        # User said: "conteeo real de usuarios... incluye eliminados" -> Total distinct people ever interacting?
        # Let's count 'CREATE' logs as "Total Users Historical"
        total_historical = ActivityLog.objects.filter(action='CREATE').count()

        # 2. Users in Current Month (Registrations)
        users_month = Invitado.objects.filter(
            registrado_en__gte=start_of_month, 
            registrado_en__lte=end_of_month
        ).count()

        # 3. Users in Prev Month
        users_prev = Invitado.objects.filter(
            registrado_en__gte=start_prev_month,
            registrado_en__lte=end_prev_month
        ).count()

        # 4. Recent Activity (Last 10 in selected month)
        # Fix: Filter by month range so it corresponds to the view context
        recent_activity = ActivityLog.objects.filter(
            timestamp__gte=start_of_month,
            timestamp__lte=end_of_month
        ).order_by('-timestamp')[:50] # Increased limit if inspecting history
        
        recent_data = [{
            'id': log.id,
            'actor': log.actor_name,
            'target': log.target_name,
            'action': log.action,
            'status': log.status,
            'timestamp': log.timestamp
        } for log in recent_activity]

        # 5. Chart Data (Daily registrations in the month)
        # Using database aggregation
        daily_stats = Invitado.objects.filter(
            registrado_en__gte=start_of_month,
            registrado_en__lte=end_of_month
        ).annotate(day=TruncDay('registrado_en')).values('day').annotate(count=Count('id')).order_by('day')
        
        chart_data = []
        # Fill missing days logic could be here, but frontend can handle or just show present days
        for entry in daily_stats:
            chart_data.append({
                'date': entry['day'].strftime('%Y-%m-%d'),
                'count': entry['count']
            })

        return Response({
            'total_historical': total_historical,
            'users_month': users_month,
            'users_prev_month': users_prev,
            'recent_activity': recent_data,
            'chart_data': chart_data,
            'meta': {
                'start_date': start_of_month.strftime('%Y-%m-%d'),
                'end_date': end_of_month.strftime('%Y-%m-%d')
            }
        })
