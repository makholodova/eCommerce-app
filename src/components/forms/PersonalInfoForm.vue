<script setup lang="ts">
import type { PersonalInfoFields } from "@/types/interfaces.ts";
import type { FormRules } from "@/types/types.ts";
import BaseInputField from "@/components/ui/BaseInputField.vue";

const modelValue = defineModel<PersonalInfoFields>({ required: true });

defineProps<{
  rules?: FormRules<PersonalInfoFields>;
  title?: string;
}>();
</script>

<template>
  <div class="form-section">
    <h3 class="form-section-title">{{ title }}</h3>
    <BaseInputField
      id="firstName"
      v-model="modelValue.firstName"
      name="firstName"
      :vuelidate-rules="rules?.firstName"
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
      :vuelidate-rules="rules?.lastName"
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
      :vuelidate-rules="rules?.dateOfBirth"
      label="Дата рождения"
      placeholder="01.01.2000"
      show-error
      type="date"
      autocomplete="date-of-birth"
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
