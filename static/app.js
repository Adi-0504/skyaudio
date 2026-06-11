let lastAudioUrl = "";
let lastFileName = "";
let currentIsland = "forest";

async function speak() {
    const text = document.getElementById("text").value;
    const btn = document.getElementById("playBtn");

    if (!text) return;

    // 🎧 播放中狀態
    btn.innerText = "播放中…";
    btn.disabled = true;

    const res = await fetch("/speak", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
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

    await player.play();

    addRecent(text);

    // 🔥 播完恢復
    player.onended = () => {
        btn.innerText = "播放";
        btn.disabled = false;
    };
}

// 🌍 切島
function setIsland(island) {
    currentIsland = island;
}

// 📜 最近使用
function addRecent(text) {
    let recent = JSON.parse(localStorage.getItem("recent")) || [];
    recent.unshift(text);
    recent = [...new Set(recent)].slice(0, 10);
    localStorage.setItem("recent", JSON.stringify(recent));
}