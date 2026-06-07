from flask import Flask, request, jsonify, send_file
import asyncio
import edge_tts
import os
import re
import uuid

app = Flask(__name__, static_folder="static")

OUTPUT_DIR = "output"
os.makedirs(OUTPUT_DIR, exist_ok=True)


@app.route("/")
def home():
    return app.send_static_file("index.html")


@app.route("/speak", methods=["POST"])
def speak():
    data = request.get_json()
    text = data.get("text", "")
    voice = data.get("voice", "zh-TW-HsiaoChenNeural")

    if not text:
        return jsonify({"error": "no text"}), 400

    # 🔥 檔名用輸入文字（安全化）
    safe_text = re.sub(r'[^\w\u4e00-\u9fff]+', '_', text)[:20]
    filename = f"{safe_text or uuid.uuid4()}.mp3"
    path = os.path.join(OUTPUT_DIR, filename)

    asyncio.run(generate_audio(text, path, voice))

    return jsonify({
        "ok": True,
        "audio_url": f"/audio/{filename}",
        "filename": filename
    })


@app.route("/audio/<filename>")
def audio(filename):
    return send_file(os.path.join(OUTPUT_DIR, filename))


async def generate_audio(text, path, voice):
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(path)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
