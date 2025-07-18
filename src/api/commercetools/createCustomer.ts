import {
  ClientBuilder,
  type PasswordAuthMiddlewareOptions,
  type HttpMiddlewareOptions,
} from "@commercetools/sdk-client-v2";
import { createApiBuilderFromCtpClient } from "@commercetools/platform-sdk";
import type { ByProjectKeyRequestBuilder } from "@commercetools/platform-sdk";
import { useTokenStore } from "@/store/useTokenStore";
import { storeToRefs } from "pinia";

const projectKey = import.meta.env.VITE_PROJECT_KEY;
const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;
const authUrl = import.meta.env.VITE_AUTH_URL;
const apiUrl = import.meta.env.VITE_API_URL;
const scopesCustomer = import.meta.env.VITE_SCOPES_CUSTOMER.split(" ");

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
    fetch: globalThis.fetch,
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
    fetch: globalThis.fetch,
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
