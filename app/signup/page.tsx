"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoginForm } from "@/components/forms/login-form";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, isLoading } = authClient.useSession();

  useEffect(() => {
    if (!isLoading && session?.user) {
      router.replace("/");
    }
  }, [session, isLoading, router]);

  if (isLoading || session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm text-center">
          <div className="text-muted-foreground text-sm">Redirecionando…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Brand (visual igual ao SignUp) */}
      <div className="relative hidden overflow-hidden bg-gradient-primary lg:flex lg:w-1/2">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: "var(--gradient-primary)" }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
          <div className="text-center">
            <h1 className="mb-8 font-bold text-6xl">AVANCE</h1>
            <p className="max-w-md text-white/90 text-xl leading-relaxed">
              Transformando educação através de consultoria, formação e
              inovação.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex w-full items-center justify-center bg-background p-6 lg:w-1/2">
        {/* Mobile header */}
        <div className="absolute top-0 right-0 left-0 flex h-20 items-center justify-center bg-gradient-primary lg:hidden">
          <h1 className="font-bold text-2xl text-white">AVANCE</h1>
        </div>

        <div className="mt-20 w-full max-w-md lg:mt-0">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
            <div className="mb-6 text-center">
              <h2 className="mb-2 font-bold text-3xl text-foreground">
                Bem-vindo de volta
              </h2>
              <p className="text-muted-foreground">
                Faça login com sua conta para continuar
              </p>
            </div>

            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
