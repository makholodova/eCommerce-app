<script setup lang="ts">
import type { UIAddress } from "@/types/types.ts";
import { computed, ref } from "vue";
import { addressRules } from "@/utils/validation.ts";
import useVuelidate from "@vuelidate/core";
import BaseButton from "@/components/ui/BaseButton.vue";
import AddressForm from "@/components/forms/AddressForm.vue";
import type { AddressFormFields, CountryOption } from "@/types/interfaces.ts";
import { toFormFields, toUIAddress } from "@/adapters/address.adapter.ts";

const props = defineProps<{
  address: UIAddress;
  countries: CountryOption[];
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "submit", address: UIAddress): void;
}>();

const formModel = ref<AddressFormFields>(toFormFields(props.address));

async function handleSubmit(): Promise<void> {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  emit("submit", toUIAddress(formModel.value, props.address.id));
}

const rules = computed(() => ({
  country: addressRules.country,
  city: addressRules.city,
  streetName: addressRules.streetName,
  postalCode: addressRules.postalCode,
}));

const v$ = useVuelidate(rules, formModel, { $lazy: true, $autoDirty: true });

const isFormValid = computed(() => !v$.value.$invalid);
</script>

<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <fieldset :disabled="isLoading" class="form-fieldset form-content">
        <AddressForm
          v-model="formModel"
          :countries="countries"
          :rules="rules"
          prefix="address"
          title=""
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
