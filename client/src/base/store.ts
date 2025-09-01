import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { User } from "../Types/Types";

interface Type {
  user: User | null;
  updateUser: (user: User | null) => void;
  isStudentModalOpen: boolean;
  setStudentModalOpen: (isOpen: boolean) => void;
}

export const useStore = create<Type>()(
  devtools((set) => ({
    user: null,
    updateUser: (user) => set(() => ({ user })),
    isStudentModalOpen: false,
    setStudentModalOpen: (isOpen) => set(() => ({ isStudentModalOpen: isOpen })),
  }))
);
