from django import forms
# 🚨 モデル名は 'Item' ではなく 'Rental' と仮定して修正
from .models import Rental 

class RentalForm(forms.ModelForm):
    class Meta:
        model = Rental
        # 🔥 フィールド名を現在のデータベース/ビューに合わせて修正 🔥
        # contents -> description に変更（ビューに合わせて）
        # image -> images のための処理は ModelForm外で必要
        fields = ['name', 'description', 'price', 'category', 'type', 'size', 'brand', 'condition', 'color']
        # images/captured_images のアップロードは ModelForm では扱えないため、手動で処理します。