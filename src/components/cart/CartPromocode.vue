<script lang="ts" setup>
import { ref, computed } from "vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import { usePromocodeStore } from "@/store/usePromocodeStore";

const promocodeStore = usePromocodeStore();

defineProps<{
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "apply", code: string): void;
}>();

const promoCode = ref("");

const isDisabled = computed(() => {
  const entered = promoCode.value.trim();
  const alreadyApplied = promocodeStore.code !== null;
  return entered === "" || alreadyApplied;
});

function onApplyClick(): void {
  emit("apply", promoCode.value.trim());
}
</script>

<template>
  <div class="cart-promocode">
    <label for="promocode" class="promocode-label">Промокод:</label>
    <div class="promocode-input-wrapper">
      <input
        id="promocode"
        v-model="promoCode"
        name="promocode"
        type="text"
        class="promocode-input"
        placeholder="Введите промокод"
        autocomplete="off"
      />
      <BaseButton
        text="Применить"
        size="sm"
        :disabled="isDisabled || disabled"
        class="promocode-button"
        @click="onApplyClick"
      />
    </div>
    <p class="promocode-message"></p>
  </div>
</template>

<style scoped>
.cart-promocode {
  margin: 50px 0;
}
.promocode-label {
  font-weight: 500;
  margin-bottom: 8px;
  display: block;
}
.promocode-input-wrapper {
  display: flex;
  gap: 12px;
  margin-top: 8px;
  max-width: 600px;
}
.promocode-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--grey-light);
  border-radius: 4px;
  font-size: 14px;
}
.promocode-button {
  flex-shrink: 0;
  width: 126px;
  font-size: 12px;
  height: 36px;
}
.promocode-message {
  margin-top: 10px;
  font-size: 14px;
  color: var(--green);
}
@media (max-width: 680px) {
  .promocode-button {
    width: 100px;
  }
}
</style>
