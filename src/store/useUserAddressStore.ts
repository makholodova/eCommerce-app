import { computed } from "vue";
import { defineStore } from "pinia";
import type { Customer } from "@commercetools/platform-sdk";
import { sharedCustomer } from "@/store/sharedCustomer.ts";

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

    function updateCustomerInfo(data: Partial<Customer>): void {
      if (!customer.value) return;

      customer.value = {
        ...customer.value,
        ...data,
      };
    }

    function setCustomer(data: Customer): void {
      customer.value = data;
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
      updateCustomerInfo,
      setCustomer,
    };
  },
  {
    persist: true,
  },
);
