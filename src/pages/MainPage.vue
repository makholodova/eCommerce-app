<script lang="ts" setup>
import heroPhone from "@/assets/images/hero-phone.png";
</script>

<template>
  <section class="hero">
    <div class="hero-inscription">
      <h1>ZHMT shop</h1>
      <p>Твой выбор электроники</p>
    </div>
    <div class="hero-img-wrapper">
      <img :src="heroPhone" class="hero-img" />
    </div>
  </section>
</template>

<style scoped>
.hero {
  background: url("@/assets/images/hero.png") center center/cover no-repeat;
  height: clamp(150, 50vh, 600px);
  max-height: 600px;
  margin-top: 20px;
  border-radius: 8px;
  padding: clamp(8px, 5vw, 60px);
  display: flex;
  justify-content: center;
  gap: 20px;
}
.hero-img-wrapper {
  width: 40%;
}
.hero-img {
  object-fit: contain;
  width: 100%;
  height: 100%;
}
.hero-inscription {
  width: 60%;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-direction: column;
}
.hero-inscription h1 {
  margin: 0;
  white-space: nowrap;
  font-size: clamp(20px, 10vw, 100px);
}
.hero-inscription p {
  margin: 0;
  font-size: clamp(16px, 5vw, 40px);
}
</style>
