import { ref } from "vue";
import type { Customer } from "@commercetools/platform-sdk";

export const sharedCustomer = ref<Customer | null>(null);
