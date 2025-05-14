<script setup lang="ts">
import { defineProps } from "vue";
import type { PersonalInfoFields } from "@/types/interfaces.ts";
import type { PersonalFormRules } from "@/types/types.ts";
import BaseInputField from "@/components/ui/BaseInputField.vue";

const modelValue = defineModel<PersonalInfoFields>({ required: true });

defineProps<{
  rules?: PersonalFormRules;
  title?: string;
}>();
</script>

<template>
  <div class="form-section">
    <h3 class="form-section-title">{{ title }}</h3>
    <BaseInputField
      id="firstName"
      v-model="modelValue.firstName"
      :vuelidate-rules="rules?.firstName"
      label="Имя"
      placeholder="Иван"
      show-error
      type="text"
    />

    <BaseInputField
      id="lastName"
      v-model="modelValue.lastName"
      :vuelidate-rules="rules?.lastName"
      label="Фамилия"
      placeholder="Иванов"
      show-error
      type="text"
    />

    <BaseInputField
      id="birthDate"
      v-model="modelValue.dateOfBirth"
      :vuelidate-rules="rules?.dateOfBirth"
      label="Дата рождения"
      placeholder="01.01.2000"
      show-error
      type="date"
    />
  </div>
</template>

<style scoped>
.form-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column: span 2;
  grid-row: 1;
  gap: 0.5rem;
}

.form-section-title {
  grid-column: span 2;

  font-weight: 500;
  font-size: 18px;
  text-align: center;
  border-top: 2px solid var(--blue-light);
  padding-top: 1rem;
}

@media (max-width: 650px) {
  .form-section {
    grid-template-columns: repeat(1, 1fr);
  }
  .form-section > * {
    grid-column: span 1;
  }
}
</style>
