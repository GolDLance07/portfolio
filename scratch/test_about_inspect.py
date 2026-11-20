import subprocess, time, json, urllib.request, tempfile
from websocket import create_connection

temp_dir = tempfile.mkdtemp()
proc = subprocess.Popen([
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    '--headless=new',
    '--remote-debugging-port=9455',
    '--remote-allow-origins=*',
    f'--user-data-dir={temp_dir}',
    '--window-size=1440,900',
    'http://localhost:5173/'
])
time.sleep(3.5)
tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9455/json').read())
ws = create_connection(tabs[0]['webSocketDebuggerUrl'])

msg_id = 0
def send_cmd(method, params=None):
    global msg_id
    msg_id += 1
    ws.send(json.dumps({'id': msg_id, 'method': method, 'params': params or {}}))
    while True:
        msg = json.loads(ws.recv())
        if msg.get('id') == msg_id:
            return msg.get('result', {})

def eval_js(js):
    res = send_cmd('Runtime.evaluate', {'expression': js, 'returnByValue': True})
    return res.get('result', {}).get('value')

eval_js('document.getElementById("about").scrollIntoView({ behavior: "instant", block: "start" })')
time.sleep(1.5)

print('--- DEEP INSPECTION OF ABOUT TITLE ---')
info = eval_js('''(() => {
    const el = document.querySelector(".horizon-title");
    const parent = el.parentElement;
    const grandParent = parent.parentElement;
    const pt = document.elementFromPoint(100, 370);
    return {
        el_tag: el.tagName,
        el_class: el.className,
        el_inlineStyle: el.getAttribute('style'),
        el_computedColor: window.getComputedStyle(el).color,
        el_computedOpacity: window.getComputedStyle(el).opacity,
        el_computedClip: window.getComputedStyle(el).clipPath,
        el_computedDisplay: window.getComputedStyle(el).display,
        parent_class: parent.className,
        parent_inlineStyle: parent.getAttribute('style'),
        parent_computedOpacity: window.getComputedStyle(parent).opacity,
        parent_rect: parent.getBoundingClientRect(),
        grandParent_class: grandParent.className,
        grandParent_computedOpacity: window.getComputedStyle(grandParent).opacity,
        element_at_point: pt ? (pt.tagName + '.' + pt.className) : null,
        eyebrow_text: document.querySelector('.horizon-eyebrow-row')?.innerText,
        eyebrow_rect: document.querySelector('.horizon-eyebrow-row')?.getBoundingClientRect(),
        eyebrow_opacity: window.getComputedStyle(document.querySelector('.horizon-eyebrow-row')).opacity
    };
})()''')

print(json.dumps(info, indent=2))

ws.close()
proc.terminate()
