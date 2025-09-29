from django.db import models

class Item(models.Model):
    name = models.CharField(max_length=200, verbose_name="商品名")
    description = models.TextField(verbose_name="商品説明")
    price = models.IntegerField(verbose_name="レンタル価格")
    category = models.CharField(max_length=100, verbose_name="カテゴリ")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name