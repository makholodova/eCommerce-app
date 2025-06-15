<script lang="ts" setup>
import heroPhone from "@/assets/images/hero-phone.png";
import { ref, onMounted, onUnmounted } from "vue";
import { showError, showSuccess } from "@/utils/toast.ts";

const currentSlide = ref(0);
const slides = [
  {
    title: "Летние скидки",
    text: "Воспользуйтесь нашим сезонным предложением: скидка 15% на все смартфоны",
    code: "ZHMT15OFF",
  },
  {
    title: "Сезонное предложение",
    text: "10% скидки на все товары, только эту неделю, торопитесь",
    code: "ZHMT-1",
  },
];
let intervalId: ReturnType<typeof setTimeout>;

onMounted(() => {
  intervalId = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.length;
  }, 8000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});

function copyCode(code: string): void {
  navigator.clipboard
    .writeText(code)
    .then(() => {
      showSuccess("Ваш промокод скопирован");
    })
    .catch(() => {
      showError("Не удалось скопировать промокод");
    });
}
function nextSlide(): void {
  clearInterval(intervalId);
  if (currentSlide.value === 0) {
    currentSlide.value = 1;
  } else {
    currentSlide.value = 0;
  }
  intervalId = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.length;
  }, 8000);
}
</script>

<template>
  <div>
    <section class="hero">
      <div class="hero-inscription">
        <h1>ZHMT shop</h1>
        <p>Твой выбор электроники</p>
      </div>
      <div class="hero-img-wrapper">
        <img :src="heroPhone" class="hero-img" />
      </div>
    </section>
    <section class="discount">
      <div class="carousel">
        <div
          class="carousel-track"
          :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
        >
          <div v-for="(slide, index) in slides" :key="index" class="slide">
            <h1 class="slide-title">{{ slide.title }}</h1>
            <div class="slide-discount-code" @click="copyCode(slide.code)">
              {{ slide.code }}
            </div>
            <div class="slide-discount-slogan">{{ slide.text }}</div>
          </div>
        </div>
      </div>
      <div class="carousel-controls">
        <span
          class="carousel-btn"
          :class="{ active: currentSlide === 0 }"
          @click="nextSlide"
        ></span>
        <span
          class="carousel-btn"
          :class="{ active: currentSlide === 1 }"
          @click="nextSlide"
        ></span>
      </div>
    </section>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.carousel {
  display: flex;
  flex-wrap: nowrap;
  overflow: hidden;
}
.carousel-controls {
  margin: 0 auto;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.carousel-btn {
  width: 30px;
  height: 10px;
  border-radius: 5px;
  border: 2px solid var(--purple);
  box-shadow: 2px inset;
  cursor: pointer;
  transform: all 0.2s ease;
}
.active {
  cursor: auto;
  background-color: var(--purple);
}
.carousel-track {
  display: flex;
  width: 100%;
  transition: transform 1s ease;
}
.slide {
  flex: 0 0 100%;
  padding: clamp(8px, 5vw, 60px);
}
.slide-title {
  font-size: clamp(20px, 5vw, 60px);
  text-align: center;
  color: white;
}
.slide-discount-code {
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: var(--purple);
  max-width: clamp(100px, 40vw, 250px);
  padding: clamp(5px, 3vw, 20px);
  margin: 0 auto;
  margin-top: clamp(10px, 3vw, 40px);
  border-radius: 8px;
  cursor: pointer;
}
.slide-discount-slogan {
  color: white;
  text-align: center;
  font-size: clamp(14px, 2vw, 30px);
  margin-top: 20px;
}
.discount {
  background-color: var(--blue-light);
  padding-bottom: 20px;
}
.hero {
  margin: 0;
  background: url("@/assets/images/hero.png") center center/cover no-repeat;
  height: clamp(150, 50vh, 600px);
  max-height: 600px;
  margin-top: 20px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
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
@media screen and (hover: hover) {
  .carousel-btn:hover {
    box-shadow: 0 0 2px 0 #750dc5 inset;
  }
}
</style>
