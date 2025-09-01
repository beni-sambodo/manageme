import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Type {
  removeImgID: (imageId: string[] | undefined) => void;
  imageId: string[] | null;
  updateImgId: (imageId: string | null) => void;
  BannerImageId: string[] | null;
  updateBannerImgId: (imageId: string | null) => void;
}

export const useSecondStore = create<Type>()(
  devtools((set) => ({
    imageId: null,
    removeImgID: (imageId: any) => set(() => ({ imageId })),
    updateImgId: (newImageId) =>
      set((state) => ({
        imageId: newImageId
          ? state.imageId
            ? Array.isArray(newImageId)
              ? [...state.imageId, ...newImageId]
              : [...state.imageId, newImageId]
            : Array.isArray(newImageId)
            ? newImageId
            : [newImageId]
          : null,
      })),
    BannerImageId: null,
    updateBannerImgId: (BannerImageId: any) => set(() => ({ BannerImageId })),
  }))
);
