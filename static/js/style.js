document.addEventListener("DOMContentLoaded", () => {
  const rightMenu = document.getElementById("right-menu");
  const leftMenu = document.getElementById("left-menu");

  const chatLink = document.querySelector(".chat-link");
  const notifyLink = document.querySelector(".notify-link");
  const hamburgerLink = document.querySelector(".hamburger-link");

  // ===== リンク無効化/有効化 =====
  function disableLinks(exceptLink) {
    [chatLink, notifyLink, hamburgerLink].forEach(link => {
      if (link !== exceptLink) {
        link.style.pointerEvents = "none";
        link.classList.add("disabled");
      } else {
        link.style.pointerEvents = "auto";
        link.classList.remove("disabled");
      }
    });
  }

  function enableAllLinks() {
    [chatLink, notifyLink, hamburgerLink].forEach(link => {
      link.style.pointerEvents = "auto";
      link.classList.remove("disabled");
    });
  }

  // ===== 右側（チャット・通知） =====
  async function loadRightMenu(e) {
    e.preventDefault();
    disableLinks(e.currentTarget);

    const url = e.currentTarget.getAttribute("href");
    try {
      const response = await fetch(url);
      const text = await response.text();
      const parser = new DOMParser();
      const newDoc = parser.parseFromString(text, "text/html");
      const newContent = newDoc.querySelector("#content");

      rightMenu.innerHTML = `
        <span class="close-btn">&times;</span>
        ${newContent ? newContent.innerHTML : "<p>読み込みエラー</p>"}
      `;

      rightMenu.className = "from-right";
      void rightMenu.offsetWidth;
      rightMenu.classList.add("slide-in");

      rightMenu.querySelector(".close-btn")
        .addEventListener("click", closeRightMenu);

    } catch {
      rightMenu.innerHTML = "<p>読み込み失敗しました</p>";
    }
  }

  function closeRightMenu() {
    rightMenu.classList.remove("slide-in");
    setTimeout(() => {
      rightMenu.innerHTML = "";
      rightMenu.className = "";
      enableAllLinks();
    }, 300);
  }

  // ===== 左側（ハンバーガー） =====
  async function loadLeftMenu(e) {
    e.preventDefault();
    disableLinks(e.currentTarget);

    const url = e.currentTarget.getAttribute("href");
    try {
      const response = await fetch(url);
      const text = await response.text();
      const parser = new DOMParser();
      const newDoc = parser.parseFromString(text, "text/html");
      const newContent = newDoc.querySelector("#content");

      leftMenu.innerHTML = `
        <span class="close-btn">&times;</span>
        ${newContent ? newContent.innerHTML : "<p>読み込みエラー</p>"}
      `;

      leftMenu.className = "from-left";
      void leftMenu.offsetWidth;
      leftMenu.classList.add("slide-in");

      leftMenu.querySelector(".close-btn")
        .addEventListener("click", closeLeftMenu);

    } catch {
      leftMenu.innerHTML = "<p>読み込み失敗しました</p>";
    }
  }

  function closeLeftMenu() {
    leftMenu.classList.remove("slide-in");
    setTimeout(() => {
      leftMenu.innerHTML = "";
      leftMenu.className = "";
      enableAllLinks();
    }, 300);
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
