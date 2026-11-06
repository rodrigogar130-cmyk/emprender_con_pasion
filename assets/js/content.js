/**
 * Edición rápida del contenido para la ponencia.
 * Cada módulo tiene tres escenas: apertura, conceptos, reflexión.
 */
export const CONFIG = {
  title: 'EMPRENDER CON PASIÓN',
  subtitle: 'De una idea a una realidad.',
  portfolio: 'https://rodrigogar130-cmyk.github.io/PORTAFOLIO/',
  whatsapp: 'https://wa.me/527225123478',
  whatsappDisplay: '722 512 3478',
  instagram: 'https://www.instagram.com/rod_capital_solution/',
  instagramDisplay: '@rod_capital_solution',
  author: 'Carlos Rodrigo García Álvarez',
};

export const BIO = [
  'Licenciado en Administración por la Universidad Autónoma del Estado de México, con formación en contribuciones fiscales y experiencia en consultoría empresarial, asesoría financiera, capacitación y desarrollo de negocios.',
  'Ha colaborado con emprendedores, empresas e instituciones como ICATI Edoméx y la UAEMéx, impulsando estrategias de crecimiento, formación empresarial y desarrollo de proyectos.',
  'Actualmente participa en el programa Emprende UAEMéx 365 desde la Dirección de Desarrollo Empresarial. Su trayectoria integra iniciativas como Hackathon, Bootcamp e Impulso Tuaeméx 2026 con el desarrollo de plataformas digitales, automatización e inteligencia artificial.',
  'Su enfoque combina estrategia empresarial, formación emprendedora y tecnología para transformar ideas en soluciones de valor.',
];

export const MODULES = [
  {
    id: 'modulo-1', n:'01', eyebrow:'EL PUNTO DE PARTIDA', title:'¿TU CORAZÓN LATE PARA EMPRENDER?',
    titleLines:['¿TU CORAZÓN LATE', 'PARA EMPRENDER?'], art:'heart',
    words:['PASIÓN','PROPÓSITO','SUEÑOS','MOTIVACIÓN','DECISIÓN'],
    focus:'DECISIÓN',
    quote:'¿Qué estarías dispuesto a construir, incluso si nadie te garantizara el éxito?',
    outro:'Todo comienza con aquello que te importa.',
    notes:[
      'Abre con una pregunta al público: «¿Quién ha tenido alguna vez una idea de negocio?». Distingue deseo, motivación y decisión de actuar. No romantices la incertidumbre.',
      'Explica que la pasión da energía, el propósito orienta y la motivación fluctúa. Una decisión necesita compromiso; invita a identificar una razón personal para emprender.',
      'Deja silencio después de la pregunta. Ejercicio de 15 segundos: que cada persona piense qué problema le importaría resolver aunque el camino fuera difícil.'
    ],
  },
  {
    id: 'modulo-2', n:'02', eyebrow:'EL NUEVO SIGNIFICADO', title:'¿QUÉ SIGNIFICA EMPRENDER HOY?',
    titleLines:['¿QUÉ SIGNIFICA', 'EMPRENDER HOY?'], art:'network',
    words:['PROBLEMAS','OPORTUNIDADES','INNOVACIÓN','VALOR','SOLUCIONES'],
    focus:'VALOR',
    quote:'Emprender no es solamente crear un negocio. Es crear valor.',
    outro:'Observa lo que falta. Diseña lo que ayuda.',
    notes:[
      'No todos los emprendimientos son tecnológicos: emprender es detectar necesidades y organizar recursos para resolverlas.',
      'Explica problema → oportunidad → solución → valor. Ejemplo: no vendes una agenda; ayudas a organizar el tiempo de alguien.',
      'Pregunta: «¿Qué molestia cotidiana en su comunidad podría convertirse en oportunidad?». Pide uno o dos ejemplos breves.'
    ],
  },
  {
    id: 'modulo-3', n:'03', eyebrow:'LO QUE TE MANTIENE EN MOVIMIENTO', title:'LA PASIÓN COMO MOTOR DE TU NEGOCIO',
    titleLines:['LA PASIÓN COMO', 'MOTOR DE TU NEGOCIO'], art:'energy',
    words:['ENERGÍA','DISCIPLINA','CONSTANCIA','RESILIENCIA','ACCIÓN'],
    focus:'ACCIÓN',
    quote:'La pasión te impulsa. La disciplina te mantiene avanzando.',
    outro:'La inspiración inicia. Los hábitos construyen.',
    notes:[
      'Cuenta que habrá días con poca motivación. La pasión impulsa, pero no reemplaza aprender, investigar, validar, administrar o descansar.',
      'Contrasta motivación con disciplina. Un hábito pequeño que se repite es más sostenible que un esfuerzo aislado.',
      'Pregunta: «¿Qué acción concreta podrías repetir durante los próximos siete días?». Permite que cada persona la formule para sí.'
    ],
  },
  {
    id: 'modulo-4', n:'04', eyebrow:'DEL ENTUSIASMO AL MÉTODO', title:'¡PREPÁRATE PARA EMPRENDER!',
    titleLines:['¡PREPÁRATE', 'PARA EMPRENDER!'], art:'roadmap',
    words:['IDEA','CLIENTE','VALIDACIÓN','MODELO','FINANZAS','MVP'],
    focus:'VALIDACIÓN',
    quote:'No necesitas tenerlo todo listo. Necesitas comenzar a validar.',
    outro:'Antes de invertir más, aprende más de tu cliente.',
    notes:[
      'Presenta el camino: idea → cliente → validación → MVP → mejora. Un MVP es una versión mínima para obtener aprendizaje útil.',
      'Da ejemplos de validación: entrevistas, observación, prototipos sencillos y pruebas reales. Incluye costos, ingresos y propuesta de valor.',
      'Interacción: que el público responda si su idea resuelve un problema comprobado. Si no, propón entrevistar a cinco potenciales clientes.'
    ],
  },
  {
    id: 'modulo-5', n:'05', eyebrow:'EL EMPRENDEDOR DETRÁS DEL PROYECTO', title:'LIDERAZGO Y HABILIDADES PERSONALES',
    titleLines:['LIDERAZGO Y', 'HABILIDADES PERSONALES'], art:'leadership',
    words:['AUTOCONOCIMIENTO','COMUNICACIÓN','CREATIVIDAD','ADAPTABILIDAD','LIDERAZGO'],
    focus:'LIDERAZGO',
    quote:'Antes de dirigir un negocio, aprende a dirigirte a ti mismo.',
    outro:'Liderar es escuchar, decidir y aprender.',
    notes:[
      'El liderazgo no exige dirigir a muchas personas. Comienza con autoconocimiento, responsabilidad y manejo del tiempo.',
      'Pregunta por habilidades que complementen las de cada emprendedor. Un buen equipo integra perfiles diversos.',
      'Invita a reconocer una fortaleza y una habilidad por desarrollar. La comunicación y la adaptación son entrenables.'
    ],
  },
  {
    id: 'modulo-6', n:'06', eyebrow:'EL IMPACTO DE LO QUE CONSTRUYES', title:'LA SATISFACCIÓN EN EL ENTORNO',
    titleLines:['LA SATISFACCIÓN', 'EN EL ENTORNO'], art:'ecosystem',
    words:['IMPACTO','COMUNIDAD','BIENESTAR','CRECIMIENTO','TRASCENDENCIA'],
    focus:'TRASCENDENCIA',
    quote:'El verdadero éxito también se mide por lo que transformas a tu alrededor.',
    outro:'Crecer también es hacer crecer a otros.',
    notes:[
      'Habla de satisfacción más allá de ventas: utilidad real para clientes, condiciones dignas para colaboradores y contribuciones a la comunidad.',
      'Plantea el equilibrio entre viabilidad económica, bienestar propio y efecto positivo de la actividad empresarial.',
      'Invita a completar: «Si mi proyecto funciona, la vida de ______ será mejor porque ______». Conecta con el cierre.'
    ],
  },
];

export const CLOSING_NOTES = [
  'Vuelve al origen: una idea adquiere valor cuando se prueba con el mundo real.',
  'Invita a no esperar al escenario perfecto. Distingue actuar con criterio de actuar impulsivamente.',
  'Deja una pausa. Pregunta: «¿Qué vas a construir tú?». Concluye con una acción específica para hoy.'
];
