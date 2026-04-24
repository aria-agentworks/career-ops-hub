import { create } from 'zustand';

type View = 'dashboard' | 'evaluate' | 'jobs' | 'tracker' | 'resumes' | 'profile';

interface NavStore {
  activeView: View;
  setActiveView: (view: View) => void;
}

export const useNavStore = create<NavStore>((set) => ({
  activeView: 'dashboard',
  setActiveView: (view) => set({ activeView: view }),
}));
