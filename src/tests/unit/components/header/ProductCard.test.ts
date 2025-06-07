import type { VueWrapper } from "@vue/test-utils";
import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import ProductCard from "@/components/ui/ProductCard.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import router from "@/router";
import type { ComponentPublicInstance } from "vue";

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
  let wrapper: VueWrapper<
    ComponentPublicInstance & { isDiscounted: boolean } & Props
  >;

  const mountCard = (
    propsData: Props,
  ): VueWrapper<
    ComponentPublicInstance & { isDiscounted: boolean } & Props
  > => {
    return mount<ComponentPublicInstance & { isDiscounted: boolean } & Props>(
      ProductCard,
      {
        global: {
          plugins: [router],
          stubs: { BaseButton },
        },
        props: propsData,
      },
    );
  };

  it("renders title, image and description", () => {
    wrapper = mountCard({
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

  it("correctly computes isDiscounted based on props", () => {
    wrapper = mountCard({ id: "1", title: "P", price: 50 });
    expect(wrapper.vm.isDiscounted).toBe(false);
    wrapper = mountCard({
      id: "1",
      title: "P",
      price: 50,
      discountedPrice: 40,
      discountedPercentage: 20,
    });
    expect(wrapper.vm.isDiscounted).toBe(true);
  });

  it("displays discount badge and prices when discounted", () => {
    wrapper = mountCard({
      id: "1",
      title: "P",
      price: 200,
      discountedPrice: 150,
      discountedPercentage: 25,
    });
    expect(wrapper.find(".card-img-discounted-icon").exists()).toBe(true);
    expect(wrapper.get(".card-current-price").text()).toBe("150 ₽");
    expect(wrapper.get(".card-discounted-price").text()).toBe("200 ₽");
  });

  it("hides discount elements when not discounted", () => {
    wrapper = mountCard({ id: "1", title: "P", price: 200 });
    expect(wrapper.find(".card-img-discounted-icon").exists()).toBe(false);
    expect(wrapper.get(".card-current-price").text()).toBe("200 ₽");
    expect(wrapper.find(".card-discounted-price").exists()).toBe(false);
  });
});
