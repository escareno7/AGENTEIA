import React from "react";
import { StudyAgentTraceStep } from "../types";
import { BrainCircuit, Cpu, Layers, CheckCircle2, Terminal } from "lucide-react";

interface AgentTraceViewProps {
  trace: StudyAgentTraceStep[];
  topic: string;
}

export const AgentTraceView: React.FC<AgentTraceViewProps> = ({ trace, topic }) => {
  return (
    <div className="space-y-4 animate-fade-in text-slate-200">
      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2.5">
          <BrainCircuit className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Traza de Razonamiento del Agente ReAct</h3>
            <p className="text-xs text-slate-400">
              Desglose paso a paso de cómo EduAgent procesó los apuntes y formuló el contenido
            </p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono">
          {trace.length} Pasos Autónomos
        </span>
      </div>

      <div className="space-y-3">
        {trace.map((step) => (
          <div
            key={step.stepNumber}
            className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold flex items-center justify-center font-mono">
                  {step.stepNumber}
                </span>
                <span className="text-xs font-bold text-white">
                  Herramienta Disparada: <code className="text-cyan-300 font-mono">{step.toolUsed}</code>
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Completado
              </span>
            </div>

            {/* Thought */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
              <span className="text-amber-400 font-bold shrink-0">🧠 Pensamiento:</span>
              <span className="italic leading-relaxed">{step.thought}</span>
            </div>

            {/* Action & Observation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2.5 rounded-xl bg-indigo-950/20 border border-indigo-800/30 text-indigo-300">
                <span className="text-[10px] uppercase font-bold text-indigo-400 block mb-0.5">
                  ⚙️ Acción (Tool Call)
                </span>
                <code className="text-[11px] break-all">{step.action}</code>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-emerald-300">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-0.5">
                  🔍 Observación del Entorno
                </span>
                <span className="text-[11px] font-sans leading-normal block">
                  {step.observation}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
