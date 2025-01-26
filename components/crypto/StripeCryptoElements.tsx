"use client";

import React from "react";
import type { OnrampAppearanceOptions, StripeOnramp } from "@stripe/crypto";

interface StripeOnrampSession {
  mount: (element: HTMLElement) => StripeOnrampSession;
  addEventListener: (
    event: string,
    listener: (event: { payload: any }) => void
  ) => void;
  removeEventListener: (
    event: string,
    listener: (event: { payload: any }) => void
  ) => void;
}

interface CryptoElementsContextType {
  onramp: StripeOnramp | null;
}

// ReactContext to simplify access of StripeOnramp object
const CryptoElementsContext = React.createContext<CryptoElementsContextType>({
  onramp: null,
});
CryptoElementsContext.displayName = "CryptoElementsContext";

interface CryptoElementsProps {
  stripeOnramp: Promise<StripeOnramp | null>;
  children: React.ReactNode;
}

export const CryptoElements: React.FC<CryptoElementsProps> = ({
  stripeOnramp,
  children,
}) => {
  const [ctx, setContext] = React.useState<CryptoElementsContextType>(() => ({
    onramp: null,
  }));

  React.useEffect(() => {
    let isMounted = true;

    Promise.resolve(stripeOnramp).then((onramp) => {
      if (onramp && isMounted) {
        setContext((ctx) => (ctx.onramp ? ctx : { onramp }));
      }
    });

    return () => {
      isMounted = false;
    };
  }, [stripeOnramp]);

  return (
    <CryptoElementsContext.Provider value={ctx}>
      {children}
    </CryptoElementsContext.Provider>
  );
};

// React hook to get StripeOnramp from context
export const useStripeOnramp = (): StripeOnramp | null => {
  const context = React.useContext(CryptoElementsContext);
  return context.onramp;
};

interface OnrampSessionEvent {
  payload: any;
}

// React element to render Onramp UI
const useOnrampSessionListener = (
  type: string,
  session: StripeOnrampSession | undefined,
  callback: (payload: any) => void
) => {
  React.useEffect(() => {
    if (session && callback) {
      const listener = (e: OnrampSessionEvent) => callback(e.payload);
      session.addEventListener(type, listener);
      return () => {
        session.removeEventListener(type, listener);
      };
    }
    return () => {};
  }, [session, callback, type]);
};

interface OnrampElementProps extends React.HTMLAttributes<HTMLDivElement> {
  clientSecret: string;
  appearance: OnrampAppearanceOptions;
  onReady: () => void;
  onChange: (event: any) => void;
}

export const OnrampElement: React.FC<OnrampElementProps> = ({
  clientSecret,
  appearance,
  onReady,
  onChange,
  ...props
}) => {
  const stripeOnramp = useStripeOnramp();
  const onrampElementRef = React.useRef<HTMLDivElement>(null);
  const [session, setSession] = React.useState<StripeOnrampSession>();

  const appearanceJSON = JSON.stringify(appearance);
  React.useEffect(() => {
    const containerRef = onrampElementRef.current;
    if (containerRef) {
      // NB: ideally we want to be able to hot swap/update onramp iframe
      // This currently results a flash if one needs to mint a new session when they need to udpate fixed transaction details
      containerRef.innerHTML = "";

      if (clientSecret && stripeOnramp) {
        setSession(
          stripeOnramp
            .createSession({
              clientSecret,
              appearance: appearanceJSON ? JSON.parse(appearanceJSON) : {},
            })
            .mount(containerRef)
        );
      }
    }
  }, [appearanceJSON, clientSecret, stripeOnramp]);

  useOnrampSessionListener("onramp_ui_loaded", session, onReady);
  useOnrampSessionListener("onramp_session_updated", session, onChange);

  return <div {...props} ref={onrampElementRef}></div>;
};
