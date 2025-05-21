import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'

type QuizStore = {
    answered: number,
    correct: number,
    score: number,
    time: number,
    setAnswered: () => void;
    setCorrect: () => void;
    setReset: () => void;
    setScore: () => void;
    refreshTime: (value: number) => void;
    setAll: (value: QuizData) => void;
    setTimeout: () => void;
    setTime: () => void;
}

interface QuizData {
  answered: number;
  correct: number;
  score: number;
  time: number;
}

export const useQuiz = create<QuizStore>()(
    persist(
        (set) => ({
            answered: 0,
            correct: 0,
            score: 0,
            time: 0,
            setAnswered: () => set((state) => ({ answered:state.answered + 1 })),
            setCorrect: () => set((state) => ({ answered:state.answered + 1, correct: state.correct + 1 })),
            setScore: () => set((state) => ({ score: (state.correct / state.answered) * 100 })),
            setTimeout: () => set({ answered: 10 }),
            setReset: () => set({ answered: 0, correct: 0, score: 0, time: 300 }),
            setAll: (value) => set({ answered: value.answered, correct: value.correct, score: value.score, time: value.time }),
            refreshTime: (value) => set({ time: value }), 
            setTime: () => set((state) => ({ time: state.time - 1 })),
        }),
        
        {
            name: "quiz",
            storage: createJSONStorage(() => localStorage)
        }
    )
);