from django.db import models

class Huesped(models.Model):
    nombre = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    rol = models.CharField(max_length=50)  # e.g. 'Admin', 'Supervisor'

    def __str__(self):
        return f"{self.nombre} ({self.rol})"

class Invitado(models.Model):
    tipo_cedula = models.CharField(max_length=20)
    numero_cedula = models.CharField(max_length=20, unique=True)
    nombre_completo = models.CharField(max_length=200)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    rol = models.CharField(max_length=50, default='Participante')
    is_active = models.BooleanField(default=True)
    
    # Tracking fields
    registrado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre_completo} - {self.numero_cedula}"

class ActivityLog(models.Model):
    ACTION_CHOICES = [
        ('CREATE', 'Creación'),
        ('UPDATE', 'Edición'),
        ('DELETE', 'Eliminación'),
        ('HIDE', 'Ocultamiento'),
    ]
    STATUS_CHOICES = [
        ('SUCCESS', 'Exitoso'),
        ('FAILED', 'Fallido'),
    ]

    actor_name = models.CharField(max_length=100, default='Admin') 
    target_name = models.CharField(max_length=200)
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='SUCCESS')
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.action} on {self.target_name}"
