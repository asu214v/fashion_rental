# home/views.py

from django.shortcuts import render
from rental.models import Rental 
from django.db.models import Q 
# 🚨 以下のインポートを追加
from datetime import timedelta
from django.utils import timezone 


def index(request):
    # 🚨 'is_published'フィールドが存在しない場合は、ここを 'status='available''などに修正してください。
    # 公開されている商品を取得
    all_rentals = Rental.objects.all().filter(is_published=True) 
    
    # -------------------------------------------------------------
    # 🚨 1. NEWアイテムのロジックを修正
    # -------------------------------------------------------------
    # 現在時刻から7日間(一週間)前の日時を計算
    one_week_ago = timezone.now() - timedelta(days=7) 
    
    # created_at が一週間前の日時以降（つまり、一週間以内）のものにフィルタリング
    new_items = all_rentals.filter(created_at__gte=one_week_ago).order_by('-created_at')[:10] 
    # -------------------------------------------------------------

    # 2. 新品のアイテム (type='新品') - 既存
    new_type_items = all_rentals.filter(type='新品')[:10]
    
    # 3. 古着の商品 (type='古着') - 既存
    used_type_items = all_rentals.filter(type='古着')[:10]

    # 4. カテゴリごとのアイテム (例: トップス) - 既存
    top_items = all_rentals.filter(category='トップス').order_by('-created_at')[:10]
    
    # 5. 5000円以下の商品 (price__lte=5000) - 既存
    cheap_items = all_rentals.filter(price__lte=5000).order_by('price')[:10]

    context = {
        'new_items': new_items,
        'new_type_items': new_type_items,
        'used_type_items': used_type_items,
        'top_items': top_items,
        'cheap_items': cheap_items,
    }
    
    return render(request, "home/index.html", context)