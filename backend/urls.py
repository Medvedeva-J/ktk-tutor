from django.urls import path, include
from . import views

urlpatterns = [
    path('generate-pdf/<data>', views.generate_pdf, name="generate_pdf"),
    
    path('students/<data>', views.StudentListCreate.as_view()),
    path('students/', views.StudentListCreate.as_view()),
    path('student/<int:pk>', views.StudentAPI.as_view()),

    path('student/<student_id>/family', views.FamilyMemberAPI.as_view()),
    path('student/<student_id>/health', views.HealthAPI.as_view()),

    path('transaction/<data>', views.update_student, name="update_student"),

    path('groups/<tutor_id>', views.GroupListCreate.as_view()),

    path('events/', views.EventsListCreate.as_view()),
    path('events/<int:year>/<int:month>', views.EventsListCreate.as_view()),
    path('events/<int:pk>', views.EventAPI.as_view()),
    
    path('tutor/<int:pk>', views.TutorAPI.as_view()),

    path('major/<int:pk>', views.MajorAPI.as_view()),

    path('csrf/', views.get_csrf, name='api-csrf'),
    path('login/', views.login_view, name='api-login'),
    path('logout/', views.logout_view, name='api-logout'),
    path('session/', views.session_view, name='api-session'),
    path('user_info/', views.user_info, name='api-userInfo'),
    path('kill_all_sessions/', views.kill_all_sessions, name='kill-all-sessions'),

    path('choices/<model>', views.get_choices, name="get_choices"),
    path('empty/<model>', views.get_empty_instance, name="get_empty_instance"),
]