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
import { storeToRefs } from "pinia";
import { changeCustomerPassword } from "@/api/commercetools/customer/changeCustomerPassword.ts";
import { useAuthStore } from "@/store/useAuthStore.ts";
import { login } from "@/api/commercetools/login.ts";
import { passwordErrorMessages } from "@/utils/errors/errorMessages.ts";
import { sharedCustomer } from "@/store/sharedCustomer.ts";

const authStore = useAuthStore();

const userProfileStore = useUserProfileStore();
const { customer, firstName, lastName, email, dateOfBirth } =
  storeToRefs(userProfileStore);
const { updatePersonalInfo } = userProfileStore;

const { modalState, openModal, closeModal } = useModal();

const isPasswordSubmitting = ref(false);
const isProfileSubmitting = ref(false);

const personalInfo = computed(() => ({
  Имя: firstName.value,
  Фамилия: lastName.value,
  "E-mail": email.value,
  "Дата рождения": dateOfBirth.value,
}));

const editableUser = ref<UserFormModel>({
  firstName: firstName.value,
  lastName: lastName.value,
  email: email.value,
  dateOfBirth: dateOfBirth.value,
});

const openProfileEditModal = (): void => {
  editableUser.value = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    dateOfBirth: dateOfBirth.value,
  };
  openModal("edit");
};

const submitProfileChanges = async (): Promise<void> => {
  isProfileSubmitting.value = true;

  try {
    await updatePersonalInfo(editableUser.value);
    showSuccess("Профиль успешно обновлён");
    closeModal();
  } catch (e) {
    if (e instanceof Error) {
      showError(e.message);
    }
  } finally {
    isProfileSubmitting.value = false;
  }
};

const openPasswordChangeModal = (): void => {
  openModal("password");
};

const submitPasswordChange = async (
  currentPassword: string,
  newPassword: string,
): Promise<void> => {
  if (!customer.value?.version) {
    showError("Не удалось получить данные пользователя");
    return;
  }
  isPasswordSubmitting.value = true;
  try {
    await changeCustomerPassword({
      version: customer.value.version,
      currentPassword: currentPassword,
      newPassword: newPassword,
    });

    authStore.logout();

    const result = await login({
      email: email.value,
      password: newPassword,
    });

    sharedCustomer.value = result.customer;

    showSuccess("Пароль успешно обновлён");
    closeModal();
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      const message =
        passwordErrorMessages[error.message] ||
        "Произошла ошибка при смене пароля. Пожалуйста, попробуйте ещё раз.";
      showError(message);
    } else {
      showError("Произошла неизвестная ошибка. Попробуйте позже.");
    }
  } finally {
    isPasswordSubmitting.value = false;
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
        :is-loading="isProfileSubmitting"
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
      <UserPasswordForm
        :is-loading="isPasswordSubmitting"
        @submit="submitPasswordChange"
        @close="closeModal"
      />
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
