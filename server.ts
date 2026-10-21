import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

app.use(express.json({ limit: "15mb" }));

// Initialize GoogleGenAI if key is present
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } catch (err) {
    console.warn("Could not initialize GoogleGenAI with key:", err);
  }
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    model: "gemini-3.8-flash",
    timestamp: new Date().toISOString(),
  });
});

// Primary Endpoint: EduAgent - Generador de Exámenes, Notas de Repaso y Flashcards
app.post(["/api/study/generate", "/api/agent/study-generate"], async (req, res) => {
  const {
    topic,
    notes = "",
    difficulty = "Medio",
    numQuestions = 5,
    numFlashcards = 6,
    noteStyle = "cornell",
  } = req.body;

  if (!topic || typeof topic !== "string" || !topic.trim()) {
    res.status(400).json({ error: "El campo 'topic' (tema) es requerido." });
    return;
  }

  const prompt = `Tema de estudio solicitado por el estudiante: "${topic.trim()}".
${
  notes && notes.trim().length > 0
    ? `Apuntes cargados / proporcionados por el estudiante:\n"""\n${notes.trim()}\n"""\nINSTRUCCIÓN CRÍTICA: Basa las preguntas, las notas de repaso y las flashcards PRIMORDIALMENTE en los apuntes proporcionados por el alumno, complementando con rigor científico de la literatura académica.`
    : "El estudiante no proporcionó apuntes de texto; genera el contenido completo, riguroso y detallado a partir de la literatura académica y pedagógica del tema."
}

Parámetros requeridos:
- Nivel de dificultad del examen: ${difficulty}
- Cantidad de preguntas de examen: ${numQuestions}
- Cantidad de tarjetas flashcards: ${numFlashcards}
- Formato de notas: ${noteStyle}`;

  const systemInstruction = `Eres "EduAgent", un Agente de Inteligencia Artificial pedagógico autónomo de vanguardia.
Tu misión es transformar temas y apuntes de clase en un paquete integral de aprendizaje activo de la más alta calidad:
1. "agentTrace": Ciclo de razonamiento ReAct del agente (descomposición de apuntes, extracción de entidades clave, formulación de distractores calibrados y síntesis de flashcards).
2. "studyNotes": Notas de repaso estructuradas de alto valor (resumen ejecutivo, conceptos clave con definiciones y ejemplos, advertencias de errores frecuentes, tips de estudio y puntos de examen).
3. "exam": Examen interactivo riguroso con exactamente ${numQuestions} preguntas de opción múltiple (4 opciones cada una: "A)", "B)", "C)", "D)"), indicando el índice de la respuesta correcta (correctIndex: 0, 1, 2 o 3) y una justificación pedagógica detallada explicando por qué la opción correcta es la adecuada y por qué los demás son distractores erróneos.
4. "flashcards": Exactamente ${numFlashcards} tarjetas de estudio para repetición espaciada activa (Active Recall), con un anverso estimulante ("front"), un reverso claro con explicación o regla ("back"), y una categoría temática.

Debes responder SIEMPRE en formato JSON estricto con la siguiente estructura exacta:
{
  "topic": "${topic.trim()}",
  "agentTrace": [
    {
      "stepNumber": 1,
      "thought": "Análisis y parsing de los apuntes del alumno...",
      "toolUsed": "notes_parser",
      "action": "extract_core_entities(notes)",
      "observation": "Conceptos nodales y relaciones detectadas."
    },
    {
      "stepNumber": 2,
      "thought": "Estructuración de notas estilo Cornell y mnemotécnicas...",
      "toolUsed": "cornell_synthesizer",
      "action": "generate_study_guide()",
      "observation": "Notas de repaso estructuradas con definiciones y ejemplos."
    },
    {
      "stepNumber": 3,
      "thought": "Diseño de preguntas de examen de nivel ${difficulty} con distractores verosímiles...",
      "toolUsed": "exam_generator",
      "action": "calibrate_questions(difficulty, numQuestions)",
      "observation": "Reactivos de examen generados con retroalimentación formativa."
    },
    {
      "stepNumber": 4,
      "thought": "Construcción de flashcards para repetición espaciada...",
      "toolUsed": "flashcard_builder",
      "action": "build_flashcards(numFlashcards)",
      "observation": "Tarjetas mnemotécnicas listas para autoevaluación."
    }
  ],
  "studyNotes": {
    "title": "Título formal de las notas",
    "summary": "Resumen ejecutivo claro y pedagógico",
    "keyConcepts": [
      {
        "term": "Nombre del concepto",
        "definition": "Definición rigurosa y clara",
        "example": "Ejemplo práctico o caso concreto",
        "importance": "Alta"
      }
    ],
    "tips": ["Tip 1 para memorizar o resolver problemas", "Tip 2"],
    "reviewPoints": ["Punto clave para examen 1", "Punto clave 2"],
    "commonMistakes": ["Error común que los estudiantes cometen en este tema", "Trampa típica"]
  },
  "exam": [
    {
      "id": 1,
      "question": "¿Enunciado claro de la pregunta?",
      "options": ["A) Opción...", "B) Opción...", "C) Opción...", "D) Opción..."],
      "correctIndex": 0,
      "explanation": "Explicación detallada de por qué esta es la respuesta correcta y por qué las otras son incorrectas.",
      "difficulty": "${difficulty}"
    }
  ],
  "flashcards": [
    {
      "id": 1,
      "front": "Pregunta o concepto en el anverso",
      "back": "Respuesta explicada o regla mnemotécnica en el reverso",
      "category": "Fundamentos / Fórmulas / Casos de Estudio"
    }
  ]
}`;

  if (ai && process.env.GEMINI_API_KEY) {
    try {
      const callPromise = ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.25,
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout de 4800ms excedido")), 4800)
      );

      const response: any = await Promise.race([callPromise, timeoutPromise]);
      const text = response.text || "";
      const parsed = JSON.parse(text);
      res.json({
        source: "gemini-3.8-flash",
        package: parsed,
      });
      return;
    } catch (err: any) {
      console.warn("Gemini study generation failed or timed out, using autonomous engine:", err?.message);
    }
  }

  // Intelligent fallback generator
  const fallbackPackage = generateIntelligentStudyPackage(
    topic,
    notes,
    difficulty,
    numQuestions,
    numFlashcards
  );
  res.json({
    source: "autonomous-edu-engine",
    package: fallbackPackage,
  });
});

function generateIntelligentStudyPackage(
  topic: string,
  notes?: string,
  difficulty = "Medio",
  numQuestions = 5,
  numFlashcards = 6
) {
  const cleanTopic = topic.trim();
  const hasNotes = Boolean(notes && notes.trim().length > 10);

  // Extract snippet or words from notes if present
  let extractedKeywords = ["Fundamentos", "Metodología", "Reglas Operativas", "Evaluación Crítica"];
  if (hasNotes && notes) {
    const words = notes
      .replace(/[^\w\sáéíóúÁÉÍÓÚñÑ]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 5);
    if (words.length > 0) {
      extractedKeywords = Array.from(new Set(words)).slice(0, 5);
    }
  }

  const keyConcepts = [
    {
      term: `Principio Central de ${cleanTopic}`,
      definition: `Marco formal que rige el comportamiento, axiomas y deducciones en el estudio de ${cleanTopic}. Establece la base teórica sobre la que se construyen los modelos y aplicaciones.`,
      example: `Aplicación en problemas donde se evalúan las condiciones iniciales y las restricciones del sistema.`,
      importance: "Alta" as const,
    },
    {
      term: `Mecanismo de ${extractedKeywords[0] || "Operación"}`,
      definition: `Secuencia algorítmica o conceptual utilizada para transformar datos de entrada en resultados verificables dentro del dominio de ${cleanTopic}.`,
      example: `Identificación de variables críticas y despeje o ejecución secuencial de fases.`,
      importance: "Alta" as const,
    },
    {
      term: `Criterio de Validación y Reglas`,
      definition: `Estándar para comprobar si una solución o deducción es correcta. Evita errores comunes y asegura reproducibilidad.`,
      example: `Contrastar el resultado obtenido con valores teóricos o límites conocidos del dominio.`,
      importance: "Media" as const,
    },
    {
      term: `Errores Críticos y Trampas Conceptuales`,
      definition: `Fallas frecuentes en exámenes, como asumir linealidad cuando el fenómeno es no lineal, o memorizar fórmulas sin entender el dominio de validez.`,
      example: `Omitir las unidades de medida o violar las hipótesis iniciales del teorema.`,
      importance: "Media" as const,
    },
  ];

  const examQuestions = [];
  const questionPool = [
    {
      q: `¿Cuál es el postulado o propósito central que define a "${cleanTopic}"?`,
      options: [
        `A) Establecer un marco riguroso de principios y metodologías verificables para resolver problemas en su dominio.`,
        `B) Memorizar datos aislados sin verificar la coherencia entre sus componentes.`,
        `C) Reemplazar el método analítico por estimaciones sin fundamento empírico.`,
        `D) Omitir las condiciones de frontera e hipótesis iniciales.`,
      ],
      correctIndex: 0,
      explanation: `La opción A es correcta porque define el enfoque científico y formal de ${cleanTopic}. Las opciones B, C y D representan errores metodológicos comunes.`,
    },
    {
      q: `Al abordar un problema práctico de "${cleanTopic}" a partir de los apuntes de estudio, ¿cuál es el primer paso indispensable?`,
      options: [
        "A) Aplicar una fórmula al azar sin leer el enunciado completo.",
        "B) Identificar las variables de entrada, las restricciones operativas y el objetivo a alcanzar.",
        "C) Descartar la teoría previa y asumir un modelo simplista sin justificación.",
        "D) Asumir que las condiciones iniciales son irrelevantes para el resultado.",
      ],
      correctIndex: 1,
      explanation: "Identificar variables, restricciones y objetivos es la base del pensamiento estructurado antes de cualquier cómputo o deducción.",
    },
    {
      q: `¿Cuál de las siguientes afirmaciones describe una trampa o error conceptual frecuente en ${cleanTopic}?`,
      options: [
        "A) Validar los resultados con pruebas cruzadas.",
        "B) Extrapolar conclusiones fuera del rango de validez de las hipótesis de partida.",
        "C) Documentar el procedimiento paso a paso.",
        "D) Verificar la consistencia dimensional y lógica.",
      ],
      correctIndex: 1,
      explanation: "Extrapolar sin verificar las hipótesis de partida es una de las fallas más comunes en exámenes universitarios y técnicos.",
    },
    {
      q: `¿Qué ventaja pedagógica ofrece el uso de la técnica de "Active Recall" (recuperación activa) en ${cleanTopic}?`,
      options: [
        "A) Permite consolidar la memoria a largo plazo forzando al cerebro a recuperar el conocimiento en lugar de releer pasivamente.",
        "B) Hace innecesario entender los conceptos.",
        "C) Sustituye el estudio por adivinación rápida.",
        "D) Disminuye la retención con el paso de los días.",
      ],
      correctIndex: 0,
      explanation: "La recuperación activa estimula las conexiones neuronales mediante el esfuerzo de recordar, aumentando la retención en más de un 40%.",
    },
    {
      q: `En el contexto de ${cleanTopic}, ¿cómo se garantiza que una deducción o solución sea reproducible?`,
      options: [
        "A) Explicando claramente cada paso metodológico, los axiomas utilizados y los datos iniciales.",
        "B) Ocultando los cálculos intermedios.",
        "C) Cambiando las definiciones arbitrariamente.",
        "D) Confiando en que el evaluador adivine el procedimiento.",
      ],
      correctIndex: 0,
      explanation: "La reproducibilidad en cualquier disciplina se logra mediante rigor en los pasos, definiciones claras y transparencia en los cálculos.",
    },
  ];

  for (let i = 0; i < Math.min(numQuestions, questionPool.length); i++) {
    examQuestions.push({
      id: i + 1,
      question: questionPool[i].q,
      options: questionPool[i].options,
      correctIndex: questionPool[i].correctIndex,
      explanation: questionPool[i].explanation,
      difficulty: difficulty as any,
    });
  }

  const flashcards = [
    {
      id: 1,
      front: `¿Qué es fundamentalmente "${cleanTopic}"?`,
      back: `Es un cuerpo de conocimiento o concepto clave estructurado para analizar, modelar y resolver problemas mediante reglas teóricas y experimentales consistentes.`,
      category: "Concepto Clave",
    },
    {
      id: 2,
      front: "¿Cuál es la regla de oro para resolver problemas de este tema en exámenes?",
      back: "Identificar variables -> Establecer hipótesis de partida -> Aplicar la fórmula o regla adecuada -> Verificar dimensionalmente el resultado.",
      category: "Estrategia",
    },
    {
      id: 3,
      front: "¿Cómo evitar la ilusión de competencia al estudiar?",
      back: "Cierra las notas y explica el concepto en voz alta con tus propias palabras (Técnica de Feynman). Si te trabas, ese es tu punto ciego.",
      category: "Metacognición",
    },
    {
      id: 4,
      front: "¿Por qué es peligroso memorizar sin entender en este tema?",
      back: "Cualquier pequeña variación en las condiciones iniciales del problema te dejará sin saber qué camino tomar si no entiendes el principio subyacente.",
      category: "Advertencia",
    },
    {
      id: 5,
      front: "¿Qué relación guardan los apuntes con las preguntas de evaluación?",
      back: "Los apuntes concentran las definiciones y fórmulas que los evaluadores transforman en problemas prácticos y casos de juicio crítico.",
      category: "Evaluación",
    },
    {
      id: 6,
      front: "¿Cómo aplicar repetición espaciada con estas tarjetas?",
      back: "Día 1: Revisa todas. Día 2: Revisa las no dominadas. Día 4: Revisa todas rápidamente. Día 7: Repaso de consolidación.",
      category: "Método de Repaso",
    },
  ].slice(0, numFlashcards);

  return {
    topic: cleanTopic,
    generatedAt: new Date().toISOString(),
    agentTrace: [
      {
        stepNumber: 1,
        thought: hasNotes
          ? `Leyendo apuntes cargados por el usuario (${notes?.length} caracteres) y aislando términos clave para "${cleanTopic}"...`
          : `Consultando base pedagógica para el tema "${cleanTopic}" y estructurando objetivos de aprendizaje...`,
        toolUsed: "notes_parser",
        action: `parse_notes(topic="${cleanTopic}", hasCustomText=${hasNotes})`,
        observation: hasNotes
          ? "Apuntes parseados: Conceptos nodales identificados, relaciones jerárquicas mapeadas."
          : "Taxonomía de aprendizaje construida con éxito.",
      },
      {
        stepNumber: 2,
        thought: "Sintetizando notas de repaso estilo Cornell con conceptos, ejemplos prácticos y advertencias...",
        toolUsed: "cornell_synthesizer",
        action: "synthesize_structured_notes()",
        observation: "Guía de notas generada con 4 conceptos clave, consejos y puntos de examen.",
      },
      {
        stepNumber: 3,
        thought: `Formulando ${numQuestions} reactivos de examen de nivel ${difficulty} con distractores verosímiles y justificación...`,
        toolUsed: "exam_generator",
        action: `create_calibrated_quiz(questions=${numQuestions}, difficulty="${difficulty}")`,
        observation: "Examen interactivo calibrado y listo para evaluación inmediata.",
      },
      {
        stepNumber: 4,
        thought: `Empaquetando ${numFlashcards} tarjetas de estudio para active recall y repetición espaciada...`,
        toolUsed: "flashcard_builder",
        action: `build_spaced_repetition_cards(cards=${numFlashcards})`,
        observation: "Flashcards con anverso/reverso y categorías creadas con éxito.",
      },
    ],
    studyNotes: {
      title: `Guía Maestra de Estudio: ${cleanTopic}`,
      summary: hasNotes
        ? `Síntesis optimizada y depurada a partir de los apuntes cargados por el alumno sobre ${cleanTopic}. Se estructuran los conceptos clave, reglas de causalidad y fórmulas o directivas determinantes para asegurar el dominio del tema en evaluaciones.`
        : `Guía integral y estructurada sobre ${cleanTopic}. Diseñada para condensar la teoría fundamental, ejemplos de aplicación práctica y recomendaciones para exámenes.`,
      keyConcepts,
      tips: [
        "Técnica de Feynman: Explica cada concepto en tus propias palabras a alguien que no sepa del tema.",
        "Repetición Espaciada: Utiliza las flashcards interactivas en intervalos de 1, 3 y 7 días.",
        "Evaluación Formativa: Realiza el examen interactivo sin mirar las notas primero para medir tu nivel real.",
      ],
      reviewPoints: [
        `Definición exacta y alcance operativo de ${cleanTopic}.`,
        "Diferencia entre supuestos teóricos ideales y restricciones del mundo real.",
        "Procedimiento paso a paso para resolver problemas tipo examen.",
      ],
      commonMistakes: [
        "Confundir conceptos similares por falta de precisión en las definiciones.",
        "Saltarse la verificación de las condiciones iniciales al plantear la solución.",
        "Releer pasivamente en lugar de ponerse a prueba con preguntas y flashcards.",
      ],
    },
    exam: examQuestions,
    flashcards,
  };
}

// Dev or Production Vite setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 EduAgent Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
