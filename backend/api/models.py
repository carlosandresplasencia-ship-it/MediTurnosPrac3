from django.db import models
from django.contrib.auth.models import AbstractUser

class Usuario(AbstractUser):
    ROLES = (
        ('ADMIN', 'Administrador'),
        ('MEDICO', 'Medico'),
        ('PACIENTE', 'Paciente'),
        ('SECRETARIA', 'Secretaria'),
    )
    rol = models.CharField(max_length=15, choices=ROLES, default='PACIENTE')
    dni = models.CharField(max_length=15, unique=True, null=True, blank=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)

class Especialidad(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)

    def __str__(self):
        return self.nombre

class ObraSocial(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre

class PerfilMedico(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='perfil_medico')
    especialidad = models.ForeignKey(Especialidad, on_delete=models.SET_NULL, null=True)
    matricula = models.CharField(max_length=50)

    def __str__(self):
        return f'Dr/a. {self.usuario.get_full_name()}'

class Turno(models.Model):
    ESTADOS = (
        ('PENDIENTE', 'Pendiente'),
        ('ATENDIDO', 'Atendido'),
        ('CANCELADO', 'Cancelado'),
        ('AUSENTE', 'Ausente'),
    )
    paciente = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='turnos_paciente')
    medico = models.ForeignKey(PerfilMedico, on_delete=models.CASCADE, related_name='turnos_medico')
    fecha_hora = models.DateTimeField()
    estado = models.CharField(max_length=10, choices=ESTADOS, default='PENDIENTE')
    motivo_consulta = models.TextField(blank=True)

    class Meta:
        unique_together = ('medico', 'fecha_hora')
