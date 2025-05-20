from django.core.exceptions import ObjectDoesNotExist

def get_default_pk_for_model(model_class):
    try:
        instance = model_class.objects.first()
        if instance:
            return instance.pk
    except ObjectDoesNotExist:
        pass
    return None

