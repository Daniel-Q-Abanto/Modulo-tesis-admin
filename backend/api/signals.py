from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver
from django.db import connection
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

def reset_auto_increment(model):
    with connection.cursor() as cursor:
        cursor.execute(f"SELECT MAX({model._meta.pk.name}) FROM {model._meta.db_table}")
        max_id = cursor.fetchone()[0]

        next_id = 1 if max_id is None else max_id + 1
        cursor.execute(f"ALTER TABLE {model._meta.db_table} AUTO_INCREMENT = {next_id}")

# Señales al eliminar registros
@receiver(post_delete, sender=Usuario)
@receiver(post_delete, sender=Producto)
@receiver(post_delete, sender=Diseño)
@receiver(post_delete, sender=Orden)
@receiver(post_delete, sender=HistorialIa)
@receiver(post_delete, sender=ImagenesGeneradas)
@receiver(post_delete, sender=Personalizacion)
@receiver(post_delete, sender=RolesYPermisos)
def reset_auto_increment_signal_delete(sender, **kwargs):
    reset_auto_increment(sender)

# Señales al guardar registros
@receiver(post_save, sender=Usuario)
@receiver(post_save, sender=Producto)
@receiver(post_save, sender=Diseño)
@receiver(post_save, sender=Orden)
@receiver(post_save, sender=HistorialIa)
@receiver(post_save, sender=ImagenesGeneradas)
@receiver(post_save, sender=Personalizacion)
@receiver(post_save, sender=RolesYPermisos)
def reset_auto_increment_signal_save(sender, **kwargs):
    reset_auto_increment(sender)
