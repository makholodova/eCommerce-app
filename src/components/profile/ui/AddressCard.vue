<script lang="ts" setup>
import type { UIAddress } from "@/types/types.ts";

defineProps<{
  address: UIAddress;
  isDefault?: boolean;
}>();

const emit = defineEmits<{
  (e: "default-toggle", id: string): void;
  (e: "edit", address: UIAddress): void;
  (e: "remove", id: string): void;
}>();
</script>

<template>
  <div class="address-card" :class="{ 'address-card--default': isDefault }">
    <div class="checkbox-wrapper">
      <label class="address-card__checkbox">
        <input
          :checked="isDefault"
          type="checkbox"
          @change="emit('default-toggle', address.id)"
        />
        <span class="checkmark"></span>
      </label>
    </div>

    <div class="address-card__info">
      <p>Страна: {{ address.country }}</p>
      <p>Город: {{ address.city }}</p>
      <p>Улица: {{ address.streetName }}</p>
      <p>Почтовый индекс: {{ address.postalCode }}</p>
    </div>

    <div class="address-card__actions">
      <button class="address-card__button" @click="emit('edit', address)">
        Редактировать
      </button>
      <button class="address-card__button" @click="emit('remove', address.id)">
        Удалить
      </button>
    </div>
  </div>
</template>

<style scoped>
.address-card {
  min-width: 280px;
  position: relative;
  border: 1px solid var(--grey-light);
  padding: 16px;
  border-radius: 8px;
}
.address-card--default {
  border-color: var(--blue);
}

.address-card__info {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  max-width: 95%;
  color: var(--grey-dark);
  margin-bottom: 0.5rem;

  word-break: break-word;
  overflow-wrap: anywhere;
}

.address-card__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

p {
  margin: 0;
}

.checkbox-wrapper {
  position: absolute;
  top: 16px;
  right: 16px;
}

.address-card__checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: var(--blue);
  gap: 8px;
}

.address-card__checkbox input {
  display: none;
}

.address-card__checkbox .checkmark {
  width: 30px;
  height: 30px;
  border: 2px solid var(--grey-light);
  border-radius: 50%;
  display: inline-block;
  position: relative;
  background-color: transparent;
  transition: all 0.2s ease;
}

.address-card__checkbox input:checked + .checkmark {
  background-color: var(--blue);
  border-color: var(--blue);
}

.address-card__checkbox input:checked + .checkmark::after {
  content: "";
  position: absolute;
  top: 6px;
  left: 10px;
  width: 6px;
  height: 10px;
  border: solid var(--white);

  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.address-card__button {
  color: var(--blue);
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 12px;
  padding: 5px;
}

.address-card__button:hover {
  color: var(--blue-hover);
}
</style>
