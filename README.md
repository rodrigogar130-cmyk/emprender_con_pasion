# EMPRENDER CON PASIÓN

Experiencia web narrativa para una ponencia presencial de Carlos Rodrigo García Álvarez.

## Qué incluye

- Portada fotográfica con imagen original, sin regeneración facial.
- Seis módulos, cada uno con tres escenas navegables, frases y gráficos SVG originales.
- Historia visual sincronizada con el desplazamiento y navegación por teclado.
- Pregunta interactiva de validación en el módulo 4 (las respuestas no se guardan).
- Cierre, semblanza resumida, enlaces reales a WhatsApp, Instagram y portafolio.
- QR local generado con Python (sin servicio externo de seguimiento).
- Modo ponente en **ventana independiente** con notas por escena, sincronización mediante `BroadcastChannel` y control de diapositivas.
- Maquetación responsiva, soporte de movimiento reducido y funcionamiento básico sin animación externa.

## Modo offline para la conferencia (sin servidor)

Abre `EMPRENDER-CON-PASION-OFFLINE.html` **haciendo doble clic**. El HTML incluye los estilos, el guion y la fotografía original, por lo que las escenas funcionan sin Internet ni configuración. Puedes mover **ese archivo** a una memoria USB.

Si también vas a utilizar las notas del ponente, conserva `presenter-offline.html` en **la misma carpeta**. La comunicación offline usa la relación entre ambas ventanas; abre las notas desde el botón **NOTAS** de la presentación.

El archivo independiente incorpora el motor nativo de animación. GSAP se activa únicamente si hay acceso a su CDN.

## Uso rápido

1. Descomprime la carpeta completa.
2. Desde la carpeta del proyecto, inicia un servidor local:
   ```sh
   python -m http.server 8000
   ```
3. Abre `http://localhost:8000` en Chrome, Edge o Firefox.
4. Usa **Presentar** o la tecla `F` para pantalla completa.
5. Usa las **flechas ← →**, **espacio**, **Re Pág / Av Pág** o el **scroll** para recorrer las escenas.
6. El botón **Notas** (`N`) abre `presenter.html` en otra ventana. Si utilizas monitor externo: mueve la ventana de notas a tu laptop, deja la página principal en la pantalla que vas a proyectar y entonces entra a pantalla completa.

> Importante: en un único monitor, las notas no son privadas. El navegador tampoco puede garantizar por sí solo qué ventana se proyecta. Usa pantalla extendida y verifica la salida antes de empezar.

## Publicar gratis con GitHub Pages

- Crea un repositorio nuevo, por ejemplo `EMPRENDER-CON-PASION`.
- Sube el **contenido** de esta carpeta a la raíz del repositorio (`index.html`, `presenter.html`, `assets/`, `scripts/`).
- En **Settings → Pages**, selecciona **Deploy from a branch**, rama `main`, carpeta `/ (root)` y guarda.
- La URL quedará con la forma `https://TU_USUARIO.github.io/EMPRENDER-CON-PASION/`.
- Se utilizan rutas relativas, por lo que funciona en subdirectorios de GitHub Pages.

## Dependencias

- **GSAP 3.12.5 y ScrollTrigger** se cargan desde Cloudflare CDN para animaciones de entrada. Si no hay conexión, el contenido y la navegación **siguen funcionando** mediante el motor nativo de scroll (CSS + JavaScript).
- No se necesita Node.js, React, base de datos, cuenta de terceros ni proceso de compilación.
- No utilizamos Lenis para evitar conflictos de rueda/teclado durante una presentación.
- Se recomienda tener Internet para la mejora visual de GSAP, pero no es indispensable.

## Editar el contenido

Todas las frases, palabras clave, notas, semblanza y enlaces están centralizados en:

`assets/js/content.js`

Reemplaza `assets/img/carlos-rodrigo-original.jpeg` por una fotografía distinta **solo si así lo decides**. La original se incluyó sin cambios de píxeles.

Para regenerar el QR después de cambiar el portafolio (si tienes Python y `qrcode`):

```sh
python scripts/generate_qr.py
```

Para regenerar las versiones offline después de editar la web:

```sh
python scripts/build_offline.py
# o, sin Python:
node scripts/build_offline.mjs
```

Para modificar la composición, colores o escala, utiliza `assets/css/styles.css`. Los SVG animados de los módulos se generan en `assets/js/main.js`.

## Consideraciones técnicas

- Las tres escenas de cada capítulo se interpolan según el progreso del scroll, con estados reversibles.
- El modo ponente usa el mismo origen HTTPS; no envía las notas a servicios externos.
- En algunos navegadores el cambio de pestaña puede interrumpir pantalla completa. Prueba el flujo con el equipo y proyector reales.
- El botón de pausa detiene movimientos ambientales y animaciones GSAP, pero no bloquea el avance por escenas.
- Si la navegación por teclas compite con controles del sistema, usa los botones de pantalla.

## Estructura

```text
emprender-con-pasion/
├── index.html
├── EMPRENDER-CON-PASION-OFFLINE.html
├── presenter-offline.html
├── presenter.html
├── README.md
├── assets/
│   ├── css/styles.css
│   ├── js/content.js
│   ├── js/main.js
│   ├── js/presenter.js
│   ├── img/carlos-rodrigo-original.jpeg
│   ├── img/icono.svg
│   └── img/qr-portafolio.svg
└── scripts/
    ├── generate_qr.py
    ├── build_offline.py
    └── build_offline.mjs
```

**© 2026 Carlos Rodrigo García Álvarez.**
