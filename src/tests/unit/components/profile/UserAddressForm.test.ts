import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import UserAddressForm from "@/components/profile/forms/UserAddressForm.vue";
import type { UIAddress } from "@/types/types";
import type { CountryOption } from "@/types/interfaces";

// Mocking AddressForm to simplify input handling
vi.mock("@/components/forms/AddressForm.vue", () => ({
  default: {
    name: "AddressForm",
    props: ["modelValue", "countries", "rules", "prefix", "title"],
    emits: ["update:modelValue"],
    template: `
      <div>
        <input name="country" @input="$emit('update:modelValue', { ...modelValue, country: $event.target.value })" />
        <input name="city" @input="$emit('update:modelValue', { ...modelValue, city: $event.target.value })" />
        <input name="streetName" @input="$emit('update:modelValue', { ...modelValue, streetName: $event.target.value })" />
        <input name="postalCode" @input="$emit('update:modelValue', { ...modelValue, postalCode: $event.target.value })" />
      </div>
    `,
  },
}));

const defaultAddress: UIAddress = {
  id: "addr-1",
  country: "DE",
  city: "Berlin",
  streetName: "Main St",
  postalCode: "12345",
};

const countries: CountryOption[] = [
  { title: "DE", value: "Germany" },
  { title: "FR", value: "France" },
];

describe("UserAddressForm (user behavior)", () => {
  it("renders the form", () => {
    const wrapper = mount(UserAddressForm, {
      props: { address: defaultAddress, countries },
    });

    expect(wrapper.find("form").exists()).toBe(true);
  });

  it("does not emit submit when city is empty", async () => {
    const wrapper = mount(UserAddressForm, {
      props: { address: defaultAddress, countries },
    });

    await wrapper.find("input[name='city']").setValue(""); // invalid
    await wrapper.find("form").trigger("submit.prevent");

    expect(wrapper.emitted("submit")).toBeUndefined();
  });

  it("emits close when cancel button is clicked", async () => {
    const wrapper = mount(UserAddressForm, {
      props: { address: defaultAddress, countries },
    });

    await wrapper.find("button[type='button']").trigger("click");

    expect(wrapper.emitted("close")).toBeTruthy();
  });
});
