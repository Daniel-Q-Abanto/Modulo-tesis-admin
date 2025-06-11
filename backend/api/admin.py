from django.contrib import admin
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

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = (
        'id_usuario', 'nombre_usuario', 'correo', 'rol',
        'is_active', 'is_staff', 'is_superuser', 'fecha_registro'
    )
    search_fields = ('nombre_usuario', 'correo')
    list_filter = ('rol', 'is_active', 'is_staff', 'fecha_registro')
    ordering = ('-fecha_registro',)


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = (
        'id_producto', 'nombre_producto', 'descripcion',
        'precio', 'stock', 'imagen_producto'
    )
    search_fields = ('nombre_producto', 'descripcion')
    list_filter = ('stock',)
    list_editable = ('precio', 'stock')


@admin.register(Diseño)
class DiseñoAdmin(admin.ModelAdmin):
    list_display = (
        'id_diseño', 'nombre_diseño', 'estado',
        'fecha_creacion', 'usuario'
    )
    search_fields = ('nombre_diseño', 'descripcion')
    list_filter = ('estado', 'fecha_creacion')
    date_hierarchy = 'fecha_creacion'


@admin.register(Orden)
class OrdenAdmin(admin.ModelAdmin):
    list_display = (
        'id_orden', 'cantidad', 'precio_total', 'estado',
        'fecha_orden', 'usuario', 'diseño'
    )
    search_fields = ('estado',)
    list_filter = ('estado', 'fecha_orden')
    date_hierarchy = 'fecha_orden'


@admin.register(HistorialIa)
class HistorialIaAdmin(admin.ModelAdmin):
    list_display = (
        'id_historial', 'prompt', 'imagen_generada',
        'fecha_generacion', 'usuario'
    )
    search_fields = ('prompt',)
    list_filter = ('fecha_generacion',)
    date_hierarchy = 'fecha_generacion'


@admin.register(ImagenesGeneradas)
class ImagenesGeneradasAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'prompt', 'imagen_url',
        'fecha_generada', 'usuario'
    )
    search_fields = ('prompt',)
    list_filter = ('fecha_generada',)
    date_hierarchy = 'fecha_generada'


@admin.register(Personalizacion)
class PersonalizacionAdmin(admin.ModelAdmin):
    list_display = (
        'id_personalizacion', 'tipo_personalizacion',
        'fecha_personalizacion', 'diseño'
    )
    search_fields = ('tipo_personalizacion',)
    list_filter = ('fecha_personalizacion',)
    date_hierarchy = 'fecha_personalizacion'


@admin.register(RolesYPermisos)
class RolesYPermisosAdmin(admin.ModelAdmin):
    list_display = ('id_rol', 'rol', 'permiso')
    search_fields = ('rol', 'permiso')
