let lastAudioUrl = "";
let lastFileName = "";
let currentIsland = "forest";

function toggleMenu() {
    const menu = document.getElementById("dropdown");
    menu.classList.toggle("hidden");
}

async function speak() {
    const text = document.getElementById("text").value;
    const btn = document.getElementById("playBtn");

    if (!text) return;

    btn.innerText = "播放中…";
    btn.disabled = true;

    const res = await fetch("/speak", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ text, island: currentIsland })
    });

    const data = await res.json();

    lastAudioUrl = data.audio_url;
    lastFileName = data.filename;

    const player = document.getElementById("player");
    player.src = lastAudioUrl;

    await player.play();

    player.onended = () => {
        btn.innerText = "播放";
        btn.disabled = false;
    };
}

function downloadAudio() {
    if (!lastAudioUrl) return;

    const a = document.createElement("a");
    a.href = lastAudioUrl;
    a.download = lastFileName;
    a.click();
}

function setIsland(i) {
    currentIsland = i;
}

function openFavorites() {
    alert("收藏詞彙（v35 placeholder）");
}

function openRecent() {
    alert("最近使用（v35 placeholder）");
}