from rest_framework import serializers
from .models import Usuario, Especialidad, PerfilMedico, Turno

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'rol', 'dni', 'telefono']

class EspecialidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Especialidad
        fields = '__all__'

class PerfilMedicoSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    especialidad_nombre = serializers.ReadOnlyField(source='especialidad.nombre')

    class Meta:
        model = PerfilMedico
        fields = ['id', 'usuario', 'especialidad', 'especialidad_nombre', 'matricula']

class TurnoSerializer(serializers.ModelSerializer):
    paciente_nombre = serializers.ReadOnlyField(source='paciente.get_full_name')
    medico_nombre = serializers.ReadOnlyField(source='medico.usuario.get_full_name')
    especialidad_nombre = serializers.ReadOnlyField(source='medico.especialidad.nombre')

    class Meta:
        model = Turno
        fields = ['id', 'paciente', 'paciente_nombre', 'medico', 'medico_nombre', 'especialidad_nombre', 'fecha_hora', 'estado', 'motivo_consulta']
