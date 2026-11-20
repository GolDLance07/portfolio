import subprocess, time, json, urllib.request, tempfile
from websocket import create_connection

temp_dir = tempfile.mkdtemp()
proc = subprocess.Popen([
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    '--headless=new',
    '--remote-debugging-port=9453',
    '--remote-allow-origins=*',
    f'--user-data-dir={temp_dir}',
    '--window-size=1440,900',
    'http://localhost:5173/'
])
time.sleep(3.5)
tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9453/json').read())
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

print('Clicking Nav 02 About:')
eval_js('''(() => {
    const navLinks = Array.from(document.querySelectorAll('.nav-item'));
    const aboutNav = navLinks.find(l => l.innerText.includes('About'));
    if (aboutNav) aboutNav.click();
})()''')
time.sleep(2)
print('scrollY after nav click:', eval_js('window.scrollY'))
print('title rect:', eval_js('JSON.stringify(document.querySelector(".horizon-title").getBoundingClientRect())'))
print('about rect:', eval_js('JSON.stringify(document.getElementById("about").getBoundingClientRect())'))

ws.close()
proc.terminate()
