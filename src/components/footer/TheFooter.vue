<script setup lang="ts">
import BaseContainer from "@/components/ui/BaseContainer.vue";
import AddressIcon from "@/assets/icons/location.svg";
import PhoneIcon from "@/assets/icons/phone.svg";
import EmailIcon from "@/assets/icons/mail.svg";

const info = [
  {
    label: "г. Краснодар, ул. Красных Партизан, дом 173",
    svg: AddressIcon,
    atr: "address",
  },
  { label: "ZHMTshop@gmail.com", svg: EmailIcon, atr: "email" },
  { label: "8 800 254 41 56", svg: PhoneIcon, atr: "phone" },
];

const pages = [
  { name: "Main", label: "Главная" },
  { name: "Catalog", label: "Каталог" },
  { name: "About", label: "О нас" },
];

const categories = [
  { name: "smartphones", label: "Смартфоны" },
  { name: "laptops", label: "Ноутбуки" },
  { name: "tablets", label: "Планшеты" },
];

const social = [
  {
    name: "vk",
    label: "VK",
    svg: "" /*VkIcon*/,
    url: "https://vk.com",
  },
  {
    name: "tg",
    label: "Telegram",
    svg: "" /*TelegramIcon*/,
    url: "https://t.me",
  },
  {
    name: "wa",
    label: "WhatsApp",
    svg: "" /*WhatsAppIcon*/,
    url: "https://wa.me/71234567890",
  },
  {
    name: "youtube",
    label: "YouTube",
    svg: "" /*YouTubeIcon*/,
    url: "https://youtube.com",
  },
];
</script>

<template>
  <footer>
    <BaseContainer class="footer">
      <div class="footer__top">
        <ul class="footer__info">
          <li v-for="item in info" :key="item.atr" class="footer__info-item">
            <component :is="item.svg" class="icon" />
            <span>{{ item.label }}</span>
          </li>
        </ul>
      </div>

      <div class="footer__links">
        <div class="footer__block">
          <h5>Компания</h5>
          <ul>
            <li v-for="item in pages" :key="item.name">
              <router-link :to="{ name: item.name }">{{
                item.label
              }}</router-link>
            </li>
          </ul>
        </div>

        <div class="footer__block">
          <h5>Категории</h5>
          <ul>
            <li v-for="item in categories" :key="item.name">
              <router-link
                :to="{
                  name: 'CatalogCategory',
                  params: { category: item.name },
                }"
              >
                {{ item.label }}
              </router-link>
            </li>
          </ul>
        </div>

        <div class="footer__social">
          <h5>Социальные сети</h5>
          <div class="social-icons">
            <a
              v-for="item in social"
              :key="item.name"
              :href="item.url"
              target="_blank"
              rel="noopener noreferrer"
              class="social-icon"
            >
              <component :is="item.svg" class="icon" />
              <span class="sr-only">{{ item.label }}</span>
            </a>
          </div>
        </div>

        <div class="footer__payment">
          <h5>Мы принимаем</h5>
          <!-- вставить логотипы платёжных систем -->
        </div>
      </div>

      <div class="footer__bottom">
        <p>
          &copy; {{ new Date().getFullYear() }} ZHMTshop — Все права защищены
        </p>
      </div>
    </BaseContainer>
  </footer>
</template>

<style scoped>
.footer {
  padding: 2rem 0;
  background: #f8f8f8;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.footer__top {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}
.footer__info {
  display: flex;
  justify-content: space-between;
  padding: 0;
}
.footer__info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.footer__bottom {
  text-align: center;
  font-size: 0.9rem;
  color: #777;
}
.icon {
  width: 25px;
  height: 25px;
}
</style>
px
