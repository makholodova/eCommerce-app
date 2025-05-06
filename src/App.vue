<script setup lang="ts"></script>

<template>
  <nav>
    <router-link to="/">Main</router-link> |
    <router-link to="/login">Login</router-link> |
    <router-link to="/register">Register</router-link>
  </nav>
  <router-view />
</template>

<style scoped></style>
