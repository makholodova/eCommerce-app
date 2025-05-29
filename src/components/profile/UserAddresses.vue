<script lang="ts" setup>
import { useUserStore } from "@/store/useUserStore.ts";
import AddressCard from "@/components/profile/AddressCard.vue";
import type { Address } from "@commercetools/platform-sdk";
import { toUIAddress } from "@/adapters/address.adapter.ts";

const userStore = useUserStore();

const shippingAddresses = userStore.shippingAddresses;
const billingAddresses = userStore.billingAddresses;

const isDefault = userStore.isDefault;

const toggleDefaultShipping = (id: string): void => {
  console.log("Установить адрес доставки по умолчанию");
  const current = userStore.defaultShippingId;
  userStore.updateCustomerInfo({
    defaultShippingAddressId: current === id ? undefined : id,
  });
};

const toggleDefaultBilling = (id: string): void => {
  console.log("Установить адрес счета по умолчанию");

  const current = userStore.defaultBillingId;
  userStore.updateCustomerInfo({
    defaultBillingAddressId: current === id ? undefined : id,
  });
};

const onAddAddressShipping = (): void => {
  console.log("Добавить адрес доставки");
};

const onAddAddressBilling = (): void => {
  console.log("Добавить адрес счета");
};

const onEditAddress = (address: Address): void => {
  console.log("Редактирование адреса", address);
};

const onRemoveAddress = (id: string): void => {
  console.log("Удаление адреса", id);
};
</script>

<template>
  <div class="profile-addresses">
    <div class="profile-addresses__section">
      <h2 class="profile-addresses__title">Адреса доставки</h2>

      <div class="address-card address-card--add" @click="onAddAddressShipping">
        <div class="add-icon">+</div>
        <p>Добавить адрес</p>
      </div>

      <AddressCard
        v-for="address in shippingAddresses"
        :key="address.id"
        :address="toUIAddress(address)"
        :is-default="isDefault(address.id, 'shipping')"
        @edit="onEditAddress"
        @remove="onRemoveAddress"
        @default-toggle="toggleDefaultShipping"
      />
    </div>

    <div class="profile-addresses__section">
      <h2 class="profile-addresses__title">Адреса для выставления счета</h2>
      <div class="address-card address-card--add" @click="onAddAddressBilling">
        <div class="add-icon">+</div>
        <p>Добавить адрес</p>
      </div>
      <AddressCard
        v-for="address in billingAddresses"
        :key="address.id"
        :address="toUIAddress(address)"
        :is-default="isDefault(address.id, 'billing')"
        @edit="onEditAddress"
        @remove="onRemoveAddress"
        @default-toggle="toggleDefaultBilling"
      />
    </div>
  </div>
</template>

<style scoped>
.profile-addresses {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-addresses__section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.profile-addresses__title {
  grid-column: 1 / -1;
  font-weight: 400;
  font-size: 22px;
  margin: 0;
}

.address-card--add {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 2px dashed var(--grey-light);
  border-radius: 8px;
  min-height: 160px;
  cursor: pointer;
  color: var(--grey-dark);
  transition:
    border-color 0.2s ease,
    color 0.2s ease;
}

.address-card--add:hover {
  border-color: var(--blue);
  color: var(--blue);
}
.add-icon {
  font-size: 32px;
  line-height: 1;
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .profile-addresses__section {
    grid-template-columns: 1fr;
  }
}
</style>
