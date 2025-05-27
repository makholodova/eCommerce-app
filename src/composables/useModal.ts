import { ref } from "vue";
import type { Ref } from "vue";

export type ModalType = "edit" | "password" | null;

export function useModal(): {
  openedModal: Ref<ModalType>;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
} {
  const openedModal = ref<ModalType>(null);

  function openModal(type: ModalType): void {
    openedModal.value = type;
  }
  function closeModal(): void {
    openedModal.value = null;
  }

  return {
    openedModal,
    openModal,
    closeModal,
  };
}
