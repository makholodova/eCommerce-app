<script lang="ts" setup>
import arrowIcon from "@/assets/icons/icon-arrow.png";
import type { breadCrumbType } from "@/types/user-login.types";

const props = defineProps<{
  breadcrumbs: breadCrumbType[];
}>();

const previousPage =
  props.breadcrumbs[props.breadcrumbs.length - 2] || props.breadcrumbs[0];
</script>

<template>
  <div class="breadcrumbs-wrapper">
    <div class="breadcrumbs">
      <router-link
        v-for="(breadcrumbRoute, inx) in breadcrumbs"
        :key="inx"
        :to="{ name: breadcrumbRoute.routeName }"
        :class="{ 'previous-pages': inx !== breadcrumbs.length - 1 }"
        >{{
          breadcrumbRoute.breadcrumbName +
          `${inx !== breadcrumbs.length - 1 ? " / " : ""}`
        }}
      </router-link>
    </div>
    <router-link
      :to="{ name: previousPage.routeName }"
      class="current-page-wrapper"
    >
      <img
        :src="arrowIcon"
        alt="arrow to the previous page"
        class="current-page-arrow"
      />
      <div class="current-page-name">
        {{ breadcrumbs[breadcrumbs.length - 1].breadcrumbName }}
      </div>
    </router-link>
  </div>
</template>

<style>
a {
  text-decoration: none;
  color: var(--grey-dark);
  text-transform: capitalize;
}
.previous-pages {
  font-weight: 400;
  font-size: 16px;
  line-height: 100%;
  color: var(--grey);
}
.current-page-name {
  font-weight: 400;
  font-size: clamp(20px, 5vw, 32px);
  color: black;
}
.current-page-wrapper {
  display: flex;
  gap: clamp(20px, 5vw, 33px);
  align-items: center;
  margin-top: 32px;
}
.current-page-wrapper img {
  width: clamp(8px, 5vw, 13px);
  height: clamp(16px, 5vw, 26px);
}
</style>
