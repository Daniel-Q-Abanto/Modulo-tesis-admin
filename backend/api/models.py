from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


class RolesYPermisos(models.Model):
    PERMISOS = [
        ('control_total', 'Control Total'),
        ('limitado', 'Acceso Limitado'),
    ]

    id_rol = models.AutoField(primary_key=True)
    rol = models.CharField(max_length=50, unique=True)
    permiso = models.CharField(max_length=50, choices=PERMISOS)

    def __str__(self):
        return self.rol

    class Meta:
        db_table = 'roles_y_permisos'


class UsuarioManager(BaseUserManager):
    def create_user(self, correo, nombre_usuario, password=None, **extra_fields):
        if not correo:
            raise ValueError("El correo es obligatorio")
        correo = self.normalize_email(correo)
        user = self.model(correo=correo, nombre_usuario=nombre_usuario, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, correo, nombre_usuario, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(correo, nombre_usuario, password, **extra_fields)

    def get_by_natural_key(self, correo):
        return self.get(correo=correo)


class Usuario(AbstractBaseUser, PermissionsMixin):
    ROLES = [
        ('administrador', 'Administrador'),
        ('trabajador', 'Trabajador'),
    ]

    id_usuario = models.AutoField(primary_key=True)
    correo = models.EmailField(unique=True, max_length=150)
    nombre_usuario = models.CharField(max_length=100)
    password = models.CharField(max_length=255)
    rol = models.ForeignKey(RolesYPermisos, on_delete=models.CASCADE)
    fecha_registro = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UsuarioManager()

    USERNAME_FIELD = 'correo'
    REQUIRED_FIELDS = ['nombre_usuario']

    def __str__(self):
        return self.nombre_usuario

    @property
    def id(self):  
        return self.id_usuario

    class Meta:
        db_table = 'usuarios'



class Producto(models.Model):
    id_producto = models.AutoField(primary_key=True)
    nombre_producto = models.CharField(max_length=150)
    descripcion = models.TextField(null=True, blank=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()
    imagen_producto = models.CharField(max_length=255)

    def __str__(self):
        return self.nombre_producto

    class Meta:
        db_table = 'productos'


class Diseño(models.Model):
    id_diseño = models.AutoField(primary_key=True)
    nombre_diseño = models.CharField(max_length=150)
    descripcion = models.TextField(null=True, blank=True)
    imagen_diseño = models.CharField(max_length=255)
    fecha_creacion = models.DateTimeField()
    estado = models.CharField(max_length=20)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='id_usuario')

    def __str__(self):
        return self.nombre_diseño

    class Meta:
        db_table = 'diseños'


class Orden(models.Model):
    id_orden = models.AutoField(primary_key=True)
    cantidad = models.PositiveIntegerField()
    precio_total = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(max_length=20)
    fecha_orden = models.DateTimeField()
    diseño = models.ForeignKey(Diseño, on_delete=models.CASCADE, db_column='id_diseño')
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='id_usuario')

    def __str__(self):
        return f"Orden {self.id_orden} - Usuario {self.usuario}"

    class Meta:
        db_table = 'ordenes'


class HistorialIa(models.Model):
    id_historial = models.AutoField(primary_key=True)
    prompt = models.TextField()
    imagen_generada = models.TextField(blank=True, null=True)
    fecha_generacion = models.DateTimeField(auto_now_add=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='id_usuario')

    def __str__(self):
        return f"IA: {self.prompt[:30]}..."

    class Meta:
        db_table = 'historial_ia'


class ImagenesGeneradas(models.Model):
    id = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(Usuario, null=True, blank=True, on_delete=models.SET_NULL, db_column='usuario_id')
    prompt = models.TextField()
    imagen_url = models.TextField()
    fecha_generada = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Imagen ID {self.id}"

    class Meta:
        db_table = 'imagenes_generadas'


class Personalizacion(models.Model):
    id_personalizacion = models.AutoField(primary_key=True)
    tipo_personalizacion = models.CharField(max_length=150)
    valores = models.JSONField()
    fecha_personalizacion = models.DateTimeField()
    diseño = models.ForeignKey(Diseño, on_delete=models.CASCADE, db_column='id_diseño')

    def __str__(self):
        return f"{self.tipo_personalizacion} - {self.diseño}"

    class Meta:
        db_table = 'personalizaciones'



