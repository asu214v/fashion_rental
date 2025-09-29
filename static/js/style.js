document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("overlay");
  const chatLink = document.querySelector(".chat-link");
  const notifyLink = document.querySelector(".notify-link");

  async function loadContent(e) {
    e.preventDefault();
    const url = e.currentTarget.getAttribute("href");
    const linkType = e.currentTarget.classList.contains("chat-link")
      ? "chat"
      : "notify";

    try {
      const response = await fetch(url);
      const text = await response.text();
      const parser = new DOMParser();
      const newDoc = parser.parseFromString(text, "text/html");
      const newContent = newDoc.querySelector("#content");

      // 閉じるボタンを追加
      overlay.innerHTML = `
        <span class="close-btn">&times;</span>
        ${newContent ? newContent.innerHTML : "<p>読み込みエラー</p>"}
      `;

      // 1. 一旦右に戻す
      overlay.classList.remove("slide-in");
      overlay.style.transform = "translateX(100%)";

      // 2. 強制リフロー
      void overlay.offsetWidth;

      // 3. 再度スライドイン
      overlay.style.transform = "";
      overlay.classList.add("slide-in");

      window.history.pushState({}, "", url);

      // 閉じるボタン
      overlay.querySelector(".close-btn").addEventListener("click", closeOverlay);

      // リンク無効化
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

  if (chatLink) chatLink.addEventListener("click", loadContent);
  if (notifyLink) notifyLink.addEventListener("click", loadContent);

  // Escapeキーで閉じる
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeOverlay();
  });
});