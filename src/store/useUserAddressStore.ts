import { computed } from "vue";
import { defineStore } from "pinia";
import type {
  Customer,
  CustomerUpdateAction,
} from "@commercetools/platform-sdk";
import { sharedCustomer } from "@/store/sharedCustomer.ts";
import { updateCustomerProfile } from "@/api/commercetools/customer/updateCustomerProfile.ts";

export const useUserAddressStore = defineStore(
  "userAddress",
  () => {
    const customer = sharedCustomer;

    const addresses = computed(() => customer.value?.addresses ?? []);

    const shippingAddresses = computed(() =>
      addresses.value.filter((a) =>
        customer.value?.shippingAddressIds?.includes(a.id!),
      ),
    );

    const billingAddresses = computed(() =>
      addresses.value.filter((a) =>
        customer.value?.billingAddressIds?.includes(a.id!),
      ),
    );

    const defaultShippingId = computed(
      () => customer.value?.defaultShippingAddressId,
    );
    const defaultBillingId = computed(
      () => customer.value?.defaultBillingAddressId,
    );

    const isDefaultShipping = (addressId: string | undefined): boolean =>
      addressId === defaultShippingId.value;

    const isDefaultBilling = (addressId: string | undefined): boolean =>
      addressId === defaultBillingId.value;

    async function updateAddressActions(
      actions: CustomerUpdateAction[],
    ): Promise<Customer> {
      if (!customer.value) throw new Error("Нет данных пользователя");

      try {
        const response = await updateCustomerProfile(
          customer.value.version,
          actions,
        );
        customer.value = response;
        return response;
      } catch (error) {
        console.error("Не удалось обновить адреса:", error);
        throw error;
      }
    }

    return {
      customer,
      addresses,
      shippingAddresses,
      billingAddresses,
      defaultShippingId,
      defaultBillingId,
      isDefaultShipping,
      isDefaultBilling,
      updateAddressActions,
    };
  },
  {
    persist: true,
  },
);
