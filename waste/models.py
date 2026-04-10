from django.db import models
from django.conf import settings
from accounts.models import District,Panchayath,Ward

# Create your models here.

User = settings.AUTH_USER_MODEL

class WASTE_CATEGORY(models.Model):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name
    
class COLLECTION_SCHEDULE(models.Model):
    category = models.ForeignKey(WASTE_CATEGORY,on_delete=models.CASCADE)
    date = models.DateField()
    # category_type = models.CharField(max_length=20, choices=category)
    
    # Location mapping
    district = models.ForeignKey(District, on_delete=models.SET_NULL, null=True, blank=True)
    panchayath = models.ForeignKey(Panchayath, on_delete=models.SET_NULL, null=True, blank=True)
    ward = models.ForeignKey(Ward, on_delete=models.SET_NULL, null=True, blank=True)
    

    # Assigned Collector
    collector = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        limit_choices_to={'role': 'collector'},
        related_name='schedules'
    )

    def __str__(self):
        return f"{self.category} collection on {self.date} at Ward {self.ward}"
    
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
        related_name='assigned_request',
    )
    
    def __str__(self):
        return f'{self.user} - {self.category} - {self.status}'
    
class WASTE_COMPLAINT(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    category = models.ForeignKey(WASTE_CATEGORY, on_delete=models.CASCADE)

    place = models.TextField()

    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    image = models.ImageField(upload_to='complaints/', null=True, blank=True)

    status = models.CharField(max_length=20, default='pending')

    collector = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_complaint',
    )

    def __str__(self):
        return f'{self.user} - {self.category} - {self.status}'