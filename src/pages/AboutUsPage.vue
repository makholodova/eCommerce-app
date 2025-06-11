<script lang="ts" setup>
import RsSchoolIcon from "@/assets/icons/rs-school-logo.svg";
import TeamMemberCard from "@/components/ui/TeamMemberCard.vue";

const teamMembers = [
  {
    name: "Жанна Ивашова",
    role: "Frontend Developer",
    github: "https://github.com/zhannaivashova",
    githubUsername: "zhannaivashova",
    photo: new URL("@/assets/images/smartphone.png", import.meta.url).href,
    bio: "Я Жанна, живу в Тбилиси. Мой путь в разработку начался около двух лет назад из любопытства, которое стало настоящим увлечением. Чтобы развить навыки, я поступила на курс JS/Frontend в RS School. Вне учёбы обожаю хайкинг, природу и, конечно, животных. В будущем хочу создавать продукты, которые приносят людям пользу и удовольствие.",
    contributions: [
      "Разработка страницы входа",
      "Создание страницы каталога",
      "Разработка страницы товаров в каталоге",
      "Разработка страницы корзины",
      "Интеграция с Commercetools API",
    ],
  },
  {
    name: "Татьяна Бодрова",
    role: "Team Lead & Frontend Developer",
    github: "https://github.com/tatiankaba",
    githubUsername: "tatiankaba",

    photo: new URL("@/assets/images/tablet.png", import.meta.url).href,
    bio: "Я Татьяна, frontend-разработчик. Живу в Загребе, но планирую переезд в Испанию. Начала с Python, но по-настоящему увлеклась JavaScript и frontend. Образование в тестировании дало мне понимание качества и внимательность к деталям. Интересуюсь нейропсихологией и люблю спорт. Стремлюсь делать продукты, полезные и удобные для людей.",
    contributions: [
      "Роль тимлида в командном проекте",
      "Настройка роутинга приложения",
      "Разработка главной страницы",
      "Реализация карточки товара и страницы товара",
      "Оптимизация загрузки карточек для повышения производительности",
      "Интегрировала Commercetools API",
    ],
  },
  {
    name: "Холодова Марина",
    role: "Frontend Developer",
    github: "https://github.com/makholodova",
    githubUsername: "makholodova",

    photo: new URL(
      "@/assets/images/team_member/makholodova.jpg",
      import.meta.url,
    ).href,
    bio: "Я Марина, frontend-разработчик. Вдохновляюсь горами и сноубордом — это мой способ перезагрузки. В разработку пришла из интереса к веб-технологиям, который перерос в увлечение созданием удобных и современных интерфейсов. Мне нравится делать интерфейсы, которые понятны и приятны в использовании. В будущем хочу развиваться в направлении frontend и участвовать в создании полезных продуктов.",
    contributions: [
      "Настройка структуры проекта, линтинга и форматирования",
      "Реализация страницы регистрации с валидацией форм",
      "Разработка страницы профиля пользователя",
      "Разработка страницы корзины",
      "Интеграция с Commercetools API",
    ],
  },
];
</script>
<template>
  <div class="about-us-page">
    <h1 class="about-us-title">Наша команда</h1>
    <div class="about-us-content">
      <TeamMemberCard
        v-for="(member, index) in teamMembers"
        :key="member.name"
        :member="member"
        :reverse="index % 2 !== 0"
      />
    </div>
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
  margin: 1rem;
}

.about-us-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}
.about-us-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  margin: 2.5rem 0;
}

.logo-rs-school {
  display: flex;
  width: max-content;
  justify-content: center;
  align-items: center;

  margin: 0 auto;
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
