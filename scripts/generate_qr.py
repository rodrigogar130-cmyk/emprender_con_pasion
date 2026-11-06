"""Genera el QR del portafolio sin depender de servicios externos."""
from pathlib import Path
import qrcode
from qrcode.image.svg import SvgPathImage
ROOT = Path(__file__).resolve().parents[1]
url = 'https://rodrigogar130-cmyk.github.io/PORTAFOLIO/'
qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H,box_size=10,border=4)
qr.add_data(url)
qr.make(fit=True)
img = qr.make_image(image_factory=SvgPathImage)
img.save(ROOT / 'assets/img/qr-portafolio.svg')
print('Código QR generado')
