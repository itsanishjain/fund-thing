import "../globals.css";
import { poppins } from "@/app/lib/fonts";
import { Metadata } from "next";
import Progress from "./progress";
import { Providers } from "./providers";
import { headers } from "next/headers";
import { config } from "@/app/lib/config";
import { cookieToInitialState } from "@account-kit/core";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: {
    template: "%s | Fund Thing",
    default: "Fund Thing",
  },
  description: "Fund Thing - Secure your crypto assets for the future",
  metadataBase: new URL("https://fund.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This will allow us to persist state across page boundaries (read more here: https://accountkit.alchemy.com/react/ssr#persisting-the-account-state)
  const initialState = cookieToInitialState(
    config,
    headers().get("cookie") ?? undefined
  );

  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <Providers initialState={initialState}>
          <Progress />
          <div className="flex h-screen flex-col">
            <div className="flex flex-1 overflow-hidden">
              {/* Main Content Area */}
              <main className="flex-1 overflow-y-auto bg-white">
                <div className="">{children}</div>
              </main>
            </div>
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
