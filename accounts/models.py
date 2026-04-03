from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class District(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Panchayath(models.Model):
    name = models.CharField(max_length=100)
    district = models.ForeignKey(District, on_delete=models.CASCADE, related_name="panchayaths")

    def __str__(self):
        return self.name


class Ward(models.Model):
    number = models.CharField()
    panchayath = models.ForeignKey(Panchayath, on_delete=models.CASCADE, related_name="wards")

    def __str__(self):
        return f"Ward {self.number}"
    


class USER(AbstractUser):
    ROLE_CHOICES = (
        ('citizen','Citizen'),
        ('collector','Collector'),
        ('admin','Admin')
    )
    
    role = models.CharField(max_length=15,choices=ROLE_CHOICES,default='citizen')
    phone = models.CharField(max_length=15,blank=True,null=True)
    address = models.TextField(blank=True,null=True)
    
    district = models.ForeignKey(District, on_delete=models.SET_NULL, null=True, blank=True)
    panchayath = models.ForeignKey(Panchayath, on_delete=models.SET_NULL, null=True, blank=True)
    ward = models.ForeignKey(Ward, on_delete=models.SET_NULL, null=True, blank=True)
    houseNo = models.CharField(max_length=10)
    
    def __str__(self):
        return self.username