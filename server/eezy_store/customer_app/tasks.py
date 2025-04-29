from django.shortcuts import render
from django.http import JsonResponse
from django.core.mail import send_mail
from .otp import generate_otp, verify_otp

def send_otp_email(email):
    """
    Generate and send OTP to the user's email address.
    """
    
    # Generate OTP and send via email
    otp = generate_otp(email)
    
    send_mail(
        'Your OTP Code',
        f'Your OTP code is {otp}. It is valid for 10 minutes.',
        fail_silently=False,
        recipient_list=[email],
    )

    return True

def verify_email_otp(request):
    """
    Verify the OTP entered by the user.
    """
    email = request.POST.get('email')
    otp_input = request.POST.get('otp')

    if verify_otp(email, otp_input):
        return JsonResponse({'message': 'OTP verified successfully!'})
    else:
        return JsonResponse({'message': 'Invalid OTP.'}, status=400)
