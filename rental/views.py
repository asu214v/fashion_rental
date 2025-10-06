from django.shortcuts import render, redirect
from .models import Rental, RentalImage
from django.contrib.auth.decorators import login_required
from django.db import transaction
import base64
import uuid
from django.core.files.base import ContentFile


@login_required
def index(request):
    message = request.session.pop("message", None)
    return render(request, "rental/index.html", {"message": message})

@login_required
def rental_reg(request):
    if request.method == "POST":
        name = request.POST.get("name")
        description = request.POST.get("description")
        price = request.POST.get("price")
        category = request.POST.get("category")
        type = request.POST.get("type")
        
        # 🔥 新規追加: フォームから新しいフィールドの値を取得 🔥
        size = request.POST.get("size")
        brand = request.POST.get("brand")
        condition = request.POST.get("condition")
        color = request.POST.get("color")
        
        # statusはフォームに追加されていないため、ビュー内で固定 ("available"を維持)
        status = "available" 

        captured_images = request.POST.getlist("captured_images")

        # データベース操作を確実に実行するためトランザクションを使用
        with transaction.atomic():
            rental = Rental.objects.create(
                user=request.user,
                name=name,
                description=description,
                price=price,
                category=category,
                type=type,
                # 🔥 新規フィールドの値をモデルに保存 🔥
                size=size,
                brand=brand,
                condition=condition,
                color=color,
                # 🔥 (ここまで新規追加) 🔥
                status=status
            )
            
            # 1. 通常のファイルアップロードを処理 (変更なし)
            for img in request.FILES.getlist("images"):
                RentalImage.objects.create(rental=rental, image=img)
                
            # 2. Base64 画像 (カメラ撮影) を処理 (変更なし)
            for base64_data in captured_images:
                if ';base64,' in base64_data:
                    format_part, imgstr = base64_data.split(';base64,')
                    
                    try:
                        ext = format_part.split('/')[-1]
                        data = ContentFile(base64.b64decode(imgstr), name=f'{uuid.uuid4()}.{ext}')
                        RentalImage.objects.create(rental=rental, image=data)
                        
                    except Exception as e:
                        print(f"カメラ画像処理中にエラーが発生しました: {e}")
                        pass 


        # 出品完了メッセージをセッションに保存
        request.session["message"] = f"{name} を出品しました！"
        return redirect("rental:index")

    return render(request, "rental/rental_reg.html")

@login_required
def my_items(request):
    # 🔥 ログインユーザーのIDと一致するRentalオブジェクトのみをフィルタリング 🔥
    # '-created_at' は、最新の出品が一番上に来るように降順で並べることを意味します
    rentals = Rental.objects.filter(user=request.user).order_by('-created_at')
    
    # my_items.html テンプレートにデータを渡す
    return render(request, "rental/my_items.html", {"rentals": rentals})