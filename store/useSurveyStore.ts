import { create } from "zustand";

interface SurveyState {
  step: number; // 현재 단계
  totalSteps: number; // 전체 단계 (여기서 관리!)
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetStep: () => void;
}

export const useSurveyStore = create<SurveyState>((set) => ({
  step: 1,
  totalSteps: 6, // 나중에 문항이 늘어나면 이 숫자만 바꾸면 끝!

  setStep: (step) => set({ step }),

  // 다음 버튼: 이제 '6' 대신 'state.totalSteps'를 사용합니다.
  nextStep: () =>
    set((state) => ({
      step: state.step < state.totalSteps ? state.step + 1 : state.step,
    })),

  prevStep: () =>
    set((state) => ({
      step: state.step > 1 ? state.step - 1 : state.step,
    })),

  resetStep: () => set({ step: 1 }),
}));
