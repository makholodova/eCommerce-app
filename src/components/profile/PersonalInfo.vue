<script lang="ts" setup>
import { computed, ref } from "vue";
import { useUserStore } from "@/store/useUserStore";
import BaseButton from "@/components/ui/BaseButton.vue";
import { useModal } from "@/composables/useModal.ts";
import type { UserFormModel } from "@/types/interfaces.ts";

import UserEditForm from "@/components/profile/UserEditForm.vue";

import PasswordEditForm from "@/components/profile/PasswordEditForm.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import { showError, showSuccess } from "@/utils/toast.ts";

const userStore = useUserStore();
const { modalState, openModal, closeModal } = useModal();

const personalInfo = computed(() => ({
  Имя: userStore.firstName,
  Фамилия: userStore.lastName,
  "E-mail": userStore.email,
  "Дата рождения": userStore.dateOfBirth,
}));

const editableUser = ref<UserFormModel>({
  firstName: userStore.firstName,
  lastName: userStore.lastName,
  email: userStore.email,
  dateOfBirth: userStore.dateOfBirth,
});

console.log(editableUser.value);

const onChangePassword = (): void => {
  openModal("password");

  console.log("Изменить пароль");
};

const onEdit = (): void => {
  editableUser.value = {
    firstName: userStore.firstName,
    lastName: userStore.lastName,
    email: userStore.email,
    dateOfBirth: userStore.dateOfBirth,
  };

  openModal("edit");
  console.log("Редактирование");
};

const onSubmitUserEdit = (): void => {
  try {
    //userStore.updateUser(editableUser.value))
    showSuccess("Профиль успешно обновлён");
  } catch (e) {
    // выводить конкретные ошибки
    if (e instanceof Error) {
      showError(`Не удалось обновить профиль, ${e.message}`);
    }
  } finally {
    closeModal();
  }
};
const onSubmitPasswordEdit = (): void => {
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
      @click="onChangePassword"
    />
    <BaseButton text="Редактировать" type="button" @click="onEdit" />

    <BaseModal
      v-if="modalState === 'edit'"
      :title="'Редактировать профиль'"
      :is-open="true"
      @close="closeModal"
    >
      <UserEditForm
        v-model="editableUser"
        @submit="onSubmitUserEdit"
        @close="closeModal"
      />
    </BaseModal>

    <BaseModal
      v-if="modalState === 'password'"
      :title="'Обновите пароль'"
      :is-open="true"
      @close="closeModal"
    >
      <PasswordEditForm @submit="onSubmitPasswordEdit" @close="closeModal" />
    </BaseModal>
  </div>
</template>

<style scoped>
.profile-section {
  display: flex;
  flex-direction: column;
  /*  align-items: center;*/
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
