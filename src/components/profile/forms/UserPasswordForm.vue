<script lang="ts" setup>
import { computed, reactive } from "vue";
import { authRules } from "@/utils/validation.ts";
import BaseInputField from "@/components/ui/BaseInputField.vue";

import useVuelidate from "@vuelidate/core";
import BaseButton from "@/components/ui/BaseButton.vue";

const form = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const { isLoading = false } = defineProps<{
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "submit", currentPassword: string, newPassword: string): void;
}>();

async function handleSubmit(): Promise<void> {
  const isValid = await v$.value.$validate();
  if (!isValid) return;
  emit("submit", form.currentPassword, form.newPassword);
}

const rules = computed(() => ({
  currentPassword: authRules.password,
  newPassword: authRules.password,
  confirmPassword: {
    ...authRules.password,
    sameAsNew: authRules.sameAsPassword(() => form.newPassword),
  },
}));

const v$ = useVuelidate(rules, form, { $lazy: true, $autoDirty: true });

const isFormValid = computed(() => !v$.value.$invalid);
</script>

<template>
  <div>
    <form class="form-content" @submit.prevent="handleSubmit">
      <fieldset :disabled="isLoading" class="form-fieldset">
        <BaseInputField
          id="current-password"
          v-model="form.currentPassword"
          name="currentPassword"
          :vuelidate-rules="rules.currentPassword"
          label="Текущий пароль"
          placeholder="**********"
          show-error
          type="password"
          autocomplete="current-password"
        />

        <BaseInputField
          id="new-password"
          v-model="form.newPassword"
          name="newPassword"
          :vuelidate-rules="rules.newPassword"
          label="Новый пароль"
          placeholder="**********"
          show-error
          type="password"
          autocomplete="new-password"
        />

        <BaseInputField
          id="confirm-password"
          v-model="form.confirmPassword"
          name="confirmPassword"
          :vuelidate-rules="rules.confirmPassword"
          label="Подтверждение нового пароля"
          placeholder="**********"
          show-error
          type="password"
          autocomplete="confirm-password"
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
  max-width: 272px;
  width: 100%;
  margin-top: 2rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
.form-fieldset {
  border: none;
  padding: 0;
  margin: 0;
}
</style>
