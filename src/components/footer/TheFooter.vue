<script setup lang="ts">
import AddressIcon from "@/assets/icons/location.svg";
import PhoneIcon from "@/assets/icons/phone.svg";
import EmailIcon from "@/assets/icons/mail.svg";
import TelegramIcon from "@/assets/icons/telegram.svg";
import WhatsAppIcon from "@/assets/icons/whatsapp.svg";
import VkIcon from "@/assets/icons/vk.svg";
import YouTubeIcon from "@/assets/icons/youtube.svg";

import VisaIcon from "@/assets/images/pay-visa.png";
import MastercardIcon from "@/assets/images/pay-mst.png";
import MirIcon from "@/assets/images/pay-mir.png";

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
    svg: VkIcon,
    url: "https://vk.com",
  },
  {
    name: "tg",
    label: "Telegram",
    svg: TelegramIcon,
    url: "https://t.me",
  },
  {
    name: "wa",
    label: "WhatsApp",
    svg: WhatsAppIcon,
    url: "https://wa.me/71234567890",
  },
  {
    name: "youtube",
    label: "YouTube",
    svg: YouTubeIcon,
    url: "https://youtube.com",
  },
];

const payments = [VisaIcon, MastercardIcon, MirIcon];
</script>

<template>
  <footer ref="headerRef">
    <div class="container footer">
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
          <ul class="block-links">
            <li v-for="item in pages" :key="item.name" class="block-link">
              <router-link :to="{ name: item.name }">{{
                item.label
              }}</router-link>
            </li>
          </ul>
        </div>

        <div class="footer__block">
          <h5>Категории</h5>
          <ul class="block-links">
            <li v-for="item in categories" :key="item.name" class="block-link">
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
        <div>
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
              </a>
            </div>
          </div>

          <div class="footer__payment">
            <h5>Мы принимаем</h5>
            <div class="payment-icons">
              <img
                v-for="(icon, i) in payments"
                :key="i"
                :src="icon"
                :alt="`payment-icon-${i}`"
                class="payment-icon"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="footer__bottom">
        <p>
          &copy; {{ new Date().getFullYear() }} ZHMTshop — Все права защищены
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
footer {
  width: 100%;
  margin-top: 60px;
  border-top: 1px solid #c1c1c1;
  box-shadow: 0 -2px 5px rgba(193, 193, 193, 0.6);
}
h5 {
  margin: 1rem 0;
  font-weight: 500;
  font-size: 18px;
  color: var(--grey);
}
.container {
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
}

.footer {
  display: flex;
  flex-direction: column;
  padding: 10px clamp(16px, 5vw, 80px);
}
.footer__top {
  border-bottom: 2px solid var(--blue-light);
}
.footer__top,
.footer__links,
.footer__bottom {
  width: 100%;
  max-width: 1440px;
}
.footer__top {
  width: 100%;
  display: grid;
  gap: 2rem;
}
.footer__info {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0;
}
.footer__links {
  display: flex;
  justify-content: space-between;
}
.footer__info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.footer__bottom {
  text-align: center;
  font-size: 0.9rem;
  color: var(--grey);
}

.block-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0;
  padding-left: 0;
  list-style-type: none;
}

.block-link a {
  font-size: 16px;
  color: var(--black);
  text-decoration: none;
  transition: color 0.3ms ease;
}

.block-link a:hover {
  color: var(--blue-hover);
}

.icon {
  width: 25px;
  height: 25px;
}

.social-icons {
  display: flex;
  align-items: center;
  justify-content: center;
}

.social-icon {
  font-weight: 400;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--grey-dark);
  transition: color 0.2ms ease;
}

.social-icon:hover {
  color: var(--blue-hover);
}

.payment-icons {
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 850px) {
  .footer__info {
    display: grid;
    justify-content: center;
    justify-items: center;
    gap: 1rem;
  }

  .footer__links {
    flex-direction: column;
    align-items: center;
  }

  .block-links {
    align-items: center;
  }
}
</style>
px
