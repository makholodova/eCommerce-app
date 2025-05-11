<script lang="ts" setup>
import RegistrationForm from "@/components/forms/RegistrationForm.vue";
</script>

<template>
  <div class="registration-page">
    <h1 class="registration-page-title">Регистрация</h1>
    <RegistrationForm />
  </div>
</template>

<style scoped>
.registration-page-title {
  text-align: center;
}
.registration-page {
  padding: 1rem 2rem;
}
</style>
