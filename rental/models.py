from django.db import models
from django.contrib.auth.models import User # Userモデルを直接インポート

class Rental(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=[('available','Available'),('rented','Rented')], default='available')
    created_at = models.DateTimeField(auto_now_add=True)
    
    # 🔥🔥🔥 以下のフィールドを追加します 🔥🔥🔥
    category = models.CharField(max_length=50, blank=True, null=True)
    type = models.CharField(max_length=50, blank=True, null=True)
    size = models.CharField(max_length=50, blank=True, null=True)
    brand = models.CharField(max_length=100, blank=True, null=True)
    condition = models.CharField(max_length=50, blank=True, null=True)
    color = models.CharField(max_length=100, blank=True, null=True)
    is_published = models.BooleanField(default=True) # デフォルトを True にすると便利です

    
    def __str__(self):
        return self.name


class RentalImage(models.Model):
    rental = models.ForeignKey(Rental, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='rental_images/')