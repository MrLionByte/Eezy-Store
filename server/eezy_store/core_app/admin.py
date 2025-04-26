from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin
from .models import Product, Rating, Address, Order, OrderItem, Cart, CartItem

# Inline: Address inside User
class AddressInline(admin.TabularInline):
    model = Address
    extra = 0

# Registering the models Address and User
class CustomUserAdmin(DefaultUserAdmin):
    inlines = [AddressInline]

admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)


# Inline: Rating inside Product
class RatingInline(admin.TabularInline):
    model = Rating
    extra = 0
    readonly_fields = ['user', 'score', 'created_at']

# Registering the models Product and Rating
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'average_rating', 'created_at']
    search_fields = ['name']
    list_filter = ['created_at']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [RatingInline]

# Inline: OrderItem inside Order
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

# Registering the models Order and OrderItem
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'status', 'total_amount', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['user__username']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [OrderItemInline]


# Inline: CartItem inside Cart
class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0

# Registering the models Cart and CartItem
@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_at', 'updated_at']
    search_fields = ['user__username']
    inlines = [CartItemInline]

