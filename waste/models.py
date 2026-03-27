from django.db import models
from django.conf import settings

# Create your models here.

User = settings.AUTH_USER_MODEL

class WASTE_CATEGORY(models.Model):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name
    
class COLLECTION_SCHEDULE(models.Model):
    category = models.ForeignKey(WASTE_CATEGORY,on_delete=models.CASCADE)
    date = models.DateField()
    area = models.CharField(max_length=200)
    
    def __str__(self):
        return f'{self.category} - {self.date}'
    
class WASTE_REQUEST(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    category = models.ForeignKey(WASTE_CATEGORY,on_delete=models.CASCADE)
    address = models.TextField()
    preferred_date = models.DateField()
    status = models.CharField(max_length=20,default='pending')
    
    collector = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_requests',
    )
    
    def __str__(self):
        return f'{self.user} - {self.category} - {self.status}'