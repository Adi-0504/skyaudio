from flask import Flask, request, jsonify, send_file
import asyncio
import edge_tts
import uuid
import os

app = Flask(__name__)

OUTPUT_DIR = "output"
os.makedirs(OUTPUT_DIR, exist_ok=True)


@app.route("/")
def home():
    return app.send_static_file("index.html")


@app.route("/speak", methods=["POST"])
def speak():
    data = request.get_json()
    text = data.get("text", "")

    if not text:
        return jsonify({"error": "no text"}), 400

    filename = f"{uuid.uuid4()}.mp3"
    path = os.path.join(OUTPUT_DIR, filename)

    asyncio.run(generate_audio(text, path))

    return jsonify({
        "ok": True,
        "audio_url": f"/audio/{filename}"
    })


@app.route("/audio/<filename>")
def audio(filename):
    return send_file(os.path.join(OUTPUT_DIR, filename))


async def generate_audio(text, path):
    communicate = edge_tts.Communicate(text, "zh-TW-HsiaoChenNeural")
    await communicate.save(path)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
