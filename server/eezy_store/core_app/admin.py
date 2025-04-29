from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin
from .models import Product, Rating, Address, Order, OrderItem, Cart, CartItem

class AddressInline(admin.TabularInline):
    model = Address
    extra = 0

class CustomUserAdmin(DefaultUserAdmin):
    inlines = [AddressInline]

admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)


class RatingInline(admin.TabularInline):
    model = Rating
    extra = 0
    readonly_fields = ['user', 'score', 'created_at']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'created_at', 'is_deleted', 'restore_product']
    search_fields = ['name']
    list_filter = ['created_at']
    readonly_fields = ['created_at', 'updated_at']

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset

    def restore_product(self, obj):
        if obj.is_deleted:
            return f"Restore"
        return f"Active"
    restore_product.short_description = "Action"


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'quantity', 'price']  

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'status', 'total_amount', 'created_at']
    list_display_links = ['id', 'user'] 
    list_editable = ['status']         
    list_filter = ['status', 'created_at']
    search_fields = ['user__username']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [OrderItemInline] 


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_at', 'updated_at']
    search_fields = ['user__username']
    inlines = [CartItemInline]

