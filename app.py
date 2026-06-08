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

    print("VOICE =", voice)

    if not text:
        return jsonify({"error": "no text"}), 400

    # 安全檔名
    safe_text = re.sub(r"[^\w\u4e00-\u9fff]+", "_", text)[:20]

    # 每次都產生不同檔名（避免快取）
    filename = f"{safe_text}_{uuid.uuid4().hex[:8]}.mp3"

    path = os.path.join(OUTPUT_DIR, filename)

    asyncio.run(generate_audio(text, path, voice))

    return jsonify({
        "ok": True,
        "audio_url": f"/audio/{filename}",
        "filename": filename
    })


@app.route("/audio/<filename>")
def audio(filename):
    path = os.path.join(OUTPUT_DIR, filename)

    if not os.path.exists(path):
        return jsonify({"error": "file not found"}), 404

    return send_file(
        path,
        mimetype="audio/mpeg",
        as_attachment=False
    )


async def generate_audio(text, path, voice):
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(path)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
