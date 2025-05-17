import { ClientBuilder } from "@commercetools/sdk-client-v2";
import { createApiBuilderFromCtpClient } from "@commercetools/platform-sdk";

const projectKey = import.meta.env.VITE_PROJECT_KEY;
const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;
const authUrl = import.meta.env.VITE_AUTH_URL;
const apiUrl = import.meta.env.VITE_API_URL;
const scopes = import.meta.env.VITE_SCOPES_CUSTOMER.split(" ");

const authMiddlewareOptions = {
  host: authUrl,
  projectKey: projectKey,
  credentials: {
    clientId: clientId,
    clientSecret: clientSecret,
  },
  scopes,
  httpClient: globalThis.fetch,
};

const httpMiddlewareOptions = {
  host: apiUrl,
  httpClient: globalThis.fetch,
};

export const ctpClient = new ClientBuilder()
  .withProjectKey(projectKey)
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

export const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey,
});
