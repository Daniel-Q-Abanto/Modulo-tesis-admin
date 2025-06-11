from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import (
    Usuario,
    Producto,
    Diseño,
    Orden,
    HistorialIa,
    ImagenesGeneradas,
    Personalizacion,
    RolesYPermisos
)



class RolesYPermisosSerializer(serializers.ModelSerializer):
    class Meta:
        model = RolesYPermisos
        fields = ['id_rol', 'rol', 'permiso']

    def validate_permiso(self, value):
        # Aquí validamos si el permiso personalizado es válido
        if value == 'nuevo' and 'nuevo_permiso' not in self.context['request'].data:
            raise serializers.ValidationError('El permiso personalizado debe ser proporcionado.')
        return value

class UsuarioSerializer(serializers.ModelSerializer):
    rol = RolesYPermisosSerializer(read_only=True)
    rol_id = serializers.PrimaryKeyRelatedField(queryset=RolesYPermisos.objects.all(), write_only=True, source='rol')

    class Meta:
        model = Usuario
        fields = ['id_usuario', 'correo', 'nombre_usuario', 'password', 'rol', 'rol_id', 'is_active', 'is_staff', 'fecha_registro']
        extra_kwargs = {
            'password': {'write_only': True},  # La contraseña solo debe ser escrita, no leída
        }

    def create(self, validated_data):
        password = validated_data.pop('password')  # Obtener la contraseña
        user = Usuario(**validated_data)  # Crear el usuario con los datos validados
        user.set_password(password)  # Establecer la contraseña de manera segura
        user.save()  # Guardar el usuario
        return user

    def update(self, instance, validated_data):
        # Si la contraseña se ha proporcionado, la actualizamos
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)  # Establecer la nueva contraseña de manera segura
        return super().update(instance, validated_data)



class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = (
            'id_producto',
            'nombre_producto',
            'descripcion',
            'precio',
            'stock',
            'imagen_producto'
        )


class DiseñoSerializer(serializers.ModelSerializer):
    nombre_usuario = serializers.ReadOnlyField(source='usuario.nombre_usuario')

    class Meta:
        model = Diseño
        fields = (
            'id_diseño',
            'nombre_diseño',
            'descripcion',
            'imagen_diseño',
            'fecha_creacion',
            'estado',
            'usuario',
            'nombre_usuario'
        )


class OrdenSerializer(serializers.ModelSerializer):
    nombre_usuario = serializers.ReadOnlyField(source='usuario.nombre_usuario')
    nombre_diseño = serializers.ReadOnlyField(source='diseño.nombre_diseño')

    class Meta:
        model = Orden
        fields = (
            'id_orden',
            'cantidad',
            'precio_total',
            'estado',
            'fecha_orden',
            'diseño',
            'nombre_diseño',
            'usuario',
            'nombre_usuario'
        )


class HistorialIaSerializer(serializers.ModelSerializer):
    nombre_usuario = serializers.ReadOnlyField(source='usuario.nombre_usuario')

    class Meta:
        model = HistorialIa
        fields = (
            'id_historial',
            'prompt',
            'imagen_generada',
            'fecha_generacion',
            'usuario',
            'nombre_usuario'
        )


class ImagenesGeneradasSerializer(serializers.ModelSerializer):
    nombre_usuario = serializers.ReadOnlyField(source='usuario.nombre_usuario')

    class Meta:
        model = ImagenesGeneradas
        fields = (
            'id',
            'usuario',
            'nombre_usuario',
            'prompt',
            'imagen_url',
            'fecha_generada'
        )


class PersonalizacionSerializer(serializers.ModelSerializer):
    nombre_diseño = serializers.ReadOnlyField(source='diseño.nombre_diseño')

    class Meta:
        model = Personalizacion
        fields = (
            'id_personalizacion',
            'tipo_personalizacion',
            'valores',
            'fecha_personalizacion',
            'diseño',
            'nombre_diseño'
        )




class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        correo = attrs.get("correo")
        password = attrs.get("password")  # ✅ IMPORTANTE

        try:
            user = Usuario.objects.select_related('rol').get(correo=correo)
        except Usuario.DoesNotExist:
            raise serializers.ValidationError("Usuario no encontrado.")

        if not user.check_password(password):  # ✅
            raise serializers.ValidationError("Contraseña incorrecta.")

        if user.rol.rol != "administrador":
            raise serializers.ValidationError("No tienes permisos para acceder al panel de administración.")

        if not user.is_active:
            raise serializers.ValidationError("Usuario inactivo.")

        # Si pasa todas las validaciones, devuelve el token y más info
        data = super().validate(attrs)
        data['rol'] = user.rol.rol
        data['nombre_usuario'] = user.nombre_usuario
        return data