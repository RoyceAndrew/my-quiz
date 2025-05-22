import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'

type QuizStore = {
    answered: number,
    correct: number,
    score: number,
    time: number,
    total: number,
    wrong: number,
    setAnswered: () => void;
    setCorrect: () => void;
    setReset: () => void;
    setScore: () => void;
    refreshTime: (value: number) => void;
    setAll: (value: QuizData) => void;
    setTimeout: () => void;
    setWrong: () => void;
    setTime: () => void;
    setAnswer: () => void;
}

interface QuizData {
  answered: number;
  correct: number;
  score: number;
  total: number;
  wrong: number;
  time: number;
}

export const useQuiz = create<QuizStore>()(
    persist(
        (set) => ({
            answered: 0,
            correct: 0,
            score: 0,
            time: 0,
            total: 0,
            wrong: 0,
            setAnswered: () => set((state) => ({ answered:state.answered + 1 })),
            setCorrect: () => set((state) => ({ answered:state.answered + 1, correct: state.correct + 1 })),
            setScore: () => set((state) => ({ score: (state.correct / state.answered) * 100 })),
            setWrong: () => set((state) => ({ wrong: state.wrong + 1 })),
            setAnswer: () => set((state) => ({ total: state.correct + state.wrong })),
            setTimeout: () => set({ answered: 10 }),
            setReset: () => set({ answered: 0, correct: 0, score: 0, time: 100, wrong: 0, total: 0 }),
            setAll: (value) => set({ answered: value.answered, correct: value.correct, score: value.score, time: value.time, wrong: value.wrong, total: value.total }),
            refreshTime: (value) => set({ time: value }), 
            setTime: () => set((state) => ({ time: state.time - 1 })),
        }),
        
        {
            name: "quiz",
            storage: createJSONStorage(() => localStorage)
        }
    )
);