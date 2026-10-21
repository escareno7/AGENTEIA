export interface ExamQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty?: "Fácil" | "Medio" | "Difícil" | "Avanzado";
}

export interface Flashcard {
  id: number;
  front: string;
  back: string;
  category: string;
  mastered?: boolean;
}

export interface KeyConcept {
  term: string;
  definition: string;
  example?: string;
  importance?: "Alta" | "Media" | "Básica";
}

export interface StudyNotes {
  title: string;
  summary: string;
  keyConcepts: KeyConcept[];
  tips: string[];
  reviewPoints: string[];
  commonMistakes?: string[];
  summaryMarkdown?: string;
}

export interface StudyAgentTraceStep {
  stepNumber: number;
  thought: string;
  toolUsed: string;
  action: string;
  observation: string;
}

export interface StudyPackage {
  topic: string;
  agentTrace: StudyAgentTraceStep[];
  studyNotes: StudyNotes;
  exam: ExamQuestion[];
  flashcards: Flashcard[];
  generatedAt?: string;
}

export interface GenerationOptions {
  difficulty: "Fácil" | "Medio" | "Difícil" | "Avanzado";
  numQuestions: number;
  numFlashcards: number;
  noteStyle: "cornell" | "resumen" | "detallado";
}
