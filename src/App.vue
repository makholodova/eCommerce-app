<script lang="ts" setup></script>

<template>
  <nav>
    <router-link :to="{ name: 'Main' }">Main</router-link>
    |
    <router-link :to="{ name: 'Login' }">Login</router-link>
    |
    <router-link :to="{ name: 'Register' }">Register</router-link>
  </nav>
  <router-view />
</template>

<style scoped></style>
