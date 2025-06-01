import { computed } from "vue";
import { defineStore } from "pinia";
import type {
  Customer,
  CustomerUpdateAction,
} from "@commercetools/platform-sdk";
import { updateCustomerProfile } from "@/api/commercetools/customer/updateCustomerProfile.ts";
import { sharedCustomer } from "@/store/sharedCustomer.ts";

export const useUserProfileStore = defineStore(
  "userProfile",
  () => {
    const customer = sharedCustomer;

    const firstName = computed(() => customer.value?.firstName ?? "");
    const lastName = computed(() => customer.value?.lastName ?? "");
    const email = computed(() => customer.value?.email ?? "");
    const dateOfBirth = computed(() => customer.value?.dateOfBirth ?? "");

    async function updatePersonalInfo(data: {
      firstName?: string;
      lastName?: string;
      email?: string;
      dateOfBirth?: string;
    }): Promise<void> {
      if (!customer.value) return;

      const actions: CustomerUpdateAction[] = [];

      if (data.firstName && data.firstName !== customer.value.firstName)
        actions.push({ action: "setFirstName", firstName: data.firstName });
      if (data.lastName && data.lastName !== customer.value.lastName)
        actions.push({ action: "setLastName", lastName: data.lastName });
      if (data.email && data.email !== customer.value.email)
        actions.push({ action: "changeEmail", email: data.email });
      if (data.dateOfBirth && data.dateOfBirth !== customer.value.dateOfBirth)
        actions.push({
          action: "setDateOfBirth",
          dateOfBirth: data.dateOfBirth,
        });
      const updateCustomer = await updateCustomerProfile(
        customer.value.version,
        actions,
      );
      customer.value = updateCustomer;
    }
    function setCustomer(data: Customer): void {
      customer.value = data;
    }

    return {
      customer,
      firstName,
      lastName,
      dateOfBirth,
      email,
      updatePersonalInfo,
      setCustomer,
    };
  },
  {
    persist: true,
  },
);
