import subprocess
import time
import json
import base64
import urllib.request
import os
import tempfile
from websocket import create_connection

CHROME_EXE = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUTPUT_DIR = r"C:\Users\Aarush\.gemini\antigravity\brain\3b1753a2-37f2-4501-bde2-2da562b145c1"
PORT = 9449

def capture_redesigned():
    temp_dir = tempfile.mkdtemp()
    cmd = [
        CHROME_EXE,
        "--headless=new",
        f"--remote-debugging-port={PORT}",
        "--remote-allow-origins=*",
        f"--user-data-dir={temp_dir}",
        "--disable-gpu",
        "--window-size=1440,900",
        "http://localhost:5173/"
    ]
    proc = subprocess.Popen(cmd)
    time.sleep(3)

    try:
        tabs = json.loads(urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json").read())
        ws_url = tabs[0]["webSocketDebuggerUrl"]
        ws = create_connection(ws_url, timeout=15)

        msg_id = 0
        def send_cmd(method, params=None):
            nonlocal msg_id
            msg_id += 1
            ws.send(json.dumps({"id": msg_id, "method": method, "params": params or {}}))
            while True:
                msg = json.loads(ws.recv())
                if msg.get("id") == msg_id:
                    return msg.get("result", {})

        def eval_js(expr):
            res = send_cmd("Runtime.evaluate", {"expression": expr, "returnByValue": True})
            return res.get("result", {}).get("value")

        def set_viewport(w, h):
            send_cmd("Emulation.setDeviceMetricsOverride", {
                "width": w,
                "height": h,
                "deviceScaleFactor": 1,
                "mobile": (w < 768)
            })
            time.sleep(0.5)

        def scroll_to_scene(anchor):
            script = f"""
            (() => {{
                const el = document.getElementById('{anchor}');
                if (el) {{
                    el.scrollIntoView({{ behavior: 'instant', block: 'start' }});
                }}
            }})()
            """
            eval_js(script)
            time.sleep(1.2)

        def take_screenshot(filename):
            res = send_cmd("Page.captureScreenshot", {"format": "png"})
            img_bytes = base64.b64decode(res["data"])
            path = os.path.join(OUTPUT_DIR, filename)
            with open(path, "wb") as f:
                f.write(img_bytes)
            print(f"Captured: {filename} ({len(img_bytes)} bytes)")

        # 1. Desktop 1440x900
        set_viewport(1440, 900)
        scroll_to_scene("home")
        take_screenshot("screenshot_redesigned_01_home_1440.png")

        scroll_to_scene("about")
        take_screenshot("screenshot_redesigned_02_about_1440.png")

        # 2. Tablet 768x1024
        set_viewport(768, 1024)
        scroll_to_scene("home")
        take_screenshot("screenshot_redesigned_01_home_768.png")

        scroll_to_scene("about")
        take_screenshot("screenshot_redesigned_02_about_768.png")

        # 3. Mobile 390x844
        set_viewport(390, 844)
        scroll_to_scene("home")
        take_screenshot("screenshot_redesigned_01_home_390.png")

        scroll_to_scene("about")
        take_screenshot("screenshot_redesigned_02_about_390.png")

        ws.close()
        print("REDESIGNED_CAPTURES_COMPLETE")
    finally:
        proc.terminate()

if __name__ == "__main__":
    capture_redesigned()
