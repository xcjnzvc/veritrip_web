// import { create } from "zustand";

// interface SurveyState {
//   answers: Record<number, string[]>;
//   setAnswer: (step: number, selected: string[]) => void;
//   resetSurvey: () => void;
// }

// export const useSurveyStore = create<SurveyState>((set) => ({
//   answers: {},

//   setAnswer: (step, selected) =>
//     set((state) => ({
//       answers: { ...state.answers, [step]: selected },
//     })),

//   resetSurvey: () => set({ answers: {} }),
// }));
