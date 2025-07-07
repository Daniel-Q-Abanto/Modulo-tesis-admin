from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomTokenObtainPairView,
    UsuarioViewSet,
    ProductoViewSet,
    DiseñoViewSet,
    OrdenViewSet,
    HistorialIaViewSet,
    ImagenesGeneradasViewSet,
    PersonalizacionViewSet,
    RolesYPermisosViewSet, MeView
)

router = DefaultRouter()
router.register('usuarios', UsuarioViewSet, basename='usuarios')
router.register('productos', ProductoViewSet, basename='productos')
router.register('diseños', DiseñoViewSet, basename='diseños')
router.register('ordenes', OrdenViewSet, basename='ordenes')
router.register('historiales', HistorialIaViewSet, basename='historiales')
router.register('imagenes', ImagenesGeneradasViewSet, basename='imagenes')
router.register('personalizaciones', PersonalizacionViewSet, basename='personalizaciones')
router.register('roles', RolesYPermisosViewSet, basename='roles')

urlpatterns = [
    path('', include(router.urls)),
    path('me/', MeView.as_view(), name='profile'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]