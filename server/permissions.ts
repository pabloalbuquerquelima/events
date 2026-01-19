"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const isAdmin = async () => {
  try {
    const { success, error } = await auth.api.userHasPermission({
      headers: await headers(),
      body: {
        permissions: {
          user: ["update", "delete"],
        },
      },
    });

    if (error) {
      return {
        success: false,
        error: error || "Erro ao verificar permissões",
      };
    }

    return success;
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error || "Erro ao verificar permissões",
    };
  }
};
