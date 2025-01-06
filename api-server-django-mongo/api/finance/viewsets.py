from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Finance
from .serializers import FinanceSerializer, FinanceHighSerializer
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework.permissions import IsAuthenticated
from pymongo import MongoClient

class FinanceViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    #client = MongoClient('mongodb://mongo:27017')
    #db = client['database']
    #collection = db['database']

    #query = {}
    #documents = list(collection.find(query))

    queryset = Finance.objects.all()
    serializer_class = FinanceSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    permission_classes = [IsAuthenticated]
    filterset_fields = {
        'timestamp': ['gte', 'lte'],  # Greater than or equal, Less than or equal
    }
    ordering_fields = ['timestamp']

    @action(detail=False, methods=['get'])
    def high(self, request):
        """
        Custom action to return only the 'High' field data.
        """
        queryset = self.get_queryset()
        serializer = FinanceHighSerializer(queryset, many=True)
        return Response(serializer.data)
