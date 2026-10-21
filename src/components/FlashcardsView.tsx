import React, { useState, useEffect } from "react";
import { Flashcard } from "../types";
import {
  Layers,
  RotateCw,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Eye,
  ListFilter,
  Check,
  Sparkles,
} from "lucide-react";

interface FlashcardsViewProps {
  flashcards: Flashcard[];
  topic: string;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ flashcards, topic }) => {
  const [cards, setCards] = useState<Flashcard[]>(flashcards);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteredMap, setMasteredMap] = useState<Record<number, boolean>>({});
  const [viewMode, setViewMode] = useState<"card" | "grid">("card");

  // Keep cards in sync when props change
  useEffect(() => {
    setCards(flashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [flashcards]);

  // Keyboard navigation
  useEffect(() => {
    if (viewMode !== "card") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, cards.length, viewMode]);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => Math.min(prev + 1, cards.length - 1));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const toggleMastered = (id: number) => {
    setMasteredMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const currentCard = cards[currentIndex];
  const masteredCount = Object.values(masteredMap).filter(Boolean).length;
  const progressPercent = Math.round(((currentIndex + 1) / cards.length) * 100);

  if (!currentCard) return null;

  return (
    <div className="space-y-6 animate-fade-in text-slate-200">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">
            Tarjetas de Estudio con Repetición Espaciada (Active Recall)
          </span>
          <h2 className="text-base font-bold text-white tracking-tight">
            Flashcards: {topic}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={shuffleCards}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            title="Barajar tarjetas al azar"
          >
            <Shuffle className="w-3.5 h-3.5 text-purple-400" />
            <span>Barajar</span>
          </button>

          <button
            onClick={() => setViewMode(viewMode === "card" ? "grid" : "card")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <ListFilter className="w-3.5 h-3.5 text-cyan-400" />
            <span>{viewMode === "card" ? "Ver Cuadrícula" : "Modo Práctica"}</span>
          </button>
        </div>
      </div>

      {viewMode === "card" ? (
        <div className="space-y-5 max-w-2xl mx-auto">
          {/* Progress Indicators */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>
                Tarjeta <strong className="text-white font-bold">{currentIndex + 1}</strong> de{" "}
                {cards.length}
              </span>
              <span className="text-emerald-400 font-semibold">
                Dominadas: {masteredCount} / {cards.length}
              </span>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* 3D Flip Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer group relative w-full min-h-[300px] rounded-3xl p-8 flex flex-col justify-between text-center transition-all duration-500 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-purple-950/30 border-2 border-indigo-500/40 hover:border-indigo-400 shadow-2xl hover:shadow-indigo-500/20 select-none"
          >
            {/* Top Category Badge */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-purple-300 font-semibold">
                {currentCard.category || "Concepto"}
              </span>

              <span className="flex items-center gap-1 text-[10px] text-slate-500 font-sans">
                <RotateCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
                {isFlipped ? "Reverso (Respuesta)" : "Anverso (Pregunta)"}
              </span>
            </div>

            {/* Main Content Area */}
            <div className="my-auto py-6 px-4">
              {!isFlipped ? (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block">
                    ¿Cuál es la respuesta o concepto?
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                    {currentCard.front}
                  </h3>
                </div>
              ) : (
                <div className="space-y-2 animate-fade-in">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                    Explicación y Regla:
                  </span>
                  <p className="text-sm sm:text-base text-cyan-200 font-medium leading-relaxed">
                    {currentCard.back}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Tip */}
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span className="hidden sm:inline">Presiona [Espacio] para voltear • [← / →] para navegar</span>
              <span className="sm:hidden">Toca para voltear</span>
              <span className="text-indigo-400/80 font-medium">Active Recall</span>
            </div>
          </div>

          {/* Navigation and Mastery Controls */}
          <div className="flex items-center justify-between pt-2 gap-3">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 disabled:opacity-40 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <button
              onClick={() => toggleMastered(currentCard.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                masteredMap[currentCard.id]
                  ? "bg-emerald-950/70 border-emerald-500/70 text-emerald-300 shadow-md shadow-emerald-950"
                  : "bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-emerald-500/40"
              }`}
            >
              <CheckCircle2
                className={`w-4 h-4 ${
                  masteredMap[currentCard.id] ? "text-emerald-400" : "text-slate-500"
                }`}
              />
              <span>
                {masteredMap[currentCard.id] ? "¡Ya me la sé!" : "Marcar como Dominada"}
              </span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === cards.length - 1}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 disabled:opacity-40 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Grid View Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {cards.map((card, idx) => {
            const isMastered = masteredMap[card.id];
            return (
              <div
                key={card.id}
                className={`p-5 rounded-2xl border space-y-3 bg-slate-900/90 transition-all ${
                  isMastered ? "border-emerald-500/40" : "border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-400">Tarjeta #{idx + 1}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-purple-300 border border-slate-700">
                    {card.category}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Pregunta</span>
                  <h4 className="text-sm font-bold text-white">{card.front}</h4>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-cyan-400">Respuesta</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{card.back}</p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => toggleMastered(card.id)}
                    className={`text-xs flex items-center gap-1 px-3 py-1 rounded-lg border transition-all ${
                      isMastered
                        ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-300"
                        : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isMastered ? "Dominada" : "Marcar"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
