from django.contrib.auth.hashers import make_password
from django.db import models
from django.utils import timezone
import datetime
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.auth.models import AbstractUser
from .utils import get_default_pk_for_model
from django.core.exceptions import ValidationError
from django.db.models.signals import post_save
from django.dispatch import receiver
import logging


logger = logging.getLogger(__name__)

class Enum(models.Model):
    class Gender(models.TextChoices):
        FEMALE = 'F', 'Женский'
        MALE = 'M', 'Мужской'

    class Relation(models.TextChoices):
        FATHER = 'F', 'Отец'
        MOTHER = 'M', 'Мать'
        GUARDIAN = 'G', 'Опекун'

    class EventType(models.TextChoices):
        WORK = 'WORK', 'Профессионально-трудовое'
        PATR = 'PATR', 'Гражданско-патриотическое'
        CULT = 'CULT', 'Культурно-нравственное'
        SPORT = 'SPORT', 'Спортивно-оздоровительное'
        PREV = 'PREV', 'Профилактическое'
        COMP = 'COMP', 'Конкурсноe, экскурсионно-выставочное'
        IND = "IND", "Индивидуальная работа"

    class BaseGrade(models.TextChoices): #На базе какого класса
        NINE = 'N', '9'
        ELEVEN = 'E', '11'

    class ExaminationForm(models.TextChoices): #Форма аттестации
        EXAM = 'E', 'Экзамен'
        CREDIT = 'C', 'Зачет'

    class DisabilityGroup(models.TextChoices):
        NONE = "0", "Не указано"
        FIRST = '1', '1'
        SECOND = '2', '2'
        THIRD = '3', '3'

class Major(models.Model): #Специальность
    major_code = models.CharField(max_length=20, blank=True, verbose_name="Код специальности")
    name = models.CharField(max_length=50, verbose_name="Название")
    qualification = models.CharField(max_length=50, verbose_name="Квалификация")
    base_grade = models.CharField(
        max_length=2,
        choices=Enum.BaseGrade.choices,
        default=Enum.BaseGrade.NINE,
        verbose_name="На базе классов"
    )

    class Meta:
        verbose_name = 'Специальность'
        verbose_name_plural = 'Специальности'

class Subject(models.Model):  # Дисциплина
    subject_code = models.CharField(max_length=20, verbose_name="Шифр")
    name = models.CharField(max_length=20, verbose_name="Название")

class Course(models.Model): #Изучение (дисциплина в рамках специальности)
    major_id = models.ForeignKey(Major, on_delete=models.PROTECT, blank=True, verbose_name="Специальность")
    subject_id = models.ForeignKey(Subject, on_delete=models.PROTECT, blank=True, verbose_name="Дисциплина")
    semester = models.IntegerField(verbose_name="Семестр")
    examination_form = models.CharField(
        max_length=7,
        choices=Enum.ExaminationForm.choices,
        default=Enum.ExaminationForm.CREDIT,
        verbose_name="Форма аттестации"
    )


class TutorManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('email должен быть указан')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)

        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_active', True)
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class Tutor(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=30, unique=True)
    lastname = models.CharField(max_length=100, verbose_name="Фамилия")
    name = models.CharField(max_length=100,verbose_name="Имя")
    patronymic = models.CharField(max_length=100, blank=True, null=True, verbose_name="Отчество")

    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    objects = TutorManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def get_full_name(self):
        return self.name

    def get_short_name(self):
        return self.name
    
    class Meta:
        verbose_name = 'Куратор'
        verbose_name_plural = 'Кураторы'

class Group(models.Model):
    name = models.CharField(max_length=100, verbose_name="Номер группы")
    major = models.ForeignKey(Major, on_delete=models.PROTECT, blank=True, verbose_name="Специальность")
    year_of_entry = models.IntegerField(default=2025, verbose_name="Год зачисления")
    tutor_id = models.ForeignKey(Tutor, on_delete=models.PROTECT, blank=True, null=True, verbose_name="Куратор")

    class Meta:
        verbose_name = 'Группа'
        verbose_name_plural = 'Группы'


class Student(models.Model):
    lastname = models.CharField(max_length=100, verbose_name="Фамилия")
    name = models.CharField(max_length=100, verbose_name="Имя")
    patronymic = models.CharField(max_length=100, verbose_name="Отчество")
    group = models.ForeignKey(Group, on_delete=models.PROTECT, verbose_name="Группа")

    birth_date = models.DateField(default=timezone.now, blank=True, verbose_name="Дата рождения")
    registration_address = models.CharField(max_length=50, blank=True, verbose_name="Адрес регистрации")
    residential_address = models.CharField(max_length=50, blank=True, verbose_name="Адрес проживания")

    gender = models.CharField(
        max_length=7,
        choices=Enum.Gender.choices,
        default=Enum.Gender.FEMALE,
        verbose_name="Пол"
    )

    email = models.EmailField(max_length=30, blank=True, verbose_name="E-mail")
    phone = models.CharField(max_length=20, blank=True, verbose_name="Телефон")
    insurance_number = models.CharField(max_length=20, blank=True, verbose_name="СНИЛС")

    class Meta:
        verbose_name = 'Студент'
        verbose_name_plural = 'Студенты'

class Grade(models.Model): #Успеваемость
    student_id = models.ForeignKey(Student, on_delete=models.PROTECT, blank=True, verbose_name="Код студента")
    subject_id = models.ForeignKey(Course, on_delete=models.PROTECT, blank=True, verbose_name="Код изучения")
    score = models.IntegerField(default=0, verbose_name="Оценка")

    class Meta:
        verbose_name = 'Успеваемость'


class Event(models.Model): #Проведение мероприятий

    name = models.CharField(max_length=100, verbose_name="Название")
    date = models.DateField(default=datetime.date.today, verbose_name="Дата")
    time = models.TimeField(default=datetime.time, verbose_name="Время")
    group = models.ForeignKey(Group, on_delete=models.PROTECT, verbose_name="Группа")
    event_type = models.CharField(
        max_length=5,
        choices=Enum.EventType.choices,
        default=Enum.EventType.WORK,
        verbose_name="Тип мероприятия")

    student = models.ForeignKey(Student, on_delete=models.PROTECT, null=True, blank=True, verbose_name="Студент")

    def clean(self):
        errors = {}
        try:
            cleaned_data = super().clean()
        except ValidationError as e:
            for field, messages in e.message_dict.items():
                errors[field] = messages

        if self.student is not None and self.event_type != Enum.EventType.IND:
            errors["student"] = 'Поле "Студент" может быть заполнено только с типом события "Индивидуальная работа".'
        if self.student is None and self.event_type == Enum.EventType.IND:
            errors["student"] = 'Поле "Студент" обязательно для типа события "Индивидуальная работа".'

        if errors:
            raise ValidationError(errors)
        # Возвращаем очищенные данные
        return cleaned_data

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = 'Мероприятие'
        verbose_name_plural = 'Мероприятия'




class FamilyMember(models.Model): #Семья
    full_name = models.CharField(max_length=100, verbose_name="ФИО")
    student = models.ForeignKey(Student, on_delete=models.CASCADE, verbose_name="Студент")
    relation = models.CharField(
        max_length=1,
        choices=Enum.Relation.choices,
        default=Enum.Relation.MOTHER,
        verbose_name="Родство"
    )
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Телефон")
    occupation = models.CharField(max_length=100, blank=True, null=True, verbose_name="Место работы")

    class Meta:
        verbose_name = 'Член семьи'
        verbose_name_plural = 'Члены семьи'

class Health(models.Model): #Здоровье
    student = models.OneToOneField(Student, on_delete=models.CASCADE, related_name='health', verbose_name="Студент")
    disabled = models.BooleanField(default=False, verbose_name="Является инвалидом")
    disability_group = models.IntegerField(default=Enum.DisabilityGroup.NONE, verbose_name="Группа инвалидности")
    disability_category = models.CharField(null=True, blank=True, max_length=20, verbose_name="Категория инвалидности")
    valid_since = models.DateField(null=True, blank=True, verbose_name="Начало действия группы инвалидности")
    valid_until = models.DateField(null=True, blank=True, verbose_name="Окончание действия группы инвалидности")
    recommendations = models.CharField(null=True, blank=True, max_length=100, verbose_name="Рекомендации врачей")
    adaptive_program = models.BooleanField(default=False, verbose_name="Требуется адаптивная программа")

    class Meta:
        verbose_name = 'Здоровье'
        verbose_name_plural = "Здоровье"

@receiver(post_save, sender=Student)
def create_health_for_student(sender, instance, created, **kwargs):
    if created:
        Health.objects.create(student=instance)



