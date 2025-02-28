import { AlchemyAccountsUIConfig, createConfig } from "@account-kit/react";
import { alchemy, arbitrumSepolia } from "@account-kit/infra";
import { QueryClient } from "@tanstack/react-query";
import { env } from "@/env";

const alchemyApiKey = env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? "";

const uiConfig: AlchemyAccountsUIConfig = {
  illustrationStyle: "outline",
  auth: {
    sections: [
      [{ type: "email" }],
      [
        { type: "passkey" },
        { type: "social", authProviderId: "google", mode: "popup" },
        { type: "social", authProviderId: "facebook", mode: "popup" },
      ],
    ],
    addPasskeyOnSignup: false,
  },
};

export const config = createConfig(
  {
    transport: alchemy({ apiKey: alchemyApiKey }),
    chain: arbitrumSepolia,
    ssr: false, // set to false if you're not using server-side rendering
    enablePopupOauth: true,
    policyId: env.NEXT_PUBLIC_POLICY_ID,
  },
  uiConfig
);

export const queryClient = new QueryClient();
