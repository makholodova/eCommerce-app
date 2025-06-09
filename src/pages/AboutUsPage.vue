<script lang="ts" setup>
import RsSchoolIcon from "@/assets/icons/rs-school-logo.svg";
</script>
<template>
  <div class="about-us-page">
    <h1 class="about-us-title">Наша команда</h1>
    <a
      href="https://rs.school/"
      target="_blank"
      aria-label="RS School Website"
      class="logo-rs-school"
    >
      <RsSchoolIcon />
    </a>
  </div>
</template>
<style scoped>
h1 {
  font-weight: 400;
  font-size: 28px;
  margin: 0;
}

.about-us-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.logo-rs-school {
  display: flex;
  width: max-content;
  justify-content: center;
  align-items: center;

  margin: auto 0 auto;
  cursor: pointer;
}

.logo-rs-school svg {
  width: 11rem;
  height: 4rem;
  transition: fill 0.2s ease;
}
.logo-rs-school svg:hover {
  fill: var(--blue-hover);
}
</style>
