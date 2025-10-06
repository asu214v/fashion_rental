# hamburger/views.py

from django.shortcuts import render
from rental.models import Rental 
from django.db.models import Q 
import json # 価格バーの初期設定などに使う可能性

# テンプレートで使用する定数
COLOR_MAP = {
    "すべて": "#5a6268", 
    "ホワイト": "#f0f0f0",
    "ブラック": "#333333",
    "グレー": "#999999",
    "ブラウン": "#8B4513",
    "グリーン": "#228B22",
    "ブルー": "#007bff",
    "パープル": "#800080",
    "イエロー": "#FFD700",
    "ピンク": "#FF69B4",
    "レッド": "#DC143C",
    "その他": "#6c757d",
}
SEX_CHOICES = ["すべて", "メンズ", "レディース", "ユニセックス"]
TYPE_CHOICES = ["すべて", "新品", "古着"]

def index(request):
    rentals = Rental.objects.all().order_by('-created_at')
    query = Q()
    params = request.GET
    
    # 1. キーワード検索と履歴の保存
    keyword = params.get('keyword', '')
    if keyword:
        search_history = request.session.get('search_history', [])
        if keyword in search_history:
            search_history.remove(keyword)
        search_history.insert(0, keyword)
        request.session['search_history'] = search_history[:5] 

        query &= (Q(name__icontains=keyword) | Q(description__icontains=keyword)) 
        
    # 2. 性別 (categoryをsexとして扱う)
    sex = params.get('sex', 'すべて')
    if sex != 'すべて':
        query &= Q(category=sex) 

    # 3. タイプ
    item_type = params.get('type', 'すべて')
    if item_type != 'すべて':
        query &= Q(type=item_type)
        
    # 4. 価格帯
    min_price = params.get('min_price')
    max_price = params.get('max_price')
    if min_price:
        try: query &= Q(price__gte=int(min_price))
        except ValueError: pass
    if max_price:
        try: query &= Q(price__lte=int(max_price))
        except ValueError: pass

    # 5. サイズ
    size = params.get('size', '')
    if size:
        query &= Q(size__icontains=size)

    # 6. ブランド
    brand = params.get('brand', '')
    if brand:
        query &= Q(brand__icontains=brand)
        
    # 7. 色
    color = params.get('color', 'すべて')
    if color != 'すべて':
        query &= Q(color=color)

    # 最終的な絞り込みを実行
    rentals = rentals.filter(query)

    context = {
        'rentals': rentals, 
        'params': params, 
        'search_history': request.session.get('search_history', []),
        
        # ハンバーガーメニュー用のデータ
        'COLOR_MAP': COLOR_MAP,
        'SEX_CHOICES': SEX_CHOICES,
        'TYPE_CHOICES': TYPE_CHOICES,
    }
    return render(request, "hamburger/index.html", context)

def menu_form_view(request): 
    # このビューの存在と、レンダリングに必要なコンテキストの準備
    context = {
        'params': request.GET, 
        'search_history': request.session.get('search_history', []),
        'COLOR_MAP': COLOR_MAP,
        'SEX_CHOICES': SEX_CHOICES,
        'TYPE_CHOICES': TYPE_CHOICES,
    }
    return render(request, "hamburger/menu_form.html", context)