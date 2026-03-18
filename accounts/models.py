from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class USER(AbstractUser):
    ROLE_CHOICES = (
        ('citizen','citizen'),
        ('collector','collector'),
        ('admin','admin')
    )
    
    role = models.CharField(max_length=15,choices=ROLE_CHOICES,default='citizen')
    phone = models.CharField(max_length=15,blank=True,null=True)
    address = models.TextField(blank=True,null=True)
    
    def __str__(self):
        return self.username