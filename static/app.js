const input = document.getElementById("textInput");
const btn = document.getElementById("speakBtn");
const audio = document.getElementById("audioPlayer");

btn.addEventListener("click", async () => {
    const text = input.value.trim();

    if (!text) {
        alert("請輸入文字");
        return;
    }

    try {
        // 1️⃣ 呼叫 Flask /speak
        const res = await fetch("/speak", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text })
        });

        if (!res.ok) {
            throw new Error("API error");
        }

        const data = await res.json();

        if (!data.audio_url) {
            throw new Error("No audio url returned");
        }

        // 2️⃣ 設定音檔並播放
        audio.src = data.audio_url;
        audio.play();

    } catch (err) {
        console.error("Error:", err);
        alert("發音失敗，請看 console");
    }
});