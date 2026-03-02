"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoginForm } from "@/components/forms/login-form";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const sessionHook = authClient.useSession();
  const session = sessionHook?.data ?? null;
  const isLoading = sessionHook?.isLoading ?? false;

  useEffect(() => {
    if (!isLoading && session?.user) {
      router.replace("/");
    }
  }, [session, isLoading, router]);

  if (isLoading || session?.user) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col items-center gap-6">
          <div className="text-muted-foreground text-sm">Redirecionando…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <LoginForm />
      </div>
    </div>
  );
}
