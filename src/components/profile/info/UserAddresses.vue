<script lang="ts" setup>
import { ref } from "vue";
import { useUserAddressStore } from "@/store/useUserAddressStore.ts";
import { useModal } from "@/composables/useModal.ts";
import { showError, showSuccess } from "@/utils/toast.ts";
import { toUIAddressFromPlatform } from "@/adapters/address.adapter.ts";
import AddressCard from "@/components/profile/ui/AddressCard.vue";
import UserAddressForm from "@/components/profile/forms/UserAddressForm.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import type { UIAddress } from "@/types/types.ts";
import type { CountryOption } from "@/types/interfaces.ts";
import { storeToRefs } from "pinia";

const userAddressStore = useUserAddressStore();
const { shippingAddresses, billingAddresses } = storeToRefs(userAddressStore);
const {
  updateAddressActions,
  isDefaultShipping,
  isDefaultBilling,
  updateCustomerInfo,
} = userAddressStore;

const { modalState, openModal, closeModal } = useModal();
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
  const current = userAddressStore.defaultShippingId;
  userAddressStore.updateCustomerInfo({
    defaultShippingAddressId: current === id ? undefined : id,
  });
};

const toggleDefaultBilling = (id: string): void => {
  console.log("Установить адрес счета по умолчанию");

  const current = userAddressStore.defaultBillingId;
  updateCustomerInfo({
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
  console.log("Обновленный адрес:", address);
  try {
    showSuccess(`Адрес успешно обновлён`);
  } catch (e) {
    // выводить конкретные ошибки
    if (e instanceof Error) {
      showError(`Не удалось обновить адрес, ${e.message}`);
    }
  } finally {
    closeModal();
  }
};

const onRemoveShippingAddress = async (id: string): Promise<void> => {
  try {
    await updateAddressActions([
      { action: "removeShippingAddressId", addressId: id },
    ]);

    showSuccess("Адрес удалён");
  } catch (e) {
    if (e instanceof Error) {
      showError(`Ошибка удаления, ${e.message}`);
    }
  }
};
const onRemoveBillingAddress = async (id: string): Promise<void> => {
  try {
    await updateAddressActions([
      { action: "removeBillingAddressId", addressId: id },
    ]);

    showSuccess("Адрес удалён");
  } catch (e) {
    if (e instanceof Error) {
      showError(`Ошибка удаления, ${e.message}`);
    }
  }
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
        :is-default="isDefaultShipping"
        @edit="onEditAddress"
        @remove="onRemoveShippingAddress"
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
        :is-default="isDefaultBilling"
        @edit="onEditAddress"
        @remove="onRemoveBillingAddress"
        @default-toggle="toggleDefaultBilling"
      />
    </div>

    <BaseModal
      v-if="modalState === 'address'"
      title="Редактировать адрес"
      :is-open="true"
      @close="closeModal"
    >
      <UserAddressForm
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
