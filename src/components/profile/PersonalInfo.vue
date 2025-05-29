<script lang="ts" setup>
import { computed } from "vue";
import { useUserStore } from "@/store/useUserStore";
import BaseButton from "@/components/ui/BaseButton.vue";

const userStore = useUserStore();

const personalInfo = computed(() => ({
  Имя: userStore.firstName,
  Фамилия: userStore.lastName,
  "E-mail": userStore.email,
  "Дата рождения": userStore.dateOfBirth,
}));

const onChangePassword = (): void => {
  console.log("Изменить пароль");
};
const onEdit = (): void => {
  console.log("Редактирование");
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
      @click="onChangePassword"
    />
    <BaseButton text="Редактировать" type="button" @click="onEdit" />
  </div>
</template>

<style scoped>
.profile-section {
  display: flex;
  flex-direction: column;
  /*  align-items: center;*/
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
