from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import Tutor
from django import forms
from django.contrib.auth.forms import UserCreationForm
class CustomTutorCreationForm(UserCreationForm):
    email = forms.EmailField(max_length=254, help_text='Обязательное поле. Введите действующий email.')
    name = forms.CharField(max_length=100, required=False, help_text='Необязательное поле. Имя пользователя')
    lastname = forms.CharField(max_length=100, required=False, help_text='Необязательное поле. Фамилия пользователя')
    patronymic = forms.CharField(max_length=100, required=False, help_text='Необязательное поле. Отчество пользователя (при наличии)')

    class Meta:
        model = Tutor
        fields = ("email", "name", "lastname", "patronymic", "password1", "password2")