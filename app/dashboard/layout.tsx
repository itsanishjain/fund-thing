import { inter } from "@/app/lib/fonts";
import { Metadata } from "next";

import SideNav from "@/components/app/SideNav";
import TopNavHeader from "@/components/app/TopNavHeader";

export const metadata: Metadata = {
  title: {
    template: "%s | willi",
    default: "willi",
  },
  description: "willi, you gonna die so let's fix your cryoto",
  metadataBase: new URL("https://willi.com"),
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <div className="flex h-screen flex-col">
          {/* Top Navigation */}
          <TopNavHeader />
          <div className="flex flex-1 overflow-hidden">
            {/* Side Navigation */}
            <aside className="w-24 border-r-2 flex flex-col items-center py-32 space-y-6">
              <SideNav />
            </aside>
            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-white">
              <div className="">{children}</div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
