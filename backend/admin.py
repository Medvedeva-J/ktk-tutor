from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Tutor
from .forms import CustomTutorCreationForm
from .models import *

class TutorAdmin(UserAdmin):
    add_form = CustomTutorCreationForm
    model = Tutor
    list_display = ("email", "is_staff", "is_active")
    list_filter = ("email", "is_staff", "is_active")

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Permissions", {"fields": ("is_staff", "is_active", "groups", "user_permissions")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "email", "password1", "password2",
                "lastname", "name", "patronymic",
                "is_staff", "is_active", "groups", "user_permissions"
            )}
         ),
    )
    search_fields = ("email",)
    ordering = ("email",)

admin.site.register(Student)
admin.site.register(Tutor, TutorAdmin)
admin.site.register(Group)
admin.site.register(Major)
admin.site.register(FamilyMember)
admin.site.register(Health)
admin.site.register(Enum),
admin.site.register(Event)
