from django.contrib import admin
from .models import Video, Tema, Trecho, PermissaoAcesso

class TemaInline(admin.TabularInline):
    model = Tema
    extra = 1

class TrechoInline(admin.TabularInline):
    model = Trecho
    extra = 1

class VideoAdmin(admin.ModelAdmin):
    inlines = [TemaInline, TrechoInline]

admin.site.register(Video, VideoAdmin)
admin.site.register(PermissaoAcesso)