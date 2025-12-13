from django.core.management.base import BaseCommand
from django.utils import timezone
from api.models import Invitado, ActivityLog
import random
from datetime import timedelta

class Command(BaseCommand):
    help = 'Seeds the database with dashboard data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')
        
        # Helper to create logs
        def log_action(target, action, date):
            ActivityLog.objects.create(
                target_name=target,
                action=action,
                status='SUCCESS',
                timestamp=date
            )
            # Hack: update timestamp manually since auto_now_add=True
            log = ActivityLog.objects.latest('id')
            log.timestamp = date
            log.save()

        now = timezone.now()
        
        # 1. Create Data for Previous Month (e.g., Nov if now is Dec)
        prev_month = now.replace(day=1) - timedelta(days=1)
        start_prev = prev_month.replace(day=1)
        
        self.stdout.write(f'Creating data for {prev_month.strftime("%B %Y")}...')
        
        for i in range(20):
            # Random date in prev month
            day_offset = random.randint(0, 20)
            reg_date = start_prev + timedelta(days=day_offset)
            
            nombre = f"Usuario Historico {i}"
            cedula = f"1000{i}"
            
            # Create Invitado (some might be inactive/deleted later)
            inv = Invitado.objects.create(
                nombre_completo=nombre,
                numero_cedula=cedula,
                tipo_cedula='CC',
                rol='Participante',
                registrado_en=reg_date
            )
            # Update created_at
            inv.registrado_en = reg_date
            inv.save()
            
            # Log Creation
            log_action(nombre, 'CREATE', reg_date)

            # Randomly delete some
            if random.random() < 0.2:
                # Log delete
                del_date = reg_date + timedelta(hours=2)
                log_action(nombre, 'DELETE', del_date)
                # Actually delete or mark inactive? 
                # Requirement says "count deleted users". ActivityLog persists even if object deleted.
                inv.delete()

        # 2. Create Data for Current Month
        self.stdout.write(f'Creating data for {now.strftime("%B %Y")}...')
        for i in range(15):
            day_offset = random.randint(0, now.day - 1 if now.day > 1 else 0)
            reg_date = now.replace(day=1) + timedelta(days=day_offset)
            
            nombre = f"Nuevo Usuario {i}"
            cedula = f"2000{i}"
            
            inv = Invitado.objects.create(
                nombre_completo=nombre,
                numero_cedula=cedula,
                tipo_cedula='CC',
                rol='Jurado' if i % 3 == 0 else 'Participante',
                registrado_en=reg_date
            )
            inv.registrado_en = reg_date
            inv.save()
            log_action(nombre, 'CREATE', reg_date)

        self.stdout.write(self.style.SUCCESS('Successfully seeded dashboard data'))
