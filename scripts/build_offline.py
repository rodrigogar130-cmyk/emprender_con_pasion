"""Empaqueta el modo offline en dos HTML autocontenidos y sin importaciones de módulos."""
from pathlib import Path
from base64 import b64encode
import re
ROOT=Path(__file__).resolve().parents[1]

def as_data(path,mime):
    return 'data:'+mime+';base64,'+b64encode((ROOT/path).read_bytes()).decode('ascii')

def source(rel):
    return (ROOT/rel).read_text(encoding='utf-8')

html=source('index.html')
html=html.replace('<link rel="stylesheet" href="assets/css/styles.css" />','<style>\n'+source('assets/css/styles.css')+'\n</style>')
html=html.replace('<script type="module" src="assets/js/main.js"></script>','')
html=html.replace('assets/img/carlos-rodrigo-original.jpeg',as_data('assets/img/carlos-rodrigo-original.jpeg','image/jpeg'))
html=html.replace('assets/img/carlos-rodrigo-sin-fondo.png',as_data('assets/img/carlos-rodrigo-sin-fondo.png','image/png'))
html=html.replace('assets/img/qr-portafolio.svg',as_data('assets/img/qr-portafolio.svg','image/svg+xml'))
html=html.replace('assets/img/icono.svg',as_data('assets/img/icono.svg','image/svg+xml'))
content=source('assets/js/content.js').replace('export const ','const ')
main=source('assets/js/main.js').replace("import {MODULES, BIO, CLOSING_NOTES} from './content.js';",'')
html=html.replace('</body>','<script>\n'+content+'\n'+main+'\n</script>\n</body>')
(ROOT/'EMPRENDER-CON-PASION-OFFLINE.html').write_text(html,encoding='utf-8')

presenter=source('presenter.html').replace('<script type="module" src="assets/js/presenter.js"></script>','')
presenter=presenter.replace('assets/img/icono.svg',as_data('assets/img/icono.svg','image/svg+xml'))
pjs=source('assets/js/presenter.js').replace("import {MODULES,CLOSING_NOTES} from './content.js';",'')
presenter=presenter.replace('</body>','<script>\n'+content+'\n'+pjs+'\n</script>\n</body>')
(ROOT/'presenter-offline.html').write_text(presenter,encoding='utf-8')
print('Offline: ',(ROOT/'EMPRENDER-CON-PASION-OFFLINE.html').stat().st_size,'bytes')
