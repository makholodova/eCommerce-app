<script lang="ts" setup>
import arrowIcon from "@/assets/icons/icon-arrow.png";
import type { breadCrumbType } from "@/types/user-login.types";
import { computed } from "vue";

const props = defineProps<{
  breadcrumbs: breadCrumbType[];
}>();

const translatedCategory: Record<string, string> = {
  tablets: "Планшеты",
  laptops: "Ноутбуки",
  smartphones: "Смартфоны",
};

const previousPage = computed(() => {
  return (
    props.breadcrumbs[props.breadcrumbs.length - 2] || props.breadcrumbs[0]
  );
});
</script>

<template>
  <div class="breadcrumbs-wrapper">
    <div class="breadcrumbs">
      <div v-if="breadcrumbs.length > 0">
        <router-link
          v-for="(breadcrumbRoute, inx) in breadcrumbs.slice(0, -1)"
          :key="inx"
          :to="
            breadcrumbRoute.params
              ? {
                  name: breadcrumbRoute.routeName,
                  params: breadcrumbRoute.params,
                }
              : { name: breadcrumbRoute.routeName }
          "
          class="previous-pages"
          >{{
            translatedCategory[breadcrumbRoute.breadcrumbName] ||
            breadcrumbRoute.breadcrumbName
          }}
          /
        </router-link>
        <span class="current-page">
          {{
            translatedCategory[breadcrumbs.at(-1)?.breadcrumbName ?? ""] ||
            breadcrumbs.at(-1)?.breadcrumbName
          }}
        </span>
      </div>
      <span v-else class="current-page">
        {{
          translatedCategory[breadcrumbs.at(-1)?.breadcrumbName ?? ""] ||
          breadcrumbs.at(-1)?.breadcrumbName
        }}
      </span>
    </div>
    <router-link
      :to="
        previousPage.params
          ? {
              name: previousPage.routeName,
              params: previousPage.params,
            }
          : { name: previousPage.routeName }
      "
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

.breadcrumbs {
  display: flex;
  justify-content: flex-start;
}
</style>
