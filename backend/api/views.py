from rest_framework import viewsets, permissions, status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import IsAuthenticated,AllowAny
from .models import *
from .serializers import *

Usuario = get_user_model()
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# =====================================
# Autenticación personalizada por rol
# =====================================


# =============================
# CRUD con ViewSets para la API
# =============================s

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    lookup_field = 'id_usuario'

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]  # Permite el registro sin autenticación
        return [IsAuthenticated()]  # Para otras acciones requerir autenticación

    def create(self, request, *args, **kwargs):
        # Asignar el rol por defecto si no se especifica uno
        if 'rol_id' not in request.data:
            request.data['rol_id'] = 2  # El rol "trabajador" tiene el id_rol 2

        try:
            rol = RolesYPermisos.objects.get(id_rol=request.data['rol_id'])
        except RolesYPermisos.DoesNotExist:
            return Response({"detail": "Rol no válido."}, status=status.HTTP_400_BAD_REQUEST)

        return super().create(request, *args, **kwargs)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    # Método GET para obtener los datos del perfil del usuario autenticado
    def get(self, request):
        usuario = request.user
        serializer = UsuarioSerializer(usuario)
        return Response(serializer.data)

    # Método PUT para actualizar los datos del perfil del usuario autenticado
    def put(self, request):
        usuario = request.user
        serializer = UsuarioSerializer(usuario, data=request.data, partial=True)  # partial=True permite actualizaciones parciales

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [permissions.AllowAny]

class DiseñoViewSet(viewsets.ModelViewSet):
    queryset = Diseño.objects.all()
    serializer_class = DiseñoSerializer
    permission_classes = [permissions.AllowAny]

class OrdenViewSet(viewsets.ModelViewSet):
    queryset = Orden.objects.all()
    serializer_class = OrdenSerializer
    permission_classes = [permissions.AllowAny]

class HistorialIaViewSet(viewsets.ModelViewSet):
    queryset = HistorialIa.objects.all()  # Esto devolverá todos los registros, no solo los del usuario actual
    serializer_class = HistorialIaSerializer
    permission_classes = [permissions.IsAuthenticated]

class ImagenesGeneradasViewSet(viewsets.ModelViewSet):
    queryset = ImagenesGeneradas.objects.all()
    serializer_class = ImagenesGeneradasSerializer
    permission_classes = [permissions.AllowAny]

class PersonalizacionViewSet(viewsets.ModelViewSet):
    queryset = Personalizacion.objects.all()
    serializer_class = PersonalizacionSerializer
    permission_classes = [permissions.AllowAny]

class RolesYPermisosViewSet(viewsets.ModelViewSet):
    queryset = RolesYPermisos.objects.all()
    serializer_class = RolesYPermisosSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        # Verificar si el permiso es nuevo
        permiso = request.data.get('permiso')
        if permiso == 'nuevo' and 'nuevo_permiso' in request.data:
            # Si es un permiso personalizado, reemplazarlo
            permiso = request.data['nuevo_permiso']
            request.data['permiso'] = permiso
        
        # Crear el nuevo rol
        return super().create(request, *args, **kwargs)
