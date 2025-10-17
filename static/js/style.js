// ==========================================================
// グローバル変数: Color Map & Category Options & Measurement Options
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
    "すべて": ['すべて', 'トップス', 'ジャケット', 'パンツ', 'スカート', 'ワンピース', '靴', 'その他'],
    "メンズ": ['すべて', 'トップス', 'ジャケット', 'パンツ', '靴', 'その他'],
    "レディース": ['すべて', 'トップス', 'ジャケット', 'パンツ', 'スカート', 'ワンピース', '靴', 'その他'],
    "ユニセックス": ['すべて', 'トップス', 'ジャケット', 'パンツ', '靴',  'その他'],
};

const subCategoryOptions = {
    "トップス": ['すべて', 'Tシャツ', 'ポロシャツ', 'ニット・セーター', 'シャツ', 'その他'],
};

const measurementOptions = {
    "すべて": {
        sizes: ['ーー'],
        fields: []
    },
    "トップス": {
        sizes: ['ーー', '-XS', 'S', 'M', 'L', 'XL-'], 
        fields: ['total_length', 'body_width', 'shoulder_width', 'sleeve_length']
    },
    "ジャケット": {
        sizes: ['ーー', '-XS', 'S', 'M', 'L', 'XL-'],
        fields: ['total_length', 'body_width', 'shoulder_width', 'sleeve_length']
    },
    "パンツ": {
        sizes: ['ーー', '-XS', 'S', 'M', 'L', 'XL-'],
        fields: ['waist', 'hip', 'length', 'rise', 'inseam', 'thigh', 'hem']
    },
    "スカート": {
        sizes: ['ーー', '-XS', 'S', 'M', 'L', 'XL-'],
        fields: ['waist', 'hip', 'length']
    },
    "ワンピース": {
        sizes: ['ーー', '-XS', 'S', 'M', 'L', 'XL-'],
        fields: ['body_width', 'total_length']
    },
    "靴": {
        sizes: [],
        fields: ['shoe_size']
    },
    "バッグ": { sizes: ['すべて'], fields: [] },
    "アクセサリー": { sizes: ['すべて'], fields: [] },
    "その他": { sizes: ['すべて'], fields: [] },
};

/**
 * 採寸フィールドとサイズ選択フィールドをカテゴリに応じて更新・表示/非表示を切り替える
 * @param {string} selectedCategory - 現在選択されているカテゴリ
 * @param {HTMLElement} containerElement - メニュー全体を囲むコンテナ
 */
function updateMeasurementFields(selectedCategory, containerElement) {
    const config = measurementOptions[selectedCategory] || measurementOptions["すべて"];
    
    const sizeSelectContainer = containerElement.querySelector('#size_select_container');
    
    // --- 1. サイズの選択肢を <select> に更新/生成 ---
    if (sizeSelectContainer) {
        sizeSelectContainer.innerHTML = ''; 
        
        const select = document.createElement('select');
        select.name = 'size';
        select.id = 'id_size_select';
        select.style.width = '100%'; 
        select.style.padding = '10px';
        select.style.border = '1px solid #ccc';
        select.style.borderRadius = '4px';

        const initialSize = sizeSelectContainer.dataset.initialValue || 'すべて';
        
        config.sizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            if (size === initialSize) {
                option.selected = true;
            }
            select.appendChild(option);
        });
        
        sizeSelectContainer.appendChild(select);
    }

    // --- 2. 採寸詳細フィールドの表示/非表示切り替えと下限/上限入力への調整 ---
    
    const allMeasurementFields = containerElement.querySelectorAll('.measurement-field');

    allMeasurementFields.forEach(fieldContainer => {
        const fieldName = fieldContainer.dataset.name;
        
        if (config.fields.includes(fieldName)) {
            fieldContainer.style.display = 'block';
            
            // 下限/上限のプレースホルダーを調整
            const label = fieldContainer.querySelector('label');
            if (label) {
                let labelText = fieldName;
                // 🚨 新しいshoe_sizeフィールドの表示名を設定
                if (fieldName === 'shoe_size') labelText = '靴サイズ (cm)'; 
                if (fieldName === 'total_length') labelText = '着丈/総丈 (cm)';
                else if (fieldName === 'body_width') labelText = '身幅 (cm)';
                else if (fieldName === 'shoulder_width') labelText = '肩幅 (cm)';
                else if (fieldName === 'sleeve_length') labelText = 'そで丈 (cm)';
                else if (fieldName === 'waist') labelText = 'ウエスト (cm)';
                else if (fieldName === 'hip') labelText = 'ヒップ (cm)';
                else if (fieldName === 'length') labelText = '丈 (cm)';
                else if (fieldName === 'rise') labelText = '股上 (cm)';
                else if (fieldName === 'inseam') labelText = '股下 (cm)';
                else if (fieldName === 'thigh') labelText = 'もも回り (cm)';
                else if (fieldName === 'hem') labelText = 'すそ回り (cm)';
                
                label.textContent = labelText;
            }

        } else {
            fieldContainer.style.display = 'none';
            
            // 非表示にする際、値をクリアしてURLパラメータに含まれないようにする
            const inputs = fieldContainer.querySelectorAll('input[type="number"]');
            inputs.forEach(input => {
                input.value = '';
            });
        }
    });
}


// ==========================================================
// 価格バリデーションロジック
// ==========================================================

function priceValidationHandler(e) {
    const form = e.currentTarget;
    const minPriceInput = form.querySelector('#min_price');
    const maxPriceInput = form.querySelector('#max_price');
    const priceErrorDiv = form.querySelector('#priceError'); 
    
    if (!minPriceInput || !maxPriceInput || !priceErrorDiv) {
        return true; 
    }

    priceErrorDiv.style.display = 'none';
    priceErrorDiv.textContent = ''; 

    const rawMin = minPriceInput.value.trim();
    const rawMax = maxPriceInput.value.trim();
    const minPrice = rawMin === "" ? NaN : Number(rawMin);
    const maxPrice = rawMax === "" ? NaN : Number(rawMax);

    let hasError = false;
    let errorMessage = ''; 

    if (rawMin !== "" && (isNaN(minPrice) || minPrice < 0)) {
        hasError = true;
        errorMessage = '※下限値は0以上の数値を入力してください。';
    }

    if (!hasError && rawMax !== "" && (isNaN(maxPrice) || maxPrice < 0)) {
        hasError = true;
        errorMessage = '※上限値は0以上の数値を入力してください。';
    }

    if (!hasError && rawMin !== "" && rawMax !== "" && maxPrice < minPrice) {
         hasError = true;
         errorMessage = '※価格の上限は下限以上の値を入力してください。'; 
    }

    if (hasError) {
        e.preventDefault();
        priceErrorDiv.textContent = errorMessage;
        priceErrorDiv.style.display = 'block';
        return false;
    }

    return true;
}


function setupPriceValidation(form) {
    form.removeEventListener('submit', priceValidationHandler); 
    form.addEventListener('submit', priceValidationHandler);
}


// ==========================================================
// 共通機能: カラーモーダルの初期化関数
// ==========================================================
function initializeColorModal(containerElement) {
    const openBtn = containerElement.querySelector('#openColorModal');
    const closeBtn = containerElement.querySelector('#closeColorModal');
    const modal = containerElement.querySelector('#colorModal');
    const colorOptions = containerElement.querySelectorAll('input[name="colorOption"]');
    const selectedInput = containerElement.querySelector('#selectedColorInput');
    const displayBanner = containerElement.querySelector('#displayColorBanner');

    if (!openBtn || !modal || !selectedInput || !displayBanner || colorOptions.length === 0) return; 

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
        }
        
        modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}


// ===== 階層カテゴリ選択ロジックの初期化 =====
function initializeCategoryLogic(containerElement) {
    const form = containerElement.querySelector('#searchForm');
    const sexHiddenInput = form ? form.querySelector('input[type="hidden"][name="sex"]') : null;
    const categorySelect = containerElement.querySelector('#category_select');
    const subCategorySelect = containerElement.querySelector('#sub_category_select');

    if (!categorySelect || !subCategorySelect) return;
    
    const initialSex = sexHiddenInput ? sexHiddenInput.value : 
                       containerElement.querySelector('.selection-buttons-container button[name="sex"].selected')?.value || 'すべて';
    
    const initialCategory = categorySelect.dataset.initialValue || 'すべて';
    // サイズ記号の初期値を size_select_container にも設定
    const sizeSelectContainer = containerElement.querySelector('#size_select_container');
    if (sizeSelectContainer) {
        sizeSelectContainer.dataset.initialValue = form.querySelector('input[name="size"]')?.value || 'すべて';
    }

    const initialSubCategory = subCategorySelect ? subCategorySelect.dataset.initialValue || 'すべて' : 'すべて';

    function updateCategoryOptions(selectedSex, selectedCategory) {
        categorySelect.innerHTML = ''; 
        const categories = categoryOptions[selectedSex] || categoryOptions["すべて"];

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            
            if (category === selectedCategory) {
                option.selected = true;
            }
            categorySelect.appendChild(option);
        });
        
        updateSubCategoryOptions(categorySelect.value, initialSubCategory);
        updateMeasurementFields(categorySelect.value, containerElement);
    }

    function updateSubCategoryOptions(selectedCategory, selectedSubCategory) {
        if (!subCategorySelect) return;
        
        subCategorySelect.innerHTML = '';
        const subCategories = subCategoryOptions[selectedCategory];
        
        if (!subCategories || (subCategories.length === 1 && subCategories[0] === 'すべて')) {
            subCategorySelect.style.display = 'block';
            const dummyOption = document.createElement('option');
            dummyOption.value = 'すべて';
            dummyOption.textContent = 'ーー';
            subCategorySelect.appendChild(dummyOption);
            return;
        } 
        
        subCategorySelect.style.display = 'block';

        subCategories.forEach(sub => {
            const option = document.createElement('option');
            option.value = sub;
            option.textContent = sub;
            
            if (sub === selectedSubCategory) {
                option.selected = true;
            }
            subCategorySelect.appendChild(option);
        });
    }

    containerElement.querySelectorAll('button[name="sex"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const newSex = e.target.value;
            updateCategoryOptions(newSex, 'すべて'); 
        });
    });
    
    categorySelect.addEventListener('change', (e) => {
        const newCategory = e.target.value;
        updateSubCategoryOptions(newCategory, 'すべて');
        updateMeasurementFields(newCategory, containerElement);
    });

    updateCategoryOptions(initialSex, initialCategory);
    updateMeasurementFields(categorySelect.value, containerElement);
}


// ==========================================================
// ハンバーガーメニュー: 画面遷移ロジック
// ==========================================================

function disableLinks(exceptLink) {
    const chatLink = document.querySelector(".chat-link");
    const notifyLink = document.querySelector(".notify-link");
    const hamburgerLink = document.querySelector(".hamburger-link");

    [chatLink, notifyLink, hamburgerLink].forEach(link => {
        if (link && link !== exceptLink) {
            link.style.pointerEvents = "none";
        }
    });
}

function enableAllLinks() {
    const chatLink = document.querySelector(".chat-link");
    const notifyLink = document.querySelector(".notify-link");
    const hamburgerLink = document.querySelector(".hamburger-link");

    [chatLink, notifyLink, hamburgerLink].forEach(link => {
        if (link) {
            link.style.pointerEvents = "auto";
        }
    });
}

function closeLeftMenu() {
    const leftMenu = document.getElementById("left-menu");
    leftMenu.classList.remove("slide-in");
    setTimeout(() => {
        leftMenu.innerHTML = "";
        leftMenu.className = "";
    }, 300);
}

function closeRightMenu() {
    const rightMenu = document.getElementById("right-menu");
    enableAllLinks();

    rightMenu.classList.remove("slide-in");
    setTimeout(() => {
        rightMenu.innerHTML = "";
        rightMenu.className = "";
    }, 300);
}

function handleMenuNavigation(e) {
    
}

function handleFormNavigation(e) {
    
}

function handleFilterButtonClick(event) {
    event.preventDefault(); 
    const button = event.currentTarget;
    const form = button.closest('form');
    const groupName = button.getAttribute('name');
    const currentValue = button.getAttribute('value');
    
    form.querySelectorAll(`button[name="${groupName}"]`).forEach(btn => {
        btn.classList.remove('selected');
    });
    button.classList.add('selected');

    let hiddenInput = form.querySelector(`input[type="hidden"][name="${groupName}"]`); 
    if (!hiddenInput) {
        hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = groupName;
        form.appendChild(hiddenInput);
    }
    hiddenInput.value = currentValue;
}

function handleResetClick(e) {
    e.preventDefault();
    window.location.href = document.querySelector('#searchForm').getAttribute('action'); 
}

function initializeHiddenInputs(form) {
    form.querySelectorAll('.selected').forEach(selectedBtn => {
        const groupName = selectedBtn.getAttribute('name');
        const currentValue = selectedBtn.getAttribute('value');
        
        let hiddenInput = form.querySelector(`input[type="hidden"][name="${groupName}"]`); 
        if (!hiddenInput) {
            hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = groupName;
            form.appendChild(hiddenInput);
        }
        hiddenInput.value = currentValue;
    });
}

function bindFilterButtons(container) {
    const form = container.querySelector('#searchForm');
    if (!form) return; 

    form.querySelectorAll('.selection-button-small, .color-option-btn').forEach(button => {
        button.removeEventListener('click', handleFilterButtonClick);
        button.addEventListener('click', handleFilterButtonClick);
    });

    const resetButton = form.querySelector('.search-reset-btn');
    if(resetButton) {
        resetButton.removeAttribute('onclick');
        resetButton.removeEventListener('click', handleResetClick);
        resetButton.addEventListener('click', handleResetClick);
    }
    
    initializeHiddenInputs(form);
}
// JavaScriptコードのどこかに記述

function setupBrandAutocomplete() {
    // 1. jQueryとjQuery UIが読み込まれているか確認
    if (typeof jQuery === 'undefined' || typeof jQuery.ui === 'undefined') {
        console.warn("jQuery UI Autocompleteに必要なライブラリがロードされていません。ブランド入力は通常のテキストフィールドとして動作します。");
        return;
    }
    
    const brandInput = $('#id_brand');
    const autocompleteUrl = '/hamburger/brand_autocomplete/'; // 🚨 urls.pyで設定したURL

    brandInput.autocomplete({
        // ユーザーが3文字以上入力したときから候補の検索を開始
        minLength: 2, 
        
        source: function(request, response) {
            // request.term にはユーザーが入力した文字が入る
            $.ajax({
                url: autocompleteUrl,
                data: {
                    term: request.term
                },
                dataType: "json",
                success: function(data) {
                    // Djangoビューから返されたJSONデータ (ブランド名のリスト) を利用
                    response(data);
                },
                error: function() {
                    console.error("ブランド候補の取得に失敗しました。");
                    response([]); // エラー時は空のリストを返す
                }
            });
        },
        
        // 候補が選択されたときの処理
        select: function(event, ui) {
            // 選択されたブランド名をテキストフィールドにセット
            brandInput.val(ui.item.value); 
            // フォームを送信したい場合はここで submit() を実行
            // brandInput.closest('form').submit();
            return false; // Autocompleteのデフォルトの挙動をキャンセル
        }
    });
}


// DOMContentLoaded内でオートコンプリートを設定
document.addEventListener("DOMContentLoaded", () => {
    // ... (既存のDOMContentLoaded内の処理) ...

    // 検索フォームがロードされた後に実行
    const staticSearchForm = document.getElementById('searchForm');
    if (staticSearchForm) {
        // ... (既存の処理) ...
        setupBrandAutocomplete(); // 🚨 追加
    }
});

// もしハンバーガーメニュー内で動的にフォームがロードされるなら、
// bindMenuLinks 関数内でも setupBrandAutocomplete() を呼び出します。
function bindMenuLinks(container) {
    // ... (既存の処理) ...
    
    const searchForm = container.querySelector('#searchForm');
    if (searchForm) {
        // ... (既存の処理) ...
        setupBrandAutocomplete(); // 🚨 追加
    }
    
    // ...
}

function bindMenuLinks(container) {
    bindFilterButtons(container);
    
    const searchForm = container.querySelector('#searchForm');
    if (searchForm) {
        setupPriceValidation(searchForm);
    }
    
    initializeCategoryLogic(container); 
}


async function loadMenuContent(url, isInitial = false) {
    const leftMenu = document.getElementById("left-menu");
    
    if (!isInitial) {
        leftMenu.innerHTML = `<p style="padding: 20px; text-align: center;">読み込み中...</p>`;
    }

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }
        
        const text = await response.text();
        
        if (isInitial) {
            leftMenu.className = "from-left";
            void leftMenu.offsetWidth;
            leftMenu.classList.add("slide-in");
        }
        
        leftMenu.innerHTML = `<div id="menu-content-container">${text}</div>`;
        
        bindMenuLinks(leftMenu); 

    } catch(error) {
        console.error("メニューコンテンツの読み込みに失敗しました:", error);
        
        leftMenu.innerHTML = `<p style="padding: 20px;">コンテンツの読み込み中にエラーが発生しました。<br>詳細: ${error.message || '不明なエラー'}</p>`;
    }
}


// ==========================================================
// DOMContentLoaded
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
    const rightMenu = document.getElementById("right-menu");
    const leftMenu = document.getElementById("left-menu");

    const chatLink = document.querySelector(".chat-link");
    const notifyLink = document.querySelector(".notify-link");
    const hamburgerLink = document.querySelector(".hamburger-link");
    const hamburgerIcon = hamburgerLink ? hamburgerLink.querySelector(".icon") : null;
    
    function closeLeftMenuWrapper(e) {
        e.preventDefault();
        
        closeLeftMenu();
        enableAllLinks();
        
        if (hamburgerIcon) {
            hamburgerIcon.innerHTML = '&#9776;';
            
            hamburgerLink.removeEventListener('click', closeLeftMenuWrapper);
            hamburgerLink.addEventListener('click', loadLeftMenuWrapper);
        }
    }
    
    async function loadLeftMenuWrapper(e) {
        e.preventDefault();
        
        await loadLeftMenu(e); 
        
        if (hamburgerIcon) {
            hamburgerIcon.innerHTML = '&times;';
            
            hamburgerLink.removeEventListener('click', loadLeftMenuWrapper);
            hamburgerLink.addEventListener('click', closeLeftMenuWrapper);
        }
    }
    
    async function loadRightMenu(e) {
        e.preventDefault();
        disableLinks(e.currentTarget);
        const url = e.currentTarget.getAttribute("href");
        try {
            const response = await fetch(url);
            const text = await response.text();
            
            rightMenu.innerHTML = `<span class="close-btn">&times;</span><div>${text}</div>`;

            rightMenu.className = "from-right";
            void rightMenu.offsetWidth;
            rightMenu.classList.add("slide-in");

            rightMenu.querySelector(".close-btn").addEventListener("click", closeRightMenu);

        } catch {
            rightMenu.innerHTML = "<p>読み込み失敗しました</p>";
        }
    }

    async function loadLeftMenu(e) {
        const target = e.currentTarget || document.querySelector(".hamburger-link");
        
        disableLinks(target);

        const url = "/hamburger/menu_form/"; 
        const currentParams = window.location.search;
        const fullUrl = url + currentParams;

        await loadMenuContent(fullUrl, true);
    }
    
    const video = document.getElementById("camera");
    const captureButton = document.getElementById("capture");
    const cameraErrorMessage = document.getElementById("cameraErrorMessage");
    if (video && captureButton) {
        const canvas = document.getElementById("snapshot");
        const context = canvas.getContext("2d");
        const container = document.getElementById("capturedImagesContainer");
        
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(stream => video.srcObject = stream)
        .catch(err => {
            console.error("カメラを起動できません: ", err);
            if (video) video.style.display = 'none'; 
            if (captureButton) captureButton.style.display = 'none';
            if (cameraErrorMessage) cameraErrorMessage.style.display = 'block';
        });
        
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

        initializeColorModal(document); 
    }
    
    chatLink?.addEventListener("click", loadRightMenu);
    notifyLink?.addEventListener("click", loadRightMenu);
    
    hamburgerLink?.addEventListener("click", loadLeftMenuWrapper);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeRightMenu();
            if (leftMenu.classList.contains('slide-in')) {
                 closeLeftMenuWrapper(e);
            }
        }
    });

    const staticSearchForm = document.getElementById('searchForm');
    if (staticSearchForm) {
        setupPriceValidation(staticSearchForm);
        bindFilterButtons(document);
        initializeCategoryLogic(document);
    }
});