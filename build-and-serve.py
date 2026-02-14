#!/usr/bin/env python3
"""Build images-list.json from Images/ and serve the site so you can open it in a browser."""
import json
import os
import sys

IMAGES_DIR = "Images"
OUTPUT_FILE = "images-list.json"
IMAGE_EXT = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
VIDEO_EXT = {".mov", ".mp4", ".webm"}
VALID_EXT = IMAGE_EXT | VIDEO_EXT

def main():
    base = os.path.dirname(os.path.abspath(__file__))
    images_path = os.path.join(base, IMAGES_DIR)
    output_path = os.path.join(base, OUTPUT_FILE)

    if not os.path.isdir(images_path):
        os.makedirs(images_path, exist_ok=True)
        with open(output_path, "w") as f:
            json.dump([], f, indent=2)
        print("Created Images/ folder. Add photos/videos and run again.")
    else:
        files = [
            f for f in os.listdir(images_path)
            if os.path.splitext(f)[1].lower() in VALID_EXT
        ]
        files.sort(key=lambda x: (x.lower(), x))
        with open(output_path, "w") as f:
            json.dump(files, f, indent=2)
        print(f"Wrote {len(files)} file(s) to {OUTPUT_FILE}")

    # Serve with built-in HTTP server
    try:
        import http.server
        import webbrowser
        from threading import Timer

        os.chdir(base)
        port = 8080
        handler = http.server.SimpleHTTPRequestHandler
        server = http.server.HTTPServer(("", port), handler)
        url = f"http://localhost:{port}"
        print(f"\nServing at {url}")
        print("Open that URL in your browser. Press Ctrl+C to stop.\n")
        Timer(1.5, lambda: webbrowser.open(url)).start()
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nBye!")
        sys.exit(0)

if __name__ == "__main__":
    main()
