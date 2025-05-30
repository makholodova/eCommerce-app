<script lang="ts" setup>
import { computed, ref } from "vue";
import { useUserProfileStore } from "@/store/useUserProfileStore.ts";
import { useModal } from "@/composables/useModal.ts";
import { showError, showSuccess } from "@/utils/toast.ts";
import UserProfileForm from "@/components/profile/forms/UserProfileForm.vue";
import UserPasswordForm from "@/components/profile/forms/UserPasswordForm.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import type { UserFormModel } from "@/types/interfaces.ts";

const userProfileStore = useUserProfileStore();
const { modalState, openModal, closeModal } = useModal();

const personalInfo = computed(() => ({
  Имя: userProfileStore.firstName,
  Фамилия: userProfileStore.lastName,
  "E-mail": userProfileStore.email,
  "Дата рождения": userProfileStore.dateOfBirth,
}));

const editableUser = ref<UserFormModel>({
  firstName: userProfileStore.firstName,
  lastName: userProfileStore.lastName,
  email: userProfileStore.email,
  dateOfBirth: userProfileStore.dateOfBirth,
});

const openProfileEditModal = (): void => {
  editableUser.value = {
    firstName: userProfileStore.firstName,
    lastName: userProfileStore.lastName,
    email: userProfileStore.email,
    dateOfBirth: userProfileStore.dateOfBirth,
  };
  openModal("edit");
};

const submitProfileChanges = async (): Promise<void> => {
  try {
    await userProfileStore.updatePersonalInfo(editableUser.value);
    showSuccess("Профиль успешно обновлён");
  } catch (e) {
    if (e instanceof Error) {
      showError(e.message);
    }
  } finally {
    closeModal();
  }
};

const openPasswordChangeModal = (): void => {
  openModal("password");
};

const submitPasswordChange = (): void => {
  try {
    showSuccess("Пароль успешно обновлён");
  } catch (e) {
    // выводить конкретные ошибки
    if (e instanceof Error) {
      showError(`Не удалось обновить пароль, ${e.message}`);
    }
  } finally {
    closeModal();
  }
};
</script>

<template>
  <div class="profile-section">
    <div class="profile-info">
      <div v-for="(value, label) in personalInfo" :key="label" class="field">
        <span class="field-label">{{ label }}: </span>
        <span class="field-content">{{ value }}</span>
      </div>
    </div>

    <BaseButton
      text="Изменить пароль"
      type="button"
      @click="openPasswordChangeModal"
    />
    <BaseButton
      text="Редактировать профиль"
      type="button"
      @click="openProfileEditModal"
    />

    <BaseModal
      v-if="modalState === 'edit'"
      :title="'Редактировать профиль'"
      :is-open="true"
      @close="closeModal"
    >
      <UserProfileForm
        v-model="editableUser"
        @submit="submitProfileChanges"
        @close="closeModal"
      />
    </BaseModal>

    <BaseModal
      v-if="modalState === 'password'"
      :title="'Обновите пароль'"
      :is-open="true"
      @close="closeModal"
    >
      <UserPasswordForm @submit="submitPasswordChange" @close="closeModal" />
    </BaseModal>
  </div>
</template>

<style scoped>
.profile-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.profile-info {
  display: flex;
  flex-direction: column;

  gap: 1.5rem;
}
.field {
  font-size: 22px;
  width: 100%;
  border-radius: 5px;
  padding: 8px;
}

.field-label {
  color: var(--grey-dark);
  margin-right: 8px;
}
.field-content {
  word-break: break-word;
  overflow-wrap: anywhere;
  flex: 1 1 auto;
  min-width: 50%;
}
</style>
