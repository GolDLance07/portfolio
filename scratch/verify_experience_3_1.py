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
PORT = 9456

def verify_3_1():
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
    time.sleep(3.5)

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
            time.sleep(0.6)

        def take_screenshot(filename):
            res = send_cmd("Page.captureScreenshot", {"format": "png"})
            img_bytes = base64.b64decode(res["data"])
            path = os.path.join(OUTPUT_DIR, filename)
            with open(path, "wb") as f:
                f.write(img_bytes)
            print(f"Captured: {filename} ({len(img_bytes)} bytes)")

        # 1. Desktop 1440x900
        set_viewport(1440, 900)

        # Transition midpoint: Home to About
        eval_js("window.scrollTo(0, 420)")
        time.sleep(1.0)
        take_screenshot("screenshot_exp3_1_home_to_about_transition.png")

        # Scroll to About scene
        eval_js("""
        (() => {
            const el = document.getElementById('about');
            if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
        })()
        """)
        time.sleep(1.5)
        take_screenshot("screenshot_exp3_1_about_restored_1440.png")

        # Focused close-up of Living Orion Constellation
        take_screenshot("screenshot_exp3_1_orion_reveal_1440.png")

        # Pointer interaction test: simulate pointer hovering at (600, 450)
        send_cmd("Input.dispatchMouseEvent", {"type": "mouseMoved", "x": 600, "y": 450})
        time.sleep(0.3)
        send_cmd("Input.dispatchMouseEvent", {"type": "mouseMoved", "x": 620, "y": 460})
        time.sleep(0.4)
        take_screenshot("screenshot_exp3_1_particle_interaction.png")

        # 2. Tablet 768x1024
        set_viewport(768, 1024)
        eval_js("""
        (() => {
            const el = document.getElementById('about');
            if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
        })()
        """)
        time.sleep(1.2)
        take_screenshot("screenshot_exp3_1_about_tablet_768.png")

        # 3. Mobile 390x844
        set_viewport(390, 844)
        eval_js("""
        (() => {
            const el = document.getElementById('about');
            if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
        })()
        """)
        time.sleep(1.2)
        take_screenshot("screenshot_exp3_1_about_mobile_390.png")

        # Validation assertions
        about_data = eval_js("""
        (() => {
            const heading = document.querySelector('.horizon-title');
            const name = document.querySelector('.about-name-text');
            const paragraphs = Array.from(document.querySelectorAll('.about-narrative-p')).map(p => p.innerText);
            const quote = document.querySelector('.quote-text')?.innerText;
            const orion = document.querySelector('.orion-svg');
            const lines = document.querySelectorAll('.orion-constellation-lines line');

            return {
                headingText: heading?.innerText,
                headingVisible: heading ? (heading.getBoundingClientRect().height > 0 && window.getComputedStyle(heading).opacity !== '0') : false,
                nameText: name?.innerText,
                paragraphCount: paragraphs.length,
                quoteText: quote,
                orionSvgExists: !!orion,
                orionLinesCount: lines.length
            };
        })()
        """)
        print("Validation Results:")
        print(json.dumps(about_data, indent=2))

        ws.close()
    finally:
        proc.terminate()

if __name__ == "__main__":
    verify_3_1()
