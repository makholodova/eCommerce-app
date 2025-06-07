import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import ProductCard from "@/components/ui/ProductCard.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import router from "@/router";

type Props = {
  id: string;
  title: string;
  image?: string;
  description?: string;
  price?: number;
  category?: string;
  discountedPrice?: number;
  discountedPercentage?: number;
};

describe("ProductCard.vue", () => {
  const mountCard = (props: Props): ReturnType<typeof mount> =>
    mount(ProductCard, {
      global: { plugins: [router], stubs: { BaseButton } },
      props,
    });

  it("renders title, image and description", () => {
    const wrapper = mountCard({
      id: "1",
      title: "Test",
      image: "img.png",
      description: "Desc",
      price: 100,
    });
    expect(wrapper.find(".card-title").text()).toBe("Test");
    expect(wrapper.get("img.card-img").attributes("src")).toBe("img.png");
    expect(wrapper.find(".card-description").text()).toBe("Desc");
  });

  it("does not render discount badge when no discount props", () => {
    const wrapper = mountCard({ id: "1", title: "P", price: 50 });
    expect(wrapper.find(".card-img-discounted-icon").exists()).toBe(false);
    expect(wrapper.find(".card-discounted-price").exists()).toBe(false);
  });

  it("renders correct discount badge and prices when discounted", () => {
    const wrapper = mountCard({
      id: "1",
      title: "P",
      price: 50,
      discountedPrice: 40,
      discountedPercentage: 20,
    });
    expect(wrapper.find(".card-img-discounted-icon").text()).toBe("-20%");
    expect(wrapper.get(".card-current-price").text()).toBe("40 ₽");
    expect(wrapper.get(".card-discounted-price").text()).toBe("50 ₽");
  });

  it("hides discount elements when only price provided", () => {
    const wrapper = mountCard({ id: "1", title: "P", price: 200 });
    expect(wrapper.find(".card-img-discounted-icon").exists()).toBe(false);
    expect(wrapper.get(".card-current-price").text()).toBe("200 ₽");
    expect(wrapper.find(".card-discounted-price").exists()).toBe(false);
  });
});
