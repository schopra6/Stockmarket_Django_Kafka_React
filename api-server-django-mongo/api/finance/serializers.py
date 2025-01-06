from rest_framework import serializers
from .models import Finance

class FinanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Finance
        db_table = 'database'
        fields = '__all__'

class FinanceHighSerializer(serializers.ModelSerializer):
    class Meta:
        model = Finance
        db_table = 'database'
        fields = ['timestamp', 'High']  # Only include the 'High' field
        read_only_field = ["timestamp"]
