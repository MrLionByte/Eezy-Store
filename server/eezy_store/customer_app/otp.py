from django.core.cache import cache
import random
import string

def generate_otp(email):
    """
    Generate a 6-digit OTP and store it in the cache with a 10-minute expiration.
    """
    otp = ''.join(random.choices(string.digits, k=6))
    
    cache.set(email, otp, timeout=600)
    
    return otp


def verify_otp(email, otp_input):
    """
    Verify the OTP entered by the user against the cached OTP.
    """
    cached_otp = cache.get(f"otp_{email}")

    if cached_otp and cached_otp == otp_input:
        return True
    return False