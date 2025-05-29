import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type { Customer } from "@commercetools/platform-sdk";

export const useUserStore = defineStore(
  "user",
  () => {
    const customer = ref<Customer | null>(null);
    const isAuthenticated = ref<boolean>(false);

    const firstName = computed(() => customer.value?.firstName ?? "");
    const lastName = computed(() => customer.value?.lastName ?? "");
    const email = computed(() => customer.value?.email ?? "");
    const dateOfBirth = computed(() => customer.value?.dateOfBirth ?? "");

    const addresses = computed(() => customer.value?.addresses ?? []);

    const defaultShippingId = computed(
      () => customer.value?.defaultShippingAddressId,
    );
    const defaultBillingId = computed(
      () => customer.value?.defaultBillingAddressId,
    );

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

    const isDefault = (
      addressId: string | undefined,
      type: "shipping" | "billing",
    ): boolean => {
      if (!addressId) return false;
      return type === "shipping"
        ? addressId === defaultShippingId.value
        : addressId === defaultBillingId.value;
    };

    const logout = (): void => {
      customer.value = null;
      isAuthenticated.value = false;
    };

    function updateCustomerInfo(data: Partial<Customer>): void {
      if (!customer.value) return;

      customer.value = {
        ...customer.value,
        ...data,
      };
    }

    return {
      customer,
      isAuthenticated,
      firstName,
      lastName,
      dateOfBirth,
      email,
      addresses,
      shippingAddresses,
      billingAddresses,
      defaultShippingId,
      defaultBillingId,
      isDefault,
      logout,
      updateCustomerInfo,
    };
  },
  {
    persist: true,
  },
);
