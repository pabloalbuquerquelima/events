"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    async function checkAdmin() {
      if (isPending) {
        return;
      }

      if (!session?.user) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      const role = (session.user as any)?.role;

      if (role === "admin" || role === "owner") {
        setIsAdmin(true);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/auth/check-admin");
        const data = await response.json();
        setIsAdmin(data.isAdmin);
      } catch (error) {
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAdmin();
  }, [session, isPending]);

  return { isAdmin, isLoading, user: session?.user };
}
