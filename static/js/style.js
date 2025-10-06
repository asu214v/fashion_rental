// style.js の全内容

// ==========================================================
// グローバル変数: Color Map & Category Options
// ==========================================================
const colorMap = {
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
    "すべて": "#5a6268"
};

const categoryOptions = {
    // 性別（sex）に応じたカテゴリの定義
    "すべて": ['すべて', 'トップス', 'ジャケット', 'パンツ', 'スカート', 'ワンピース', '靴', 'バッグ', 'アクセサリー', 'その他'],
    "メンズ": ['すべて', 'トップス', 'ジャケット', 'パンツ', '靴', 'バッグ', 'アクセサリー', 'その他'],
    "レディース": ['すべて', 'トップス', 'ジャケット', 'パンツ', 'スカート', 'ワンピース', '靴', 'バッグ', 'アクセサリー', 'その他'],
    "ユニセックス": ['すべて', 'トップス', 'ジャケット', 'パンツ', '靴', 'バッグ', 'アクセサリー', 'その他'],
};

const subCategoryOptions = {
    // カテゴリ（category）に応じた詳細種類（sub_category）の定義
    "トップス": ['すべて', 'Tシャツ', 'ポロシャツ', 'ニット・セーター', 'シャツ', 'その他'],
    // 他のカテゴリが必要な場合はここに追加
};


// ==========================================================
// 共通機能: カラーモーダルの初期化関数 (現在のメニュー遷移UIでは未使用の可能性あり)
// ==========================================================
function initializeColorModal(containerElement) {
    const openBtn = containerElement.querySelector('#openColorModal');
    const closeBtn = containerElement.querySelector('#closeColorModal');
    const modal = containerElement.querySelector('#colorModal');
    const colorOptions = containerElement.querySelectorAll('input[name="colorOption"]');
    const selectedInput = containerElement.querySelector('#selectedColorInput');
    const displayBanner = containerElement.querySelector('#displayColorBanner');

    if (!openBtn || !modal || !selectedInput || !displayBanner || colorOptions.length === 0) return; 

    // --- 1. 初期値の表示 ---
    const initialColor = selectedInput.value;
    if (initialColor && colorMap[initialColor]) {
        colorOptions.forEach(radio => {
            if (radio.value === initialColor) radio.checked = true;
        });
        
        const bgColor = colorMap[initialColor];
        const textColor = (initialColor === 'ホワイト' || initialColor === 'イエロー' || initialColor === 'すべて') ? 'black' : 'white';

        displayBanner.textContent = initialColor;
        displayBanner.style.backgroundColor = bgColor;
        displayBanner.style.color = textColor;
        displayBanner.style.border = (initialColor === 'ホワイト' || initialColor === 'イエロー' || initialColor === 'すべて') ? '1px solid #ccc' : 'none';
        displayBanner.style.display = 'inline-block';
    } else {
        displayBanner.style.display = 'none';
    }


    // --- 2. イベントリスナーの登録 ---

    openBtn.addEventListener('click', () => { modal.style.display = 'flex'; });
    
    closeBtn.addEventListener('click', () => {
        let selectedValue = null;
        colorOptions.forEach(radio => {
            if (radio.checked) {
                selectedValue = radio.value;
            }
        });

        if (selectedValue) {
            selectedInput.value = selectedValue;
            
            const bgColor = colorMap[selectedValue];
            const textColor = (selectedValue === 'ホワイト' || selectedValue === 'イエロー' || selectedValue === 'すべて') ? 'black' : 'white';

            displayBanner.textContent = selectedValue;
            displayBanner.style.backgroundColor = bgColor;
            displayBanner.style.color = textColor;
            displayBanner.style.border = (selectedValue === 'ホワイト' || selectedValue === 'イエロー' || selectedValue === 'すべて') ? '1px solid #ccc' : 'none';
            displayBanner.style.display = 'inline-block';
        } else {
            selectedInput.value = '';
            displayBanner.style.display = 'none';
        }
        
        modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}


// ===== 階層カテゴリ選択ロジックの初期化 (現在のメニュー遷移UIでは未使用の可能性あり) =====
function initializeCategoryLogic(containerElement) {
    const sexSelect = containerElement.querySelector('#sex');
    const categorySelect = containerElement.querySelector('#category_select');
    const subCategorySelect = containerElement.querySelector('#sub_category_select');

    if (!sexSelect || !categorySelect) return;
    
    const initialCategory = categorySelect.dataset.initialValue || categorySelect.value;
    const initialSubCategory = subCategorySelect ? subCategorySelect.dataset.initialValue || subCategorySelect.value : '';

    function updateCategoryOptions(selectedSex, selectedCategory) {
        categorySelect.innerHTML = ''; 
        const categories = categoryOptions[selectedSex] || categoryOptions["すべて"];

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            
            if (category === selectedCategory || category === initialCategory) {
                option.selected = true;
            }
            categorySelect.appendChild(option);
        });
        
        updateSubCategoryOptions(categorySelect.value, initialSubCategory);
    }

    function updateSubCategoryOptions(selectedCategory, selectedSubCategory) {
        if (!subCategorySelect) return;
        
        subCategorySelect.innerHTML = '';
        const subCategories = subCategoryOptions[selectedCategory] || ['すべて'];
        
        if (subCategories.length === 1 && subCategories[0] === 'すべて') {
             subCategorySelect.style.display = 'none';
        } else {
             subCategorySelect.style.display = 'block';
        }

        subCategories.forEach(sub => {
            const option = document.createElement('option');
            option.value = sub;
            option.textContent = sub;
            
            if (sub === selectedSubCategory || sub === initialSubCategory) {
                option.selected = true;
            }
            subCategorySelect.appendChild(option);
        });
    }

    sexSelect.addEventListener('change', (e) => {
        updateCategoryOptions(e.target.value, 'すべて'); 
    });
    
    categorySelect.addEventListener('change', (e) => {
        updateSubCategoryOptions(e.target.value, 'すべて');
    });

    updateCategoryOptions(sexSelect.value, initialCategory);
}


// ==========================================================
// ハンバーガーメニュー: 画面遷移ロジック (コア機能)
// ==========================================================

function closeLeftMenu() {
    const leftMenu = document.getElementById("left-menu");
    // enableAllLinks() は省略 (必要に応じて実装してください)
    
    leftMenu.classList.remove("slide-in");
    setTimeout(() => {
        leftMenu.innerHTML = "";
        leftMenu.className = "";
    }, 300);
}

function closeRightMenu() {
    const rightMenu = document.getElementById("right-menu");
    // enableAllLinks() は省略 (必要に応じて実装してください)

    rightMenu.classList.remove("slide-in");
    setTimeout(() => {
        rightMenu.innerHTML = "";
        rightMenu.className = "";
    }, 300);
}

/**
 * メニュー内のリンククリック時の処理 (主に性別、タイプ、色などの選択画面遷移)
 */
function handleMenuNavigation(e) {
    e.preventDefault();
    const nextUrl = e.currentTarget.getAttribute('href');
    if (nextUrl) {
        loadMenuContent(nextUrl);
    }
}

/**
 * フォーム送信時の処理 (主にキーワード、価格、サイズ、ブランドの入力画面)
 */
function handleFormNavigation(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // 現在の絞り込みパラメータを取得し、'step'を除外
    const currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.delete('step');
    
    // フォームの内容をパラメータに追加/上書き
    for (const [key, value] of formData.entries()) {
        if (value) {
            currentUrlParams.set(key, value);
        } else {
            currentUrlParams.delete(key);
        }
    }
    
    // メインメニューに戻るURLを構築
    const mainUrl = '/hamburger/menu/'; // DjangoのURL名に依存
    const nextUrl = `${mainUrl}?step=main&${currentUrlParams.toString()}`;

    loadMenuContent(nextUrl);
}

/**
 * 新しいコンテンツに埋め込まれたすべての要素にイベントを再バインド
 */
function bindMenuLinks(container) {
    // 1. リンク (<a>) のバインド
    container.querySelectorAll('a').forEach(link => {
        // 検索実行ボタンとリセットボタンは標準動作（ページ全体遷移）させる
        if (link.classList.contains('menu-submit-btn') || link.classList.contains('menu-reset-btn')) {
            return; 
        }
        
        const href = link.getAttribute('href');
        // 外部リンクやJS実行リンクは対象外
        if (!href || href.startsWith('#') || href.startsWith('javascript:') || !href.includes('/menu/')) return; 

        link.removeEventListener('click', handleMenuNavigation);
        link.addEventListener('click', handleMenuNavigation);
    });
    
    // 2. フォーム (<form>) のバインド
    container.querySelectorAll('form').forEach(form => {
        form.removeEventListener('submit', handleFormNavigation);
        form.addEventListener('submit', handleFormNavigation);
    });

    // 3. (必要なら) カラーモーダルなどの初期化を再実行
    // initializeColorModal(container); 
    // initializeCategoryLogic(container);
}


/**
 * メニューコンテンツのロードと表示を担うメイン関数
 */
async function loadMenuContent(url, isInitial = false) {
    const leftMenu = document.getElementById("left-menu");
    const closeBtnHtml = `<span class="close-btn">&times;</span>`;
    
    // ロード中はスピナーなどを表示するとUX向上
    if (!isInitial) {
        leftMenu.innerHTML = `${closeBtnHtml}<p style="padding: 20px; text-align: center;">読み込み中...</p>`;
        leftMenu.querySelector(".close-btn").addEventListener("click", closeLeftMenu);
    }

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }
        
        const text = await response.text();
        
        // 1. アニメーション制御 (初回ロード時のみスライドアニメーションを実行)
        if (isInitial) {
            leftMenu.className = "from-left";
            void leftMenu.offsetWidth;
            leftMenu.classList.add("slide-in");
        }
        
        // 2. コンテンツの置き換え
        // メニューのHTML全体を置き換え、スクロール領域のパディング調整
        leftMenu.innerHTML = `${closeBtnHtml}<div id="menu-content-container">${text}</div>`;
        
        // 3. イベントの再バインド
        leftMenu.querySelector(".close-btn").addEventListener("click", closeLeftMenu);
            
        bindMenuLinks(leftMenu);

    } catch(error) {
        console.error("メニューコンテンツの読み込みに失敗しました:", error);
        
        // エラー詳細をユーザーに表示
        leftMenu.innerHTML = `${closeBtnHtml}<p style="padding: 20px;">コンテンツの読み込み中にエラーが発生しました。<br>詳細: ${error.message || '不明なエラー'}</p>`;
        leftMenu.querySelector(".close-btn").addEventListener("click", closeLeftMenu);
    }
}


// ==========================================================
// DOMContentLoaded (ページ読み込み完了時) の処理
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
    const rightMenu = document.getElementById("right-menu");
    const leftMenu = document.getElementById("left-menu");

    const chatLink = document.querySelector(".chat-link");
    const notifyLink = document.querySelector(".notify-link");
    const hamburgerLink = document.querySelector(".hamburger-link");

    // ===== リンク無効化/有効化 (再定義) =====
    // 閉じるボタンの実装に必要なため、簡略化して残します。
    function disableLinks(exceptLink) {
        [chatLink, notifyLink, hamburgerLink].forEach(link => {
            if (link && link !== exceptLink) {
                link.style.pointerEvents = "none";
            }
        });
    }

    function enableAllLinks() {
        [chatLink, notifyLink, hamburgerLink].forEach(link => {
            if (link) {
                link.style.pointerEvents = "auto";
            }
        });
    }
    
    // ===== 右側メニューの開閉 (修正版) =====
    async function loadRightMenu(e) {
        e.preventDefault();
        disableLinks(e.currentTarget);
        const url = e.currentTarget.getAttribute("href");
        try {
            const response = await fetch(url);
            const text = await response.text();
            
            // 右メニューはHTMLをそのまま表示
            rightMenu.innerHTML = `<span class="close-btn">&times;</span><div>${text}</div>`;

            rightMenu.className = "from-right";
            void rightMenu.offsetWidth;
            rightMenu.classList.add("slide-in");

            rightMenu.querySelector(".close-btn").addEventListener("click", closeRightMenu);

        } catch {
            rightMenu.innerHTML = "<p>読み込み失敗しました</p>";
        }
    }

    // ===== 左側メニューの開閉 (loadMenuContentを使用するように修正) =====
    async function loadLeftMenu(e) {
        const target = e.currentTarget || document.querySelector(".hamburger-link");
        if (e && e.preventDefault) e.preventDefault();
        
        // リンク無効化 (メニューを開いている間は他のヘッダーアイコンを無効にする)
        disableLinks(target);

        // 初回ロード時は、必ず /hamburger/menu/ にリクエスト
        const url = "/hamburger/menu/"; 
        
        // 既存のURLパラメータを引き継ぐ (例: ?sex=メンズ)
        const currentParams = window.location.search;
        const fullUrl = currentParams ? `${url}?step=main${currentParams.replace('?', '&')}` : `${url}?step=main`;

        await loadMenuContent(fullUrl, true); // trueで初回アニメーション実行
    }
    
    // ===== 出品フォーム機能: カメラと初期化 (要素が存在する場合のみ実行) =====
    const video = document.getElementById("camera");
    const captureButton = document.getElementById("capture");
    const cameraErrorMessage = document.getElementById("cameraErrorMessage");
    if (video && captureButton) {
        const canvas = document.getElementById("snapshot");
        const context = canvas.getContext("2d");
        const container = document.getElementById("capturedImagesContainer");
        
        // --- 1. カメラ起動 ---
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(stream => video.srcObject = stream)
        .catch(err => {
            console.error("カメラを起動できません: ", err);
            if (video) video.style.display = 'none'; 
            if (captureButton) captureButton.style.display = 'none';
            if (cameraErrorMessage) cameraErrorMessage.style.display = 'block';
        });
        
        // --- 2. 撮影 ---
        captureButton.addEventListener("click", () => {
            if (!canvas) return;
            
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0);
        
            const dataURL = canvas.toDataURL("image/png");
        
            const imgPreview = document.createElement("img");
            imgPreview.src = dataURL;
            imgPreview.style.width = "100px";
            imgPreview.style.margin = "5px";
            container.appendChild(imgPreview);
        
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = "captured_images";
            input.value = dataURL;
            container.appendChild(input);
        });

        // --- 3. 出品フォームのカラーモーダル初期化 ---
        initializeColorModal(document); 
    }
    
    // ===== イベント登録 =====
    chatLink?.addEventListener("click", loadRightMenu);
    notifyLink?.addEventListener("click", loadRightMenu);
    hamburgerLink?.addEventListener("click", loadLeftMenu);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeRightMenu();
            closeLeftMenu();
        }
    });
});