import {
  ClientBuilder,
  type AnonymousAuthMiddlewareOptions,
  type HttpMiddlewareOptions,
} from "@commercetools/sdk-client-v2";
import { createApiBuilderFromCtpClient } from "@commercetools/platform-sdk";
import type { ByProjectKeyRequestBuilder } from "@commercetools/platform-sdk";
import { useAnonymousTokenStore } from "@/store/useAnonymousTokenStore";
import { storeToRefs } from "pinia";
import { getAnonymousId } from "@/utils/anonymousId";

const projectKey = import.meta.env.VITE_PROJECT_KEY;
const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;
const authUrl = import.meta.env.VITE_AUTH_URL;
const apiUrl = import.meta.env.VITE_API_URL;
const scopesAnonymous = import.meta.env.VITE_SCOPES_ANONYMOUS.split(" ");

export function createAnonymousApiRoot(): ByProjectKeyRequestBuilder {
  const anonymousTokenStore = useAnonymousTokenStore();
  const { token, refreshToken, expirationTime } =
    storeToRefs(anonymousTokenStore);

  const anonymousId = anonymousTokenStore.anonymousId || getAnonymousId();

  const authOptions: AnonymousAuthMiddlewareOptions = {
    host: authUrl,
    projectKey,
    credentials: {
      clientId,
      clientSecret,
    },
    scopes: scopesAnonymous,
    fetch: async (url: RequestInfo, options?: RequestInit) => {
      const modifiedUrl =
        typeof url === "string" ? new URL(url) : new URL(url.toString());
      modifiedUrl.searchParams.set("anonymous_id", anonymousId);
      return fetch(modifiedUrl, options);
    },
    tokenCache: {
      get: () => ({
        token: token.value,
        refreshToken: refreshToken.value,
        expirationTime: expirationTime.value,
        anonymousId: anonymousId,
      }),

      set: (newAnonymousToken) => {
        anonymousTokenStore.setAnonymousToken({
          ...newAnonymousToken,
          anonymousId,
        });
      },
    },
  };

  const httpOptions: HttpMiddlewareOptions = {
    host: apiUrl,
    fetch: globalThis.fetch,
  };

  const client = new ClientBuilder()
    .withAnonymousSessionFlow(authOptions)
    .withHttpMiddleware(httpOptions)
    .withLoggerMiddleware()
    .build();

  return createApiBuilderFromCtpClient(client).withProjectKey({ projectKey });
}
