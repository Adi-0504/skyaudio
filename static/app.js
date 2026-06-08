let lastUrl = "";
let lastFile = "";

async function speak() {
    const text = document.getElementById("text").value;
    const island = document.getElementById("island").value;

    if (!text) return;

    const res = await fetch("/speak", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ text, island })
    });

    const data = await res.json();

    lastUrl = data.audio_url;
    lastFile = data.filename;

    const player = document.getElementById("player");
    player.src = lastUrl;
    player.play();
}