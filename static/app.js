async function speak() {
    const text = document.getElementById("text").value;

    const res = await fetch("/speak", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
    });

    const data = await res.json();

    const audio = document.getElementById("player");
    audio.src = data.audio_url;
    audio.play();
}