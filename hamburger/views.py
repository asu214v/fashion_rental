# hamburger/views.py

from django.shortcuts import render
from rental.models import Rental 
from django.db.models import Q 
import json 
from django.http import JsonResponse

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

# 採寸フィールドの一覧を定義
MEASUREMENT_FIELDS = [
    'total_length', 'body_width', 'shoulder_width', 'sleeve_length',
    'waist', 'hip', 'length', 'rise', 'inseam', 'thigh', 'hem'
]

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
        
    # 2. 性別 
    sex = params.get('sex', 'すべて')
    # 🚨 修正: 性別フィルタリングを適用
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

    # 5. サイズ記号
    size = params.get('size', 'すべて') # 🚨 'すべて'をデフォルト値にする
    # 🚨 修正: サイズ記号が「すべて」以外の時のみ絞り込みを適用
    if size != 'すべて':
        query &= Q(size__icontains=size)

    # 6. ブランド
    brand = params.get('brand', '')
    if brand:
        query &= Q(brand__icontains=brand)
        
    # 7. 色
    color = params.get('color', 'すべて')
    if color != 'すべて':
        query &= Q(color=color)

    # 🚨 8. 採寸フィールド (新しく追加するロジック)
    for field in MEASUREMENT_FIELDS:
        min_param = f'{field}_min'
        max_param = f'{field}_max'
        
        min_val = params.get(min_param)
        max_val = params.get(max_param)

        # min_valが空でなければ、下限の検索条件を追加
        # 🚨 ここで空文字列('')とNoneを明確に区別し、空の場合は検索しない
        if min_val: # min_val が空文字列やNoneでない
            try:
                # データベースのフィールド名 (例: total_length) を指定して検索
                query &= Q(**{f'{field}__gte': float(min_val)})
            except ValueError:
                pass 
                
        # max_valが空でなければ、上限の検索条件を追加
        if max_val: # max_val が空文字列やNoneでない
            try:
                # データベースのフィールド名 (例: total_length) を指定して検索
                query &= Q(**{f'{field}__lte': float(max_val)})
            except ValueError:
                pass

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

def brand_autocomplete(request):
    """
    ブランド名を入力キーワードで絞り込み、JSONで返すビュー
    """
    query = request.GET.get('term', '') # 通常、オートコンプリートは 'term' という名前でキーワードを受け取る
    
    if not query:
        return JsonResponse([], safe=False)

    # データベースからキーワードに部分一致するブランド名を取得
    # DISTINCTを使って重複を排除し、最大20件に制限
    brands = Rental.objects.filter(
        brand__icontains=query
    ).values_list('brand', flat=True).distinct()[:20]

    # オートコンプリートライブラリの多くは ['Brand A', 'Brand B'] のようなリストを期待する
    brand_list = list(brands)
    
    return JsonResponse(brand_list, safe=False)