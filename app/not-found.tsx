"use client";

import { Home, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = usePathname();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        {/* Large 404 with gradient */}
        <div className="relative mb-8">
          <h1 className="bg-gradient-to-r from-primary to-primary-light bg-clip-text font-bold text-8xl text-transparent md:text-9xl">
            404
          </h1>
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/20 to-primary-light/20 blur-3xl" />
        </div>

        {/* Error message */}
        <div className="mb-8">
          <h2 className="mb-4 font-semibold text-2xl text-foreground md:text-3xl">
            Página não encontrada
          </h2>
          <p className="mb-2 text-lg text-muted-foreground">
            A página que você está procurando não existe ou foi movida.
          </p>
          <p className="inline-block rounded-lg bg-muted px-3 py-1 font-mono text-muted-foreground text-sm">
            Rota: {location}
          </p>
        </div>

        {/* Action buttons */}
        <div className="space-y-4 sm:flex sm:justify-center sm:space-x-4 sm:space-y-0">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Voltar ao Início
            </Link>
          </Button>

          <Button asChild className="w-full sm:w-auto" variant="outline">
            <Link href="/painel">
              <Search className="mr-2 h-4 w-4" />
              Explorar Cursos
            </Link>
          </Button>
        </div>

        {/* Decorative elements */}
        <div className="mt-12 opacity-50">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-primary/10 to-primary-light/10" />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
