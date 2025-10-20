from django.shortcuts import render, get_object_or_404
from rental.models import Rental

def all_items(request):
    rentals = Rental.objects.all().order_by('-created_at')  # 最新順
    return render(request, "items/all_items.html", {"rentals": rentals})

def item_detail(request, rental_id):
    rental = get_object_or_404(Rental, id=rental_id)
    return render(request, "items/item_detail.html", {"rental": rental})

def review_detail(request, item_id):
    # item_idを使って商品を取得し、関連するレビューを渡す
    rental = get_object_or_404(Rental, pk=item_id)
    reviews = rental.review_set.all().order_by('-created_at') # 関連するレビューを取得する仮のコード
    
    context = {
        'rental': rental,
        'reviews': reviews,
    }
    return render(request, 'items/review_detail.html', context)