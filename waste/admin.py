from django.contrib import admin
from .models import WASTE_CATEGORY,WASTE_REQUEST,WASTE_COMPLAINT,COLLECTION_SCHEDULE

# Register your models here.

admin.site.register(WASTE_CATEGORY)
# admin.site.register(WASTE_REQUEST)
admin.site.register(WASTE_COMPLAINT)
admin.site.register(COLLECTION_SCHEDULE)
@admin.register(WASTE_REQUEST)
class WasteRequestAdmin(admin.ModelAdmin):
    # This will show the ID, User, Category, and Status in the list view
    list_display = ('id', 'user', 'category', 'status') 
    list_display_links = ('id', 'user') # Makes the ID clickable
