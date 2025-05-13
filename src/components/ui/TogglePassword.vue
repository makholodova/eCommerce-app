<script lang="ts" setup>
import EyeIcon from "@/assets/icons/icon-eye.svg";
import EyeIconOff from "@/assets/icons/icon-eye-off.svg";

const isPasswordVisible = defineModel<boolean>("passwordVisible", {
  default: false,
});

const togglePasswordVisibility = (): void => {
  isPasswordVisible.value = !isPasswordVisible.value;
};
</script>

<template>
  <button
    type="button"
    class="toggle-password"
    @click="togglePasswordVisibility"
  >
    <img
      :src="isPasswordVisible ? EyeIcon : EyeIconOff"
      alt="toggle password"
      class="icon-eye"
    />
  </button>
</template>

<style scoped>
.toggle-password {
  position: absolute;
  top: 50%;
  right: 34px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  background-color: transparent;
}

.icon-eye {
  width: 22px;
  height: 22px;
  object-fit: contain;
}
</style>
