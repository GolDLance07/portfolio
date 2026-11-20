import subprocess, time, json, urllib.request, tempfile
from websocket import create_connection

temp_dir = tempfile.mkdtemp()
proc = subprocess.Popen([
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    '--headless=new',
    '--remote-debugging-port=9452',
    '--remote-allow-origins=*',
    f'--user-data-dir={temp_dir}',
    '--window-size=1440,900',
    'http://localhost:5173/'
])
time.sleep(3.5)

tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9452/json').read())
ws = create_connection(tabs[0]['webSocketDebuggerUrl'])

msg_id = 0
def eval_js(js):
    global msg_id
    msg_id += 1
    ws.send(json.dumps({'id': msg_id, 'method': 'Runtime.evaluate', 'params': {'expression': js, 'returnByValue': True}}))
    while True:
        msg = json.loads(ws.recv())
        if msg.get('id') == msg_id:
            return msg.get('result', {}).get('result', {}).get('value')

print('--- Initial Page Load ---')
print('Window scrollY:', eval_js('window.scrollY'))
print('#about rect:', eval_js('JSON.stringify(document.getElementById("about").getBoundingClientRect())'))
print('.horizon-title rect:', eval_js('JSON.stringify(document.querySelector(".horizon-title").getBoundingClientRect())'))

eval_js('document.getElementById("about").scrollIntoView({ block: "start" })')
time.sleep(1.2)

print('--- After scrollIntoView(#about) ---')
print('Window scrollY:', eval_js('window.scrollY'))
print('#about rect:', eval_js('JSON.stringify(document.getElementById("about").getBoundingClientRect())'))
print('.horizon-title rect:', eval_js('JSON.stringify(document.querySelector(".horizon-title").getBoundingClientRect())'))
print('.horizon-title computed:', eval_js('''JSON.stringify((() => {
    const s = window.getComputedStyle(document.querySelector(".horizon-title"));
    return {
        opacity: s.opacity,
        clipPath: s.clipPath,
        transform: s.transform,
        display: s.display,
        visibility: s.visibility,
        offsetHeight: document.querySelector(".horizon-title").offsetHeight,
        innerText: document.querySelector(".horizon-title").innerText
    };
})())'''))

ws.close()
proc.terminate()
