import React, { useState } from "react";
import { StudyNotes } from "../types";
import {
  FileText,
  Copy,
  Check,
  Printer,
  Sparkles,
  BookOpen,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";

interface NotesViewProps {
  notes: StudyNotes;
  topic: string;
}

export const NotesView: React.FC<NotesViewProps> = ({ notes, topic }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const markdown = `# ${notes.title}\n\n**Tema:** ${topic}\n\n## Resumen Ejecutivo\n${notes.summary}\n\n## Conceptos Clave\n${notes.keyConcepts
      .map(
        (c, i) =>
          `### ${i + 1}. ${c.term} [Importancia: ${c.importance || "Alta"}]\n- **Definición:** ${
            c.definition
          }\n${c.example ? `- **Ejemplo:** ${c.example}\n` : ""}`
      )
      .join("\n")}\n\n## Errores Frecuentes a Evitar\n${(notes.commonMistakes || [])
      .map((m) => `- ⚠️ ${m}`)
      .join("\n")}\n\n## Consejos de Memorización y Examen\n${notes.tips
      .map((t) => `- 💡 ${t}`)
      .join("\n")}\n\n## Puntos Críticos de Repaso\n${notes.reviewPoints
      .map((p) => `- ✅ ${p}`)
      .join("\n")}`;

    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-200">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
            Guía de Estudio Generada por Agente IA
          </span>
          <h2 className="text-base font-bold text-white tracking-tight">{notes.title}</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copiado en Markdown" : "Copiar Notas"}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* Summary Box */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/30 via-slate-900 to-slate-900 border border-indigo-500/30 space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          Resumen Ejecutivo del Tema
        </h3>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed text-justify">
          {notes.summary}
        </p>
      </div>

      {/* Key Concepts Grid (Cornell style) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          Glosario de Conceptos Clave y Fórmulas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {notes.keyConcepts.map((concept, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                    {concept.term}
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                    {concept.importance || "Pilar"}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {concept.definition}
                </p>
              </div>

              {concept.example && (
                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-cyan-300 font-mono">
                  <span className="text-slate-500 font-bold">Ejemplo: </span>
                  {concept.example}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Common Mistakes & Study Tips Two-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Common Mistakes */}
        {notes.commonMistakes && notes.commonMistakes.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
            <h4 className="font-bold text-amber-300 flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Errores Comunes y Trampas en Exámenes
            </h4>
            <ul className="space-y-1.5 text-slate-300 pl-4 list-disc text-[11px] leading-relaxed">
              {notes.commonMistakes.map((mistake, i) => (
                <li key={i}>{mistake}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Study Tips */}
        {notes.tips && notes.tips.length > 0 && (
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
            <h4 className="font-bold text-emerald-300 flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
              <Lightbulb className="w-4 h-4 text-emerald-400" />
              Consejos de Estudio y Memorización
            </h4>
            <ul className="space-y-1.5 text-slate-300 pl-4 list-disc text-[11px] leading-relaxed">
              {notes.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Review Points Checklist */}
      {notes.reviewPoints && notes.reviewPoints.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            Puntos Críticos para Verificar Antes del Examen
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
            {notes.reviewPoints.map((pt, i) => (
              <div
                key={i}
                className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2"
              >
                <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[10px] shrink-0 font-bold">
                  {i + 1}
                </span>
                <span className="truncate">{pt}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
