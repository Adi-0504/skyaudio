let lastAudioUrl = "";
let lastFileName = "";

async function speak() {
    const text = document.getElementById("text").value;
    const voice = document.getElementById("voice").value;

    if (!text) {
        alert("請輸入文字");
        return;
    }

    const res = await fetch("/speak", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ text, voice })
    });

    const data = await res.json();

    if (!data.audio_url) {
        alert("生成失敗");
        return;
    }

    lastAudioUrl = data.audio_url;
    lastFileName = data.filename;

    const player = document.getElementById("player");
    player.src = lastAudioUrl;
    player.play();
}

function downloadAudio() {
    if (!lastAudioUrl) {
        alert("還沒有音檔");
        return;
    }

    const a = document.createElement("a");
    a.href = lastAudioUrl;
    a.download = lastFileName;
    a.click();
}