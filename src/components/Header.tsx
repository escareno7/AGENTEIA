import React from "react";
import { GraduationCap, Sparkles, Printer, RotateCcw } from "lucide-react";

interface HeaderProps {
  onReset: () => void;
  hasContent: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onReset, hasContent }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight leading-none">
                EduAgent <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">AI</span>
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Generador Autónomo de Exámenes, Notas de Repaso y Flashcards
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {hasContent && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
              title="Comenzar con un nuevo tema"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Nuevo Tema</span>
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
            title="Imprimir notas o examen"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Imprimir / PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
