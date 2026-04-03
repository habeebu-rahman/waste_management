from django.contrib import admin
from .models import WASTE_CATEGORY,WASTE_REQUEST,WASTE_COMPLAINT

# Register your models here.

admin.site.register(WASTE_CATEGORY)
admin.site.register(WASTE_REQUEST)
admin.site.register(WASTE_COMPLAINT)
