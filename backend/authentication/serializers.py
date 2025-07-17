from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Project


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        return user
    
    def to_representation(self, instance):
        refresh_token = RefreshToken.for_user(instance)
        return {
            'id': instance.id,
            'username': instance.username,
            'email': instance.email,
            'refresh': str(refresh_token),
            'access': str(refresh_token.access_token),
        }
    
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        print("Validating login with data:", attrs)
        user = User.objects.filter(username=attrs['username']).first()
        if user is None or not user.check_password(attrs['password']):
            raise serializers.ValidationError("Invalid credentials")

        # store user for later use
        self.user = user
        return attrs

    def to_representation(self, instance):
        refresh_token = RefreshToken.for_user(instance)
        return {
            'id': instance.id,
            'username': instance.username,
            'email': instance.email,
            'refresh': str(refresh_token),
            'access': str(refresh_token.access_token),
        }
    
class CreateProjectSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255, required=True)
    data_context = serializers.CharField(max_length=1000, required=True, allow_blank=False)
    data_path = serializers.CharField(max_length=1000, required=True, allow_blank=False)
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

    def validate_data_path(self, value):
        if not value:
            raise serializers.ValidationError("Data path cannot be empty")
        return value

    def validate_date_from(self, value):
        if not value:
            raise serializers.ValidationError("Date from cannot be empty")
        return value

    def validate_date_to(self, value):
        if not value:
            raise serializers.ValidationError("Date to cannot be empty")
        return value