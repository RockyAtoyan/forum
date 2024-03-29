import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import { Providers } from "@/components/providers/Providers";
import { Header } from "@/components/Header/header";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { Notifications } from "@/components/Notifications";
import { auth } from "@/actions/auth.actions";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Форум ИВТиПТ ЮФУ",
  description: "Форум Института Высоких технологий и пьезотехники ЮФУ",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await auth();

  return (
    <html lang="ru">
      <body
        className={cn(
          inter.className,
          "grid grid-rows-[60px+1fr] h-screen overflow-hidden text-primary",
        )}
      >
        <Providers>
          <Header />
          <main style={{ height: "calc(100vh - 60px)" }}>
            {!user?.banned ? (
              children
            ) : (
              <div
                className={
                  "h-full flex items-center justify-center font-semibold text-destructive dark:text-primary text-3xl"
                }
              >
                Данный аккаунт забанен!
              </div>
            )}
          </main>
          {!user?.banned && (
            <>
              <Toaster closeButton={true} richColors={true} duration={2000} />
              {user && <Notifications id={user.id} />}
            </>
          )}
        </Providers>
      </body>
    </html>
  );
}
