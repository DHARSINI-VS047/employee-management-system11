from django.http import HttpResponse
from django.urls import path


def home(request):
    return HttpResponse(
        "Employee Management System Backend is Live and Running!"
    )


urlpatterns = [
    path('', home),
]
