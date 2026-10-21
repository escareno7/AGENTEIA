/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { StudyPackage } from "./types";
import { Header } from "./components/Header";
import { NotesInputArea } from "./components/NotesInputArea";
import { NotesView } from "./components/NotesView";
import { ExamView } from "./components/ExamView";
import { FlashcardsView } from "./components/FlashcardsView";
import { AgentTraceView } from "./components/AgentTraceView";
import {
  FileText,
  Award,
  Layers,
  BrainCircuit,
  Sliders,
  Sparkles,
  ArrowLeft,
  AlertCircle,
  GraduationCap,
} from "lucide-react";

export default function App() {
  const [topic, setTopic] = useState<string>("Redes Neuronales y Backpropagation");
  const [notesText, setNotesText] = useState<string>(
    "Apuntes de clase: Las redes neuronales profundas se componen de capas de entrada, ocultas y de salida. El algoritmo de retropropagación (backpropagation) utiliza la regla de la cadena del cálculo multivariable para calcular el gradiente de la función de pérdida respecto a cada peso sináptico. El optimizador de descenso de gradiente (SGD, Adam) actualiza los pesos en dirección opuesta al gradiente para minimizar el error. La tasa de aprendizaje (learning rate) controla el tamaño del paso. Problemas comunes: desvanecimiento del gradiente (vanishing gradient) y sobreajuste (overfitting)."
  );
  const [difficulty, setDifficulty] = useState<"Fácil" | "Medio" | "Difícil" | "Avanzado">("Medio");
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [numFlashcards, setNumFlashcards] = useState<number>(6);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [studyPackage, setStudyPackage] = useState<StudyPackage | null>(null);
  const [activeTab, setActiveTab] = useState<"notes" | "exam" | "flashcards" | "trace">("notes");
  const [showConfigDrawer, setShowConfigDrawer] = useState<boolean>(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/study/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          notes: notesText,
          difficulty,
          numQuestions,
          numFlashcards,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en el servidor: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.package) {
        throw new Error("Respuesta incompleta del agente");
      }

      setStudyPackage(data.package);
      setActiveTab("notes");
      setShowConfigDrawer(false);
    } catch (err: any) {
      console.error("Error generating study package:", err);
      setErrorMsg("Ocurrió un error al procesar la solicitud. Por favor intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStudyPackage(null);
    setTopic("");
    setNotesText("");
    setShowConfigDrawer(false);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Header */}
      <Header onReset={handleReset} hasContent={Boolean(studyPackage)} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-6">
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 text-rose-200 text-xs flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-slate-400 hover:text-white text-xs underline"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* VIEW 1: Input Studio (When no package generated yet or editing config) */}
        {!studyPackage || showConfigDrawer ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {studyPackage && (
              <button
                onClick={() => setShowConfigDrawer(false)}
                className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver a los Resultados de Estudio</span>
              </button>
            )}

            <div className="text-center space-y-2 max-w-xl mx-auto pb-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Agente de Aprendizaje Acelerado</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                ¿Qué deseas estudiar hoy?
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Ingresa el tema y carga tus apuntes de clase. El Agente de IA creará un examen interactivo calificado, notas de repaso Cornell y flashcards mnemotécnicas.
              </p>
            </div>

            <NotesInputArea
              topic={topic}
              setTopic={setTopic}
              notesText={notesText}
              setNotesText={setNotesText}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              numQuestions={numQuestions}
              setNumQuestions={setNumQuestions}
              numFlashcards={numFlashcards}
              setNumFlashcards={setNumFlashcards}
              isLoading={isLoading}
              onGenerate={handleGenerate}
            />
          </div>
        ) : (
          /* VIEW 2: Results Studio (Generated Package Tabs) */
          <div className="space-y-6 animate-fade-in">
            {/* Top Navigation Switcher Bar */}
            <div className="glass-panel p-2.5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto max-w-full">
                <button
                  onClick={() => setActiveTab("notes")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === "notes"
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Notas de Repaso</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-950/80 border border-indigo-800 text-indigo-300">
                    {studyPackage.studyNotes.keyConcepts.length} Conceptos
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("exam")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === "exam"
                      ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Examen Interactivo</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300">
                    {studyPackage.exam.length} Reactivos
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("flashcards")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === "flashcards"
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Flashcards</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-950/80 border border-purple-800 text-purple-300">
                    {studyPackage.flashcards.length} Tarjetas
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("trace")}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === "trace"
                      ? "bg-amber-600/30 text-amber-300 border border-amber-500/40"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                  title="Ver traza interna de razonamiento del agente"
                >
                  <BrainCircuit className="w-3.5 h-3.5 text-amber-400" />
                  <span>Traza ReAct</span>
                </button>
              </div>

              {/* Edit inputs trigger button */}
              <button
                onClick={() => setShowConfigDrawer(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Modificar Apuntes / Tema</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="pt-2">
              {activeTab === "notes" && (
                <NotesView notes={studyPackage.studyNotes} topic={studyPackage.topic} />
              )}

              {activeTab === "exam" && (
                <ExamView questions={studyPackage.exam} topic={studyPackage.topic} />
              )}

              {activeTab === "flashcards" && (
                <FlashcardsView
                  flashcards={studyPackage.flashcards}
                  topic={studyPackage.topic}
                />
              )}

              {activeTab === "trace" && (
                <AgentTraceView
                  trace={studyPackage.agentTrace}
                  topic={studyPackage.topic}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-slate-800/80 bg-slate-950/60 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span>
              EduAgent AI: Tu Asistente y Tutor Autónomo de Aprendizaje
            </span>
          </div>
          <div className="text-slate-400 text-[11px]">
            Desarrollado con arquitectura ReAct &amp; Google Gemini 3.8 Flash
          </div>
        </div>
      </footer>
    </div>
  );
}
