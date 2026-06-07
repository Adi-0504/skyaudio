from flask import Flask, request, send_file, jsonify
import asyncio
import edge_tts
import os

from g2p import g2p

app = Flask(__name__, static_folder="static")


@app.route("/")
def home():
    return send_file("static/index.html")


async def generate_audio(text):
    voice = "es-ES-AlvaroNeural"

    communicate = edge_tts.Communicate(text, voice)
    await communicate.save("output/out.mp3")


@app.route("/speak", methods=["POST"])
def speak():
    text = request.json.get("text", "")

    phonemes = g2p(text)

    # 👉 Edge TTS 不吃 IPA，所以轉回可讀字串
    final_text = "".join(phonemes)

    if not final_text.strip():
        return jsonify({"error": "empty input"}), 400

    asyncio.run(generate_audio(final_text))

    return send_file("output/out.mp3", mimetype="audio/mp3")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)

