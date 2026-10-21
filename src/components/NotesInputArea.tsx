import React, { useRef, useState } from "react";
import {
  BookOpen,
  FileText,
  Upload,
  Sparkles,
  RotateCcw,
  Sliders,
  Check,
  FileCode,
  X,
} from "lucide-react";

interface NotesInputAreaProps {
  topic: string;
  setTopic: (t: string) => void;
  notesText: string;
  setNotesText: (n: string) => void;
  difficulty: "Fácil" | "Medio" | "Difícil" | "Avanzado";
  setDifficulty: (d: "Fácil" | "Medio" | "Difícil" | "Avanzado") => void;
  numQuestions: number;
  setNumQuestions: (n: number) => void;
  numFlashcards: number;
  setNumFlashcards: (n: number) => void;
  isLoading: boolean;
  onGenerate: () => void;
}

export const NotesInputArea: React.FC<NotesInputAreaProps> = ({
  topic,
  setTopic,
  notesText,
  setNotesText,
  difficulty,
  setDifficulty,
  numQuestions,
  setNumQuestions,
  numFlashcards,
  setNumFlashcards,
  isLoading,
  onGenerate,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const samplePresets = [
    {
      label: "Redes Neuronales",
      topic: "Redes Neuronales Artificiales y Backpropagation",
      notes:
        "Apuntes de Deep Learning: Las redes neuronales multicapa se componen de capa de entrada, capas ocultas y capa de salida. Cada neurona calcula la suma ponderada z = W*x + b y aplica una función de activación no lineal (ReLU, Sigmoid, Tanh). El algoritmo de backpropagation utiliza la regla de la cadena para calcular las derivadas parciales de la función de pérdida (Cross-Entropy, MSE) con respecto a cada peso sináptico. El optimizador actualiza los pesos según W = W - lr * dW. Problemas críticos: sobreajuste (overfitting), que se combate con Dropout y regularización L2; y desvanecimiento de gradientes (vanishing gradients), mitigado con funciones ReLU y normalización por lotes (Batch Normalization).",
    },
    {
      label: "Cálculo Diferencial",
      topic: "Cálculo Diferencial: Regla de la Cadena y Optimización",
      notes:
        "Notas de Cálculo: La derivada representa la tasa de cambio instantánea de una función. Regla de la cadena: d/dx[f(g(x))] = f'(g(x)) * g'(x). Para optimización de funciones continuas, los puntos críticos ocurren donde f'(x) = 0 o f'(x) no existe. Criterio de la primera derivada: si f' cambia de positivo a negativo, hay un máximo relativo; si cambia de negativo a positivo, hay un mínimo. Criterio de la segunda derivada: si f''(c) < 0 en punto crítico, es un máximo cóncavo hacia abajo; si f''(c) > 0, es un mínimo cóncavo hacia arriba. Puntos de inflexión donde f''(x) = 0 y cambia la concavidad.",
    },
    {
      label: "Bioquímica",
      topic: "Bioquímica Celular: Ciclo de Krebs y Respiración Celular",
      notes:
        "Apuntes de Biología y Bioquímica: El ciclo de Krebs (ciclo del ácido cítrico) ocurre en la matriz mitocondrial de las células eucariotas. El piruvato de la glucólisis se descarboxila a Acetil-CoA mediante el complejo piruvato deshidrogenasa. El Acetil-CoA (2C) se condensa con el oxalacetato (4C) para formar citrato (6C) mediante la citrato sintasa. A lo largo de una vuelta del ciclo se liberan 2 moléculas de CO2 y se generan 3 NADH, 1 FADH2 y 1 GTP/ATP por cada acetilo. Los transportadores de electrones NADH y FADH2 viajan a la cadena de transporte de electrones en la membrana mitocondrial interna, generando un gradiente electroquímico de protones que impulsa la ATP sintasa (fosforilación oxidativa) produciendo ~30-32 ATP por molécula de glucosa.",
    },
    {
      label: "Historia Universal",
      topic: "Historia Universal: Causas y Consecuencias de la Segunda Guerra Mundial",
      notes:
        "Apuntes de Historia: Causas principales: El Tratado de Versalles (1919) y las sanciones económicas a Alemania, el surgimiento del fascismo en Italia y el nacionalsocialismo en Alemania, la Gran Depresión de 1929 y el expansionismo del Imperio de Japón en Asia. Detonante: La invasión alemana a Polonia el 1 de septiembre de 1939. Bloques: Eje (Alemania, Italia, Japón) vs Aliados (Reino Unido, URSS, EE.UU., Francia). Puntos de inflexión: Batalla de Stalingrado (1942-1943) en el frente oriental y el Desembarco de Normandía (1944). Consecuencias: Creación de la ONU (1945), inicio de la Guerra Fría entre EE.UU. y la URSS, división de Alemania y el Plan Marshall para la reconstrucción europea.",
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      readFile(file);
    }
  };

  const readFile = (file: File) => {
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setNotesText(content);
      }
    };
    reader.readAsText(file);
  };

  const clearFile = () => {
    setUploadedFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Quick Presets Bar */}
      <div className="glass-panel p-3.5 rounded-2xl space-y-2 border border-slate-800">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Temas sugeridos de prueba rápida:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {samplePresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTopic(preset.topic);
                setNotesText(preset.notes);
                setUploadedFileName(null);
              }}
              className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/60 text-slate-300 hover:text-white text-xs font-medium transition-all"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5 shadow-xl">
        {/* Step 1: Topic */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            1. Tema de Estudio o Pregunta del Usuario
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Escribe el tema que deseas estudiar (ej. Termodinámica, Estructuras de Datos, Historia...)"
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
          />
        </div>

        {/* Step 2: Notes Upload / Paste */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-cyan-400" />
              2. Cargar o Pegar Apuntes de Clase
            </label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Subir Archivo (.txt, .md, .csv)</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".txt,.md,.json,.csv,.rtf"
              className="hidden"
            />
          </div>

          {/* Drag & Drop Box */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`relative rounded-xl border transition-all ${
              isDragOver
                ? "border-cyan-400 bg-cyan-950/20"
                : "border-slate-700/80 bg-slate-900/90"
            }`}
          >
            {uploadedFileName && (
              <div className="flex items-center justify-between p-2.5 bg-indigo-950/40 border-b border-indigo-800/40 text-xs text-indigo-200 rounded-t-xl">
                <span className="flex items-center gap-1.5 font-medium truncate">
                  <FileCode className="w-4 h-4 text-indigo-400 shrink-0" />
                  Archivo cargado: <strong className="text-white">{uploadedFileName}</strong>
                </span>
                <button
                  onClick={clearFile}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Quitar archivo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <textarea
              rows={6}
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Pega aquí tus notas de clase, resúmenes, párrafos de lecturas o fórmulas... O arrastra un archivo de texto directamente."
              className="w-full p-3.5 bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none resize-none font-mono leading-relaxed"
            />

            <div className="flex items-center justify-between px-3 py-2 border-t border-slate-800/80 text-[10px] text-slate-500">
              <span>
                {notesText.trim().length > 0
                  ? `${notesText.length} caracteres • El Agente priorizará este contenido`
                  : "Opcional: Si no cargas apuntes, el Agente usará su corpus académico"}
              </span>
              {notesText.length > 0 && (
                <button
                  onClick={() => {
                    setNotesText("");
                    clearFile();
                  }}
                  className="text-slate-400 hover:text-rose-400"
                >
                  Limpiar apuntes
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Step 3: Options (Difficulty, Questions, Flashcards) */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            3. Parámetros del Agente de Estudio
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Dificultad del Examen
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="Fácil">Fácil (Conceptos Básicos)</option>
                <option value="Medio">Medio (Aplicación &amp; Análisis)</option>
                <option value="Difícil">Difícil (Problemas Complejos)</option>
                <option value="Avanzado">Avanzado (Nivel Examen Final)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Preguntas de Examen
              </label>
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value={3}>3 Reactivos</option>
                <option value={5}>5 Reactivos (Recomendado)</option>
                <option value={8}>8 Reactivos</option>
                <option value={10}>10 Reactivos</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Tarjetas Flashcards
              </label>
              <select
                value={numFlashcards}
                onChange={(e) => setNumFlashcards(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value={4}>4 Tarjetas</option>
                <option value={6}>6 Tarjetas (Recomendado)</option>
                <option value={8}>8 Tarjetas</option>
                <option value={12}>12 Tarjetas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={onGenerate}
          disabled={isLoading || !topic.trim()}
          className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
            isLoading
              ? "bg-slate-800 text-slate-400 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-indigo-600/30 hover:shadow-cyan-500/20"
          }`}
        >
          {isLoading ? (
            <>
              <RotateCcw className="w-5 h-5 animate-spin text-cyan-300" />
              <span>EduAgent: Analizando Apuntes &amp; Construyendo Paquete...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-white" />
              <span>Generar Examen, Notas y Flashcards con IA</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
