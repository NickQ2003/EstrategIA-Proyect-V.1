from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HuespedViewSet, InvitadoViewSet, DashboardView

router = DefaultRouter()
router.register(r'huespedes', HuespedViewSet)
router.register(r'invitados', InvitadoViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/stats/', DashboardView.as_view(), name='dashboard-stats'),
]
