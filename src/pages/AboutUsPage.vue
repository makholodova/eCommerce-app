<script lang="ts" setup>
import RsSchoolIcon from "@/assets/icons/rs-school-logo.svg";
import TeamMemberCard from "@/components/ui/TeamMemberCard.vue";

const teamMembers = [
  {
    name: "Холодова Марина",
    role: "Frontend Developer",
    github: "https://github.com/makholodova",
    githubUsername: "makholodova",

    photo: new URL("@/assets/images/laptop.png", import.meta.url).href,
    bio: "Я Марина, frontend-разработчик, вдохновляюсь путешествиями, особенно люблю горы и сноуборд — это мой способ перезагрузки и источник вдохновения. В разработку пришла из интереса к веб-технологиям, который быстро превратился в увлечение и стремление создавать удобные и современные интерфейсы. В командном проекте на курсе RS School принимала участие в разработке eCommerce-приложения. На старте занималась технической настройкой проекта: структурой, линтингом и форматированием кода. Реализовывала страницу регистрации с валидацией форм, страницу профиля пользователя и страницу корзины. Работала с Commercetools API — получала и отправляла данные, реализовывала возможность редактирования информации в профиле. Мне нравится делать интерфейсы, которые понятны и приятны в использовании. В будущем хочу продолжать развиваться в направлении frontend-разработки и участвовать в создании продуктов, которые приносят реальную пользу пользователям.",
    contributions: [],
  },
  {
    name: "Жанна Ивашова",
    role: "Frontend Developer",
    github: "https://github.com/zhannaivashova",
    githubUsername: "zhannaivashova",
    photo: new URL("@/assets/images/smartphone.png", import.meta.url).href,
    bio: "Я Жанна, живу в солнечном Тбилиси. Мой путь в разработку начался около двух лет назад - из любопытства, которое быстро переросло в настоящее увлечение. Чтобы структурировать знания и развить практические навыки, я поступила на курс JS/Frontend в RS School. В командном проекте занималась разработкой Login Page, Catalog Page, Catalog Products Page, а также активно работала с  API Commercetools, настраивая взаимодействие между фронтендом и бэкендом. Вне учёбы я обожаю хайкинг, люблю природу и всегда рада новым маршрутам. А ещё у меня особая слабость к котикам и собачкам — они делают любой день лучше. В будущем хочу продолжать развиваться как frontend-разработчик и работать над продуктами, которые приносят людям пользу и удовольствие.",
    contributions: [],
  },
  {
    name: "Татьяна Бодрова",
    role: "Team Lead & Frontend Developer",
    github: "https://github.com/tatiankaba",
    githubUsername: "tatiankaba",

    photo: new URL("@/assets/images/tablet.png", import.meta.url).href,
    bio: "Я Татьяна, живу в Загребе, Хорватия, но уже в ближайшее время планирую переезд в Испанию. Моё увлечение программированием началось несколько лет назад с изучения Python, а затем меня по-настоящему увлёк JavaScript и frontend-разработка. До этого я училась на тестировщика и некоторое время работала в этой роли, что дало мне хороший фундамент в понимании качества продукта и внимательность к деталям.    В командном проекте я выступала в роли тимлида и принимала активное участие в разработке ключевых компонентов: настроила роутинг, реализовала главную страницу, продуктовую карточку и страницу с подробной информацией о товаре. Также занималась оптимизацией загрузки карточек продуктов для повышения производительности и удобства пользователя.    Помимо кода, я увлечена спортом, а также глубоко интересуюсь профайлингом, нейропсихологией и нейробиологией — люблю понимать, как работает человек и его мозг.",
    contributions: [],
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
