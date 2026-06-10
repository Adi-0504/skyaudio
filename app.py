from flask import Flask, request, jsonify, send_file
import asyncio
import edge_tts
import os
import re
import uuid

app = Flask(__name__, static_folder="static")

OUTPUT_DIR = "output"
os.makedirs(OUTPUT_DIR, exist_ok=True)

ISLAND_VOICES = {
    "forest": "id-ID-ArdiNeural",
    "plain": "es-ES-AlvaroNeural",
    "mine": "hi-IN-MadhurNeural",
    "beach": "fil-PH-AngeloNeural"
}

@app.route("/")
def home():
    return app.send_static_file("index.html")

@app.route("/speak", methods=["POST"])
def speak():
    data = request.get_json()

    text = data.get("text", "")
    island = data.get("island", "forest")

    voice = ISLAND_VOICES.get(island, ISLAND_VOICES["forest"])

    if not text:
        return jsonify({"error": "no text"}), 400

    safe_text = re.sub(r"[^\w\u4e00-\u9fff]+", "_", text)[:20]
    filename = f"{safe_text}_{uuid.uuid4().hex[:8]}.mp3"
    path = os.path.join(OUTPUT_DIR, filename)

    asyncio.run(generate_audio(text, path, voice))

    return jsonify({
        "audio_url": f"/audio/{filename}",
        "filename": filename
    })

@app.route("/audio/<filename>")
def audio(filename):
    return send_file(os.path.join(OUTPUT_DIR, filename), mimetype="audio/mpeg")

# favicon 防 404
@app.route('/favicon.ico')
def favicon():
    return send_file('static/icon.png')

async def generate_audio(text, path, voice):
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(path)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
