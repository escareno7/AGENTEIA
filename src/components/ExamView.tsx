import React, { useState } from "react";
import { ExamQuestion } from "../types";
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  HelpCircle,
  Sparkles,
  Printer,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

interface ExamViewProps {
  questions: ExamQuestion[];
  topic: string;
}

export const ExamView: React.FC<ExamViewProps> = ({ questions, topic }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isGraded, setIsGraded] = useState<boolean>(false);

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (isGraded) return; // Prevent changing after submission
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });
    const percentage = Math.round((correctCount / questions.length) * 100);
    return {
      correctCount,
      total: questions.length,
      percentage,
      passed: percentage >= 70,
    };
  };

  const scoreData = isGraded ? calculateScore() : null;
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="space-y-6 animate-fade-in text-slate-200">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">
            Evaluación Diagnóstica Interactiva
          </span>
          <h2 className="text-base font-bold text-white tracking-tight">
            Examen: {topic}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400">
            {answeredCount} de {questions.length} respondidas
          </span>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Imprimir Examen</span>
          </button>
        </div>
      </div>

      {/* Score Result Banner when graded */}
      {scoreData && (
        <div
          className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in ${
            scoreData.passed
              ? "bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/40"
              : "bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/40"
          }`}
        >
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                scoreData.passed
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-amber-500/20 text-amber-400"
              }`}
            >
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {scoreData.passed ? "¡Felicidades, Examen Aprobado!" : "Buen Intento, Requiere Repaso"}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Obtuviste <strong>{scoreData.correctCount} de {scoreData.total}</strong> aciertos.
                Revisa las justificaciones pedagógicas abajo para consolidar los puntos débiles.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right font-mono">
              <span className="text-[10px] text-slate-400 block uppercase">Calificación</span>
              <span
                className={`text-2xl font-black ${
                  scoreData.passed ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {scoreData.percentage}%
              </span>
            </div>

            <button
              onClick={() => {
                setSelectedAnswers({});
                setIsGraded(false);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar</span>
            </button>
          </div>
        </div>
      )}

      {/* Questions Stack */}
      <div className="space-y-4">
        {questions.map((q, idx) => {
          const isAnswered = selectedAnswers[q.id] !== undefined;
          const userChoice = selectedAnswers[q.id];
          const isUserCorrect = isAnswered && userChoice === q.correctIndex;

          return (
            <div
              key={q.id}
              className={`p-5 rounded-2xl border transition-all ${
                isGraded
                  ? isUserCorrect
                    ? "bg-slate-900/90 border-emerald-500/40"
                    : "bg-slate-900/90 border-rose-500/40"
                  : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 font-mono">
                    {idx + 1}
                  </span>
                  <h4 className="text-sm font-semibold text-white leading-relaxed">
                    {q.question}
                  </h4>
                </div>

                {isGraded && (
                  <span className="shrink-0 flex items-center gap-1 text-xs font-semibold">
                    {isUserCorrect ? (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" /> Correcto
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-400">
                        <XCircle className="w-4 h-4" /> Incorrecto
                      </span>
                    )}
                  </span>
                )}
              </div>

              {/* Options Grid */}
              <div className="space-y-2 pt-3">
                {q.options.map((opt, optIdx) => {
                  const isSelected = userChoice === optIdx;
                  const isThisCorrect = q.correctIndex === optIdx;

                  let optionStyle =
                    "bg-slate-950/70 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:text-white";

                  if (isGraded) {
                    if (isThisCorrect) {
                      optionStyle =
                        "bg-emerald-950/50 border-emerald-500/70 text-emerald-200 font-medium shadow-md shadow-emerald-950";
                    } else if (isSelected && !isThisCorrect) {
                      optionStyle =
                        "bg-rose-950/50 border-rose-500/70 text-rose-300 line-through";
                    } else {
                      optionStyle = "bg-slate-950/30 border-slate-800/40 text-slate-500 opacity-60";
                    }
                  } else if (isSelected) {
                    optionStyle =
                      "bg-indigo-950/60 border-indigo-500/70 text-indigo-200 font-semibold shadow-md shadow-indigo-950";
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      disabled={isGraded}
                      className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${optionStyle}`}
                    >
                      <span className="leading-snug">{opt}</span>
                      {isGraded && isThisCorrect && (
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 shrink-0">
                          Respuesta Correcta
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Detailed Formative Explanation */}
              {isGraded && (
                <div className="mt-3.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-1 animate-fade-in">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-bold uppercase text-[10px] tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Retroalimentación Pedagógica del Agente:</span>
                  </div>
                  <p>{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-400">
          {!isGraded ? (
            <span>
              Responde todas las preguntas y haz clic en <strong>Calificar Examen</strong>.
            </span>
          ) : (
            <span>
              Puedes hacer clic en <strong>Reiniciar</strong> para volver a practicar.
            </span>
          )}
        </div>

        {!isGraded ? (
          <button
            onClick={() => setIsGraded(true)}
            disabled={answeredCount === 0}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
          >
            Calificar Examen ({answeredCount}/{questions.length})
          </button>
        ) : (
          <button
            onClick={() => {
              setSelectedAnswers({});
              setIsGraded(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Volver a Intentar</span>
          </button>
        )}
      </div>
    </div>
  );
};
