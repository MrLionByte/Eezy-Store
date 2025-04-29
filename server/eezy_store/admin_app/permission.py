from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """
    Custom permission to only allow admins to access the view.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_staff or request.user.is_superuser
    