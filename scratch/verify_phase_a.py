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
PORT = 9447

def verify_phase_a():
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

        def take_screenshot(filename):
            res = send_cmd("Page.captureScreenshot", {"format": "png"})
            img_bytes = base64.b64decode(res["data"])
            path = os.path.join(OUTPUT_DIR, filename)
            with open(path, "wb") as f:
                f.write(img_bytes)
            print(f"Captured: {filename} ({len(img_bytes)} bytes)")

        # Verify Three.js Canvas existence and WebGL context
        status = eval_js("""
        (() => {
            const canvas = document.querySelector('.three-space-environment-container canvas');
            return {
                webglCanvasFound: !!canvas,
                canvasWidth: canvas ? canvas.width : 0,
                canvasHeight: canvas ? canvas.height : 0,
                homeSection: !!document.getElementById('home'),
                aboutSection: !!document.getElementById('about'),
                scrollTriggerCount: window.ScrollTrigger ? window.ScrollTrigger.getAll().length : -1,
            };
        })()
        """)
        print("PHASE_A_RUNTIME_STATUS:", json.dumps(status, indent=2))

        # 1. Capture Scene 01 initial state (Observatory Hero in Midnight Three.js space)
        take_screenshot("screenshot_phase_a_01_observatory_hero.png")

        # 2. Scroll into transition midpoint between Scene 01 and Scene 02 (Z-travel, spatial recede)
        eval_js("""
        (() => {
            window.scrollTo({ top: 550, behavior: 'instant' });
        })()
        """)
        time.sleep(1.2)
        take_screenshot("screenshot_phase_a_02_transition_midpoint.png")

        # 3. Scroll into Scene 02 (Beyond the Horizon / Orion in pure Midnight Sky)
        eval_js("""
        (() => {
            const el = document.getElementById('about');
            if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
        })()
        """)
        time.sleep(1.2)
        take_screenshot("screenshot_phase_a_03_horizon_orion.png")

        # 4. Simulate pointer movement to demonstrate spring-damper reactivity
        eval_js("""
        (() => {
            const evt = new MouseEvent('mousemove', {
                clientX: 720,
                clientY: 450,
                bubbles: true
            });
            window.dispatchEvent(evt);
        })()
        """)
        time.sleep(0.5)
        take_screenshot("screenshot_phase_a_04_pointer_interaction.png")

        ws.close()
        print("PHASE_A_VERIFICATION_COMPLETE")
    finally:
        proc.terminate()

if __name__ == "__main__":
    verify_phase_a()
