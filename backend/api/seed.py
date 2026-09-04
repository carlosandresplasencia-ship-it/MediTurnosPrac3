from api.models import Usuario, Especialidad, PerfilMedico

cardio, _ = Especialidad.objects.get_or_create(nombre='Cardiologia', descripcion='Atencion cardiovascular')
pedia, _ = Especialidad.objects.get_or_create(nombre='Pediatria', descripcion='Atencion infantil')

admin, _ = Usuario.objects.get_or_create(username='admin_mediturnos', defaults={'email': 'admin@mediturnos.com', 'first_name': 'Admin', 'last_name': 'Sistema', 'rol': 'ADMIN', 'is_staff': True, 'is_superuser': True})
admin.set_password('Admin1234!')
admin.rol = 'ADMIN'
admin.save()

med1, _ = Usuario.objects.get_or_create(username='dr_gonzalez', defaults={'first_name': 'Carlos', 'last_name': 'Gonzalez', 'email': 'gonzalez@mediturnos.com', 'rol': 'MEDICO'})
med1.set_password('Medico1234!')
med1.rol = 'MEDICO'
med1.save()
PerfilMedico.objects.get_or_create(usuario=med1, defaults={'especialidad': cardio, 'matricula': 'MN-45892'})

med2, _ = Usuario.objects.get_or_create(username='dra_perez', defaults={'first_name': 'Maria', 'last_name': 'Perez', 'email': 'perez@mediturnos.com', 'rol': 'MEDICO'})
med2.set_password('Medico1234!')
med2.rol = 'MEDICO'
med2.save()
PerfilMedico.objects.get_or_create(usuario=med2, defaults={'especialidad': pedia, 'matricula': 'MN-51204'})

pac1, _ = Usuario.objects.get_or_create(username='juan_perez', defaults={'first_name': 'Juan', 'last_name': 'Perez', 'email': 'juan@gmail.com', 'rol': 'PACIENTE', 'dni': '38452109'})
pac1.set_password('Paciente1234!')
pac1.rol = 'PACIENTE'
pac1.save()

pac2, _ = Usuario.objects.get_or_create(username='lucia_gomez', defaults={'first_name': 'Lucia', 'last_name': 'Gomez', 'email': 'lucia@gmail.com', 'rol': 'PACIENTE', 'dni': '41102938'})
pac2.set_password('Paciente1234!')
pac2.rol = 'PACIENTE'
pac2.save()

print('OK!')
