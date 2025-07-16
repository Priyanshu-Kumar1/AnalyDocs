from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken


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