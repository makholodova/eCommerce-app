import { ref } from "vue";
import type { Ref } from "vue";

export type ModalType = "edit" | "password" | "address" | null;

export function useModal(): {
  modalState: Ref<ModalType>;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
} {
  const modalState = ref<ModalType>(null);

  function openModal(type: ModalType): void {
    modalState.value = type;
  }
  function closeModal(): void {
    modalState.value = null;
  }

  return {
    modalState,
    openModal,
    closeModal,
  };
}
