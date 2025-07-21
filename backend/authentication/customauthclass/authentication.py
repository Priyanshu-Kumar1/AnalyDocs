from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken as JWTAccessToken
from rest_framework_simplejwt.exceptions import TokenError
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

class CookieJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        raw_token = request.COOKIES.get('access_token')

        if not raw_token:
            logger.debug("No access_token cookie found.")
            return None # No token in cookie, let other auth classes try or fail

        try:
            # Validate the token using simplejwt's AccessToken class
            # This will verify signature, expiry, etc.
            validated_token = JWTAccessToken(raw_token)
            user_id = validated_token['user_id']

            user = User.objects.get(id=user_id)
            logger.debug(f"User {user.username} authenticated via cookie JWT.")
            return (user, validated_token) # Authenticated successfully!

        except User.DoesNotExist:
            logger.warning(f"User not found for token: {user_id}")
            raise AuthenticationFailed('No such user.')
        except TokenError as e:
            logger.warning(f"Invalid or expired JWT in cookie: {e}")
            raise AuthenticationFailed('Invalid or expired token.')
        except Exception as e:
            logger.error(f"Unexpected error during cookie JWT authentication: {e}")
            raise AuthenticationFailed('Authentication error.')

    def authenticate_header(self, request):
        """
        Return a string to be used as the value of the WWW-Authenticate
        header in a 401 Unauthorized response.
        """
        # This informs the client that Bearer tokens are still expected,
        # even if we primarily use cookies for internal API calls.
        # You might adjust this based on your overall auth strategy.
        return 'Bearer realm="api"'