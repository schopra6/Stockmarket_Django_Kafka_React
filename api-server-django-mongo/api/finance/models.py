from djongo import models

from django.contrib.auth.models import (
    PermissionsMixin,
)
from djongo import models

# finance_app/models.py


class Finance(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    timestamp = models.DateTimeField()
    Open = models.FloatField()
    High = models.FloatField()
    Low = models.FloatField()
    Close = models.FloatField()
    Volume = models.IntegerField()
    class Meta:
        db_table = 'finance'
        app_label = 'api_finance'


    def __str__(self):
        return f"Finance data at {self.timestamp}"




