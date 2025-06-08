<script lang="ts" setup>
import type { AddressFormFields, CountryOption } from "@/types/interfaces.ts";
import type { FormRules } from "@/types/types.ts";
import BaseInputField from "@/components/ui/BaseInputField.vue";
import BaseSelectField from "@/components/ui/BaseSelectField.vue";

const modelValue = defineModel<AddressFormFields>({ required: true });

defineProps<{
  countries: CountryOption[];
  prefix: string;
  title?: string;
  rules?: FormRules<AddressFormFields>;
  isLoading?: boolean;
}>();
</script>

<template>
  <div class="form-section address-wrapper">
    <h3 v-if="title" class="form-section-title">{{ title }}</h3>
    <BaseInputField
      :id="`${prefix}-streetName`"
      v-model="modelValue.streetName"
      :name="`${prefix}-streetName`"
      :vuelidate-rules="rules?.streetName"
      label="Улица"
      placeholder="ул. Ленина"
      show-error
      type="text"
      :autocomplete="`section-${prefix} address-line1`"
    />

    <BaseInputField
      :id="`${prefix}-city`"
      v-model="modelValue.city"
      :name="`${prefix}-city`"
      :vuelidate-rules="rules?.city"
      label="Город"
      placeholder="Москва"
      show-error
      type="text"
      :autocomplete="`section-${prefix} address-level2`"
    />

    <BaseSelectField
      :id="`${prefix}-country`"
      v-model="modelValue.country"
      :name="`${prefix}-country`"
      :options="countries"
      :vuelidate-rules="rules?.country"
      :is-loading="isLoading"
      label="Страна"
      placeholder="Выберите страну"
      show-error
      :autocomplete="`section-${prefix} country`"
    />

    <BaseInputField
      :id="`${prefix}-postalCode`"
      v-model="modelValue.postalCode"
      :name="`${prefix}-postalCode`"
      :vuelidate-rules="rules?.postalCode"
      label="Почтовый индекс"
      placeholder="123456"
      show-error
      type="text"
      :autocomplete="`section-${prefix} postal-code`"
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
