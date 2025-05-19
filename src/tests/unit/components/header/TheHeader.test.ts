import { afterEach, describe, it, vi, expect } from "vitest";
import type { VueWrapper } from "@vue/test-utils";
import { mount } from "@vue/test-utils";
import TheHeader from "@/components/header/TheHeader.vue";
import { h, type VNode } from "vue";

type TokenStore = {
  isAuthenticated: boolean;
  logout: () => void;
};

type Router = {
  push: (options: unknown) => void;
};

type Route = {
  name: string;
};

vi.mock("@/store/useTokenStore", () => {
  return {
    useTokenStore: (): TokenStore => ({
      isAuthenticated: false,
      logout: vi.fn(),
    }),
  };
});

const mockPush = vi.fn();
const mockRouteName = "Main";

vi.mock("vue-router", async () => {
  const actual = await vi.importActual("vue-router");
  return {
    ...actual,
    useRouter: (): Router => ({
      push: mockPush,
    }),
    useRoute: (): Route => ({
      name: mockRouteName,
    }),
    RouterLink: {
      name: "RouterLink",
      render: (): VNode => h("a", {}, "RouterLink"),
    },
  };
});

import { RouterLink } from "vue-router";

describe("<TheHeader />", () => {
  let wrapper: VueWrapper<InstanceType<typeof TheHeader>>;

  const createWrapper = (): void => {
    wrapper = mount(TheHeader);
  };

  afterEach((): void => {
    if (wrapper) wrapper.unmount();
    vi.resetAllMocks();
    vi.clearAllMocks();
  });

  it("checks if logout button disappears when user is not authorized", (): void => {
    createWrapper();

    const links = wrapper.findAllComponents(RouterLink);
    const logoutLink = links.find((link) => link.text().includes("Выход"));

    expect(logoutLink).toBeUndefined();
  });
});
