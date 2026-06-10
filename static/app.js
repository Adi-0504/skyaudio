let lastAudioUrl = "";
let lastFileName = "";
let currentIsland = "forest";

let recentWords = JSON.parse(localStorage.getItem("recent")) || [];
let favoriteWords = JSON.parse(localStorage.getItem("favorites")) || [];

// 🌍 切島
function setIsland(island) {
    currentIsland = island;
}

// 🎧 播放
async function speak() {
    const text = document.getElementById("text").value;

    if (!text) return;

    const res = await fetch("/speak", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            text,
            island: currentIsland
        })
    });

    const data = await res.json();

    lastAudioUrl = data.audio_url;
    lastFileName = data.filename;

    const player = document.getElementById("player");
    player.src = lastAudioUrl;
    player.play();

    addRecent(text);
}

// ⬇️ 下載
function downloadAudio() {
    if (!lastAudioUrl) return;

    const a = document.createElement("a");
    a.href = lastAudioUrl;
    a.download = lastFileName;
    a.click();
}

// ⭐ 收藏
function toggleFavorite() {
    const text = document.getElementById("text").value;
    if (!text) return;

    if (favoriteWords.includes(text)) {
        favoriteWords = favoriteWords.filter(t => t !== text);
    } else {
        favoriteWords.push(text);
    }

    localStorage.setItem("favorites", JSON.stringify(favoriteWords));
}

// 📜 最近使用
function addRecent(text) {
    recentWords.unshift(text);
    recentWords = [...new Set(recentWords)].slice(0, 10);
    localStorage.setItem("recent", JSON.stringify(recentWords));
}

// ⋯ menu
function toggleMenu() {
    document.getElementById("menu").classList.toggle("hidden");
}

document.addEventListener("click", (e) => {
    const menu = document.getElementById("menu");
    const btn = document.querySelector(".menu-btn");

    if (!menu.contains(e.target) && !btn.contains(e.target)) {
        menu.classList.add("hidden");
    }
});

// 📜 show recent
function showRecent() {
    alert(recentWords.join("\n") || "沒有紀錄");
}

// ⭐ show favorites
function showFavorites() {
    alert(favoriteWords.join("\n") || "沒有收藏");
}

// 🧹 clear
function clearAll() {
    localStorage.clear();
    recentWords = [];
    favoriteWords = [];
    alert("已清除");
}