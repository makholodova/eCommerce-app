<script setup lang="ts">
import GitHubIcon from "@/assets/icons/icon-github.svg";

defineProps<{
  member: {
    name: string;
    role: string;
    github: string;
    githubUsername: string;
    photo: string;
    bio: string;
    contributions: string[];
  };
  reverse: boolean;
}>();
</script>

<template>
  <div :class="['team-member-wrapper', { reverse }]">
    <div :class="['team-member', { reverse }]">
      <div class="photo-wrapper">
        <img
          :src="member.photo"
          :alt="member.name"
          class="team-member__photo"
        />
      </div>

      <div class="team-member__info">
        <h2 class="team-member__name">{{ member.name }}</h2>
        <h3 class="team-member__role">{{ member.role }}</h3>
        <p class="team-member__bio">{{ member.bio }}</p>
        <ul class="team-member__tasks">
          <li
            v-for="(task, taskIndex) in member.contributions"
            :key="taskIndex"
            class="team-member__task"
          >
            {{ task }}
          </li>
        </ul>
        <a
          :href="member.github"
          target="_blank"
          aria-label="Github"
          class="team-member__github"
        >
          <GitHubIcon class="team-member__github-icon" />
          <span class="team-member__github-text"
            >GitHub {{ member.githubUsername }}</span
          >
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.team-member-wrapper {
  display: flex;
  justify-content: flex-start;
}

.team-member-wrapper.reverse {
  justify-content: flex-end;
}

.team-member {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background-color: var(--blue-lighter);
  /* border: 1px solid var(--blue);*/
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 800px;
}

.team-member.reverse {
  flex-direction: row-reverse;
}

.photo-wrapper {
  display: flex;
  align-items: center;
  background-color: transparent;
  border: 3px solid var(--white);
  border-radius: 50%;
  padding: 0.5rem;
}

.team-member__photo {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
}

.team-member__github {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  font-weight: 500;
  color: var(--black);
  text-decoration: none;
  transition: color 0.2s ease;
}

.team-member__github:hover {
  color: var(--blue-hover);
}

.team-member__github-icon {
  width: 20px;
  height: 20px;
  transition: fill 0.2s ease;
}

.team-member__github-text {
  font-size: 16px;
}

@media (max-width: 768px) {
  .team-member,
  .team-member.reverse {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>
