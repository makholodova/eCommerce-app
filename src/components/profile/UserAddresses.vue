<script lang="ts" setup>
import { ref } from "vue";
import { useUserStore } from "@/store/useUserStore.ts";
import { toUIAddressFromPlatform } from "@/adapters/address.adapter.ts";
import { useModal } from "@/composables/useModal.ts";
import type { UIAddress } from "@/types/types.ts";
import type { CountryOption } from "@/types/interfaces.ts";
import BaseModal from "@/components/ui/BaseModal.vue";
import AddressEditForm from "@/components/profile/AddressEditForm.vue";
import AddressCard from "@/components/profile/AddressCard.vue";

const userStore = useUserStore();

const shippingAddresses = userStore.shippingAddresses;
const billingAddresses = userStore.billingAddresses;

const isDefault = userStore.isDefault;

const { openedModal, openModal, closeModal } = useModal();
const defaultAddress: UIAddress = {
  id: "",
  country: "",
  city: "",
  streetName: "",
  postalCode: "",
};

const addressToEdit = ref<UIAddress>({ ...defaultAddress });

const countries = ref<CountryOption[]>([{ title: "RU", value: "Россия" }]); //нужно брать из комерзтоолс наверно

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

const openAddressModal = (address?: UIAddress): void => {
  addressToEdit.value = address ?? { ...defaultAddress };
  openModal("address");
};

const onEditAddress = (address: UIAddress): void => {
  console.log("Редактирование адреса", address);
  openAddressModal(address);
};

const onSubmitAddress = (address: UIAddress): void => {
  console.log("Сохранение адреса", address);
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
        :address="toUIAddressFromPlatform(address)"
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
        :address="toUIAddressFromPlatform(address)"
        :is-default="isDefault(address.id, 'billing')"
        @edit="onEditAddress"
        @remove="onRemoveAddress"
        @default-toggle="toggleDefaultBilling"
      />
    </div>

    <BaseModal
      v-if="openedModal === 'address'"
      :title="'Редактировать адрес'"
      :is-open="true"
      name="address-edit"
      @close="closeModal"
    >
      <AddressEditForm
        :address="addressToEdit"
        :countries="countries"
        @submit="onSubmitAddress"
        @close="closeModal"
      />
    </BaseModal>
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
