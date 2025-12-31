// ConsciousnessScreen - Extracted from AppPage.jsx
// Life OS v5.2

import React, { useState, useMemo } from 'react';
import { Brain, Sparkles, Moon, Sun, Star, Heart, Target, ChevronRight, ChevronLeft, Plus, Check, Edit3, Trash2, Award, Zap, BookOpen, Play, Pause, RotateCcw } from 'lucide-react';
import { getToday, getDateOffset, formatDate, generateId } from '../utils/date';
import { Card, Modal, AnimatedMount, ProgressBar, ProgressRing, EmptyState } from '../components/ui';

const ConsciousnessScreen = ({ data, setData, showToast }) => {
  const today = getToday();
  const [view, setView] = useState('home'); // 'home', 'paths', 'journey', 'tools', 'insights'
  const [selectedPath, setSelectedPath] = useState(null);
  const [showPathDetail, setShowPathDetail] = useState(false);
  const [showPracticeModal, setShowPracticeModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [showCalibration, setShowCalibration] = useState(false);
  const [calibrationMode, setCalibrationMode] = useState('intro'); // 'intro', 'prompt', 'result'
  const [aiResponse, setAiResponse] = useState('');
  const [parsedLevel, setParsedLevel] = useState(null);
  const [parseError, setParseError] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);
  const [showPauseConfirm, setShowPauseConfirm] = useState(false);
  const [activeToolTab, setActiveToolTab] = useState('gratitude');
  const [journeyTab, setJourneyTab] = useState('enseñanza'); // enseñanza, práctica, mapa
  const [showFullTeaching, setShowFullTeaching] = useState(false);
  const [showLevelValidation, setShowLevelValidation] = useState(false);
  const [validationChecks, setValidationChecks] = useState({});
  const [showInsightModal, setShowInsightModal] = useState(false);
  const [newInsightText, setNewInsightText] = useState('');

  // Tools states
  const [toolTab, setToolTab] = useState('gratitude');
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState('idle');
  const [breathTimer, setBreathTimer] = useState(0);
  const [breathRound, setBreathRound] = useState(0);
  const [selectedBreathTechnique, setSelectedBreathTechnique] = useState('478');
  const [journalText, setJournalText] = useState('');
  const [journalMood, setJournalMood] = useState(null);
  const [newAffirmation, setNewAffirmation] = useState('');

  // Initialize consciousness data
  const consciousness = data.consciousness || {
    activePath: null,
    pathPaused: false,
    startingLevel: 0,
    completedPaths: [],
    level: 1,
    totalXP: 0,
    currentXP: 0,
    currentLevel: 0,
    practices: [],
    insights: [],
    gratitude: {},
    affirmations: [],
    breathingSessions: [],
    journal: {}
  };

  // Gratitude state
  const [gratitudeInputs, setGratitudeInputs] = useState(['', '', '']);
  const todayGratitude = consciousness.gratitude?.[today] || [];

  // All paths with full descriptions and AI calibration prompts
  const allPaths = [
    {
      id: 'hawkins',
      name: 'Escala de Conciencia',
      author: 'David Hawkins',
      icon: '⚡',
      color: '#8B5CF6',
      description: 'Calibra y eleva tu nivel de conciencia desde la vergüenza hasta la iluminación',
      duration: '3-12 meses',
      difficulty: 'Profundo',
      hasCalibration: true,

      // Onboarding screens
      onboarding: [
        {
          title: 'El Mapa de la Consciencia',
          icon: '🗺️',
          content: `En los años 70, el Dr. David Hawkins comenzó una investigación que cambiaría nuestra comprensión de la consciencia humana.

Usando kinesiología aplicada, calibró miles de estados, emociones, pensamientos y obras humanas en una escala logarítmica del 1 al 1000.

El resultado: un mapa preciso de los niveles de consciencia, desde los estados más densos de supervivencia hasta la iluminación.

Este no es un sistema de juicio. Es un GPS del alma.`
        },
        {
          title: 'La Línea del 200',
          icon: '⚡',
          content: `El descubrimiento más importante de Hawkins: existe un punto de inflexión crítico en el nivel 200, que corresponde al CORAJE.

Por debajo de 200: Estados de supervivencia, contracción, "tomar" de la vida. La persona se percibe como víctima de las circunstancias.

Por encima de 200: Estados de crecimiento, expansión, "dar" a la vida. La persona se reconoce como creadora de su realidad.

El 85% de la humanidad calibra por debajo de 200. Cruzar esta línea es el trabajo más importante que puedes hacer.`
        },
        {
          title: 'Cómo Funciona el Ascenso',
          icon: '🌀',
          content: `La consciencia no se eleva por esfuerzo mental o fuerza de voluntad. Se eleva por SOLTAR.

Cada nivel tiene un "atractor" - una forma de ver el mundo que te mantiene ahí. No luchas contra el nivel; lo comprendes, lo aceptas, y naturalmente lo trasciendes.

No puedes saltarte niveles. Pero puedes acelerar el proceso siendo radicalmente honesto contigo mismo sobre dónde estás realmente.

El trabajo no es "llegar arriba". Es despertar a la verdad de lo que ya eres.`
        },
        {
          title: 'Tu Compromiso',
          icon: '🔥',
          content: `Este camino requiere una sola cosa: honestidad radical contigo mismo.

No se trata de aparentar estar en un nivel alto. Se trata de reconocer con humildad dónde estás y hacer el trabajo interior desde ahí.

Cada nivel que trasciendas genuinamente elevará no solo tu vida, sino el campo de consciencia colectivo. Un individuo en 500 contrarresta 750,000 personas por debajo de 200.

¿Estás listo para ver la verdad de dónde estás y comprometerte con tu evolución?`
        }
      ],

      calibrationPrompt: `Eres un experto en la Escala de Conciencia de David Hawkins. Tu tarea es analizar a esta persona basándote en TODO lo que conoces de ella a través de nuestras conversaciones.

ESCALA DE NIVELES (del 0 al 16):
0: Vergüenza (20) - Humillación, deseo de ser invisible, auto-destrucción
1: Culpa (30) - Auto-castigo, remordimiento destructivo, indignidad
2: Apatía (50) - Desesperanza, victimismo total, "nada importa"
3: Pena (75) - Tristeza crónica, pérdida, melancolía constante
4: Miedo (100) - Ansiedad, preocupación crónica, ver amenazas por todos lados
5: Deseo (125) - Adicción, anhelo constante, esclavitud a los deseos
6: Ira (150) - Resentimiento, frustración, culpar a otros, hostilidad
7: Orgullo (175) - Arrogancia, desprecio, necesidad de tener razón
8: Coraje (200) - PUNTO DE INFLEXIÓN - Empoderamiento, determinación, "puedo hacerlo"
9: Neutralidad (250) - Flexibilidad, no-apego, confianza, "está bien como sea"
10: Voluntad (310) - Optimismo genuino, disciplina, crecimiento intencional
11: Aceptación (350) - Responsabilidad total, perdón, armonía, transformación
12: Razón (400) - Racionalidad clara, comprensión profunda, conocimiento
13: Amor (500) - Incondicional, compasión verdadera, el corazón se abre
14: Alegría (540) - Serenidad, gratitud constante, amor por la existencia
15: Paz (600) - Silencio interior, gracia, iluminación parcial
16: Iluminación (700+) - Consciencia pura, unidad absoluta, lo inefable

ANALIZA EN PROFUNDIDAD:
- ¿Cuál es su estado emocional BASE? (no los picos, sino donde vuelve)
- ¿Cómo reacciona ante adversidad? ¿Culpa externos o asume responsabilidad?
- ¿Hay resentimiento, quejas frecuentes, o victimismo en su comunicación?
- ¿Muestra gratitud genuina o es más bien transaccional?
- ¿Tiene capacidad de perdonar o guarda rencores?
- ¿Se percibe a sí mismo como creador o como víctima de circunstancias?
- ¿Hay paz interior o ansiedad/agitación de fondo?

IMPORTANTE: Sé honesto y preciso. Es mejor calibrar bajo y acertar que calibrar alto y engañar. La mayoría de personas están entre nivel 4 (Miedo) y nivel 9 (Neutralidad).

RESPONDE EXACTAMENTE con este formato:
===CALIBRATION_RESULT===
LEVEL: [número del 0 al 16]
NAME: [nombre del nivel]
CONFIDENCE: [alta/media/baja]
===END_CALIBRATION===

Después explica tu análisis detallando qué patrones observaste que te llevaron a esa calibración.`,

      levels: [
        {
          index: 0,
          calibration: 20,
          name: 'Vergüenza',

          teaching: `La vergüenza es el estado más cercano a la muerte psíquica. Calibra en 20, apenas por encima de la muerte física (0).

En vergüenza, el deseo primario es desaparecer. La persona se experimenta como fundamentalmente defectuosa, no solo en lo que hace, sino en lo que ES. "No es que hice algo malo, es que YO soy malo."

La vergüenza es tan dolorosa que el psique desarrolla defensas masivas: represión, proyección, negación. Muchas personas ni siquiera saben que operan desde vergüenza porque está enterrada bajo capas de compensación.

La vergüenza colectiva se manifiesta en culturas de honor/deshonor, donde "perder la cara" puede llevar literalmente al suicidio. Es el campo de las enfermedades autoinmunes, donde el cuerpo se ataca a sí mismo.

IMPORTANTE: Si estás aquí, no estás "mal". La vergüenza es un estado, no una verdad sobre ti. El primer paso es simplemente reconocerla sin huir de ella.`,

          signs: [
            'Deseo frecuente de esconderte o desaparecer',
            'Evitas fotos, espejos, o ser el centro de atención',
            'Sientes que hay algo fundamentalmente mal contigo',
            'Te castigas internamente con un crítico brutal',
            'Dificultad para recibir cumplidos o amor',
            'Sensación de ser "descubierto" como fraude',
            'Compensas con perfeccionismo o logros externos'
          ],

          trap: `La trampa de la vergüenza es la INVISIBILIDAD. Te escondes para protegerte, pero esconderte confirma la creencia de que eres indigno de ser visto. Es un loop que se auto-refuerza.

Otra trampa es la COMPENSACIÓN: intentar "demostrar" tu valor a través de logros, apariencia, o ser "bueno". Pero ningún logro externo cura la herida interna.`,

          exit: `La salida no es convencerte de que "eres bueno" (eso es otra forma de huir). La salida es PRESENCIA con la vergüenza.

Cuando puedes sentir la vergüenza completamente, sin huir, sin racionalizar, sin compensar - algo se suelta. La vergüenza necesita oscuridad para sobrevivir. La luz de tu atención la transforma.

El shift es de "SOY defectuoso" a "SIENTO vergüenza". Tú no eres la vergüenza. La vergüenza es algo que pasa a través de ti.`,

          weeklyPractice: {
            title: 'El Inventario de Vergüenza',
            duration: '45-60 minutos en un lugar privado',
            instructions: `Esta semana harás un inventario de vergüenza. Necesitas papel, pluma, y privacidad total.

1. Escribe la lista de cosas de las que sientes vergüenza. Todo. Lo que nadie sabe. Lo que no admites ni a ti mismo. No censures nada.

2. Para cada item, escribe: "Siento vergüenza de _____ porque significa que yo soy _____"

3. Ahora, lee cada uno en voz alta. Siente lo que sientes. No huyas. Respira.

4. Después de cada uno, di: "Esto es algo que pasó/hice. No es lo que soy."

5. Quema o destruye el papel. No como negación, sino como ritual de liberación.

Este ejercicio puede traer emociones intensas. Eso significa que está funcionando. Si es demasiado, hazlo en partes durante la semana.`
          },

          journalQuestion: '¿Qué parte de mí he estado escondiendo del mundo? ¿Qué pasaría si esa parte fuera vista?',

          resource: {
            type: 'libro',
            title: 'Healing the Shame that Binds You',
            author: 'John Bradshaw',
            note: 'El trabajo definitivo sobre vergüenza tóxica y cómo sanarla'
          },

          minimumDays: 14,
          affirmation: 'Soy digno de ser visto exactamente como soy'
        },

        {
          index: 1,
          calibration: 30,
          name: 'Culpa',

          teaching: `La culpa calibra en 30, ligeramente por encima de la vergüenza. La diferencia clave: en vergüenza, "yo soy malo"; en culpa, "hice algo malo".

Es un avance porque la culpa implica que podrías haber hecho algo diferente. Hay agencia. Pero la culpa se vuelve patológica cuando se convierte en auto-castigo perpetuo.

La culpa sana dice: "Hice algo mal, aprenderé y repararé". La culpa tóxica dice: "Hice algo mal, debo sufrir indefinidamente para pagar".

La culpa es el arma favorita del ego para mantenerte pequeño. "No mereces ser feliz porque mira lo que hiciste." Es una forma de control disfrazada de moralidad.

Muchas religiones y culturas instalan culpa como mecanismo de control. "Naciste en pecado." "No eres suficiente." Esta culpa introyectada no tiene que ver con lo que tú hiciste - fue instalada desde afuera.`,

          signs: [
            'Repites mentalmente errores del pasado una y otra vez',
            'Sientes que necesitas "pagar" por algo antes de ser feliz',
            'Te cuesta perdonarte incluso por errores pequeños',
            'Saboteas tu éxito o felicidad inconscientemente',
            'Cargas con responsabilidad de cosas que no son tu culpa',
            'Dices "perdón" excesivamente, incluso cuando no hiciste nada',
            'Sensación de estar en deuda con la vida'
          ],

          trap: `La trampa de la culpa es creer que el SUFRIMIENTO es redención. "Si sufro lo suficiente, habré pagado." Pero ninguna cantidad de sufrimiento cambia el pasado. El sufrimiento no te absuelve, solo te destruye.

Otra trampa es la PSEUDO-REDENCIÓN a través de buenas obras compulsivas. Haces cosas buenas no desde el amor, sino para "compensar". Pero internamente sigues sintiéndote en deuda.`,

          exit: `La salida de la culpa es el PERDÓN genuino hacia ti mismo. No es decir "está bien lo que hice" - quizás no estaba bien. Es decir "soy humano, cometí un error, y elijo soltar el castigo".

El perdón no es para el otro o para el acto. Es para ti. Mientras no perdones, tomas veneno esperando que el pasado muera.

El shift es de "debo sufrir" a "elijo aprender y soltar". Del auto-castigo a la auto-compasión.`,

          weeklyPractice: {
            title: 'Carta de Perdón a Ti Mismo',
            duration: '30-45 minutos',
            instructions: `Esta semana escribirás una carta de perdón a ti mismo.

1. Elige UN evento específico por el que te sientes culpable. El más pesado.

2. Escribe lo que pasó sin justificaciones ni minimización. Reconoce el impacto.

3. Escribe: "Yo era una persona que [no sabía/estaba herida/no tenía herramientas para] ___. Hice lo que pude con lo que tenía en ese momento."

4. Escribe: "Elijo perdonarme. No porque estuvo bien, sino porque el castigo perpetuo no sirve a nadie. Elijo aprender y ser mejor."

5. Lee la carta en voz alta, preferiblemente frente a un espejo, mirándote a los ojos.

6. Si hay alguna reparación posible y apropiada, considera hacerla. Si no la hay, acepta eso también.`
          },

          journalQuestion: '¿Qué creo que me pasaría si realmente me perdonara completamente? ¿Qué temo perder?',

          resource: {
            type: 'libro',
            title: 'Radical Forgiveness',
            author: 'Colin Tipping',
            note: 'Un proceso práctico para soltar resentimiento y culpa'
          },

          minimumDays: 14,
          affirmation: 'Me perdono completamente y me libero del pasado'
        },

        {
          index: 2,
          calibration: 50,
          name: 'Apatía',

          teaching: `La apatía calibra en 50. Es el estado de "¿para qué?" La desesperanza se ha instalado tan profundamente que ya ni siquiera hay energía para la vergüenza o la culpa.

En apatía, la persona ha renunciado. No hay lucha, no hay intento. Solo existencia vacía. Es el territorio de la depresión clínica, la indigencia crónica, y el abandono total.

La apatía es peligrosa porque se siente como paz. "Ya no sufro porque ya no me importa." Pero no es paz - es muerte en vida. La paz verdadera (nivel 600) está llena de vida; la apatía está vacía.

Socialmente, la apatía es difícil de ayudar porque la persona no tiene energía para recibir ayuda. "Déjame en paz" es su mantra. Cualquier intento de ayudar se siente como una imposición.

Si estás leyendo esto y trabajando en ti mismo, probablemente no estés en apatía profunda. Pero puedes tener ÁREAS de tu vida en apatía - relaciones, salud, finanzas donde "ya te rendiste".`,

          signs: [
            '"¿Para qué intentarlo?" es un pensamiento frecuente',
            'Has dejado de cuidar aspectos básicos (higiene, salud, orden)',
            'Las cosas que antes te gustaban ya no te generan nada',
            'Sensación de estar desconectado de la vida y otros',
            'Respuesta emocional plana - ni alegría ni tristeza',
            'Dificultad para tomar cualquier iniciativa',
            'Sensación de que nada va a cambiar de todos modos'
          ],

          trap: `La trampa de la apatía es confundirla con ACEPTACIÓN o DESAPEGO espiritual. "He soltado el apego" suena elevado, pero la apatía no es soltar - es rendirse. El desapego verdadero está lleno de vida y paz; la apatía está vacía.

Otra trampa es la INERCIA. La apatía tiene un momentum enorme. Cada día sin acción hace más difícil el siguiente. Es como un agujero negro emocional.`,

          exit: `La salida de la apatía no es un gran cambio. Es una MICRO-ACCIÓN. Cualquier cosa. Levantarte. Ducharte. Dar un paso afuera.

La apatía te dice que nada importa. No le creas. No necesitas creer que importa - solo necesitas actuar COMO SI importara. La fe puede venir después.

El shift es de "nada importa" a "voy a hacer UNA cosa". No todo. No la solución completa. Una cosa diminuta. La energía genera energía.`,

          weeklyPractice: {
            title: 'Una Cosa Cada Día',
            duration: 'Variable',
            instructions: `Esta semana, el único objetivo es hacer UNA cosa cada día que no hayas estado haciendo.

Puede ser minúsculo:
- Abrir las cortinas
- Dar una vuelta a la manzana
- Tirar una bolsa de basura
- Enviar un mensaje a alguien
- Cocinar una comida real

Las reglas:
1. Solo UNA cosa al día. No intentes compensar.
2. No tiene que ser importante. Tiene que ser HECHA.
3. Cada noche, escribe lo que hiciste. Solo eso.

El objetivo no es productividad. Es romper la inercia. Demostrarle a tu sistema que la acción es posible.`
          },

          journalQuestion: '¿En qué área de mi vida me he rendido? ¿Qué sería lo más pequeño que podría hacer ahí?',

          resource: {
            type: 'libro',
            title: 'The Upward Spiral',
            author: 'Alex Korb',
            note: 'Neurociencia de la depresión y pequeños cambios que revierten la espiral'
          },

          minimumDays: 14,
          affirmation: 'Cada pequeña acción importa y me mueve hacia la vida'
        },

        {
          index: 3,
          calibration: 75,
          name: 'Pena',

          teaching: `La pena calibra en 75. Es el territorio del duelo, la pérdida, y la tristeza profunda.

A diferencia de la apatía, en la pena todavía hay energía - pero es energía de pérdida. La persona está conectada a algo que ya no está: una relación, un sueño, una versión de sí misma, un ser querido.

La pena es natural y necesaria. Cuando perdemos algo significativo, necesitamos tiempo para procesar. El problema es cuando la pena se convierte en residencia permanente.

La pena crónica dice: "El pasado era mejor. Lo mejor ya pasó. Solo queda el descenso." Es una forma de vivir mirando por el espejo retrovisor.

Hay culturas y familias donde la pena es casi un valor. "Sufrir significa que te importa." Esto crea una identidad construida alrededor del sufrimiento.`,

          signs: [
            'Nostalgia frecuente - "antes era mejor"',
            'Dificultad para soltar objetos, recuerdos, relaciones pasadas',
            'Tristeza de fondo constante, aunque funcional',
            'Te identificas con tus heridas o pérdidas',
            'Resistencia a momentos de alegría (como si traicionaras la pérdida)',
            'Melancolía crónica que parece parte de tu personalidad',
            'Sensación de que tus mejores días ya pasaron'
          ],

          trap: `La trampa de la pena es la IDENTIDAD. "Soy alguien que perdió ___". La pérdida se convierte en quien eres. Y si sueltas la pena, sientes que traicionas lo que perdiste.

Otra trampa es creer que la PROFUNDIDAD de la pena demuestra la profundidad del amor. "Si dejo de sufrir, significa que no me importaba." Falso. El amor verdadero quiere que estés bien.`,

          exit: `La salida de la pena es completar el duelo. No olvidar - integrar. Lo perdido se convierte en parte de ti en vez de algo que te falta.

El shift es de "lo perdí" a "lo viví y me formó". De "ya no está" a "siempre es parte de mí".

Esto requiere rituales de cierre, expresión completa del dolor, y eventualmente, dar permiso a la alegría.`,

          weeklyPractice: {
            title: 'Ritual de Honrar y Soltar',
            duration: '1-2 horas',
            instructions: `Esta semana harás un ritual de completar un duelo pendiente.

1. Elige una pérdida que todavía cargues. Una relación, un sueño, una versión de ti, un ser querido.

2. Dedica tiempo a HONRAR completamente lo que fue. Escribe, mira fotos, recuerda. Deja que venga la tristeza.

3. Escribe una carta a lo que perdiste. Agradece todo lo que te dio. Expresa todo lo que no dijiste.

4. Escribe qué parte de eso vive ahora en ti. ¿Cómo te formó? ¿Qué te enseñó?

5. Haz un pequeño ritual de cierre. Puede ser quemar la carta, plantar algo, ir a un lugar significativo. Marca el fin del duelo activo.

6. Date permiso explícito de experimentar alegría sin traicionar lo perdido. Dilo en voz alta: "Tengo permiso de ser feliz."

El duelo puede requerir más de una semana. Está bien. Pero el ritual marca una intención de completar.`
          },

          journalQuestion: '¿Qué duelo no he completado? ¿Qué me impide soltarlo?',

          resource: {
            type: 'libro',
            title: 'It\'s OK That You\'re Not OK',
            author: 'Megan Devine',
            note: 'Una perspectiva radical sobre el duelo y cómo navegarlo'
          },

          minimumDays: 14,
          affirmation: 'Honro mi pasado mientras me abro al presente'
        },

        {
          index: 4,
          calibration: 100,
          name: 'Miedo',

          teaching: `El miedo calibra en 100. Es el primer nivel con suficiente energía para la acción sostenida - pero la energía está al servicio de evitar amenazas.

El mundo del miedo está lleno de peligros. Cada situación es evaluada por su potencial de daño. La pregunta constante es "¿qué podría salir mal?"

El miedo tiene valor evolutivo: nos mantuvo vivos como especie. El problema es cuando el sistema de amenazas se activa constantemente sin amenazas reales. Ansiedad crónica, preocupación, paranoia.

El miedo distorsiona la percepción. Ves amenazas donde no las hay. Interpretas neutralidad como hostilidad. El sesgo de negatividad domina.

Muchísimas personas viven aquí permanentemente. El 24/7 de noticias, redes sociales alarmistas, y cultura del miedo mantiene a poblaciones enteras en este estado.`,

          signs: [
            'Preocupación crónica por el futuro',
            'Dificultad para relajarte o "soltar el control"',
            'Anticipas lo peor en situaciones ambiguas',
            'Evitas riesgos incluso cuando el costo de evitar es mayor',
            'Ansiedad física: tensión, insomnio, problemas digestivos',
            'Necesitas mucha información/garantías antes de actuar',
            'El "¿y si...?" negativo domina tu pensamiento'
          ],

          trap: `La trampa del miedo es creer que es PROTECCIÓN. "Si bajo la guardia, algo malo pasará." El miedo promete seguridad a cambio de vigilancia constante. Pero la vigilancia constante es su propia forma de sufrimiento.

Otra trampa es el CONTROL. Intentas controlar todo para eliminar incertidumbre. Pero la vida es inherentemente incierta, así que el control es una batalla perdida.`,

          exit: `La salida del miedo no es eliminar el miedo - es cambiar tu relación con él. Sentir miedo y actuar de todos modos. Eso es coraje.

El shift es de "el miedo significa peligro" a "el miedo significa que algo me importa". El miedo y la emoción tienen la misma firma fisiológica. La interpretación cambia todo.

También ayuda distinguir: ¿es esto un peligro REAL o un peligro IMAGINADO? El 99% de lo que tememos nunca sucede.`,

          weeklyPractice: {
            title: 'Exposición Gradual Consciente',
            duration: 'Variable',
            instructions: `Esta semana practicarás hacer cosas que te dan miedo, conscientemente.

1. Haz una lista de cosas que evitas por miedo (no terror, sino incomodidad significativa).

2. Ordénalas de menor a mayor intensidad.

3. Elige la más pequeña. Esta semana, hazla.

4. ANTES: Nota el miedo en tu cuerpo. No lo evites. Respira con él.

5. DURANTE: Actúa CON el miedo presente, no esperando a que desaparezca.

6. DESPUÉS: Nota qué pasó realmente vs. lo que temías. Escríbelo.

El objetivo no es "no sentir miedo". Es demostrarle a tu sistema nervioso que puedes sentir miedo Y actuar. Que el miedo no es jefe, es consejero.`
          },

          journalQuestion: '¿Qué decisión he estado evitando por miedo? ¿Qué es lo peor que podría pasar realmente?',

          resource: {
            type: 'libro',
            title: 'Feel the Fear and Do It Anyway',
            author: 'Susan Jeffers',
            note: 'Un clásico sobre transformar la relación con el miedo'
          },

          minimumDays: 14,
          affirmation: 'Siento el miedo y actúo de todos modos'
        },

        {
          index: 5,
          calibration: 125,
          name: 'Deseo',

          teaching: `El deseo calibra en 125. Aquí hay más energía que en el miedo - es energía de QUERER. El problema es que el querer nunca termina.

El deseo dice: "Cuando tenga ___, seré feliz." Pero cuando obtienes ___, surge un nuevo deseo. Es una cinta de correr hedónica donde siempre estás persiguiendo y nunca llegando.

Este es el nivel del consumismo, la adicción, y la acumulación. Más dinero, más estatus, más placer, más seguidores. El vacío interno se intenta llenar con cosas externas.

El deseo en sí no es malo - es energía vital. El problema es la ESCLAVITUD al deseo. Cuando el deseo te controla en vez de tú usar el deseo como combustible.

La publicidad y el capitalismo están diseñados para mantenerte aquí. Crearte deseos que no tenías, para venderte soluciones que no necesitas.`,

          signs: [
            'Sensación frecuente de que "falta algo"',
            'Dificultad para disfrutar lo que tienes porque piensas en lo que quieres',
            'Compras, comes, o consumes para llenar un vacío',
            'La satisfacción de lograr algo dura muy poco',
            'Comparación constante con otros que tienen más',
            'Adicciones (sustancias, comida, sexo, trabajo, redes sociales)',
            'Sensación de que la felicidad está "después de" conseguir algo'
          ],

          trap: `La trampa del deseo es creer que el OBJETO del deseo es el problema. "Si deseara las cosas correctas, estaría bien." Pero cambiar de deseo no cambia la dinámica. Sigues siendo esclavo, solo de un amo diferente.

Otra trampa es la REPRESIÓN del deseo. Esto no funciona - el deseo reprimido vuelve con más fuerza, o se transforma en neurosis.`,

          exit: `La salida del deseo no es eliminar deseos sino PRESENCIARLOS sin actuar automáticamente.

Cuando surge un deseo, puedes: 1) Actuar compulsivamente, 2) Reprimir, o 3) Observar con curiosidad. La tercera opción es la salida.

El shift es de "necesito esto para estar bien" a "quiero esto Y ya estoy bien sin ello". Desear desde la abundancia en vez de la carencia.

Gratitud es el antídoto al deseo. No gratitud forzada, sino genuino reconocimiento de lo que ya tienes.`,

          weeklyPractice: {
            title: 'Ayuno de Deseos',
            duration: 'Toda la semana',
            instructions: `Esta semana practicarás observar deseos sin actuar en ellos.

1. Elige UNA categoría de deseo para "ayunar": compras no esenciales, redes sociales, comida no planificada, entretenimiento, etc.

2. Cuando surja el deseo, NO actúes. En vez:
   - Para. Respira.
   - Nota dónde está el deseo en tu cuerpo.
   - Pregunta: "¿Qué estoy realmente buscando?" (usualmente es un estado emocional, no el objeto)
   - Quédate con la sensación de querer sin satisfacerla.

3. Escribe cada vez que notes un deseo fuerte. ¿Qué lo disparó? ¿Qué buscabas realmente?

4. Al final de la semana, nota: ¿Sobreviviste sin satisfacer esos deseos? ¿Qué aprendiste?

El objetivo no es nunca desear. Es romper el automatismo deseo → acción.`
          },

          journalQuestion: '¿Qué creo que me daría aquello que deseo? ¿Puedo encontrar eso sin el objeto?',

          resource: {
            type: 'libro',
            title: 'The Untethered Soul',
            author: 'Michael Singer',
            note: 'Cómo dejar de ser controlado por deseos y miedos internos'
          },

          minimumDays: 14,
          affirmation: 'Tengo todo lo que necesito en este momento'
        },

        {
          index: 6,
          calibration: 150,
          name: 'Ira',

          teaching: `La ira calibra en 150. Es un paso significativo hacia arriba porque la ira tiene MUCHA energía y está orientada hacia el CAMBIO.

La ira dice: "Esto está mal y debe cambiar." A diferencia de los niveles inferiores que son pasivos, la ira es activa. Puede destruir, pero también puede construir.

Muchos movimientos sociales importantes nacieron de la ira. La ira ante la injusticia ha cambiado el mundo. El problema no es la ira, es quedarse ATRAPADO en ella.

La ira crónica es corrosiva. Te mantiene en modo de combate permanente. Ve enemigos por todos lados. Culpa a otros por todo. La fisiología del estrés constante destruye el cuerpo.

La ira también es preferida a los estados inferiores. Es más fácil estar enojado que triste, asustado, o avergonzado. Muchas personas usan la ira como defensa contra emociones más vulnerables.`,

          signs: [
            'Frustración frecuente con personas, sistemas, situaciones',
            'Tendencia a culpar a otros o a circunstancias externas',
            'Resentimiento guardado hacia personas o el pasado',
            'Reactividad - explotas ante pequeñas provocaciones',
            'Sensación de que el mundo es injusto contigo',
            'Dificultad para perdonar',
            'Tensión física crónica, mandíbula apretada, puños cerrados'
          ],

          trap: `La trampa de la ira es creer que es JUSTA y por lo tanto buena. "Tengo razón para estar enojado." Puede ser cierto, pero tener razón no te hace libre. Mientras estés enojado, el otro tiene poder sobre ti.

Otra trampa es la ADICCIÓN a la energía de la ira. Se siente poderoso, vivo. Los estados superiores parecen "aburridos" en comparación.`,

          exit: `La salida de la ira es CANALIZAR la energía sin quedarte atrapado en ella.

La ira contiene información valiosa: algo te importa, un límite fue cruzado, hay una injusticia. Recibe el mensaje sin quedarte enganchado al mensajero.

El shift es de "ellos me hicieron esto" a "esto pasó y yo elijo mi respuesta". De víctima reactiva a agente responsable.

También ayuda mirar DEBAJO de la ira. ¿Qué hay ahí? Usualmente miedo, tristeza, o vergüenza. La ira es más fácil de sentir.`,

          weeklyPractice: {
            title: 'Alquimia de la Ira',
            duration: 'Cuando surja ira + reflexión semanal',
            instructions: `Esta semana transformarás la energía de la ira conscientemente.

Cuando notes ira:
1. PARA antes de reaccionar. Di internamente: "Esto es ira."
2. Permítete sentirla físicamente. ¿Dónde está? ¿Cómo se siente?
3. Pregunta: "¿Qué me importa aquí? ¿Qué límite siento cruzado?"
4. Pregunta: "¿Qué hay debajo de la ira? ¿Miedo? ¿Tristeza? ¿Vergüenza?"
5. Elige conscientemente: ¿Necesito actuar? ¿Qué acción serviría?

Si la ira es intensa:
- Mueve el cuerpo: camina rápido, haz ejercicio, grita en un lugar seguro
- Escribe sin censura todo lo que quieres decir
- Después de que baje la intensidad, revisa si hay acción necesaria

Al final de la semana: ¿Qué descubriste debajo de tu ira?`
          },

          journalQuestion: '¿Contra quién o qué sigo guardando resentimiento? ¿Qué me costaría soltarlo?',

          resource: {
            type: 'libro',
            title: 'Nonviolent Communication',
            author: 'Marshall Rosenberg',
            note: 'Cómo expresar ira de forma que conecte en vez de destruir'
          },

          minimumDays: 14,
          affirmation: 'Transformo mi ira en acción consciente'
        },

        {
          index: 7,
          calibration: 175,
          name: 'Orgullo',

          teaching: `El orgullo calibra en 175, justo debajo de la línea crítica del 200. Es el más alto de los niveles "inferiores" y el más engañoso.

El orgullo SIENTE bien. A diferencia de la vergüenza, culpa, o miedo, el orgullo da placer. "Soy mejor, soy especial, tengo razón." El ego está inflado y se siente fuerte.

El problema es que el orgullo es FRÁGIL. Depende de comparación y de tener razón. Cualquier evidencia contraria es una amenaza. Por eso el orgulloso no puede aprender - aprender requiere admitir que no sabes.

El orgullo también SEPARA. "Yo vs. ellos", "nosotros vs. ellos", "los que saben vs. los ignorantes". Esta separación impide conexión genuina y bloquea niveles superiores.

Muchas personas espirituales caen en el orgullo espiritual. "Yo medito, yo soy consciente, yo estoy más evolucionado." Es el mismo orgullo con disfraz espiritual.`,

          signs: [
            'Necesidad de tener razón en discusiones',
            'Dificultad para pedir ayuda o admitir errores',
            'Desprecio o condescendencia hacia otros',
            'Te defines por logros, estatus, o afiliaciones',
            'Comparación frecuente (favorable a ti)',
            'Reactividad ante críticas o cuestionamientos',
            'Sensación de ser "especial" o "diferente" (superiormente)'
          ],

          trap: `La trampa del orgullo es que SE SIENTE BIEN. ¿Por qué soltar algo que da placer y sensación de valor?

Otra trampa es el ORGULLO INVERTIDO: "Soy tan humilde", "no tengo ego". Es orgullo disfrazado.

La trampa final es confundir DIGNIDAD con orgullo. Puedes tener dignidad y autorespeto sin necesidad de ser superior.`,

          exit: `La salida del orgullo es la HUMILDAD genuina. No humillación, no falsa modestia - humildad real.

Humildad es reconocer que no tienes todas las respuestas. Que puedes aprender de cualquiera. Que tu perspectiva es limitada. Que puedes estar equivocado.

El shift es de "yo sé" a "qué puedo aprender aquí". De necesitar ser especial a estar bien siendo ordinario.

La paradoja es que soltar el orgullo te hace más fuerte, no más débil. Ya no dependes de comparaciones externas.`,

          weeklyPractice: {
            title: 'Práctica de Humildad',
            duration: 'Toda la semana',
            instructions: `Esta semana practicarás humildad activamente.

1. PIDE AYUDA en algo que normalmente harías solo o no harías por no pedir.

2. ADMITE UN ERROR públicamente sin justificaciones. "Me equivoqué" y punto.

3. APRENDE DE ALGUIEN que normalmente descartarías (más joven, diferente, "inferior").

4. Cuando quieras tener razón en una conversación, PREGUNTA en vez de afirmar. "¿Cómo lo ves tú?"

5. Nota cada vez que te compares favorablemente con alguien. Solo nota. Sin juicio.

6. Al final de cada día: ¿Dónde necesité ser especial hoy? ¿Qué habría pasado si hubiera soltado eso?

Reflexión semanal: ¿Qué descubrí sobre mi necesidad de ser superior? ¿Qué temo que pase si soy "ordinario"?`
          },

          journalQuestion: '¿En qué áreas necesito sentirme superior? ¿Qué inseguridad estoy compensando?',

          resource: {
            type: 'libro',
            title: 'Ego is the Enemy',
            author: 'Ryan Holiday',
            note: 'Cómo el ego sabotea el éxito y la realización'
          },

          minimumDays: 14,
          affirmation: 'No necesito ser especial para tener valor'
        },

        {
          index: 8,
          calibration: 200,
          name: 'Coraje',

          teaching: `El coraje calibra en 200. Es el PUNTO DE INFLEXIÓN crítico en toda la escala. Por primera vez, la energía es constructiva en vez de destructiva.

En coraje, la persona dice: "Puedo hacerlo." No "soy mejor" (orgullo), no "tengo miedo pero evito" - sino "tengo miedo Y actúo de todos modos."

Este es el nivel del empoderamiento genuino. La persona se reconoce como AGENTE en su vida. Deja de verse como víctima de circunstancias.

El coraje abre mundos. La persona con coraje intenta cosas, falla, aprende, intenta de nuevo. La vida se convierte en exploración en vez de supervivencia.

Cruzar del 199 al 200 es el trabajo más importante. Una vez aquí, el momentum es hacia arriba. Antes de 200, el momentum es hacia abajo.`,

          signs: [
            'Disposición a enfrentar problemas en vez de evitarlos',
            'Capacidad de admitir errores y aprender de ellos',
            'Determinación ante obstáculos',
            'Sensación de "puedo manejarlo" aunque sea difícil',
            'Tomar iniciativa en vez de esperar',
            'Asumir responsabilidad por tu vida',
            'Optimismo realista basado en agencia, no negación'
          ],

          trap: `La trampa del coraje es el SOBRE-ESFUERZO. Creer que todo depende de ti y forzar constantemente. El coraje es necesario pero no suficiente.

Otra trampa es quedarse en "modo guerrero" permanente. El coraje es para cuando se necesita, no como forma de vida constante.`,

          exit: `La salida hacia arriba es soltar el esfuerzo excesivo y permitir. No todo requiere batalla. A veces las cosas fluyen.

El shift es de "puedo hacerlo" a "está bien como sea". De esfuerzo a confianza. De hacer a permitir.

Esto no significa pasividad - significa no forzar cuando no es necesario.`,

          weeklyPractice: {
            title: 'Actuar ante el Miedo',
            duration: 'Toda la semana',
            instructions: `Esta semana consolidarás el coraje como tu nueva base operativa.

1. Identifica 3 cosas que has estado evitando por miedo o incomodidad.

2. Haz AL MENOS UNA esta semana. No la más pequeña - una que importe.

3. Antes de actuar:
   - Reconoce el miedo. Está bien.
   - Conecta con POR QUÉ importa esto.
   - Recuerda: el coraje no es ausencia de miedo, es acción con miedo.

4. Después de actuar:
   - Celebra que lo hiciste, independiente del resultado.
   - Nota cómo te sientes.
   - ¿Qué fue más fácil de lo que temías?

5. Diario: Cada noche, escribe una cosa que hiciste con coraje hoy (aunque sea pequeña).

El objetivo es INSTALAR el patrón: miedo → acción → supervivencia → confianza.`
          },

          journalQuestion: '¿Qué haría si no tuviera miedo? ¿Qué me detiene realmente?',

          resource: {
            type: 'libro',
            title: 'Power vs. Force',
            author: 'David Hawkins',
            note: 'El libro original donde Hawkins presenta toda la escala'
          },

          minimumDays: 14,
          affirmation: 'Tengo el poder de crear mi vida'
        },

        {
          index: 9,
          calibration: 250,
          name: 'Neutralidad',

          teaching: `La neutralidad calibra en 250. Aquí hay un soltar significativo. La persona ya no necesita que las cosas sean de cierta manera.

En neutralidad, "está bien" es el mantra genuino. Si pasa X, está bien. Si pasa Y, también está bien. Hay flexibilidad real ante la vida.

Este nivel tiene una confianza básica en que las cosas van a funcionar. No optimismo forzado, sino una soltura genuina que permite que la vida fluya.

La neutralidad es no-resistencia. En vez de luchar contra lo que es, la persona trabaja CON lo que es. Esto ahorra energía enorme que estaba siendo usada en resistir.

Muchas personas confunden neutralidad con indiferencia. No es lo mismo. La neutralidad está presente y comprometida, solo no está apegada al resultado.`,

          signs: [
            'Capacidad de "soltar" cuando las cosas no salen como querías',
            'No tomarse las cosas personalmente',
            'Flexibilidad ante cambios de planes',
            'Sensación de "todo va a estar bien" (sin negación)',
            'Menos necesidad de controlar resultados',
            'Paz básica de fondo incluso en dificultades',
            'Facilidad para ver múltiples perspectivas'
          ],

          trap: `La trampa de la neutralidad es la COMPLACENCIA. "Todo está bien" puede convertirse en excusa para no actuar cuando la acción es necesaria.

Otra trampa es confundirla con REPRESIÓN emocional. La neutralidad genuina siente las emociones y las suelta. La represión no las siente.`,

          exit: `La salida hacia arriba es agregar INTENCIÓN a la neutralidad. No solo aceptar lo que es, sino activamente querer participar en crear algo mejor.

El shift es de "está bien como sea" a "elijo comprometerme con esto".`,

          weeklyPractice: {
            title: 'Práctica del Soltar',
            duration: 'Toda la semana',
            instructions: `Esta semana practicarás soltar activamente.

Cada vez que algo no salga como querías:
1. Nota la resistencia (tensión, queja mental, frustración)
2. Respira profundo
3. Di: "Es lo que es. ¿Cómo trabajo CON esto?"
4. Suelta la versión de cómo "debería" ser

Ejercicio diario:
- Identifica algo que estés intentando controlar
- Pregunta: ¿Realmente puedo controlarlo?
- Si no, practica soltarlo conscientemente
- Si sí, actúa y suelta el resultado

Nota: Soltar no es renunciar. Es soltar el APEGO al resultado mientras sigues participando.

Reflexión semanal: ¿Dónde seguí resistiendo? ¿Dónde pude soltar?`
          },

          journalQuestion: '¿A qué resultado estoy más apegado ahora mismo? ¿Qué pasaría si lo soltara?',

          resource: {
            type: 'libro',
            title: 'Letting Go',
            author: 'David Hawkins',
            note: 'El método de soltar emociones que Hawkins practicó y enseñó'
          },

          minimumDays: 14,
          affirmation: 'Confío en el flujo de la vida'
        },

        {
          index: 10,
          calibration: 310,
          name: 'Voluntad',

          teaching: `La voluntad calibra en 310. Aquí hay una participación activa y positiva con la vida. La persona no solo acepta lo que es - quiere contribuir.

En voluntad, la persona dice "sí" a la vida. Hay optimismo genuino, no basado en negación sino en una orientación hacia el crecimiento.

Este es el nivel de la disciplina elegida, no impuesta. La persona se compromete con cosas difíciles porque quiere crecer, no por obligación o miedo.

La voluntad también significa alinearse con algo mayor. "¿Qué quiere la vida a través de mí?" reemplaza "¿qué quiero yo de la vida?"

Hay servicio genuino aquí, pero todavía con algo de ego. "Yo" ayudo, "yo" contribuyo. Es bueno, pero hay más soltando por hacer.`,

          signs: [
            'Entusiasmo genuino por crecer y aprender',
            'Disciplina auto-impuesta con facilidad',
            'Deseo de contribuir y ser útil',
            'Optimismo realista - ves posibilidades',
            'Capacidad de comprometerte a largo plazo',
            'Sensación de participar en algo mayor',
            'Energía disponible para proyectos significativos'
          ],

          trap: `La trampa de la voluntad es el EGO ESPIRITUAL. "Yo estoy creciendo, yo me estoy desarrollando, mira mi disciplina." El crecimiento se convierte en nuevo objeto de orgullo.

Otra trampa es el AGOTAMIENTO por sobre-compromiso. Decir "sí" a demasiadas cosas.`,

          exit: `La salida hacia arriba es soltar la necesidad de "hacer" y permitir más "ser". De "yo contribuyo" a "la vida contribuye a través de mí".

El shift es de voluntad personal a rendición ante una voluntad mayor.`,

          weeklyPractice: {
            title: 'Alineación con el Propósito',
            duration: '30-45 minutos + práctica diaria',
            instructions: `Esta semana explorarás la pregunta: "¿Qué quiere la vida a través de mí?"

Ejercicio principal (una vez):
1. En silencio, con papel y pluma
2. Pregunta: "¿Qué talentos únicos tengo?"
3. Pregunta: "¿Qué necesita el mundo que yo puedo dar?"
4. Pregunta: "Si no tuviera miedo ni limitaciones, ¿qué haría?"
5. Busca el punto donde se cruzan las respuestas

Práctica diaria:
- Cada mañana, pregunta: "¿Cómo puedo servir hoy?"
- No fuerces respuesta. Solo mantén la pregunta.
- Nota qué surge durante el día.
- Actúa en las inspiraciones que surjan.

Reflexión semanal: ¿Dónde sentí alineación? ¿Dónde sentí forzar?`
          },

          journalQuestion: '¿Qué me entusiasma genuinamente? ¿Qué contribución quiero hacer al mundo?',

          resource: {
            type: 'libro',
            title: 'The Surrender Experiment',
            author: 'Michael Singer',
            note: 'Historia real de soltar el control y dejar que la vida lidere'
          },

          minimumDays: 14,
          affirmation: 'Mi voluntad está al servicio del bien mayor'
        },

        {
          index: 11,
          calibration: 350,
          name: 'Aceptación',

          teaching: `La aceptación calibra en 350. Es un nivel de transformación profunda donde la persona toma RESPONSABILIDAD TOTAL por su experiencia.

En aceptación, ya no hay víctimas ni victimarios. Todo lo que te pasa, en algún nivel, lo co-creaste o lo permitiste. Esto no es culpa - es poder.

Este es el nivel del perdón verdadero. No "te perdono porque debo" sino "entiendo que todos hacemos lo mejor que podemos con nuestra consciencia actual".

La aceptación ve la perfección en la imperfección. Las cosas no tienen que cambiar para estar bien. Están bien como son, Y pueden mejorar. Ambas cosas.

Hay una paz profunda aquí que no depende de circunstancias. La paz está adentro, no afuera.`,

          signs: [
            'Tomar 100% responsabilidad por tu vida y experiencias',
            'Capacidad de perdonar genuinamente',
            'Ver eventos "negativos" como oportunidades de crecimiento',
            'No necesitas cambiar a otros para estar bien',
            'Paz que no depende de circunstancias',
            'Armonía en relaciones - menos conflictos',
            'Sensación de que todo tiene propósito'
          ],

          trap: `La trampa de la aceptación es usarla para EVITAR acción necesaria. "Acepto todo" puede volverse pasividad disfrazada de espiritualidad.

Otra trampa es confundir aceptación con APROBACIÓN. Aceptar que algo ES no significa que está bien o que no debe cambiar.`,

          exit: `La salida hacia arriba es moverse de aceptación a COMPRENSIÓN profunda. No solo "es lo que es" sino entender las leyes y patrones detrás de todo.

El shift es de aceptar a comprender.`,

          weeklyPractice: {
            title: 'Responsabilidad Total',
            duration: 'Reflexión profunda + práctica diaria',
            instructions: `Esta semana practicarás tomar responsabilidad total por todo en tu vida.

Ejercicio principal:
1. Elige una situación difícil que culpes a otros o a circunstancias
2. Pregunta: "¿Cómo co-creé esto?" (no con culpa, con curiosidad)
3. Pregunta: "¿Qué creencias o patrones míos permitieron esto?"
4. Pregunta: "¿Qué puedo aprender de esto?"
5. Pregunta: "¿Qué tengo el poder de cambiar AHORA?"

Práctica diaria:
- Cuando algo te moleste, en vez de culpar, pregunta: "¿Cuál es mi parte?"
- No para culparte, sino para recuperar tu poder.

Ejercicio de perdón:
- Elige una persona a quien guardes resentimiento
- Escribe: "Te perdono porque entiendo que hiciste lo mejor que podías con tu nivel de consciencia."
- No tienes que decírselo. Es para ti.

Reflexión: ¿Dónde recuperé poder? ¿Dónde sigo culpando externos?`
          },

          journalQuestion: '¿Qué situación he estado culpando a externos? ¿Cuál fue mi parte? ¿Qué puedo hacer ahora?',

          resource: {
            type: 'libro',
            title: 'Loving What Is',
            author: 'Byron Katie',
            note: 'Un método práctico para cuestionar pensamientos y encontrar paz'
          },

          minimumDays: 14,
          affirmation: 'Acepto completamente lo que es y creo desde ahí'
        },

        {
          index: 12,
          calibration: 400,
          name: 'Razón',

          teaching: `La razón calibra en 400. Es el nivel del intelecto desarrollado, la ciencia, y la comprensión profunda.

Aquí la persona puede manejar grandes cantidades de información y ver patrones complejos. Einstein calibraba aquí.

La razón es poderosa. Ha creado la ciencia moderna, la tecnología, la medicina. Pero tiene límites. No puede captar lo no-lineal, lo paradójico, lo espiritual.

El 400 es donde se atoran muchos académicos e intelectuales. "Si no puedo entenderlo racionalmente, no es real." Esto bloquea el acceso a niveles superiores.

La mente es excelente herramienta, mal amo. En razón, la mente es respetada pero no adorada.`,

          signs: [
            'Capacidad de pensamiento abstracto y complejo',
            'Búsqueda de verdad y comprensión',
            'Apertura a examinar tus propias creencias',
            'Menos reactividad emocional',
            'Apreciación por el conocimiento y el aprendizaje',
            'Capacidad de ver sistemas y patrones',
            'Honestidad intelectual'
          ],

          trap: `La trampa de la razón es creer que TODO puede ser entendido racionalmente. Esto cierra la puerta a la intuición, la gracia, y los estados transpersonales.

Otra trampa es el ANÁLISIS PARÁLISIS. Entender todo pero no actuar.`,

          exit: `La salida hacia arriba es reconocer los límites del intelecto y abrirse a formas de conocer no-racionales: intuición, revelación, experiencia directa.

El shift es de "entiendo" a "sé" (conocimiento directo, no conceptual).`,

          weeklyPractice: {
            title: 'Más Allá de la Mente',
            duration: '20 minutos diarios + reflexión',
            instructions: `Esta semana explorarás los límites del pensamiento.

Práctica diaria:
1. 20 minutos de meditación en silencio
2. Cuando venga un pensamiento, nota que es un pensamiento
3. Pregunta: "¿Quién es el que observa este pensamiento?"
4. Descansa en el espacio entre pensamientos

Ejercicio de intuición:
- Antes de analizar algo, pregunta a tu intuición qué siente
- Nota la respuesta que viene ANTES del análisis
- Compara después: ¿La intuición tenía algo que la razón no vio?

Cuestiona una creencia:
- Elige una creencia que tengas fuertemente
- Busca 3 razones por las que podría estar equivocada
- Nota cómo se siente cuestionar algo "seguro"

Reflexión: ¿Dónde la mente me sirvió? ¿Dónde me limitó?`
          },

          journalQuestion: '¿Qué "sé" que no podría explicar racionalmente? ¿Dónde mi mente bloquea mi intuición?',

          resource: {
            type: 'libro',
            title: 'Transcending the Levels of Consciousness',
            author: 'David Hawkins',
            note: 'Exploración profunda de cada nivel y cómo trascenderlo'
          },

          minimumDays: 14,
          affirmation: 'Mi mente es una herramienta, no mi identidad'
        },

        {
          index: 13,
          calibration: 500,
          name: 'Amor',

          teaching: `El amor calibra en 500. No amor romántico o condicional, sino amor como estado del ser. El corazón se ha abierto.

Este es un salto no-lineal. De 400 a 500 hay más distancia cualitativa que de 0 a 400. Es el comienzo de los estados verdaderamente espirituales.

En amor, todo se ve con los ojos de la compasión. Las personas no son "buenas" o "malas" - están en diferentes niveles de consciencia haciendo lo mejor que pueden.

El amor a este nivel es INCONDICIONAL. No depende de que el otro haga algo. No es "te amo si..." Es "te amo porque existes."

La mayoría de la gente experimenta 500 como estado pico - en momentos de gracia, con un recién nacido, en la naturaleza. El trabajo es estabilizarlo.`,

          signs: [
            'Compasión genuina incluso hacia personas difíciles',
            'Capacidad de ver la inocencia esencial en todos',
            'Menos juicio, más comprensión',
            'Apertura del corazón como experiencia física',
            'Deseo de servir sin necesidad de reconocimiento',
            'Gratitud profunda y frecuente',
            'Sensación de conexión con todos los seres'
          ],

          trap: `La trampa del amor es el AMOR IDIOTA - amor sin sabiduría que permite abusos o no mantiene límites necesarios.

Otra trampa es el AGOTAMIENTO por dar sin recibir o sin cuidar de ti mismo.`,

          exit: `La salida hacia arriba es de amor como HACER a amor como SER. De "amo" a "soy amor".

El shift es que el amor deja de ser algo que haces y se convierte en lo que eres.`,

          weeklyPractice: {
            title: 'Práctica del Corazón Abierto',
            duration: '15-20 minutos diarios + práctica continua',
            instructions: `Esta semana cultivarás el amor incondicional.

Meditación de amor-bondad (diaria):
1. Siéntate en quietud, mano en el corazón
2. Genera sentimiento de amor hacia ti mismo
3. Extiende ese amor a alguien querido
4. Extiende a alguien neutral
5. Extiende a alguien difícil
6. Extiende a todos los seres

Práctica durante el día:
- Con cada persona que encuentres, silentemente desea: "Que seas feliz. Que estés en paz."
- Incluso con personas que te molesten

Ejercicio especial:
- Elige una persona que te cueste amar
- Escribe 5 formas en que esa persona sufre o ha sufrido
- Nota si surge compasión al ver su sufrimiento

Reflexión: ¿Dónde pude amar más fácilmente? ¿Dónde me resistí?`
          },

          journalQuestion: '¿Qué me impide amar sin condiciones? ¿Qué necesitaría soltar?',

          resource: {
            type: 'libro',
            title: 'The Book of Joy',
            author: 'Dalai Lama & Desmond Tutu',
            note: 'Dos maestros del amor incondicional comparten su sabiduría'
          },

          minimumDays: 21,
          affirmation: 'Soy amor incondicional en forma humana'
        },

        {
          index: 14,
          calibration: 540,
          name: 'Alegría',

          teaching: `La alegría calibra en 540. No alegría por algo - alegría sin causa. Es un estado de gracia donde la felicidad emerge del simple hecho de existir.

En alegría, hay una apreciación estética de toda la creación. La belleza está en todas partes. La vida es milagrosa.

Este es el territorio de los santos y sanadores avanzados. La presencia de alguien en 540 puede elevar a otros sin palabras.

La alegría a este nivel tiene cualidad de rendición. No estás creando la alegría - estás PERMITIENDO que la alegría que ya está ahí se exprese a través de ti.

Es raro estabilizarse aquí. Requiere haber trascendido no solo los estados negativos, sino también el apego a estados positivos.`,

          signs: [
            'Alegría sin causa externa',
            'Apreciación constante de la belleza en todo',
            'Gratitud como estado permanente, no práctica',
            'Paciencia infinita con personas y procesos',
            'Compasión universal que incluye a todos los seres',
            'Sensación de gracia - que todo es dado',
            'Sanación que ocurre naturalmente alrededor tuyo'
          ],

          trap: `La trampa es APEGARSE a la alegría. Querer mantenerla puede hacerla huir. La alegría viene de soltar, incluso el soltar.

Otra trampa es usar la alegría para EVITAR ver sufrimiento legítimo.`,

          exit: `La salida hacia arriba es rendirse aún más profundamente, hasta que incluso la alegría se suelta en paz absoluta.`,

          weeklyPractice: {
            title: 'Cultivar la Gratitud',
            duration: 'Práctica continua + 15 min diarios',
            instructions: `Esta semana te sumergirás en gratitud como portal a la alegría.

Práctica de gratitud profunda (diaria):
1. Por la mañana, antes de levantarte, encuentra 10 cosas por las que estar agradecido
2. No solo enumerar - SENTIR la gratitud en el cuerpo
3. Incluye cosas obvias Y cosas que normalmente ignorarías

Durante el día:
- Cada hora, pausa y encuentra algo por lo que estar agradecido en ese momento
- Especialmente cuando algo "malo" pase: busca el regalo

Práctica de asombro:
- Dedica 15 minutos a observar algo ordinario con ojos de asombro
- Una flor, el cielo, tu propia mano
- Mira como si fuera la primera vez

Reflexión: ¿Cuándo surgió alegría sin causa? ¿Qué estaba pasando?`
          },

          journalQuestion: '¿Qué sería agradecer todo - incluso lo difícil? ¿Cómo cambiaría mi vida?',

          resource: {
            type: 'libro',
            title: 'A Return to Love',
            author: 'Marianne Williamson',
            note: 'Un Curso de Milagros hecho accesible - sobre vivir desde el amor'
          },

          minimumDays: 21,
          affirmation: 'Permito que la alegría infinita fluya a través de mí'
        },

        {
          index: 15,
          calibration: 600,
          name: 'Paz',

          teaching: `La paz calibra en 600. Es el territorio de la iluminación parcial, donde la experiencia ordinaria se transforma en extraordinaria.

En paz, no hay "hacedor". Las cosas pasan, pero no hay sensación de que "yo" las esté haciendo. El ego se ha vuelto transparente.

Este estado se describe como "iluminación" en muchas tradiciones. La persona sigue funcionando en el mundo pero ya no está identificada con la forma.

La paz a este nivel es imperturbable. No es que no pasen cosas difíciles - es que no alteran el estado fundamental. Hay una quietud de fondo constante.

Se alcanza por gracia más que por esfuerzo. Toda la práctica espiritual prepara el terreno, pero el salto final es un regalo.`,

          signs: [
            'Paz que no depende de nada externo',
            'Sensación de que el ego es transparente o ausente',
            'Las cosas pasan sin sensación de "yo" haciéndolas',
            'Silencio interior permanente',
            'No hay conflicto interno',
            'Tiempo parece detenerse o ser irrelevante',
            'Otros se sienten en paz en tu presencia'
          ],

          trap: `A este nivel hay pocas trampas porque la mayoría del ego se ha disuelto. La única sería creer que "llegaste" - incluso eso es ego.`,

          exit: `La salida final es hacia la iluminación completa - pero esto ya no es "salida" en el sentido ordinario. Es desaparecer en lo absoluto.`,

          weeklyPractice: {
            title: 'Rendición Profunda',
            duration: 'Práctica extendida de silencio',
            instructions: `A este nivel, las prácticas son simples porque lo complejo ya se soltó.

Silencio extendido:
- Dedica tiempo esta semana a silencio profundo
- No meditación con técnica - solo silencio
- Permite que todo sea como es
- No intentes cambiar nada, incluido tu estado

Auto-indagación:
- En momentos de quietud, pregunta: "¿Quién soy yo?"
- No busques respuesta mental
- Descansa en el no-saber

Rendición:
- Ofrece cada momento a lo Divino, como quieras concebirlo
- "Sea Tu voluntad, no la mía"
- Nota la paz que viene de no tener que controlar nada`
          },

          journalQuestion: '¿Quién soy yo más allá de todo lo que creo que soy?',

          resource: {
            type: 'libro',
            title: 'I Am That',
            author: 'Nisargadatta Maharaj',
            note: 'Diálogos con un maestro iluminado sobre la naturaleza del ser'
          },

          minimumDays: 30,
          affirmation: 'Soy la paz que sobrepasa todo entendimiento'
        },

        {
          index: 16,
          calibration: 700,
          name: 'Iluminación',

          teaching: `La iluminación calibra de 700 a 1000. Es lo inefable. El intento de describirlo ya lo reduce.

Aquí no hay persona que esté iluminada. La persona se ha disuelto en la Consciencia que siempre fue.

Se dice que solo unas pocas docenas de personas en la historia han estabilizado este nivel: Buda, Jesús, Krishna, ciertos maestros.

No hay práctica que te "lleve" aquí. La iluminación no es logro - es reconocimiento de lo que siempre fuiste. El buscador desaparece, y lo que queda es lo que siempre estuvo.

Si estás leyendo esto, probablemente no estás aquí todavía. Y eso está perfectamente bien. Cada nivel es completo en sí mismo. El viaje ES el destino.`,

          signs: [
            'No hay descripción posible desde adentro',
            'No hay "alguien" experimentando nada',
            'Unidad absoluta - sin separación',
            'Amor infinito, consciencia infinita',
            'El tiempo, espacio, y causación se revelan como ilusorios',
            'Paz que sobrepasa todo entendimiento',
            'Todo es percibido como perfecto exactamente como es'
          ],

          trap: `No hay trampa porque no hay nadie que pueda estar atrapado.`,

          exit: `No hay salida porque no hay entrada. Esto es lo que siempre fue.`,

          weeklyPractice: {
            title: 'Estar Presente',
            duration: 'Siempre',
            instructions: `A este nivel, no hay práctica ni practicante. Solo hay lo que es.

Si sientes llamado a algo, es estar presente. Simplemente estar. Ser testigo de lo que es.

No hay nada que hacer. Nada que lograr. Ningún lugar a donde ir.

Solo esto. Solo ahora. Solo consciencia consciente de sí misma.

Om.`
          },

          journalQuestion: 'Esta pregunta ya no tiene sentido, y eso está bien.',

          resource: {
            type: 'libro',
            title: 'Be As You Are',
            author: 'Ramana Maharshi (ed. David Godman)',
            note: 'Enseñanzas del sabio de Arunachala sobre el ser verdadero'
          },

          minimumDays: null,
          affirmation: 'Soy lo que siempre fui y siempre seré'
        }
      ]
    },
    {
      id: 'maslow',
      name: 'Pirámide de Necesidades',
      author: 'Abraham Maslow',
      icon: '🏔️',
      color: '#10B981',
      description: 'Asciende desde las necesidades básicas hasta la autorrealización',
      fullDescription: `La Pirámide de Maslow describe la jerarquía de necesidades humanas. No puedes enfocarte en autorrealización si tus necesidades básicas no están cubiertas.

La clave es identificar en qué nivel estás ahora mismo y trabajar conscientemente en satisfacer esas necesidades antes de subir al siguiente.

Maslow descubrió que solo el 2% de las personas alcanzan la autorrealización. Este camino te guía paso a paso hasta allí y más allá: la trascendencia.`,
      duration: '8 semanas',
      difficulty: 'Intermedio',
      hasCalibration: true,
      calibrationPrompt: `Eres un experto en la Jerarquía de Necesidades de Abraham Maslow. Tu tarea es analizar a esta persona basándote en TODO lo que conoces de ella a través de nuestras conversaciones.

ESCALA DE NIVELES (del 0 al 5):
0: Fisiológicas - Necesidades básicas: sueño, alimentación, ejercicio, salud física
1: Seguridad - Estabilidad económica, hogar, salud, empleo estable, seguridad emocional
2: Pertenencia - Amor, amistad, intimidad, familia, conexión social, comunidad
3: Estima - Reconocimiento, respeto, logros, confianza, autoestima
4: Autorrealización - Expresión del potencial único, creatividad, propósito, crecimiento
5: Trascendencia - Servicio a otros, conexión espiritual, dejar legado, contribuir al mundo

ANALIZA considerando:
- ¿Tiene cubiertas sus necesidades básicas (sueño, alimentación, salud)?
- ¿Tiene estabilidad financiera y emocional?
- ¿Tiene relaciones significativas y sentido de pertenencia?
- ¿Se siente valorado y tiene autoconfianza?
- ¿Está expresando su potencial único?
- ¿Busca trascender y servir a algo mayor?

El nivel donde la persona tiene CARENCIAS activas es donde debe enfocarse. No se puede subir sosteniblemente si hay huecos abajo.

RESPONDE EXACTAMENTE con este formato (es crucial para el parsing):
===CALIBRATION_RESULT===
LEVEL: [número del 0 al 5]
NAME: [nombre del nivel]
CONFIDENCE: [alta/media/baja]
===END_CALIBRATION===

Seguido de una breve explicación de por qué determinaste ese nivel, incluyendo qué necesidades están cubiertas y cuáles requieren atención.`,
      levels: [
        { level: 1, name: 'Fisiológicas', practice: 'Audita tu sueño, nutrición, ejercicio e hidratación. Mejora UNO hoy', affirmation: 'Mi cuerpo es mi templo sagrado' },
        { level: 2, name: 'Seguridad', practice: 'Revisa tus finanzas, salud, hogar. ¿Qué genera inseguridad? Crea un plan', affirmation: 'Estoy seguro y protegido por la vida' },
        { level: 3, name: 'Pertenencia', practice: 'Contacta a alguien que aprecias. Expresa genuinamente tu afecto', affirmation: 'Pertenezco, soy amado y valioso' },
        { level: 4, name: 'Estima', practice: 'Lista 5 logros recientes. Celébralos conscientemente', affirmation: 'Soy valioso, capaz y merecedor' },
        { level: 5, name: 'Autorrealización', practice: '¿Qué talento único tienes? Exprésalo hoy de alguna forma', affirmation: 'Expreso mi potencial único cada día' },
        { level: 6, name: 'Trascendencia', practice: '¿Cómo puedes servir a algo mayor que tú hoy?', affirmation: 'Mi vida tiene propósito cósmico' }
      ]
    },
    {
      id: 'acim',
      name: 'Un Curso de Milagros',
      author: 'Helen Schucman',
      icon: '✨',
      color: '#EC4899',
      description: 'Transforma la percepción del miedo al amor a través del perdón',
      fullDescription: `Un Curso de Milagros es un sistema de pensamiento espiritual que enseña que solo hay dos emociones: amor y miedo. Todo lo demás son variaciones.

El perdón es la herramienta central. No es perdonar porque el otro hizo algo malo, sino reconocer que lo que pensamos que pasó era una ilusión basada en nuestra percepción.

El objetivo es experimentar "milagros" - cambios de percepción del miedo al amor - en tu vida diaria.`,
      duration: '52 semanas',
      difficulty: 'Profundo',
      hasCalibration: false,
      levels: [
        { level: 1, name: 'Reconocer la ilusión', practice: 'Algo que te molestó hoy: pregunta "¿Y si esto no es lo que parece?"', affirmation: 'Nada real puede ser amenazado' },
        { level: 2, name: 'Elegir de nuevo', practice: 'Ante cada situación, pausa y elige: ¿miedo o amor?', affirmation: 'Puedo elegir ver esto de otra manera' },
        { level: 3, name: 'Perdón verdadero', practice: 'Perdona a alguien viendo su inocencia esencial, más allá de sus actos', affirmation: 'Te veo como Dios te creó' },
        { level: 4, name: 'El instante santo', practice: 'Detente completamente. Entrega la situación y escucha la guía', affirmation: 'No sé qué significa nada por mi cuenta' },
        { level: 5, name: 'Extensión del amor', practice: 'Da activamente lo que quieres recibir hoy', affirmation: 'Dar y recibir son lo mismo' },
        { level: 6, name: 'Visión de Cristo', practice: 'Mira a alguien difícil y ve la luz detrás de la forma', affirmation: 'Veo la luz de Dios en todos' },
        { level: 7, name: 'Paz de Dios', practice: 'Permanece en paz pase lo que pase. Es tu única función', affirmation: 'La paz de Dios es mi única meta' }
      ]
    },
    {
      id: 'jung',
      name: 'Individuación',
      author: 'Carl Jung',
      icon: '🌓',
      color: '#6366F1',
      description: 'Integra tu sombra y arquetipos hacia la totalidad del Ser',
      fullDescription: `La Individuación de Jung es el proceso de integrar las partes inconscientes de tu psique para llegar a ser quien realmente eres.

La Sombra contiene todo lo que has reprimido: cualidades que juzgas negativas pero que tienen poder cuando se integran. El Anima/Animus es tu contraparte psíquica del sexo opuesto.

El objetivo final es el Self: la totalidad de quien eres, consciente e inconsciente unificados.`,
      duration: '16 semanas',
      difficulty: 'Avanzado',
      hasCalibration: false,
      levels: [
        { level: 1, name: 'Encuentro con la Sombra', practice: 'Lo que más te molesta de otros, ¿dónde existe en ti? Escríbelo sin juzgar', affirmation: 'Abrazo todas las partes de mí' },
        { level: 2, name: 'Integración de la Sombra', practice: 'Un aspecto "oscuro" tuyo: ¿qué regalo esconde? Encuéntralo', affirmation: 'Mi sombra es mi maestra más sabia' },
        { level: 3, name: 'Anima/Animus', practice: 'Conecta con tu energía femenina (receptiva) o masculina (activa) menos desarrollada', affirmation: 'Contengo todas las energías en equilibrio' },
        { level: 4, name: 'La Persona', practice: 'Identifica una "máscara" social que uses. Quítatela conscientemente hoy', affirmation: 'Soy auténtico en cada momento' },
        { level: 5, name: 'El Self', practice: 'Medita en el centro de ti, más allá del ego. ¿Quién observa?', affirmation: 'Mi centro es inquebrantable y eterno' },
        { level: 6, name: 'Totalidad', practice: 'Vive un día completo desde la integración. Sombra, luz, todo es tú', affirmation: 'Soy la totalidad de quien soy' }
      ]
    },
    {
      id: 'tolle',
      name: 'Presencia Consciente',
      author: 'Eckhart Tolle',
      icon: '🕉️',
      color: '#14B8A6',
      description: 'Despierta al poder del ahora y disuelve el ego',
      fullDescription: `Eckhart Tolle enseña que el único momento real es el Ahora. El sufrimiento viene de resistir el presente, ya sea añorando el pasado o temiendo el futuro.

El "cuerpo del dolor" es la acumulación de sufrimiento pasado que se activa buscando más dolor. Observarlo es el primer paso para disolverlo.

La iluminación no es algo que logras, es tu estado natural cuando dejas de identificarte con la mente.`,
      duration: '8 semanas',
      difficulty: 'Fundamental',
      hasCalibration: false,
      levels: [
        { level: 1, name: 'Observar la mente', practice: 'Por 5 min, observa tus pensamientos como nubes. No te enganches', affirmation: 'No soy mis pensamientos' },
        { level: 2, name: 'El cuerpo interno', practice: 'Siente la energía viva dentro de tus manos, pies, todo el cuerpo', affirmation: 'Estoy vivo y presente ahora mismo' },
        { level: 3, name: 'Disolución del ego', practice: 'Cuando el ego reaccione (ofensa, defensa), observa sin actuar', affirmation: 'Mi esencia está más allá del ego' },
        { level: 4, name: 'Aceptación radical', practice: 'Di "sí" internamente a este momento, exactamente como es', affirmation: 'Este momento es exactamente perfecto' },
        { level: 5, name: 'Espaciosidad', practice: 'Nota el espacio entre pensamientos. Descansa ahí', affirmation: 'Soy el espacio donde todo aparece' },
        { level: 6, name: 'Presencia pura', practice: 'Vive todo el día desde presencia. Vuelve al Ahora constantemente', affirmation: 'Solo existe el eterno Ahora' }
      ]
    },
    {
      id: 'stoic',
      name: 'Estoicismo',
      author: 'Marco Aurelio, Séneca, Epicteto',
      icon: '🏛️',
      color: '#78716C',
      description: 'Domina tu mente y acepta lo que no puedes controlar',
      fullDescription: `El Estoicismo es una filosofía práctica de hace 2000 años, usada por emperadores y esclavos por igual.

Su principio central: no puedes controlar lo que pasa, pero siempre puedes controlar tu respuesta. La tranquilidad viene de aceptar esta distinción.

Los estoicos practicaban la visualización negativa (imaginar lo peor) no para ser pesimistas, sino para apreciar lo que tienen y estar preparados.`,
      duration: '8 semanas',
      difficulty: 'Práctico',
      hasCalibration: false,
      levels: [
        { level: 1, name: 'Dicotomía del control', practice: 'Lista lo que te preocupa. Separa: ¿qué controlas y qué no?', affirmation: 'Me enfoco solo en lo que depende de mí' },
        { level: 2, name: 'Premeditatio malorum', practice: 'Visualiza que sale mal algo que temes. ¿Sobrevivirías? Sí', affirmation: 'Estoy preparado para cualquier adversidad' },
        { level: 3, name: 'Memento mori', practice: 'Vive hoy como si fuera el último. ¿Qué importa realmente?', affirmation: 'Cada día es un regalo precioso' },
        { level: 4, name: 'Amor fati', practice: 'Algo "malo" que pasó: encuentra el regalo escondido. Ámalo', affirmation: 'Amo mi destino exactamente como es' },
        { level: 5, name: 'Virtud práctica', practice: 'Elige una virtud (sabiduría, justicia, coraje, templanza) y practícala conscientemente', affirmation: 'Mi carácter es mi verdadero destino' },
        { level: 6, name: 'Ciudadano del cosmos', practice: '¿Cómo puedes servir a la humanidad hoy desde tu lugar?', affirmation: 'Sirvo al bien de todos los seres' }
      ]
    },
    {
      id: 'buddhism',
      name: 'Noble Óctuple Sendero',
      author: 'Buda',
      icon: '☸️',
      color: '#F59E0B',
      description: 'El camino medio hacia el fin del sufrimiento',
      fullDescription: `Las Cuatro Nobles Verdades del Buda: 1) Existe el sufrimiento (dukkha), 2) Tiene una causa (apego), 3) Puede cesar, 4) El camino es el Óctuple Sendero.

El camino se divide en tres entrenamientos: Sabiduría (visión e intención), Ética (habla, acción, sustento), y Meditación (esfuerzo, atención, concentración).

No es un camino lineal sino una rueda: todos los aspectos se practican simultáneamente.`,
      duration: '12 semanas',
      difficulty: 'Profundo',
      hasCalibration: false,
      levels: [
        { level: 1, name: 'Visión correcta', practice: 'Observa algo que te haga sufrir. ¿Cuál es el apego detrás?', affirmation: 'Veo la realidad tal como es' },
        { level: 2, name: 'Intención correcta', practice: 'Antes de actuar, pausa: ¿mi intención es bondadosa?', affirmation: 'Mis intenciones son puras y benévolas' },
        { level: 3, name: 'Habla correcta', practice: 'Hoy, solo palabras verdaderas, amables y útiles', affirmation: 'Mis palabras crean paz y armonía' },
        { level: 4, name: 'Acción correcta', practice: 'Actúa hoy sin dañar a ningún ser, incluyéndote', affirmation: 'Mis acciones benefician a todos' },
        { level: 5, name: 'Sustento correcto', practice: '¿Tu trabajo daña o beneficia? ¿Cómo mejorarlo?', affirmation: 'Mi trabajo sirve al mundo' },
        { level: 6, name: 'Esfuerzo correcto', practice: 'Cultiva un estado mental positivo. Suelta uno negativo', affirmation: 'Mi esfuerzo es sabio y constante' },
        { level: 7, name: 'Atención correcta', practice: '10 min de mindfulness: cuerpo, sensaciones, mente, fenómenos', affirmation: 'Estoy plenamente presente ahora' },
        { level: 8, name: 'Concentración correcta', practice: '20 min de meditación enfocada en la respiración', affirmation: 'Mi mente está unificada y en paz' }
      ]
    },
    {
      id: 'toltec',
      name: 'Los Cuatro Acuerdos',
      author: 'Don Miguel Ruiz',
      icon: '🦅',
      color: '#DC2626',
      description: 'Sabiduría tolteca para la libertad personal',
      fullDescription: `Los Cuatro Acuerdos son un código de conducta basado en la sabiduría tolteca ancestral.

El concepto central es que vivimos en un "sueño" de la sociedad, lleno de acuerdos que aceptamos sin cuestionar. Estos acuerdos limitan nuestra libertad.

Los Cuatro Acuerdos son nuevos acuerdos que puedes hacer contigo mismo para liberarte del sueño colectivo y vivir auténticamente.`,
      duration: '4 semanas',
      difficulty: 'Accesible',
      hasCalibration: false,
      levels: [
        { level: 1, name: 'Sé impecable con tus palabras', practice: 'Hoy, CERO quejas, chismes o palabras contra ti mismo', affirmation: 'Mis palabras crean mi realidad' },
        { level: 2, name: 'No te tomes nada personal', practice: 'Algo que alguien dijo/hizo: recuerda que no es sobre ti', affirmation: 'Soy inmune a las opiniones de otros' },
        { level: 3, name: 'No hagas suposiciones', practice: 'Algo que asumiste sobre alguien: pregunta directamente', affirmation: 'Pregunto en lugar de asumir' },
        { level: 4, name: 'Haz siempre lo máximo', practice: 'En todo lo que hagas hoy, da tu 100% (que varía según el día)', affirmation: 'Mi mejor esfuerzo siempre es suficiente' }
      ]
    },
    {
      id: 'wilber',
      name: 'Espiral Dinámica',
      author: 'Ken Wilber / Clare Graves',
      icon: '🌀',
      color: '#7C3AED',
      description: 'Evolución de la consciencia a través de los niveles de desarrollo',
      fullDescription: `La Espiral Dinámica mapea la evolución de la consciencia humana a través de niveles, cada uno con su visión del mundo, valores y forma de operar.

Cada nivel trasciende e incluye al anterior. No hay niveles "mejores", cada uno es apropiado para ciertas condiciones de vida.

Los niveles de "segundo orden" (Amarillo y Turquesa) pueden ver y apreciar todos los niveles anteriores sin juzgar.`,
      duration: '16 semanas',
      difficulty: 'Avanzado',
      hasCalibration: true,
      calibrationPrompt: `Eres un experto en Espiral Dinámica (Spiral Dynamics) de Clare Graves y Ken Wilber. Tu tarea es analizar a esta persona basándote en TODO lo que conoces de ella a través de nuestras conversaciones.

ESCALA DE NIVELES (del 0 al 7):
0: BEIGE - Supervivencia pura, instintos, necesidades básicas
1: PÚRPURA - Tribal, mágico, ancestros, rituales, pertenencia al clan
2: ROJO - Poder, dominación, impulsividad, ego, "yo primero"
3: AZUL - Orden, reglas, autoridad, propósito, sacrificio por la causa
4: NARANJA - Logro, éxito, ciencia, racionalidad, competencia, progreso
5: VERDE - Comunidad, igualdad, consenso, ecología, pluralismo, sensibilidad
6: AMARILLO - Sistémico, integral, flexibilidad, complejidad, autonomía funcional
7: TURQUESA - Holístico, global, espiritual, consciencia planetaria, unidad

INDICADORES CLAVE por nivel:
- BEIGE: Foco en supervivencia inmediata
- PÚRPURA: Lealtad al grupo, tradiciones, supersticiones
- ROJO: Impulsividad, dominación, gratificación inmediata
- AZUL: Deber, disciplina, "correcto vs incorrecto", estructura
- NARANJA: Metas, métricas, optimización, éxito material
- VERDE: Inclusión, emociones, anti-jerarquía, causas sociales
- AMARILLO: Ve valor en todos los niveles, piensa en sistemas
- TURQUESA: Consciencia global, espiritualidad integradora

ANALIZA considerando:
- ¿Cuáles son sus valores principales expresados?
- ¿Cómo toma decisiones? ¿Qué prioriza?
- ¿Cómo ve a los demás y las diferencias?
- ¿Qué tipo de problemas le preocupan?
- ¿Cómo maneja la complejidad y la ambigüedad?

NOTA: La mayoría de personas operan principalmente desde 1-2 niveles pero tienen acceso a otros en diferentes contextos.

RESPONDE EXACTAMENTE con este formato (es crucial para el parsing):
===CALIBRATION_RESULT===
LEVEL: [número del 0 al 7]
NAME: [nombre y color del nivel]
CONFIDENCE: [alta/media/baja]
===END_CALIBRATION===

Seguido de una breve explicación que incluya el nivel predominante y niveles secundarios que observes.`,
      levels: [
        { level: 1, name: 'Beige - Supervivencia', practice: 'Honra tus instintos básicos conscientemente hoy', affirmation: 'Mi cuerpo sabe sobrevivir' },
        { level: 2, name: 'Púrpura - Tribu', practice: 'Conecta con tus ancestros o comunidad. Honra tu linaje', affirmation: 'Pertenezco a algo mayor que yo' },
        { level: 3, name: 'Rojo - Poder', practice: 'Expresa tu poder personal de forma ética y constructiva', affirmation: 'Mi poder sirve al bien' },
        { level: 4, name: 'Azul - Orden', practice: 'Encuentra propósito en la disciplina y estructura hoy', affirmation: 'El orden crea libertad verdadera' },
        { level: 5, name: 'Naranja - Logro', practice: 'Persigue una meta con excelencia e integridad', affirmation: 'Mi éxito beneficia a todos' },
        { level: 6, name: 'Verde - Comunidad', practice: 'Cultiva empatía genuina con alguien diferente a ti', affirmation: 'Todos somos igualmente valiosos' },
        { level: 7, name: 'Amarillo - Integral', practice: 'Observa un conflicto desde TODAS las perspectivas', affirmation: 'Veo y aprecio el sistema completo' },
        { level: 8, name: 'Turquesa - Holístico', practice: 'Actúa hoy desde la consciencia de unidad global', affirmation: 'Soy una célula de Gaia' }
      ]
    },
    {
      id: 'kabbalah',
      name: 'Árbol de la Vida',
      author: 'Tradición Cabalística',
      icon: '🌳',
      color: '#3B82F6',
      description: 'Asciende por las sefirot hacia la unión con lo Divino',
      fullDescription: `El Árbol de la Vida es el mapa de la Creación según la Cábala. Las 10 sefirot (emanaciones) representan aspectos de lo Divino y de nuestra propia alma.

El camino espiritual es ascender desde Malkuth (el mundo material) hasta Kether (la corona, unión con Dios), pasando por diferentes estados de consciencia.

Cada sefirah tiene una lección y una energía específica que integrar.`,
      duration: '20 semanas',
      difficulty: 'Místico',
      hasCalibration: false,
      levels: [
        { level: 1, name: 'Malkuth - Reino', practice: 'Encuentra lo sagrado en algo completamente material hoy', affirmation: 'Lo divino está presente en la materia' },
        { level: 2, name: 'Yesod - Fundamento', practice: 'Recuerda un sueño y busca su mensaje simbólico', affirmation: 'Mi fundamento es sólido e inquebrantable' },
        { level: 3, name: 'Hod - Gloria', practice: 'Estudia algo que expanda tu mente. El intelecto como ofrenda', affirmation: 'Mi mente sirve a lo divino' },
        { level: 4, name: 'Netzach - Victoria', practice: 'Expresa una emoción artísticamente: escribe, pinta, baila', affirmation: 'Mis emociones son sagradas guías' },
        { level: 5, name: 'Tiphareth - Belleza', practice: 'Medita en tu corazón como centro del Árbol, conectando arriba y abajo', affirmation: 'Mi corazón es el centro del Universo' },
        { level: 6, name: 'Geburah - Severidad', practice: 'Establece un límite necesario con amor pero firmeza', affirmation: 'El límite sagrado crea la forma' },
        { level: 7, name: 'Chesed - Misericordia', practice: 'Da generosamente sin esperar nada a cambio', affirmation: 'Mi amor no tiene límites ni condiciones' },
        { level: 8, name: 'Binah - Entendimiento', practice: 'Recibe en silencio. Escucha más de lo que hablas', affirmation: 'Comprendo más allá de las palabras' },
        { level: 9, name: 'Chokmah - Sabiduría', practice: 'Accede a la sabiduría primordial en meditación profunda', affirmation: 'La sabiduría infinita fluye a través de mí' },
        { level: 10, name: 'Kether - Corona', practice: 'Medita en la unidad absoluta. Disuelve toda separación', affirmation: 'Soy uno con la Fuente de todo' }
      ]
    }
  ];

  const activePath = allPaths.find(p => p.id === consciousness.activePath);
  const currentLevel = consciousness.currentLevel || 0;
  const startingLevel = consciousness.startingLevel || 0;
  const effectiveLevel = startingLevel + currentLevel;
  const xpForNextLevel = 100 * (currentLevel + 1);
  const currentXP = consciousness.currentXP || 0;
  const isPaused = consciousness.pathPaused || false;

  // Start path with optional calibration
  const startPath = (pathId, startLevel = 0) => {
    console.log("startPath called with:", pathId, startLevel);
    const path = allPaths.find(p => p.id === pathId);
    setData(prev => ({
      ...prev,
      consciousness: {
        ...prev.consciousness,
        activePath: pathId,
        pathPaused: false,
        startingLevel: startLevel,
        currentLevel: 0,
        currentXP: 0,
        pathStartDate: today,
        practices: prev.consciousness?.practices || []
      }
    }));
    setShowPathDetail(false);
    setShowOnboarding(false);
    setShowCalibration(false);
    setCalibrationAnswers({});
    showToast(`🌟 Comenzaste: ${path.name}`);
    setView('journey');
  };

  // Pause path
  const pausePath = () => {
    setData(prev => ({
      ...prev,
      consciousness: {
        ...prev.consciousness,
        pathPaused: true,
        pausedDate: today
      }
    }));
    setShowPauseConfirm(false);
    showToast('⏸️ Camino pausado');
  };

  // Resume path
  const resumePath = () => {
    setData(prev => ({
      ...prev,
      consciousness: {
        ...prev.consciousness,
        pathPaused: false
      }
    }));
    showToast('▶️ Camino reanudado');
  };

  // Abandon path
  const abandonPath = () => {
    setData(prev => ({
      ...prev,
      consciousness: {
        ...prev.consciousness,
        activePath: null,
        pathPaused: false,
        startingLevel: 0,
        currentLevel: 0,
        currentXP: 0
      }
    }));
    setShowPauseConfirm(false);
    setView('paths');
    showToast('Camino abandonado');
  };

  // Complete path
  const completePath = () => {
    setData(prev => ({
      ...prev,
      consciousness: {
        ...prev.consciousness,
        activePath: null,
        pathPaused: false,
        completedPaths: [...(prev.consciousness?.completedPaths || []), {
          id: consciousness.activePath,
          completedDate: today,
          finalLevel: effectiveLevel,
          startingLevel: startingLevel
        }],
        totalXP: (prev.consciousness?.totalXP || 0) + currentXP,
        level: (prev.consciousness?.level || 1) + 1
      }
    }));
    showToast('🎉 ¡Camino completado!');
  };

  // Log practice
  const logPractice = (practice, notes = '') => {
    const xpGained = 25;
    const newXP = currentXP + xpGained;
    const levelUp = newXP >= xpForNextLevel;

    setData(prev => ({
      ...prev,
      consciousness: {
        ...prev.consciousness,
        currentXP: levelUp ? newXP - xpForNextLevel : newXP,
        currentLevel: levelUp ? currentLevel + 1 : currentLevel,
        practices: [...(prev.consciousness?.practices || []), {
          id: Date.now(),
          date: today,
          pathId: consciousness.activePath,
          levelName: activePath?.levels[effectiveLevel]?.name,
          practice,
          notes,
          xp: xpGained
        }]
      }
    }));

    setShowPracticeModal(false);
    showToast(levelUp ? '⬆️ ¡Subiste de nivel!' : `+${xpGained} XP`);
  };

  // Add insight
  const addInsight = (text) => {
    setData(prev => ({
      ...prev,
      consciousness: {
        ...prev.consciousness,
        insights: [...(prev.consciousness?.insights || []), {
          id: Date.now(),
          date: today,
          text,
          pathId: consciousness.activePath
        }]
      }
    }));
    showToast('💡 Insight guardado');
  };

  // Save gratitude
  const saveGratitude = () => {
    const items = gratitudeInputs.filter(g => g.trim());
    if (items.length === 0) return;
    setData(prev => ({
      ...prev,
      consciousness: {
        ...prev.consciousness,
        gratitude: { ...prev.consciousness?.gratitude, [today]: items }
      }
    }));
    setGratitudeInputs(['', '', '']);
    showToast('🙏 Gratitud guardada');
  };

  // Calculate streaks
  const practiceStreak = (() => {
    let streak = 0;
    let checkDate = today;
    while (true) {
      const hasPractice = consciousness.practices?.some(p => p.date === checkDate);
      if (!hasPractice && checkDate !== today) break;
      if (hasPractice) streak++;
      const d = new Date(checkDate);
      d.setDate(d.getDate() - 1);
      checkDate = d.toISOString().split('T')[0];
    }
    return streak;
  })();

  const gratitudeStreak = (() => {
    let streak = 0;
    let checkDate = today;
    while (consciousness.gratitude?.[checkDate]?.length > 0) {
      streak++;
      const d = new Date(checkDate);
      d.setDate(d.getDate() - 1);
      checkDate = d.toISOString().split('T')[0];
    }
    return streak;
  })();

  // ========== RENDER: HOME VIEW ==========
  const renderHomeView = () => {
    const todayPractice = consciousness.practices?.find(p => p.date === today);

    return (
      <div className="space-y-4 pb-24">
        {/* Header */}
        <AnimatedMount>
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-1">🧘 Conciencia</h1>
            <p className="text-white/50 text-sm">Tu viaje de transformación interior</p>
          </div>
        </AnimatedMount>

        {/* Level Card */}
        <AnimatedMount delay={25}>
          <Card className="bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border-violet-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/50">Nivel de Consciencia</p>
                <p className="text-4xl font-bold">{consciousness.level || 1}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/50">XP Total</p>
                <p className="text-2xl font-bold text-violet-400">{consciousness.totalXP || 0}</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <Sparkles className="w-7 h-7" />
              </div>
            </div>
            {(practiceStreak > 0 || gratitudeStreak > 0) && (
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-4">
                {practiceStreak > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="text-sm">{practiceStreak}d práctica</span>
                  </div>
                )}
                {gratitudeStreak > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-pink-400" />
                    <span className="text-sm">{gratitudeStreak}d gratitud</span>
                  </div>
                )}
              </div>
            )}
          </Card>
        </AnimatedMount>

        {/* Active Path or Start */}
        <AnimatedMount delay={50}>
          {activePath && !isPaused ? (
            <Card className="border-2" style={{ borderColor: activePath.color + '50', background: activePath.color + '10' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{activePath.icon}</div>
                  <div>
                    <p className="font-bold">{activePath.name}</p>
                    <p className="text-xs text-white/50">Nivel {effectiveLevel + 1}: {activePath.levels[effectiveLevel]?.name}</p>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progreso al siguiente nivel</span>
                  <span>{currentXP}/{xpForNextLevel} XP</span>
                </div>
                <ProgressBar value={currentXP} max={xpForNextLevel} color="bg-gradient-to-r from-violet-500 to-fuchsia-500" />
              </div>

              {todayPractice ? (
                <div className="flex items-center gap-2 p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
                  <Check className="w-5 h-5" />
                  <span className="text-sm font-medium">Práctica completada hoy</span>
                </div>
              ) : (
                <button onClick={() => setShowPracticeModal(true)} className="w-full py-3 rounded-xl font-medium text-white" style={{ backgroundColor: activePath.color }}>
                  Hacer práctica del día
                </button>
              )}

              <button onClick={() => setView('journey')} className="w-full mt-2 py-2 text-sm text-white/60 hover:text-white">
                Ver camino completo →
              </button>
            </Card>
          ) : isPaused ? (
            <Card className="border border-amber-500/30 bg-amber-500/10">
              <div className="flex items-center gap-3 mb-3">
                <Pause className="w-6 h-6 text-amber-400" />
                <div>
                  <p className="font-medium">Camino en pausa</p>
                  <p className="text-xs text-white/50">{activePath?.name}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={resumePath} className="flex-1 py-2 bg-violet-500 rounded-xl font-medium">
                  Reanudar
                </button>
                <button onClick={() => setView('paths')} className="px-4 py-2 bg-white/10 rounded-xl">
                  Cambiar
                </button>
              </div>
            </Card>
          ) : (
            <Card onClick={() => setView('paths')} className="border border-dashed border-violet-500/50 hover:bg-violet-500/10 cursor-pointer transition-all">
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-3">
                  <Plus className="w-6 h-6 text-violet-400" />
                </div>
                <p className="font-medium">Elegir un camino</p>
                <p className="text-xs text-white/50 mt-1">10 sistemas de transformación disponibles</p>
              </div>
            </Card>
          )}
        </AnimatedMount>

        {/* Daily Gratitude */}
        <AnimatedMount delay={75}>
          <Card>
            <div className="flex items-center justify-between mb-3">
              <p className="font-medium flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-400" /> Gratitud del día
              </p>
              {todayGratitude.length > 0 && <Check className="w-5 h-5 text-emerald-400" />}
            </div>

            {todayGratitude.length > 0 ? (
              <div className="space-y-2">
                {todayGratitude.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                    <span className="text-pink-400">♥</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {[0, 1, 2].map(i => (
                  <input key={i} type="text" placeholder={`Agradezco ${i + 1}...`}
                    value={gratitudeInputs[i]}
                    onChange={(e) => {
                      const newInputs = [...gratitudeInputs];
                      newInputs[i] = e.target.value;
                      setGratitudeInputs(newInputs);
                    }}
                    className="w-full bg-white/5 rounded-xl px-3 py-2 text-sm" />
                ))}
                <button onClick={saveGratitude} disabled={!gratitudeInputs.some(g => g.trim())}
                  className="w-full py-2 bg-pink-500 disabled:bg-white/10 rounded-xl text-sm font-medium mt-2">
                  Guardar gratitud
                </button>
              </div>
            )}
          </Card>
        </AnimatedMount>

        {/* Quick Actions */}
        <AnimatedMount delay={100}>
          <div className="grid grid-cols-2 gap-3">
            <Card onClick={() => setView('tools')} className="cursor-pointer hover:bg-white/10">
              <div className="text-center">
                <div className="text-2xl mb-1">🛠️</div>
                <p className="text-sm font-medium">Herramientas</p>
                <p className="text-[10px] text-white/40">Respiración, afirmaciones</p>
              </div>
            </Card>
            <Card onClick={() => setView('insights')} className="cursor-pointer hover:bg-white/10">
              <div className="text-center">
                <div className="text-2xl mb-1">💡</div>
                <p className="text-sm font-medium">Insights</p>
                <p className="text-[10px] text-white/40">{consciousness.insights?.length || 0} guardados</p>
              </div>
            </Card>
          </div>
        </AnimatedMount>

        {/* Completed Paths */}
        {consciousness.completedPaths?.length > 0 && (
          <AnimatedMount delay={125}>
            <Card>
              <p className="font-medium mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" /> Caminos Completados ({consciousness.completedPaths?.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {consciousness.completedPaths?.map((cp, i) => {
                  const path = allPaths.find(p => p.id === cp.id);
                  return (
                    <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg">
                      <span>{path?.icon}</span>
                      <span className="text-sm">{path?.name}</span>
                      <Check className="w-4 h-4 text-emerald-400" />
                    </div>
                  );
                })}
              </div>
            </Card>
          </AnimatedMount>
        )}
      </div>
    );
  };

  // ========== RENDER: PATH SELECTION ==========
  const renderPathsView = () => (
    <div className="space-y-4 pb-24">
      <AnimatedMount>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setView('home')} className="p-2 hover:bg-white/10 rounded-lg">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Caminos de Transformación</h1>
            <p className="text-white/50 text-sm">Elige tu sistema de desarrollo</p>
          </div>
        </div>
      </AnimatedMount>

      {/* Current Progress */}
      <AnimatedMount delay={25}>
        <Card className="bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border-violet-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/50">Nivel de Consciencia</p>
              <p className="text-4xl font-bold">{consciousness.level}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/50">XP Total</p>
              <p className="text-2xl font-bold text-violet-400">{consciousness.totalXP}</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Sparkles className="w-8 h-8" />
            </div>
          </div>
          {practiceStreak > 0 && (
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-sm">{practiceStreak} días de práctica continua</span>
            </div>
          )}
        </Card>
      </AnimatedMount>

      {/* Active Path */}
      {activePath && (
        <AnimatedMount delay={50}>
          <Card className="border-2" style={{ borderColor: activePath.color + '50', background: activePath.color + '10' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{activePath.icon}</div>
                <div>
                  <p className="font-bold">{activePath.name}</p>
                  <p className="text-xs text-white/50">{activePath.author}</p>
                </div>
              </div>
              <button onClick={() => setView('journey')} className="px-3 py-1.5 rounded-lg text-sm font-medium" style={{ backgroundColor: activePath.color }}>
                Continuar →
              </button>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Nivel {currentLevel + 1}: {activePath.levels[currentLevel]?.name}</span>
                <span>{currentXP}/{xpForNextLevel} XP</span>
              </div>
              <ProgressBar value={currentXP} max={xpForNextLevel} color="bg-gradient-to-r from-violet-500 to-fuchsia-500" />
            </div>
            <p className="text-xs text-white/40">{currentLevel + 1} de {activePath.levels.length} niveles</p>
          </Card>
        </AnimatedMount>
      )}

      {/* Completed Paths */}
      {consciousness.completedPaths?.length > 0 && (
        <AnimatedMount delay={75}>
          <Card>
            <p className="font-medium mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" /> Caminos Completados
            </p>
            <div className="flex flex-wrap gap-2">
              {consciousness.completedPaths?.map(cp => {
                const path = allPaths.find(p => p.id === cp.id);
                return (
                  <div key={cp.id + cp.completedDate} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg">
                    <span>{path?.icon}</span>
                    <span className="text-sm">{path?.name}</span>
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                );
              })}
            </div>
          </Card>
        </AnimatedMount>
      )}

      {/* Available Paths */}
      <AnimatedMount delay={100}>
        <p className="text-sm text-white/50 mb-2">Caminos Disponibles</p>
        <div className="space-y-2">
          {allPaths.filter(p => p.id !== consciousness.activePath).map((path, idx) => {
            const isCompleted = consciousness.completedPaths?.some(cp => cp.id === path.id);
            return (
              <button key={path.id} onClick={() => { setSelectedPath(path); setShowPathDetail(true); }}
                className="w-full bg-white/5 hover:bg-white/10 rounded-xl p-4 text-left transition-all"
                style={{ animationDelay: `${idx * 50}ms` }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: path.color + '20' }}>
                    {path.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{path.name}</p>
                      {isCompleted && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <p className="text-xs text-white/40">{path.author}</p>
                    <p className="text-xs text-white/50 mt-1">{path.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/30" />
                </div>
                <div className="flex gap-2 mt-2">
                  <span className="text-[10px] px-2 py-0.5 bg-white/10 rounded-full">{path.duration}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-white/10 rounded-full">{path.difficulty}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-white/10 rounded-full">{path.levels.length} niveles</span>
                </div>
              </button>
            );
          })}
        </div>
      </AnimatedMount>

      {/* Path Detail Modal */}
      <Modal isOpen={showPathDetail} onClose={() => setShowPathDetail(false)} title={selectedPath?.name || ''}>
        {selectedPath && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center text-4xl" style={{ backgroundColor: selectedPath.color + '20' }}>
                {selectedPath.icon}
              </div>
              <div>
                <p className="text-lg font-bold">{selectedPath.name}</p>
                <p className="text-sm text-white/50">{selectedPath.author}</p>
              </div>
            </div>

            <p className="text-sm text-white/70">{selectedPath.description}</p>

            <div className="flex gap-3">
              <div className="flex-1 bg-white/5 rounded-xl p-3 text-center">
                <p className="text-xl font-bold">{selectedPath.duration}</p>
                <p className="text-xs text-white/40">Duración</p>
              </div>
              <div className="flex-1 bg-white/5 rounded-xl p-3 text-center">
                <p className="text-xl font-bold">{selectedPath.levels.length}</p>
                <p className="text-xs text-white/40">Niveles</p>
              </div>
              <div className="flex-1 bg-white/5 rounded-xl p-3 text-center">
                <p className="text-xl font-bold">{selectedPath.difficulty}</p>
                <p className="text-xs text-white/40">Dificultad</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Niveles del camino:</p>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {selectedPath.levels.map((level, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">{idx + 1}</div>
                    <span className="text-sm">{level.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => startPath(selectedPath.id)} className="w-full py-3 rounded-xl font-medium text-white" style={{ backgroundColor: selectedPath.color }}>
              {consciousness.activePath ? 'Cambiar a este camino' : 'Comenzar este camino'}
            </button>
          </div>
        )}
      </Modal>
    </div>
  );

  // ========== RENDER: JOURNEY VIEW ==========
  const renderJourneyView = () => {
    console.log("renderJourneyView called, activePath:", activePath?.name, "consciousness.activePath:", consciousness.activePath);
    if (!activePath) return <div className="flex items-center justify-center py-20 text-white/50">Selecciona un camino primero</div>;
    const currentLevelData = activePath.levels[effectiveLevel];
    const todayPractice = consciousness.practices?.find(p => p.date === today);

    // Calculate time in level
    const practicesInLevel = (consciousness.practices || []).filter(p =>
      p.pathId === activePath.id && p.levelName === currentLevelData?.name
    );
    const daysWithPractice = new Set(practicesInLevel.map(p => p.date)).size;
    const minDays = currentLevelData?.minimumDays || 7;
    const canAdvance = daysWithPractice >= minDays;

    return (
      <div className="space-y-4 pb-24">
        {/* Header */}
        <AnimatedMount>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setView('home')} className="p-2 hover:bg-white/10 rounded-lg">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">{activePath.icon} {activePath.name}</h1>
                <p className="text-white/50 text-sm">{activePath.author}</p>
              </div>
            </div>
            <button onClick={() => setShowPauseConfirm(true)} className="p-2 hover:bg-white/10 rounded-lg">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </AnimatedMount>

        {/* Current Level Header */}
        <AnimatedMount delay={25}>
          <Card className="border-2" style={{ borderColor: activePath.color + '40' }}>
            <div className="text-center">
              <p className="text-xs text-white/40">Nivel {effectiveLevel + 1} de {activePath.levels.length}</p>
              <p className="text-2xl font-bold mt-1" style={{ color: activePath.color }}>{currentLevelData?.name}</p>
              {currentLevelData?.calibration && (
                <p className="text-xs text-white/30 mt-1">Calibración: {currentLevelData.calibration}</p>
              )}
            </div>

            {/* Time in level indicator */}
            <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-white/10">
              <div className="text-center">
                <p className="text-lg font-bold">{daysWithPractice}</p>
                <p className="text-[10px] text-white/40">días practicando</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <p className="text-lg font-bold">{minDays}</p>
                <p className="text-[10px] text-white/40">mínimo recomendado</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                {canAdvance ? (
                  <p className="text-lg">✓</p>
                ) : (
                  <p className="text-lg font-bold">{minDays - daysWithPractice}</p>
                )}
                <p className="text-[10px] text-white/40">{canAdvance ? 'listo' : 'días restantes'}</p>
              </div>
            </div>
          </Card>
        </AnimatedMount>

        {/* Tab Navigation */}
        <AnimatedMount delay={50}>
          <div className="flex bg-white/5 rounded-xl p-1 gap-1">
            {['enseñanza', 'práctica', 'mapa'].map(tab => (
              <button
                key={tab}
                onClick={() => setJourneyTab(tab)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all capitalize ${journeyTab === tab ? 'bg-violet-500 text-white' : 'text-white/50'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </AnimatedMount>

        {/* TAB: Enseñanza */}
        {journeyTab === 'enseñanza' && (
          <div className="space-y-4">
            {/* Teaching */}
            {currentLevelData?.teaching && (
              <AnimatedMount delay={75}>
                <Card>
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-violet-400" />
                    <p className="font-medium">La Enseñanza</p>
                  </div>
                  <div className={`text-sm text-white/70 leading-relaxed whitespace-pre-line ${!showFullTeaching && currentLevelData.teaching.length > 500 ? 'line-clamp-6' : ''}`}>
                    {currentLevelData.teaching}
                  </div>
                  {currentLevelData.teaching.length > 500 && (
                    <button
                      onClick={() => setShowFullTeaching(!showFullTeaching)}
                      className="text-xs text-violet-400 mt-3 hover:text-violet-300"
                    >
                      {showFullTeaching ? '← Ver menos' : 'Leer más →'}
                    </button>
                  )}
                </Card>
              </AnimatedMount>
            )}

            {/* Signs */}
            {currentLevelData?.signs && currentLevelData.signs.length > 0 && (
              <AnimatedMount delay={100}>
                <Card>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <p className="font-medium">Señales de que estás aquí</p>
                  </div>
                  <div className="space-y-2">
                    {currentLevelData.signs.map((sign, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-amber-400 mt-0.5 text-sm">•</span>
                        <p className="text-sm text-white/70">{sign}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </AnimatedMount>
            )}

            {/* Trap */}
            {currentLevelData?.trap && (
              <AnimatedMount delay={125}>
                <Card className="border border-red-500/20 bg-red-500/5">
                  <div className="flex items-center gap-2 mb-3">
                    <X className="w-4 h-4 text-red-400" />
                    <p className="font-medium text-red-400">La Trampa</p>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{currentLevelData.trap}</p>
                </Card>
              </AnimatedMount>
            )}

            {/* Exit */}
            {currentLevelData?.exit && (
              <AnimatedMount delay={150}>
                <Card className="border border-emerald-500/20 bg-emerald-500/5">
                  <div className="flex items-center gap-2 mb-3">
                    <ArrowRight className="w-4 h-4 text-emerald-400" />
                    <p className="font-medium text-emerald-400">La Salida</p>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{currentLevelData.exit}</p>
                </Card>
              </AnimatedMount>
            )}

            {/* Resource */}
            {currentLevelData?.resource && (
              <AnimatedMount delay={175}>
                <Card className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-violet-400" />
                    <p className="font-medium">Recurso Recomendado</p>
                  </div>
                  <p className="text-white font-medium">{currentLevelData.resource.title}</p>
                  <p className="text-sm text-white/50">{currentLevelData.resource.author}</p>
                  {currentLevelData.resource.note && (
                    <p className="text-xs text-white/40 mt-2 italic">{currentLevelData.resource.note}</p>
                  )}
                </Card>
              </AnimatedMount>
            )}
          </div>
        )}

        {/* TAB: Práctica */}
        {journeyTab === 'práctica' && (
          <div className="space-y-4">
            {/* Weekly Practice */}
            {currentLevelData?.weeklyPractice && (
              <AnimatedMount delay={75}>
                <Card>
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-4 h-4 text-amber-400" />
                    <p className="font-medium">Práctica Semanal</p>
                  </div>
                  <p className="text-lg font-medium mt-2" style={{ color: activePath.color }}>
                    {currentLevelData.weeklyPractice.title}
                  </p>
                  {currentLevelData.weeklyPractice.duration && (
                    <p className="text-xs text-white/40 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {currentLevelData.weeklyPractice.duration}
                    </p>
                  )}
                  <div className="mt-4 p-4 bg-white/5 rounded-xl">
                    <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">
                      {currentLevelData.weeklyPractice.instructions}
                    </p>
                  </div>
                </Card>
              </AnimatedMount>
            )}

            {/* Journal Question */}
            {currentLevelData?.journalQuestion && (
              <AnimatedMount delay={100}>
                <Card className="bg-gradient-to-br from-white/5 to-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Edit3 className="w-4 h-4 text-cyan-400" />
                    <p className="font-medium">Pregunta de Reflexión</p>
                  </div>
                  <p className="text-lg italic text-center text-white/80 py-2">
                    "{currentLevelData.journalQuestion}"
                  </p>
                </Card>
              </AnimatedMount>
            )}

            {/* Affirmation */}
            {currentLevelData?.affirmation && (
              <AnimatedMount delay={125}>
                <Card>
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-4 h-4 text-pink-400" />
                    <p className="font-medium">Afirmación</p>
                  </div>
                  <p className="text-lg italic text-center text-white/80 py-2">
                    "{currentLevelData.affirmation}"
                  </p>
                </Card>
              </AnimatedMount>
            )}

            {/* Log Practice Button */}
            <AnimatedMount delay={150}>
              <Card>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium">Registro de Práctica</p>
                  {todayPractice && (
                    <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">
                      ✓ Hoy completado
                    </span>
                  )}
                </div>

                {todayPractice ? (
                  <div className="text-center py-4">
                    <p className="text-emerald-400 font-medium">¡Práctica registrada!</p>
                    <p className="text-xs text-white/40 mt-1">+{todayPractice.xp} XP ganados hoy</p>
                    {todayPractice.notes && (
                      <p className="text-sm text-white/60 mt-3 italic">"{todayPractice.notes}"</p>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowPracticeModal(true)}
                    className="w-full py-3 rounded-xl font-medium text-white"
                    style={{ backgroundColor: activePath.color }}
                  >
                    Registrar Práctica Semanal
                  </button>
                )}
              </Card>
            </AnimatedMount>

            {/* Progress note */}
            {!canAdvance && (
              <AnimatedMount delay={175}>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-sm text-white/50">
                    Practica al menos {minDays} días antes de avanzar al siguiente nivel.
                  </p>
                  <p className="text-xs text-white/30 mt-1">
                    El crecimiento real requiere integración, no prisa.
                  </p>
                </div>
              </AnimatedMount>
            )}
          </div>
        )}

        {/* TAB: Mapa */}
        {journeyTab === 'mapa' && (
          <AnimatedMount delay={75}>
            <Card>
              <p className="font-medium mb-4">Tu Viaje</p>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {activePath.levels.map((level, idx) => {
                  const isCompleted = idx < effectiveLevel;
                  const isCurrent = idx === effectiveLevel;
                  const isLocked = idx > effectiveLevel;
                  const isStart = idx === startingLevel && startingLevel > 0;

                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isCurrent ? 'bg-violet-500/20 border border-violet-500/30' :
                        isCompleted ? 'bg-emerald-500/10' : 'bg-white/5'
                        }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${isCompleted ? 'bg-emerald-500' :
                        isCurrent ? 'bg-violet-500' : 'bg-white/10'
                        }`}>
                        {isCompleted ? <Check className="w-5 h-5" /> : idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${isLocked ? 'text-white/30' : ''}`}>
                          {level.name}
                        </p>
                        {level.calibration && (
                          <p className="text-xs text-white/30">Calibración: {level.calibration}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {isStart && !isCurrent && (
                          <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full">Inicio</span>
                        )}
                        {isCurrent && (
                          <span className="text-xs px-2 py-0.5 bg-violet-500 rounded-full">Actual</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Completion button */}
              {canAdvance && effectiveLevel < activePath.levels.length - 1 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-white/50 text-center mb-3">
                    Has practicado {daysWithPractice} días. ¿Sientes que has integrado este nivel?
                  </p>
                  <button
                    onClick={() => {
                      setValidationChecks({});
                      setShowLevelValidation(true);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl font-medium"
                  >
                    Validar integración del nivel
                  </button>
                </div>
              )}

              {effectiveLevel >= activePath.levels.length - 1 && (
                <div className="mt-4 pt-4 border-t border-white/10 text-center">
                  <p className="text-amber-400 font-medium">🎉 ¡Último nivel!</p>
                  <p className="text-xs text-white/50 mt-1">Completa la práctica para finalizar el camino</p>
                  {canAdvance && (
                    <button
                      onClick={completePath}
                      className="mt-3 w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl font-bold"
                    >
                      Completar Camino
                    </button>
                  )}
                </div>
              )}
            </Card>
          </AnimatedMount>
        )}
      </div>
    );
  };

  // ========== RENDER: TOOLS VIEW ==========
  const breathingTechniques = {
    '478': { name: '4-7-8 Relajación', inhale: 4, hold: 7, exhale: 8, holdOut: 0, rounds: 4, color: '#3B82F6' },
    'box': { name: 'Respiración Cuadrada', inhale: 4, hold: 4, exhale: 4, holdOut: 4, rounds: 4, color: '#8B5CF6' },
    'wim': { name: 'Wim Hof', inhale: 2, hold: 0, exhale: 2, holdOut: 15, rounds: 30, color: '#06B6D4' }
  };

  const journalPrompts = [
    "¿Qué te hizo sentir vivo hoy?",
    "¿Qué aprendiste de ti mismo?",
    "¿Por qué estás agradecido ahora?",
    "¿Qué resistencia sientes y qué te enseña?"
  ];

  const moods = [
    { id: 'amazing', emoji: '🤩', label: 'Increíble' },
    { id: 'happy', emoji: '😊', label: 'Feliz' },
    { id: 'calm', emoji: '😌', label: 'Tranquilo' },
    { id: 'meh', emoji: '😐', label: 'Normal' },
    { id: 'anxious', emoji: '😰', label: 'Ansioso' },
    { id: 'sad', emoji: '😢', label: 'Triste' }
  ];

  const defaultAffirmations = [
    "Soy digno de amor y abundancia",
    "El universo conspira a mi favor",
    "Confío en el proceso de la vida",
    "Soy exactamente quien necesito ser",
    "Mi paz interior es inquebrantable"
  ];

  const userAffirmations = consciousness.affirmations || [];
  const allAffirmations = [...userAffirmations.map(a => a.text), ...defaultAffirmations];

  const todayJournal = consciousness.journal?.[today];

  const saveJournal = () => {
    if (!journalText.trim()) return;
    setData(prev => ({
      ...prev,
      consciousness: {
        ...prev.consciousness,
        journal: {
          ...(prev.consciousness?.journal || {}),
          [today]: { text: journalText, mood: journalMood, timestamp: new Date().toISOString() }
        }
      }
    }));
    showToast('📔 Reflexión guardada');
    setJournalText('');
    setJournalMood(null);
  };

  const addNewAffirmation = () => {
    if (!newAffirmation.trim()) return;
    setData(prev => ({
      ...prev,
      consciousness: {
        ...prev.consciousness,
        affirmations: [...(prev.consciousness?.affirmations || []), { id: Date.now(), text: newAffirmation.trim() }]
      }
    }));
    setNewAffirmation('');
    showToast('💫 Afirmación añadida');
  };

  const renderToolsView = () => (
    <div className="space-y-4 pb-24">
      <AnimatedMount>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('home')} className="p-2 hover:bg-white/10 rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Herramientas</h1>
          </div>
        </div>
        <p className="text-sm text-white/50 ml-12">Prácticas para cultivar consciencia</p>
      </AnimatedMount>

      {/* Tool Tabs */}
      <AnimatedMount delay={25}>
        <div className="flex bg-white/5 rounded-xl p-1 gap-1">
          {[
            { id: 'gratitude', icon: '🙏', label: 'Gratitud' },
            { id: 'affirmations', icon: '💫', label: 'Afirmaciones' },
            { id: 'breathing', icon: '🧘', label: 'Respirar' },
            { id: 'journal', icon: '📔', label: 'Diario' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setToolTab(tab.id)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${toolTab === tab.id ? 'bg-violet-500' : ''
                }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </AnimatedMount>

      {/* GRATITUDE */}
      {toolTab === 'gratitude' && (
        <AnimatedMount delay={50}>
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium">Gratitud Diaria</p>
                <p className="text-xs text-white/50">3 cosas por las que agradecer hoy</p>
              </div>
              {todayGratitude.length > 0 && (
                <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">
                  ✓ Completado
                </span>
              )}
            </div>

            {todayGratitude.length > 0 ? (
              <div className="space-y-2">
                {todayGratitude.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/5 rounded-xl p-3">
                    <span className="text-emerald-400">✓</span>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
                <p className="text-xs text-white/30 text-center mt-3">Vuelve mañana para más gratitud</p>
              </div>
            ) : (
              <div className="space-y-3">
                {gratitudeInputs.map((input, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-lg">{i + 1}.</span>
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => {
                        const newInputs = [...gratitudeInputs];
                        newInputs[i] = e.target.value;
                        setGratitudeInputs(newInputs);
                      }}
                      placeholder={`Estoy agradecido por...`}
                      className="flex-1 bg-white/5 rounded-xl px-3 py-2 text-sm"
                    />
                  </div>
                ))}
                <button
                  onClick={saveGratitude}
                  disabled={!gratitudeInputs.some(g => g.trim())}
                  className="w-full py-3 bg-violet-500 rounded-xl font-medium disabled:opacity-30"
                >
                  Guardar Gratitud
                </button>
              </div>
            )}
          </Card>

          {/* Gratitude Stats */}
          <Card className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10">
            <div className="flex items-center justify-around text-center">
              <div>
                <p className="text-2xl font-bold">{Object.keys(consciousness.gratitude || {}).length}</p>
                <p className="text-xs text-white/50">días totales</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <p className="text-2xl font-bold">{(() => {
                  let streak = 0;
                  let checkDate = today;
                  while ((consciousness.gratitude || {})[checkDate]?.length > 0) {
                    streak++;
                    const d = new Date(checkDate);
                    d.setDate(d.getDate() - 1);
                    checkDate = d.toISOString().split('T')[0];
                  }
                  return streak;
                })()}</p>
                <p className="text-xs text-white/50">racha actual</p>
              </div>
            </div>
          </Card>
        </AnimatedMount>
      )}

      {/* AFFIRMATIONS */}
      {toolTab === 'affirmations' && (
        <AnimatedMount delay={50}>
          <Card>
            <p className="font-medium mb-3">Tus Afirmaciones</p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {allAffirmations.map((aff, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/5 rounded-xl p-3">
                  <span className="text-violet-400">✦</span>
                  <span className="text-sm italic flex-1">{aff}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <p className="font-medium mb-3">Añadir Nueva</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAffirmation}
                onChange={(e) => setNewAffirmation(e.target.value)}
                placeholder="Yo soy..."
                className="flex-1 bg-white/5 rounded-xl px-3 py-2 text-sm"
              />
              <button
                onClick={addNewAffirmation}
                disabled={!newAffirmation.trim()}
                className="px-4 py-2 bg-violet-500 rounded-xl font-medium disabled:opacity-30"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </Card>

          {/* Random affirmation display */}
          <Card className="bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30">
            <p className="text-xs text-white/50 mb-2 text-center">Afirmación del momento</p>
            <p className="text-lg italic text-center py-4">
              "{allAffirmations[Math.floor(Date.now() / 60000) % allAffirmations.length]}"
            </p>
          </Card>
        </AnimatedMount>
      )}

      {/* BREATHING */}
      {toolTab === 'breathing' && (
        <AnimatedMount delay={50}>
          {!breathingActive ? (
            <>
              <Card>
                <p className="font-medium mb-4">Técnicas de Respiración</p>
                <div className="space-y-3">
                  {Object.entries(breathingTechniques).map(([id, tech]) => (
                    <button
                      key={id}
                      onClick={() => setSelectedBreathTechnique(id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${selectedBreathTechnique === id ? 'bg-violet-500/20 border border-violet-500/50' : 'bg-white/5'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{tech.name}</p>
                          <p className="text-xs text-white/50">
                            {tech.inhale}s inhalar • {tech.hold > 0 ? `${tech.hold}s retener • ` : ''}{tech.exhale}s exhalar
                            {tech.holdOut > 0 ? ` • ${tech.holdOut}s pausa` : ''} × {tech.rounds}
                          </p>
                        </div>
                        {selectedBreathTechnique === id && <Check className="w-5 h-5 text-violet-400" />}
                      </div>
                    </button>
                  ))}
                </div>
              </Card>

              <button
                onClick={() => {
                  setBreathingActive(true);
                  setBreathPhase('inhale');
                  setBreathTimer(0);
                  setBreathRound(0);
                }}
                className="w-full py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl font-bold text-lg"
              >
                🧘 Comenzar Sesión
              </button>

              {/* Breathing stats */}
              <Card className="bg-white/5">
                <div className="flex items-center justify-around text-center">
                  <div>
                    <p className="text-2xl font-bold">{(consciousness.breathingSessions || []).length}</p>
                    <p className="text-xs text-white/50">sesiones totales</p>
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div>
                    <p className="text-2xl font-bold">
                      {(consciousness.breathingSessions || []).filter(s => s.date === today).length}
                    </p>
                    <p className="text-xs text-white/50">hoy</p>
                  </div>
                </div>
              </Card>
            </>
          ) : (
            <Card className="py-8">
              <div className="text-center">
                <p className="text-xs text-white/50 mb-2">
                  {breathingTechniques[selectedBreathTechnique].name} • Ronda {breathRound + 1}/{breathingTechniques[selectedBreathTechnique].rounds}
                </p>

                {/* Animated circle */}
                <div className="relative w-48 h-48 mx-auto my-8">
                  <div
                    className={`absolute inset-0 rounded-full transition-all duration-1000 ${breathPhase === 'inhale' ? 'scale-100 opacity-80' :
                      breathPhase === 'hold' ? 'scale-100 opacity-60' :
                        breathPhase === 'exhale' ? 'scale-75 opacity-40' :
                          'scale-75 opacity-30'
                      }`}
                    style={{ backgroundColor: breathingTechniques[selectedBreathTechnique].color }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold capitalize">
                        {breathPhase === 'inhale' ? 'Inhala' :
                          breathPhase === 'hold' ? 'Retén' :
                            breathPhase === 'exhale' ? 'Exhala' :
                              breathPhase === 'holdOut' ? 'Pausa' : ''}
                      </p>
                      <p className="text-5xl font-bold mt-2">{Math.ceil(breathTimer)}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setBreathingActive(false);
                    setBreathPhase('idle');
                    setBreathTimer(0);
                    setBreathRound(0);
                  }}
                  className="px-6 py-2 bg-white/10 rounded-xl"
                >
                  Cancelar
                </button>
              </div>
            </Card>
          )}
        </AnimatedMount>
      )}

      {/* JOURNAL */}
      {toolTab === 'journal' && (
        <AnimatedMount delay={50}>
          <Card>
            <p className="font-medium mb-3">Reflexión del Día</p>

            {todayJournal ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{moods.find(m => m.id === todayJournal.mood)?.emoji || '📝'}</span>
                  <span className="text-sm text-white/50">{moods.find(m => m.id === todayJournal.mood)?.label || ''}</span>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-sm leading-relaxed whitespace-pre-line">{todayJournal.text}</p>
                </div>
                <p className="text-xs text-white/30 text-center">Ya escribiste hoy. Vuelve mañana.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Prompt */}
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-3">
                  <p className="text-xs text-violet-400 mb-1">Pregunta del día</p>
                  <p className="text-sm italic">{journalPrompts[new Date().getDay() % journalPrompts.length]}</p>
                </div>

                {/* Mood selector */}
                <div>
                  <p className="text-xs text-white/50 mb-2">¿Cómo te sientes?</p>
                  <div className="flex gap-2 justify-center">
                    {moods.map(mood => (
                      <button
                        key={mood.id}
                        onClick={() => setJournalMood(mood.id)}
                        className={`p-2 rounded-xl text-2xl transition-all ${journalMood === mood.id ? 'bg-violet-500 scale-110' : 'bg-white/5'
                          }`}
                      >
                        {mood.emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text input */}
                <textarea
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                  placeholder="Escribe tu reflexión..."
                  rows={5}
                  className="w-full bg-white/5 rounded-xl p-3 text-sm resize-none"
                />

                <button
                  onClick={saveJournal}
                  disabled={!journalText.trim()}
                  className="w-full py-3 bg-violet-500 rounded-xl font-medium disabled:opacity-30"
                >
                  Guardar Reflexión
                </button>
              </div>
            )}
          </Card>

          {/* Journal history */}
          {Object.keys(consciousness.journal || {}).length > 0 && (
            <Card>
              <p className="font-medium mb-3">Entradas Anteriores</p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {Object.entries(consciousness.journal || {})
                  .filter(([date]) => date !== today)
                  .sort(([a], [b]) => b.localeCompare(a))
                  .slice(0, 5)
                  .map(([date, entry]) => (
                    <div key={date} className="bg-white/5 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-white/40">{date}</span>
                        <span>{moods.find(m => m.id === entry.mood)?.emoji}</span>
                      </div>
                      <p className="text-xs text-white/60 line-clamp-2">{entry.text}</p>
                    </div>
                  ))}
              </div>
            </Card>
          )}
        </AnimatedMount>
      )}
    </div>
  );

  // ========== RENDER: INSIGHTS VIEW ==========
  const insightPrompts = [
    "¿Qué patrón descubriste hoy sobre ti mismo?",
    "¿Qué creencia limitante identificaste?",
    "¿Qué momento de claridad tuviste?",
    "¿Qué conexión hiciste que antes no veías?",
    "¿Qué resistencia notaste y qué te enseña?"
  ];

  const renderInsightsView = () => (
    <div className="space-y-4 pb-24">
      <AnimatedMount>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('home')} className="p-2 hover:bg-white/10 rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Insights</h1>
          </div>
          <button onClick={() => setShowInsightModal(true)} className="p-2 bg-violet-500 rounded-xl">
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-white/50 ml-12">Tus descubrimientos y revelaciones</p>
      </AnimatedMount>

      {/* Insight prompt card */}
      <AnimatedMount delay={25}>
        <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Pregunta del día</p>
              <p className="text-sm text-white/70 italic">
                "{insightPrompts[new Date().getDay() % insightPrompts.length]}"
              </p>
              <button
                onClick={() => setShowInsightModal(true)}
                className="text-xs text-amber-400 mt-2 hover:text-amber-300"
              >
                Responder →
              </button>
            </div>
          </div>
        </Card>
      </AnimatedMount>

      {/* Stats */}
      {consciousness.insights.length > 0 && (
        <AnimatedMount delay={50}>
          <div className="flex gap-3">
            <Card className="flex-1 text-center py-3">
              <p className="text-2xl font-bold">{consciousness.insights.length}</p>
              <p className="text-xs text-white/40">insights totales</p>
            </Card>
            <Card className="flex-1 text-center py-3">
              <p className="text-2xl font-bold">
                {consciousness.insights.filter(i => i.date === today).length}
              </p>
              <p className="text-xs text-white/40">hoy</p>
            </Card>
            <Card className="flex-1 text-center py-3">
              <p className="text-2xl font-bold">
                {new Set(consciousness.insights.map(i => i.date)).size}
              </p>
              <p className="text-xs text-white/40">días</p>
            </Card>
          </div>
        </AnimatedMount>
      )}

      {consciousness.insights.length > 0 ? (
        <div className="space-y-3">
          {consciousness.insights.slice().reverse().map((insight, idx) => {
            const path = allPaths.find(p => p.id === insight.pathId);
            return (
              <AnimatedMount key={insight.id} delay={75 + idx * 25}>
                <Card>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-relaxed">{insight.text}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-white/40">
                        <span>{formatShortDate(insight.date)}</span>
                        {path && <span>• {path.icon} {path.name}</span>}
                        {insight.levelName && <span>• {insight.levelName}</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setData(prev => ({
                          ...prev,
                          consciousness: {
                            ...prev.consciousness,
                            insights: prev.consciousness.insights.filter(i => i.id !== insight.id)
                          }
                        }));
                      }}
                      className="p-1 hover:bg-white/10 rounded-lg text-white/30 hover:text-white/60"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              </AnimatedMount>
            );
          })}
        </div>
      ) : (
        <AnimatedMount delay={75}>
          <Card className="text-center py-12 border border-dashed border-white/20">
            <Lightbulb className="w-12 h-12 mx-auto text-white/20 mb-3" />
            <p className="text-white/40 mb-1">Sin insights todavía</p>
            <p className="text-xs text-white/30">Guarda tus reflexiones y descubrimientos</p>
            <button
              onClick={() => setShowInsightModal(true)}
              className="mt-4 px-4 py-2 bg-violet-500 rounded-xl text-sm font-medium"
            >
              Añadir primer insight
            </button>
          </Card>
        </AnimatedMount>
      )}

      {/* Add Insight Modal */}
      <Modal isOpen={showInsightModal} onClose={() => { setShowInsightModal(false); setNewInsightText(''); }} title="Nuevo Insight">
        <div className="space-y-4">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
            <p className="text-xs text-amber-400 mb-1">💡 Pregunta para reflexionar</p>
            <p className="text-sm text-white/70 italic">
              "{insightPrompts[new Date().getDay() % insightPrompts.length]}"
            </p>
          </div>

          <div>
            <label className="text-sm text-white/50 mb-2 block">Tu insight o descubrimiento</label>
            <textarea
              value={newInsightText}
              onChange={(e) => setNewInsightText(e.target.value)}
              placeholder="Hoy me di cuenta de que..."
              rows={4}
              className="w-full bg-white/5 rounded-xl p-3 text-sm resize-none"
              autoFocus
            />
          </div>

          {activePath && (
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-xs text-white/40">
                Se guardará relacionado a: {activePath.icon} {activePath.name} • {activePath.levels[effectiveLevel]?.name}
              </p>
            </div>
          )}

          <button
            onClick={() => {
              if (newInsightText.trim()) {
                addInsight(newInsightText.trim());
                setNewInsightText('');
                setShowInsightModal(false);
              }
            }}
            disabled={!newInsightText.trim()}
            className="w-full py-3 bg-violet-500 rounded-xl font-medium disabled:opacity-30"
          >
            Guardar Insight
          </button>
        </div>
      </Modal>
    </div>
  );

  // ========== MAIN RENDER ==========
  return (
    <div className="pb-24">
      {/* View Toggle - only show when not on home */}
      {view !== 'home' && (
        <div className="flex bg-white/10 rounded-xl p-1 mb-4">
          <button onClick={() => setView('home')} className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${view === 'home' ? 'bg-violet-500' : ''}`}>
            Inicio
          </button>
          <button onClick={() => setView('paths')} className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${view === 'paths' ? 'bg-violet-500' : ''}`}>
            Caminos
          </button>
          <button onClick={() => setView('journey')} disabled={!activePath} className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${view === 'journey' ? 'bg-violet-500' : ''} ${!activePath ? 'opacity-30' : ''}`}>
            Viaje
          </button>
          <button onClick={() => setView('tools')} className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${view === 'tools' ? 'bg-violet-500' : ''}`}>
            Herramientas
          </button>
          <button onClick={() => setView('insights')} className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${view === 'insights' ? 'bg-violet-500' : ''}`}>
            Insights
          </button>
        </div>
      )}

      {view === 'home' && renderHomeView()}
      {view === 'paths' && renderPathsView()}
      {view === 'journey' && renderJourneyView()}
      {view === 'tools' && renderToolsView()}
      {view === 'insights' && renderInsightsView()}

      {/* Level Validation Modal */}
      {showLevelValidation && activePath && (() => {
        const currentLevelData = activePath.levels[effectiveLevel];
        const signs = currentLevelData?.signs || [];
        const checkedCount = Object.values(validationChecks).filter(Boolean).length;
        const requiredChecks = Math.ceil(signs.length * 0.7); // Need 70% to advance
        const canConfirmAdvance = checkedCount >= requiredChecks;

        // Generate inverted signs for validation (what you should NO LONGER feel strongly)
        const getValidationItems = () => {
          if (!signs.length) return [];

          // For lower levels, we check that you NO LONGER strongly identify with these signs
          // For higher levels, we check that you DO identify with positive signs
          const isLowerLevel = effectiveLevel < 8; // Below Courage (200)

          return signs.map((sign, idx) => ({
            id: idx,
            text: isLowerLevel
              ? `Ya no me identifico fuertemente con: "${sign}"`
              : `Siento que esto es verdad para mí: "${sign}"`,
            originalSign: sign
          }));
        };

        const validationItems = getValidationItems();

        return (
          <Modal
            isOpen={showLevelValidation}
            onClose={() => setShowLevelValidation(false)}
            title="Validación de Integración"
          >
            <div className="space-y-4">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{activePath.icon}</div>
                <p className="font-bold text-lg" style={{ color: activePath.color }}>
                  {currentLevelData?.name}
                </p>
                <p className="text-xs text-white/50 mt-1">
                  ¿Has trascendido este nivel?
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-xs text-white/50 mb-3">
                  Sé honesto contigo mismo. Marca solo las afirmaciones que genuinamente sientes que son verdad para ti ahora:
                </p>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {validationItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setValidationChecks(prev => ({
                        ...prev,
                        [item.id]: !prev[item.id]
                      }))}
                      className={`w-full p-3 rounded-xl text-left transition-all flex items-start gap-3 ${validationChecks[item.id]
                        ? 'bg-emerald-500/20 border border-emerald-500/30'
                        : 'bg-white/5 border border-transparent'
                        }`}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${validationChecks[item.id] ? 'bg-emerald-500' : 'bg-white/10'
                        }`}>
                        {validationChecks[item.id] && <Check className="w-3 h-3" />}
                      </div>
                      <span className="text-sm text-white/80">{item.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress indicator */}
              <div className="bg-white/5 rounded-xl p-3">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-white/50">Progreso de validación</span>
                  <span className={checkedCount >= requiredChecks ? 'text-emerald-400' : 'text-white/50'}>
                    {checkedCount}/{signs.length} ({Math.round(checkedCount / signs.length * 100) || 0}%)
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${canConfirmAdvance ? 'bg-emerald-500' : 'bg-violet-500'}`}
                    style={{ width: `${(checkedCount / signs.length) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-white/30 mt-2 text-center">
                  Necesitas validar al menos {requiredChecks} de {signs.length} puntos (70%) para avanzar
                </p>
              </div>

              {!canConfirmAdvance && checkedCount > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
                  <p className="text-xs text-amber-400">
                    💡 Si no puedes marcar suficientes puntos, quizás necesitas más tiempo en este nivel.
                    No hay prisa - la integración real requiere tiempo.
                  </p>
                </div>
              )}

              {canConfirmAdvance && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3">
                  <p className="text-xs text-emerald-400">
                    ✓ Has validado suficientes puntos. Parece que estás listo para avanzar.
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowLevelValidation(false)}
                  className="flex-1 py-3 bg-white/10 rounded-xl font-medium"
                >
                  Seguir practicando
                </button>
                <button
                  onClick={() => {
                    if (canConfirmAdvance) {
                      // Save validation to history
                      setData(prev => ({
                        ...prev,
                        consciousness: {
                          ...prev.consciousness,
                          currentLevel: (prev.consciousness?.currentLevel || 0) + 1,
                          currentXP: 0,
                          levelHistory: [
                            ...(prev.consciousness?.levelHistory || []),
                            {
                              pathId: activePath.id,
                              level: effectiveLevel,
                              levelName: currentLevelData?.name,
                              completedAt: new Date().toISOString(),
                              validationScore: Math.round(checkedCount / signs.length * 100)
                            }
                          ]
                        }
                      }));
                      setShowLevelValidation(false);
                      setValidationChecks({});
                      showToast(`🎉 ¡Has trascendido ${currentLevelData?.name}!`);
                    }
                  }}
                  disabled={!canConfirmAdvance}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all ${canConfirmAdvance
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                    : 'bg-white/5 text-white/30'
                    }`}
                >
                  Avanzar al siguiente
                </button>
              </div>
            </div>
          </Modal>
        );
      })()}

      {/* Practice Modal */}
      {showPracticeModal && activePath && (
        <Modal isOpen={showPracticeModal} onClose={() => setShowPracticeModal(false)} title="Práctica del Día">
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl mb-2">{activePath.icon}</div>
              <p className="font-bold">{activePath.levels[effectiveLevel]?.name}</p>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-sm leading-relaxed">{activePath.levels[effectiveLevel]?.practice}</p>
            </div>

            <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-3">
              <p className="text-xs text-violet-400 mb-1">Afirmación</p>
              <p className="text-sm italic">"{activePath.levels[effectiveLevel]?.affirmation}"</p>
            </div>

            <div>
              <label className="text-sm text-white/50 mb-2 block">Notas (opcional)</label>
              <textarea id="practice-notes" rows={3} placeholder="¿Cómo fue tu práctica? ¿Qué descubriste?"
                className="w-full bg-white/5 rounded-xl p-3 text-sm resize-none" />
            </div>

            <button onClick={() => {
              const notes = document.getElementById('practice-notes')?.value || '';
              logPractice(activePath.levels[effectiveLevel]?.practice, notes);
            }} className="w-full py-3 rounded-xl font-medium" style={{ backgroundColor: activePath.color }}>
              Completar Práctica (+25 XP)
            </button>
          </div>
        </Modal>
      )}

      {/* Path Detail Modal */}
      <Modal isOpen={showPathDetail} onClose={() => {
        setShowPathDetail(false);
        setShowOnboarding(false);
        setShowCalibration(false);
        setCalibrationMode('prompt');
        setAiResponse('');
        setParsedLevel(null);
        setPromptCopied(false);
        setOnboardingStep(0);
      }} title={selectedPath?.name || ''}>
        {/* Initial path info */}
        {selectedPath && !showOnboarding && !showCalibration && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center text-4xl" style={{ backgroundColor: selectedPath.color + '20' }}>
                {selectedPath.icon}
              </div>
              <div>
                <p className="text-lg font-bold">{selectedPath.name}</p>
                <p className="text-sm text-white/50">{selectedPath.author}</p>
              </div>
            </div>

            <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{selectedPath.fullDescription}</p>

            <div className="flex gap-3">
              <div className="flex-1 bg-white/5 rounded-xl p-3 text-center">
                <p className="text-lg font-bold">{selectedPath.duration}</p>
                <p className="text-xs text-white/40">Duración</p>
              </div>
              <div className="flex-1 bg-white/5 rounded-xl p-3 text-center">
                <p className="text-lg font-bold">{selectedPath.levels.length}</p>
                <p className="text-xs text-white/40">Niveles</p>
              </div>
              <div className="flex-1 bg-white/5 rounded-xl p-3 text-center">
                <p className="text-lg font-bold">{selectedPath.difficulty}</p>
                <p className="text-xs text-white/40">Dificultad</p>
              </div>
            </div>

            <button onClick={() => {
              if (selectedPath.onboarding && selectedPath.onboarding.length > 0) {
                setShowOnboarding(true);
                setOnboardingStep(0);
              } else if (selectedPath.hasCalibration) {
                setShowCalibration(true);
              } else {
                startPath(selectedPath.id, 0);
              }
            }} className="w-full py-3 rounded-xl font-medium text-white" style={{ backgroundColor: selectedPath.color }}>
              Comenzar
            </button>
          </div>
        )}

        {/* Onboarding Screens - Immersive intro to the path */}
        {selectedPath && showOnboarding && !showCalibration && selectedPath.onboarding && (
          <div className="space-y-6">
            {/* Progress dots */}
            <div className="flex justify-center gap-2">
              {selectedPath.onboarding.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${idx === onboardingStep ? 'bg-violet-500 w-6' : idx < onboardingStep ? 'bg-violet-500' : 'bg-white/20'}`}
                />
              ))}
            </div>

            {/* Current screen */}
            <div className="text-center py-4">
              <div className="text-5xl mb-4">{selectedPath.onboarding[onboardingStep]?.icon}</div>
              <h3 className="text-xl font-bold mb-4">{selectedPath.onboarding[onboardingStep]?.title}</h3>
              <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">
                {selectedPath.onboarding[onboardingStep]?.content}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              {onboardingStep > 0 && (
                <button
                  onClick={() => setOnboardingStep(prev => prev - 1)}
                  className="flex-1 py-3 bg-white/10 rounded-xl font-medium"
                >
                  ← Anterior
                </button>
              )}

              {onboardingStep < selectedPath.onboarding.length - 1 ? (
                <button
                  onClick={() => setOnboardingStep(prev => prev + 1)}
                  className="flex-1 py-3 rounded-xl font-medium text-white"
                  style={{ backgroundColor: selectedPath.color }}
                >
                  Siguiente →
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (selectedPath.hasCalibration) {
                      setShowCalibration(true);
                    } else {
                      startPath(selectedPath.id, 0);
                    }
                  }}
                  className="flex-1 py-3 rounded-xl font-medium text-white"
                  style={{ backgroundColor: selectedPath.color }}
                >
                  {selectedPath.hasCalibration ? 'Continuar a calibración' : 'Comenzar camino'}
                </button>
              )}
            </div>

            {/* Skip option */}
            <button
              onClick={() => startPath(selectedPath.id, 0)}
              className="w-full py-2 text-xs text-white/30 hover:text-white/50"
            >
              Saltar introducción y empezar desde el principio
            </button>
          </div>
        )}

        {/* AI Calibration intro - after onboarding */}
        {selectedPath && showCalibration && calibrationMode === 'intro' && (
          <div className="space-y-4 text-center">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-xl font-bold">Calibración con IA</h3>
            <p className="text-sm text-white/70">
              Vamos a usar tu IA favorita (Claude, ChatGPT, etc.) para determinar tu punto de partida basándose en todo lo que ya conoce de ti.
            </p>
            <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-3 text-left">
              <p className="text-xs text-violet-400 font-medium mb-2">💡 ¿Por qué así?</p>
              <p className="text-xs text-white/60">
                Tu IA tiene contexto de tus conversaciones, proyectos, estados emocionales y forma de pensar. Esto permite una calibración mucho más precisa que un simple test.
              </p>
            </div>
            <button onClick={() => setCalibrationMode('prompt')}
              className="w-full py-3 rounded-xl font-medium" style={{ backgroundColor: selectedPath.color }}>
              Ver prompt de calibración
            </button>
            <button onClick={() => startPath(selectedPath.id, 0)} className="w-full py-2 text-sm text-white/50">
              Empezar desde el principio
            </button>
          </div>
        )}

        {/* AI Calibration - Prompt Mode */}
        {selectedPath && showCalibration && calibrationMode === 'prompt' && selectedPath.calibrationPrompt && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-white/50 mb-2">Paso 1 de 2</p>
              <h3 className="font-bold">Copia este prompt</h3>
            </div>

            <div className="bg-black/30 rounded-xl p-3 max-h-60 overflow-y-auto">
              <p className="text-xs text-white/70 whitespace-pre-wrap font-mono leading-relaxed">{selectedPath.calibrationPrompt}</p>
            </div>

            <button onClick={() => {
              navigator.clipboard.writeText(selectedPath.calibrationPrompt);
              setPromptCopied(true);
              setTimeout(() => setPromptCopied(false), 2000);
            }} className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2"
              style={{ backgroundColor: promptCopied ? '#10B981' : selectedPath.color }}>
              {promptCopied ? (
                <><Check className="w-4 h-4" /> Copiado!</>
              ) : (
                <><Copy className="w-4 h-4" /> Copiar prompt</>
              )}
            </button>

            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-xs text-white/50 mb-2">Instrucciones:</p>
              <ol className="text-xs text-white/70 space-y-1.5 list-decimal list-inside">
                <li>Copia el prompt de arriba</li>
                <li>Pégalo en tu IA (Claude, ChatGPT, Gemini...)</li>
                <li>La IA que mejor te conozca dará mejor resultado</li>
                <li>Copia la respuesta completa y pégala aquí</li>
              </ol>
            </div>

            <button onClick={() => setCalibrationMode('result')}
              className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-all">
              Ya tengo la respuesta →
            </button>
          </div>
        )}

        {/* AI Calibration - Result Mode */}
        {selectedPath && showCalibration && calibrationMode === 'result' && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-white/50 mb-2">Paso 2 de 2</p>
              <h3 className="font-bold">Pega la respuesta de la IA</h3>
            </div>

            <textarea
              value={aiResponse}
              onChange={(e) => {
                setAiResponse(e.target.value);
                setParseError(false);
                // Try to parse the response
                const match = e.target.value.match(/===CALIBRATION_RESULT===[\s\S]*?LEVEL:\s*(\d+)[\s\S]*?NAME:\s*([^\n]+)[\s\S]*?===END_CALIBRATION===/);
                if (match) {
                  const level = parseInt(match[1]);
                  if (level >= 0 && level < selectedPath.levels.length) {
                    setParsedLevel({ level, name: match[2].trim() });
                  } else {
                    setParsedLevel(null);
                  }
                } else {
                  setParsedLevel(null);
                }
              }}
              placeholder="Pega aquí la respuesta completa de la IA..."
              className="w-full bg-white/5 rounded-xl p-3 text-sm resize-none h-40"
            />

            {parsedLevel !== null && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center">
                <p className="text-xs text-emerald-400 mb-1">✓ Nivel detectado</p>
                <p className="text-2xl font-bold" style={{ color: selectedPath.color }}>
                  {selectedPath.levels[parsedLevel.level]?.name || parsedLevel.name}
                </p>
                <p className="text-xs text-white/50 mt-1">
                  Nivel {parsedLevel.level + 1} de {selectedPath.levels.length}
                </p>
              </div>
            )}

            {aiResponse && !parsedLevel && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
                <p className="text-xs text-amber-400">
                  ⚠️ No pude detectar el formato de resultado. Asegúrate de que la IA incluyó el bloque ===CALIBRATION_RESULT===
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <button onClick={() => setCalibrationMode('prompt')}
                className="flex-1 py-3 bg-white/10 rounded-xl font-medium">
                ← Volver
              </button>
              <button onClick={() => {
                if (parsedLevel !== null) {
                  startPath(selectedPath.id, parsedLevel.level);
                }
              }} disabled={parsedLevel === null}
                className="flex-1 py-3 rounded-xl font-medium disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ backgroundColor: selectedPath.color }}>
                Comenzar
              </button>
            </div>

            <div className="text-center">
              <button onClick={() => startPath(selectedPath.id, 0)} className="text-sm text-white/40 hover:text-white/60">
                o empezar desde el principio
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Pause Confirm Modal */}
      <Modal isOpen={showPauseConfirm} onClose={() => setShowPauseConfirm(false)} title="Gestionar camino">
        <div className="space-y-3">
          <button onClick={pausePath} className="w-full p-4 bg-amber-500/20 hover:bg-amber-500/30 rounded-xl text-left transition-all">
            <p className="font-medium flex items-center gap-2"><Pause className="w-4 h-4" /> Pausar camino</p>
            <p className="text-xs text-white/50 mt-1">Tu progreso se guardará y podrás continuar después</p>
          </button>
          <button onClick={abandonPath} className="w-full p-4 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-left transition-all">
            <p className="font-medium flex items-center gap-2 text-red-400"><X className="w-4 h-4" /> Abandonar camino</p>
            <p className="text-xs text-white/50 mt-1">Perderás el progreso en este camino (XP total se mantiene)</p>
          </button>
        </div>
      </Modal>
    </div>
  );
};

// ============================================================================
// SETTINGS SCREEN
// ============================================================================


export default ConsciousnessScreen;
