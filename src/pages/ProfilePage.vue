<script lang="ts" setup>
import { ref } from "vue";

import { TabKey } from "@/types/enums.ts";
import ProfileTabs from "@/components/profile/ui/ProfileTabs.vue";
import UserProfileInfo from "@/components/profile/info/UserProfileInfo.vue";
import UserAddresses from "@/components/profile/info/UserAddresses.vue";

const currentTab = ref<TabKey>(TabKey.Account);

const tabComponentsMap = {
  Account: UserProfileInfo,
  Address: UserAddresses,
};
</script>

<template>
  <div class="profile-page">
    <div class="profile-layout">
      <h1 class="profile-title">Моя учетная запись</h1>
      <ProfileTabs v-model="currentTab" />
      <div class="profile-content">
        <component :is="tabComponentsMap[currentTab]" />
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 400;
  font-size: 28px;
  margin: 0;
  /*text-align: center;*/
}

.profile-page {
  padding: 24px;
  min-height: 100vh;
}

.profile-layout {
  display: flex;
  /*align-items: center;*/
  flex-direction: column;
  gap: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  width: 100%;
}
.profile-title {
  padding-left: 24px;
}

.profile-content {
  flex: 1;
  padding: 24px;
  /* border-radius: 40px;
  box-shadow: 0 2px 20px rgb(0 0 0 / 10%);*/
  /*border: 1px solid var(--blue-light);*/
}
</style>
