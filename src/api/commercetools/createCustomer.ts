import {
  ClientBuilder,
  type PasswordAuthMiddlewareOptions,
  type HttpMiddlewareOptions,
} from "@commercetools/sdk-client-v2";
import { createApiBuilderFromCtpClient } from "@commercetools/platform-sdk";
import type { ByProjectKeyRequestBuilder } from "@commercetools/platform-sdk";
import { useTokenStore } from "@/store/useTokenStore";
import { storeToRefs } from "pinia";
import { useAnonymousTokenStore } from "@/store/useAnonymousTokenStore";

const projectKey = import.meta.env.VITE_PROJECT_KEY;
const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;
const authUrl = import.meta.env.VITE_AUTH_URL;
const apiUrl = import.meta.env.VITE_API_URL;
const scopesCustomer = import.meta.env.VITE_SCOPES_CUSTOMER.split(" ");

const anonymousId = useAnonymousTokenStore().anonymousId;

/*const customFetch: typeof fetch = async (url, options) => {
  const modifiedUrl =
    typeof url === "string" ? new URL(url, apiUrl) : new URL(url.toString());

  if (anonymousId) {
    modifiedUrl.searchParams.set("anonymous_id", anonymousId);
  }

  return fetch(modifiedUrl.toString(), options);
};*/

function isHeaderRecord(
  headers: HeadersInit,
): headers is Record<string, string> {
  return (
    typeof headers === "object" && headers !== null && !("forEach" in headers)
  );
}

const customFetch: typeof fetch = async (url, options) => {
  if (
    options?.body &&
    typeof options.body === "string" &&
    options.headers &&
    isHeaderRecord(options.headers) &&
    options.headers["Content-Type"] === "application/x-www-form-urlencoded"
  ) {
    const params = new URLSearchParams(options.body);
    if (anonymousId) {
      params.set("anonymous_id", anonymousId);
    }

    const modifiedOptions: RequestInit = {
      ...options,
      body: params.toString(),
    };

    return fetch(url.toString(), modifiedOptions);
  }

  return fetch(url.toString(), options);
};
export function createCustomerApiRoot(
  email: string,
  password: string,
): ByProjectKeyRequestBuilder {
  const tokenStore = useTokenStore();
  const { token, refreshToken, expirationTime } = storeToRefs(tokenStore);

  const authOptions: PasswordAuthMiddlewareOptions = {
    host: authUrl,
    projectKey,
    credentials: {
      clientId,
      clientSecret,
      user: {
        username: email,
        password: password,
      },
    },
    scopes: scopesCustomer,
    fetch: customFetch,
    tokenCache: {
      get: () => ({
        token: token.value,
        refreshToken: refreshToken.value,
        expirationTime: expirationTime.value,
      }),
      set: (newToken) => {
        tokenStore.setTokenStore(newToken);
      },
    },
  };

  const httpOptions: HttpMiddlewareOptions = {
    host: apiUrl,
    fetch: customFetch,
  };

  const customerClient = new ClientBuilder()
    .withPasswordFlow(authOptions)
    .withHttpMiddleware(httpOptions)
    .withLoggerMiddleware()
    .build();

  return createApiBuilderFromCtpClient(customerClient).withProjectKey({
    projectKey,
  });
}
