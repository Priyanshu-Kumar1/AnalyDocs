from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Project

from django.contrib.auth import get_user_model

User = get_user_model()



class CreateProjectSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255, required=True)
    project_id = serializers.CharField(max_length=255, required=True)
    user_id = serializers.CharField(max_length=10000, required=True, allow_blank=False)
    data_context = serializers.CharField(max_length=10000, required=True, allow_blank=False)
    data_url = serializers.CharField(max_length=10000, default='')
    date_from = serializers.DateField(required=True, allow_null=False)
    date_to = serializers.DateField(required=True, allow_null=False)

    def validate_name(self, value):
        if not value:
            raise serializers.ValidationError("Project name cannot be empty")
        return value

    def validate_data_context(self, value):
        if not value:
            raise serializers.ValidationError("Data context cannot be empty")
        return value

    def validate_data_url(self, value):
        if not value:
            raise serializers.ValidationError("Data URL cannot be empty")
        return value

    def validate_date_from(self, value):
        if not value:
            raise serializers.ValidationError("Date from cannot be empty")
        return value

    def validate_date_to(self, value):
        if not value:
            raise serializers.ValidationError("Date to cannot be empty")
        return value
    
    def create(self, validated_data):
        project = Project.objects.create(
            project_id=validated_data['project_id'],
            user_id=validated_data['user_id'],
            name=validated_data['name'],
            data_context=validated_data['data_context'],
            data_url=validated_data['data_url'],
            date_from=validated_data['date_from'],
            date_to=validated_data['date_to']
        )
        return project