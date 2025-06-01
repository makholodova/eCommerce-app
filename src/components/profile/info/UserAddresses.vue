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
const {
  shippingAddresses,
  billingAddresses,
  defaultShippingId,
  defaultBillingId,
} = storeToRefs(userAddressStore);
const { updateAddressActions, isDefaultShipping, isDefaultBilling } =
  userAddressStore;

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

const toggleDefaultShipping = async (id: string): Promise<void> => {
  const isDefault = defaultShippingId.value === id;
  const newDefaultId = isDefault ? undefined : id;

  try {
    await updateAddressActions([
      {
        action: "setDefaultShippingAddress",
        addressId: newDefaultId,
      },
    ]);
    showSuccess(
      isDefault
        ? "Адрес снят как адрес доставки по умолчанию"
        : "Установлен новый адрес доставки по умолчанию",
    );
  } catch (e) {
    if (e instanceof Error) {
      showError(`Не удалось изменить адрес доставки: ${e.message}`);
    }
  }
};

const toggleDefaultBilling = async (id: string): Promise<void> => {
  const isDefault = defaultBillingId.value === id;
  const newDefaultId = isDefault ? undefined : id;

  try {
    await updateAddressActions([
      {
        action: "setDefaultBillingAddress",
        addressId: newDefaultId,
      },
    ]);
    showSuccess(
      isDefault
        ? "Адрес снят как адрес для выставления счета по умолчанию"
        : "Установлен новый адрес для выставления счета по умолчанию",
    );
  } catch (e) {
    if (e instanceof Error) {
      showError(
        `Не удалось изменить адрес для выставления счета: ${e.message}`,
      );
    }
  }
};

const openAddShippingModal = (): void => {
  addressToEdit.value = { ...defaultAddress };
  openModal("addShipping");
};

const openAddBillingModal = (): void => {
  addressToEdit.value = { ...defaultAddress };
  openModal("addBilling");
};

const openEditAddressModal = (address: UIAddress): void => {
  addressToEdit.value = address;
  openModal("edit");
};

const onSubmitShippingAddress = async (address: UIAddress): Promise<void> => {
  try {
    const updatedCustomer = await updateAddressActions([
      { action: "addAddress", address: address },
    ]);

    const lastAddress = updatedCustomer.addresses.at(-1);
    if (!lastAddress?.id)
      throw new Error("Не удалось получить ID нового адреса");

    await updateAddressActions([
      { action: "addShippingAddressId", addressId: lastAddress.id },
    ]);

    showSuccess("Адрес добавлен");
    closeModal();
  } catch (e) {
    if (e instanceof Error) {
      showError(`Ошибка удаления, ${e.message}`);
    }
  }
};
const onSubmitBillingAddress = async (address: UIAddress): Promise<void> => {
  try {
    const updatedCustomer = await updateAddressActions([
      { action: "addAddress", address: address },
    ]);

    const lastAddress = updatedCustomer.addresses.at(-1);
    if (!lastAddress?.id)
      throw new Error("Не удалось получить ID нового адреса");

    await updateAddressActions([
      { action: "addBillingAddressId", addressId: lastAddress.id },
    ]);

    showSuccess("Адрес добавлен");
    closeModal();
  } catch (e) {
    if (e instanceof Error) {
      showError(`Ошибка удаления, ${e.message}`);
    }
  }
};

const onSubmitEditedAddress = async (address: UIAddress): Promise<void> => {
  try {
    await updateAddressActions([
      { action: "changeAddress", addressId: address.id, address: address },
    ]);
    showSuccess(`Адрес успешно обновлён`);
    closeModal();
  } catch (e) {
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

      <div class="address-card address-card--add" @click="openAddShippingModal">
        <div class="add-icon">+</div>
        <p>Добавить адрес</p>
      </div>

      <AddressCard
        v-for="address in shippingAddresses"
        :key="address.id"
        :address="toUIAddressFromPlatform(address)"
        :is-default="isDefaultShipping(address.id)"
        @edit="openEditAddressModal"
        @remove="onRemoveShippingAddress"
        @default-toggle="toggleDefaultShipping"
      />
    </div>

    <div class="profile-addresses__section">
      <h2 class="profile-addresses__title">Адреса для выставления счета</h2>
      <div class="address-card address-card--add" @click="openAddBillingModal">
        <div class="add-icon">+</div>
        <p>Добавить адрес</p>
      </div>
      <AddressCard
        v-for="address in billingAddresses"
        :key="address.id"
        :address="toUIAddressFromPlatform(address)"
        :is-default="isDefaultBilling(address.id)"
        @edit="openEditAddressModal"
        @remove="onRemoveBillingAddress"
        @default-toggle="toggleDefaultBilling"
      />
    </div>

    <BaseModal
      v-if="modalState === 'addShipping'"
      title="Добавить адрес доставки"
      :is-open="true"
      @close="closeModal"
    >
      <UserAddressForm
        :address="addressToEdit"
        :countries="countries"
        @submit="onSubmitShippingAddress"
        @close="closeModal"
      />
    </BaseModal>

    <BaseModal
      v-if="modalState === 'addBilling'"
      title="Добавить адрес для выставления счета"
      :is-open="true"
      @close="closeModal"
    >
      <UserAddressForm
        :address="addressToEdit"
        :countries="countries"
        @submit="onSubmitBillingAddress"
        @close="closeModal"
      />
    </BaseModal>

    <BaseModal
      v-if="modalState === 'edit'"
      title="Редактировать адрес"
      :is-open="true"
      @close="closeModal"
    >
      <UserAddressForm
        :address="addressToEdit"
        :countries="countries"
        @submit="onSubmitEditedAddress"
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
