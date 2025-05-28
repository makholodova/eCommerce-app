import { useTokenStore } from "@/store/useTokenStore";
import { useAnonymousTokenStore } from "@/store/useAnonymousTokenStore";
import { loginAnonymous } from "@/api/commercetools/loginAnonymous";

export async function checkValidSession(): Promise<void> {
  const tokenStore = useTokenStore();
  const anonymousStore = useAnonymousTokenStore();

  if (!tokenStore.token && !anonymousStore.token) {
    await loginAnonymous();
  }
}
