import { mount, type VueWrapper } from "@vue/test-utils";
import { type ComponentPublicInstance, nextTick } from "vue";
import { describe, it, expect } from "vitest";
import UserProfileForm from "@/components/profile/forms/UserProfileForm.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInputField from "@/components/ui/BaseInputField.vue";

const validModel = {
  firstName: "Ivan",
  lastName: "Ivanov",
  dateOfBirth: "2000-01-01",
  email: "ivan@test.com",
};

const mountForm = (
  overrides: Record<string, unknown> = {},
): VueWrapper<ComponentPublicInstance> =>
  mount(UserProfileForm, {
    props: {
      modelValue: { ...validModel },
      isLoading: false,
      ...overrides,
    },
    global: {
      stubs: {
        BaseButton,
        BaseInputField,
      },
    },
  });

describe("UserProfileForm.vue", () => {
  it("displays initial values", () => {
    const wrapper = mountForm();
    const inputs = wrapper.findAll("input");

    expect(inputs[0].element.value).toBe("Ivan");
    expect(inputs[1].element.value).toBe("Ivanov");
    expect(inputs[2].element.value).toBe("2000-01-01");
    expect(inputs[3].element.value).toBe("ivan@test.com");
  });

  it("emits 'submit' event with valid data", async () => {
    const wrapper = mountForm();

    await wrapper.find("form").trigger("submit.prevent");
    await Promise.resolve();
    await nextTick();

    expect(wrapper.emitted("submit")).toBeTruthy();
  });

  it("does not emit 'submit' if the form is invalid", async () => {
    const wrapper = mountForm({
      modelValue: {
        ...validModel,
        email: "invalid-email",
      },
    });

    await wrapper.find("form").trigger("submit.prevent");
    await Promise.resolve();
    await nextTick();

    expect(wrapper.emitted("submit")).toBeFalsy();
  });

  it("disables the submit button when isLoading is true", () => {
    const wrapper = mountForm({ isLoading: true });
    const button = wrapper.get("button[type='submit']");

    expect(button.attributes("disabled")).toBeDefined();
  });

  it("emits 'close' event when cancel button is clicked", async () => {
    const wrapper = mountForm();

    await wrapper.get("button[type='button']").trigger("click");

    expect(wrapper.emitted("close")).toBeTruthy();
  });
});
