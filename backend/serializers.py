from rest_framework import serializers
from .models import *
import importlib
import logging

logger = logging.getLogger(__name__)

class VerboseSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        for field_name, field in instance._meta.fields_map.items():
            pass 

        representation["verbose"] = {}

        for field in instance._meta.get_fields():
            if not hasattr(field, 'verbose_name'):
                continue
            verbose_key = f"{field.name}_verbose"
            representation["verbose"][verbose_key] = str(field.verbose_name)
        return representation

class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        fields = kwargs.pop('fields', None)
        super().__init__(*args, **kwargs)

        if fields is not None:
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)

class MajorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Major
        fields = "__all__"

class HealthSerializer(VerboseSerializer):
    class Meta:
        model = Health
        fields = "__all__"

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = "__all__"

class StudentSerializer(VerboseSerializer):
    class Meta:
        model = Student 
        fields = '__all__'


class EventSerializer(VerboseSerializer):
    class Meta:
        model = Event
        fields = "__all__"

class TutorSerializer(VerboseSerializer):
    class Meta:
        model = Tutor
        fields = ["lastname", "name", "patronymic"]


class FamilyMemberSerializer(VerboseSerializer):
    class Meta:
        model = FamilyMember
        fields = "__all__"

class EventTypSerializer(VerboseSerializer):
    class Meta:
        model = Enum.EventType
        fields = "__all__"
    
    
    