<script lang="ts" setup>
import { computed } from "vue";
import { authRules, personalInfoRules } from "@/utils/validation.ts";
import BaseInputField from "@/components/ui/BaseInputField.vue";
import type { UserFormModel } from "@/types/interfaces.ts";
import useVuelidate from "@vuelidate/core";
import BaseButton from "@/components/ui/BaseButton.vue";

const modelValue = defineModel<UserFormModel>({ required: true });

const { isLoading = false } = defineProps<{
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "submit"): void;
}>();

async function handleSubmit(): Promise<void> {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  emit("submit");
}

const rules = computed(() => ({
  firstName: personalInfoRules.firstName,
  lastName: personalInfoRules.lastName,
  dateOfBirth: personalInfoRules.dateOfBirth,
  email: authRules.email,
}));

const v$ = useVuelidate(rules, modelValue, { $lazy: true, $autoDirty: true });

const isFormValid = computed(() => !v$.value.$invalid);
</script>

<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <fieldset :disabled="isLoading" class="form-content form-fieldset">
        <BaseInputField
          id="firstName"
          v-model="modelValue.firstName"
          name="firstName"
          :vuelidate-rules="rules.firstName"
          label="Имя"
          placeholder="Иван"
          show-error
          type="text"
          autocomplete="given-name"
        />

        <BaseInputField
          id="lastName"
          v-model="modelValue.lastName"
          name="lastName"
          :vuelidate-rules="rules.lastName"
          label="Фамилия"
          placeholder="Иванов"
          show-error
          type="text"
          autocomplete="family-name"
        />

        <BaseInputField
          id="birthDate"
          v-model="modelValue.dateOfBirth"
          name="birthDate"
          :vuelidate-rules="rules.dateOfBirth"
          label="Дата рождения"
          placeholder="01.01.2000"
          show-error
          type="date"
          autocomplete="date-of-birth"
        />

        <BaseInputField
          id="email"
          v-model="modelValue.email"
          name="email"
          :vuelidate-rules="rules.email"
          label="E-mail"
          placeholder="user@example.com"
          show-error
          type="email"
          autocomplete="email"
        />
      </fieldset>
      <div class="modal-actions">
        <BaseButton
          size="xl"
          text="Сохранить"
          type="submit"
          :is-loading="isLoading"
          :disabled="!isFormValid || isLoading"
        />
        <BaseButton
          size="xl"
          text="Отмена"
          type="button"
          variant="secondary"
          @click="emit('close')"
        />
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-content {
  max-width: 478px;
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.modal-actions {
  grid-column: span 2;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
.form-fieldset {
  border: none;
  padding: 0;
  margin: 0;
}
@media (max-width: 650px) {
  .form-content {
    max-width: 272px;
    grid-template-columns: repeat(1, 1fr);
  }
  .modal-actions {
    grid-column: span 1;
  }
}
</style>
