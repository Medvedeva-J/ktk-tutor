from rest_framework import generics
from .serializers import *
from .models import *
import json
import copy
from django.apps import apps
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.forms.models import model_to_dict
from django.core import serializers
from django.middleware.csrf import get_token
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.core.exceptions import ValidationError
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from django.contrib.sessions.models import Session
from django.contrib.auth.mixins import LoginRequiredMixin
import logging
from django.shortcuts import get_object_or_404
from django.db.models import QuerySet
from rest_framework.request import Request
from io import BytesIO
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Table, TableStyle, Paragraph
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from django.db import transaction
from rest_framework.test import APIRequestFactory
from rest_framework.test import APIClient


logger = logging.getLogger(__name__)


def update_student(request, data):
    data = json.loads(data)
    student_id = data["id"]
    family = data["family"]
    studentData = data["studentData"]
    health = data["health"]
    factory = APIRequestFactory()
    try: 
        with transaction.atomic():
                # Создаем запросы для каждого put
                request_student = factory.put(f'student/{student_id}', studentData)
                request_family = factory.put(f'student/{student_id}/family', family, format='json')
                request_health = factory.put(f'student/{student_id}/health', health, format='json')

                response_student = StudentAPI.as_view()(request_student, **{"pk":student_id})
                response_health = HealthAPI.as_view()(request_health, **{"student_id":student_id})
                response_family = FamilyMemberAPI.as_view()(request_family, **{"student_id":student_id})
                if response_student.status_code >= 400:
                    raise ValidationError(response_student.data["errors"])
                if response_health.status_code >= 400:
                    raise ValidationError(response_health.data)
                if response_family.status_code >= 400:
                    raise ValidationError(response_family.data["errors"])
                return JsonResponse({
                    'student': response_student.data,
                    'health': response_health.data,
                    'family': response_family.data
                }, status=200)
    except ValidationError as e:
        logger.debug(e.message_dict)
        return JsonResponse({'errors': e.message_dict}, status=400)

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None:
        return response
        return Response({'errors': ['An unexpected error occurred.']}, status=500)
    if isinstance(response.data, dict):
        # Если ошибки в формате словаря, преобразуем их в список строк
        errors = {}
        for key, value in response.data.items():
            if isinstance(value, list):
                errors[key] = {';'.join(value)}  # Добавляем все сообщения из списка
            else:
                errors[key] = value  # Добавляем сообщение как строку
        response.data = {'errors': errors}
    elif isinstance(response.data, list):
        # Если ошибки уже в формате списка, просто оборачиваем их
        response.data = {'errors': response.data}
    return response

def generate_pdf(request, data):
    data = json.loads(data)
    buffer = BytesIO()
    pdfmetrics.registerFont(TTFont('TimesNewRoman', r".\static\fonts\TIMES.TTF"))
    
    font_name = 'TimesNewRoman'
    font_size = 12

    PAGE_WIDTH, PAGE_HEIGHT = letter
    LEFT_MARGIN = 40
    RIGHT_MARGIN = 40
    TOP_MARGIN = 40

    num_cols = len(data[0]) + 1
    available_width = PAGE_WIDTH - LEFT_MARGIN - RIGHT_MARGIN

    col_width = available_width / num_cols
    col_widths = [col_width] * num_cols

    styleN = ParagraphStyle(
        name=font_name,
        fontName=font_name,
        fontSize=font_size,
        leading=14
    )

    data = [[index + 1, *item.values()] for (index, item) in enumerate(data)]
    data = [[Paragraph(str(item), styleN) for item in obj] for obj in data]
    table = Table(data, colWidths=col_widths)
    style = TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), font_name),
        ('FONTSIZE', (0, 0), (-1, -1), font_size),
        ('BACKGROUND', (0, 0), (-1, 0), colors.white),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ])

    table.setStyle(style)

    p = canvas.Canvas(buffer, pagesize=letter)

    table_width, table_height = table.wrap(PAGE_WIDTH - 2*LEFT_MARGIN, PAGE_HEIGHT - 2*TOP_MARGIN)

    x = LEFT_MARGIN
    y = PAGE_HEIGHT - TOP_MARGIN - table_height

    table.drawOn(p, x, y)

    p.showPage()
    p.save()

    buffer.seek(0)
    return HttpResponse(buffer, content_type='application/pdf')

def json_login_required(view_func):
    def wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Вы не авторизованы'}, status=401)
        return view_func(request, *args, **kwargs)
    return wrapped_view

def get_csrf(request):
    response = JsonResponse({'detail': 'CSRF cookie set'})
    response['X-CSRFToken'] = get_token(request)
    return response

@require_POST
def login_view(request):
    data = json.loads(request.body)
    email = data.get('email')
    password = data.get('password')

    if email is None or password is None:
        return JsonResponse({'detail': f"Укажите пароль и логин"}, status=400)

    user = authenticate(username=email, password=password)
    
    if user is None:
        return JsonResponse({'detail': 'Неверные данные'}, status=400)

    login(request, user)
    return JsonResponse({'detail': 'Успешная авторизация'})

@json_login_required
def logout_view(request):
    logout(request)
    return JsonResponse({'detail': 'Вы успешно вышли'})

@ensure_csrf_cookie # отправка CSRF cookie
def session_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'isAuthenticated': False})

    return JsonResponse({'isAuthenticated': True, 'email': request.user.email, 'user_id': request.user.id})


@json_login_required
def user_info(request):
    return JsonResponse({'id': request.user.id})

  
@json_login_required
def kill_all_sessions(request):
    sessions = Session.objects.all()
    sessions.delete()

    return JsonResponse({'detail': 'Сессии успешно завершены'})

def get_choices(request, model):
    model = getattr(apps.get_model("backend", "Enum"), model)
    choices = {f"{item.value}":{'label': item.label} for item in model}
    return JsonResponse(choices)

def get_empty_instance(request, model):
    model_class = apps.get_model("backend", model)
    if not model_class:
        raise Http404(f"Model '{model}' not found in app 'backend'.")

    instance = model_class()
    serializer = get_serializer_class(f"{model}Serializer")(instance)
    return JsonResponse(serializer.data)

def get_serializer_class(serializer_name):
    serializer_path = f"backend.serializers.{serializer_name}"
    try:
        module_path, class_name = serializer_path.rsplit('.', 1)
        module = importlib.import_module(module_path)
        serializer_class = getattr(module, class_name)
        return serializer_class
    except (ImportError, AttributeError, ValueError) as e:
        return None


class StudentListCreate(generics.ListCreateAPIView):
    queryset = Student.objects.all().order_by("lastname")

    def get_filtered_queryset(self, queryset: QuerySet, request: Request) -> QuerySet:
        data = self.request.query_params.get('data')
        if data is not None:
            data = json.loads(data)
            if "filters" in data.keys():
                filters = data["filters"]
                statements = []
                for i in list(filters.values()):
                    statements.append(f"{i["field"]}__{i["statement"]}='{i["compare-to"]}'")
                result={}
                exec(f'queryset = queryset.filter({', '.join(statements)})', locals(), result)
                queryset = result["queryset"]
            elif "group" in data.keys():
                return queryset.filter(group=data["group"])

        return queryset

    def get_queryset(self):
        base_queryset = super().get_queryset()
        return self.get_filtered_queryset(base_queryset, self.request)

    def get_serializer(self, *args, **kwargs):
        data = self.request.query_params.get('data')
        if data is not None:
            data = json.loads(data)
            if "fields" in data.keys():
                fields = data["fields"]
                kwargs['fields'] = fields
        kwargs['context'] = self.get_serializer_context()
        serializer_class = self.get_serializer_class()
        return serializer_class(*args, **kwargs)

    def get_serializer_class(self):
        queryset = self.get_queryset()
        model = queryset.model

        class DynamicSerializer(DynamicFieldsModelSerializer):
            class Meta:
                model = Student
                fields = '__all__'

        return DynamicSerializer


class StudentAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    def get_queryset(self):
        student_id = self.kwargs.get('id', None)
        if student_id is not None:
            return Student.objects.filter(id__exact=student_id)
        return Student.objects.all()


class TutorAPI(generics.RetrieveUpdateAPIView):
    queryset = Tutor.objects.all()
    serializer_class = TutorSerializer

    def get_queryset(self):
        tutor_id = self.kwargs.get('id', None)
        if tutor_id is not None:
            return Tutor.objects.filter(id__exact=tutor_id)
        return Tutor.objects.all()


class GroupAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class GroupListCreate(generics.ListCreateAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

    def get_queryset(self):
        tutor_id = self.kwargs.get('tutor_id', None)
        if tutor_id is not None:
            return Group.objects.filter(tutor_id__exact=tutor_id)
        return Group.objects.all()



class EventsListCreate(generics.ListCreateAPIView):
    serializer_class = EventSerializer

    def get_queryset(self):
        year = self.kwargs.get("year", None)
        month = self.kwargs.get('month', None)
        if year is not None and month is not None:
            month = str(month) if month < 10 else "0" + month
            return Event.objects.filter(date__year=year, date__month=month)
        return Event.objects.all()


    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body.decode('utf-8'))
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        event = Event(
            name=data.get('name'),
            date=data.get('date'),
            time=data.get('time'),
            group_id=data.get('group'),
            event_type=data.get('event_type'),
            student_id=data.get('student'),
        )
        try:
            event.save() 
        except ValidationError as e:
            return Response({'errors': e.message_dict}, status=400)
        return Response({'message': 'Event created successfully', 'id': event.id})
    

class EventAPI(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EventSerializer

    def get_queryset(self):
        event_id = self.kwargs.get('id', None)
        if event_id is not None:
            return Event.objects.filter(id__exact=event_id)
        return Event.objects.all()
    
    def put(self, request, *args, **kwargs):
        event_id = kwargs.get('pk')
        event = get_object_or_404(Event, id=event_id) 
        try:
            data = json.loads(request.body.decode('utf-8'))
        except json.JSONDecodeError:
            return Response({'error': 'Invalid JSON'}, status=status.HTTP_400_BAD_REQUEST)
        
        event.name = data.get('name', event.name) 
        event.date = data.get('date', event.date)
        event.time = data.get('time', event.time)
        event.group_id = data.get('group', event.group_id)
        event.event_type = data.get('event_type', event.event_type)
        event.student_id = data.get('student', event.student_id)
        try:
            event.save()
        except ValidationError as e:
            return Response({'errors': e.message_dict}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'Event updated successfully', 'id': event.id}, status=status.HTTP_200_OK)


class MajorAPI(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MajorSerializer

    def get_queryset(self):
        major_id = self.kwargs.get('id', None)
        if major_id is not None:
            return Major.objects.filter(id__exact=major_id)
        return Major.objects.all()

class FamilyMemberAPI(generics.ListCreateAPIView):
    serializer_class = FamilyMemberSerializer

    def put(self, request, student_id):
        try:
            data = json.loads(request.body)
            incoming_ids = set()

            try:
                student_instance = Student.objects.get(id=student_id)
            except Student.DoesNotExist:
                return Response(
                    {'error': f'Student with id {student_id} does not exist.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Обработка обновления и создания объектов
            for member in data:
                member_id = member.get('id')
                
                if member_id:
                    try:
                        existing_member = FamilyMember.objects.get(id=member_id)
                    except FamilyMember.DoesNotExist:
                        return Response(
                            {'error': f'FamilyMember with id {member_id} does not exist.'},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    for attr, value in member.items():
                        if attr == "student":
                            setattr(existing_member, attr, Student.objects.get(id=student_id))
                        else:
                            setattr(existing_member, attr, value)
                    try:
                        existing_member.full_clean()
                        existing_member.save()
                        incoming_ids.add(existing_member.id)
                    except ValidationError as e:
                        return Response({'errors': e.message_dict}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    # Новый объект
                    student = Student.objects.get(id=student_id)
                    member["student"] = student
                    new_member = FamilyMember(**member)
                    try:
                        new_member.full_clean()
                        new_member.save()
                        incoming_ids.add(new_member.id)
                    except ValidationError as e:
                        return Response({'errors': e.message_dict}, status=status.HTTP_400_BAD_REQUEST)

            # Удаление объектов, которых нет во входных данных
            current_members = FamilyMember.objects.filter(student_id=student_id)
            current_ids = set(current_members.values_list('id', flat=True))
            ids_to_delete = current_ids - incoming_ids

            if ids_to_delete:
                FamilyMember.objects.filter(id__in=ids_to_delete).delete()

            return Response({
                "status": "success",
                "updated_or_created": len(incoming_ids),
                "deleted": len(ids_to_delete),
            }, status=status.HTTP_200_OK)

        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON"}, status=status.HTTP_400_BAD_REQUEST)



    def get_queryset(self):
        student_id = self.kwargs.get('student_id', None)
        if student_id is not None:
            return FamilyMember.objects.filter(student__exact=student_id)
        return FamilyMember.objects.all()

class HealthAPI(generics.ListCreateAPIView):
    serializer_class = HealthSerializer

    def get_queryset(self):
        student_id = self.kwargs.get('student_id', None)
        if student_id is not None:
            return Health.objects.filter(student__exact=student_id)
        return Health.objects.all()
    
    def put(self, request, student_id):
        try:
                instance = Health.objects.filter(student__exact=student_id)
                if len(instance) > 0:
                    instance = instance[0]
                serializer = HealthSerializer(instance, data=request.data)
        except Health.DoesNotExist:
            serializer = HealthSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK if instance else status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)