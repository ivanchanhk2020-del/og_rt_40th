import re, urllib.request
base = 'https://obsgyn.med.hku.hk'
html = urllib.request.urlopen(base + '/en/Our-Team/University-Staff').read().decode('utf-8', 'ignore')
links = re.findall(r'href="(/en/Staff/[^"]+)"[^>]*>([^<]+)</a>', html)
print('links', len(links))
target = ['Raymond','Ernest','Jennifer','Paul','WANG','William','LIU','Philip','Calvin','Cherie','Rachel','Andy','Erica']
for href, name in links:
    if not any(t.lower() in name.lower() for t in target):
        continue
    phtml = urllib.request.urlopen(base + href).read().decode('utf-8', 'ignore')
    m = re.search(r'<img src="([^"]*Our-Team/University-Staff/[^"]+\.jpg[^"]*)"', phtml, re.I)
    img = m.group(1) if m else ''
    if img.startswith('/'):
        img = base + img
    print(f'{name} | {href} | {img if img else "NO_IMAGE"}')
