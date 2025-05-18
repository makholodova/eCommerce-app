<script lang="ts" setup>
import type { AuthFields } from "@/types/interfaces.ts";
import type { FormRules } from "@/types/types.ts";
import BaseInputField from "@/components/ui/BaseInputField.vue";

const modelValue = defineModel<AuthFields>({ required: true });

defineProps<{
  rules?: FormRules<AuthFields>;
}>();
</script>

<template>
  <div class="form-section credentials-wrapper">
    <BaseInputField
      id="email"
      v-model="modelValue.email"
      :vuelidate-rules="rules?.email"
      label="E-mail"
      placeholder="user@example.com"
      show-error
      type="email"
    />
    <BaseInputField
      id="password"
      v-model="modelValue.password"
      :vuelidate-rules="rules?.password"
      label="Пароль"
      placeholder="**********"
      show-error
      type="password"
    />
  </div>
</template>

<style scoped>
.form-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}
@media (max-width: 650px) {
  .form-section {
    grid-template-columns: 1fr;
  }
}
</style>
