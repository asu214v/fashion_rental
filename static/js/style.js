// static/js/main.js
document.addEventListener("DOMContentLoaded", () => {
    // 既存の要素
    const overlay = document.getElementById("overlay");
    const chatLink = document.querySelector(".chat-link");
    const notifyLink = document.querySelector(".notify-link");

    // 【追加】ハンバーガーメニュー関連の要素を取得
    const hamburgerButton = document.querySelector(".hamburger"); // HTMLのクラス名に合わせて修正
    // サイドメニューのコンテンツがoverlayに入ることを想定し、ここは一旦不要（後述のHTML修正を参照）
    // const sideMenu = document.getElementById('side-menu'); 
    
    // ----------------------------------------------------
    // 既存の loadContent 関数 (変更なし)
    async function loadContent(e) {
        e.preventDefault();
        const url = e.currentTarget.getAttribute("href");
        
        // 既存のloadContentはchatとnotifyのリンクタイプを判定しているため、
        // loadMenuContent関数を別途作成します
        const linkType = e.currentTarget.classList.contains("chat-link")
          ? "chat"
          : "notify";

        try {
            const response = await fetch(url);
            const text = await response.text();
            const parser = new DOMParser();
            const newDoc = parser.parseFromString(text, "text/html");
            const newContent = newDoc.querySelector("#content");

            overlay.innerHTML = `
                <span class="close-btn">&times;</span>
                ${newContent ? newContent.innerHTML : "<p>読み込みエラー</p>"}
            `;

            // スライドイン処理 (変更なし)
            overlay.classList.remove("slide-in");
            overlay.style.transform = "translateX(100%)";
            void overlay.offsetWidth;
            overlay.style.transform = "";
            overlay.classList.add("slide-in");

            window.history.pushState({}, "", url);

            overlay.querySelector(".close-btn").addEventListener("click", closeOverlay);

            // リンク無効化処理 (既存)
            if (linkType === "chat") {
                chatLink.classList.add("disabled");
                notifyLink.classList.remove("disabled");
                notifyLink.style.pointerEvents = "none";
                chatLink.style.pointerEvents = "auto";
            } else {
                notifyLink.classList.add("disabled");
                chatLink.classList.remove("disabled");
                chatLink.style.pointerEvents = "none";
                notifyLink.style.pointerEvents = "auto";
            }
        } catch (err) {
            overlay.innerHTML = "<p>読み込み失敗しました</p>";
            overlay.classList.add("slide-in");
        }
    }

    // ----------------------------------------------------
    // 既存の closeOverlay 関数 (変更なし)
    function closeOverlay() {
        overlay.classList.remove("slide-in");
        setTimeout(() => {
            overlay.innerHTML = "";
            // 両方のリンクを有効化
            chatLink.style.pointerEvents = "auto";
            notifyLink.style.pointerEvents = "auto";
            chatLink.classList.remove("disabled");
            notifyLink.classList.remove("disabled");
        }, 300);
    }
    
    // ----------------------------------------------------
    // 【追加】ハンバーガーメニュー用のコンテンツ読み込み関数
    function loadMenuContent(e) {
        e.preventDefault();
        // ここでは、ハンバーガーメニューの内容を直接HTMLで記述するか、
        // 専用のエンドポイントから取得することを想定します。
        
        // 例: メニュー内容を直接記述
        overlay.innerHTML = `
            <span class="close-btn">&times;</span>
            <div class="side-menu-content">
                <h2>メニュー</h2>
                <ul>
                    <li><a href="/">ホームへ</a></li>
                    <li><a href="{% url 'my_page:settings' %}">設定</a></li>
                    <li><a href="{% url 'auth:logout' %}">ログアウト</a></li>
                    </ul>
            </div>
        `;

        // スライドイン処理 (既存のloadContentと共通)
        overlay.classList.remove("slide-in");
        overlay.style.transform = "translateX(100%)";
        void overlay.offsetWidth;
        overlay.style.transform = "";
        overlay.classList.add("slide-in");

        // 閉じるボタン
        overlay.querySelector(".close-btn").addEventListener("click", closeOverlay);
        
        // リンク無効化処理
        // ハンバーガーメニューを開いている間はチャット/通知ボタンの誤操作を防ぐために無効化することが望ましい
        chatLink.style.pointerEvents = "none";
        notifyLink.style.pointerEvents = "none";
    }

    // ----------------------------------------------------
    // イベントリスナーの設定

    if (chatLink) chatLink.addEventListener("click", loadContent);
    if (notifyLink) notifyLink.addEventListener("click", loadContent);
    
    // 【追加】ハンバーガーボタンのイベントリスナー
    if (hamburgerButton) hamburgerButton.addEventListener("click", loadMenuContent);

    // Escapeキーで閉じる (変更なし)
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeOverlay();
    });
});

// 【削除】DOMContentLoadedの外側にあるこのブロックは削除してください
/*
const hamburgerButton = document.getElementById('hamburger-menu');
const sideMenu = document.getElementById('side-menu');

hamburgerButton.addEventListener('click', function() {
    sideMenu.classList.toggle('is-active');
});
*/