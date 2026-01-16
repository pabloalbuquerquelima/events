"use client";

import {
  Calendar,
  GraduationCap,
  Home,
  LogOut,
  Menu,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";

const menuItems = [
  { icon: Home, label: "Início", href: "/" },
  { icon: Calendar, label: "Eventos", href: "/eventos" },
];

export default function Topbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => router.push("/login"),
          onError: (ctx) => console.error("Erro ao fazer logout:", ctx.error),
        },
      });
    } catch (error) {
      console.error("Erro no logout:", error);
    }
  };

  const navigateAndClose = (href: string) => {
    router.push(href);
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center border-border border-b bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo e Menu Mobile */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Sheet onOpenChange={setIsMenuOpen} open={isMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  aria-label="Abrir menu"
                  className="lg:hidden"
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent className="w-80 p-0" side="left">
                <div className="flex h-full flex-col">
                  <div className="border-b p-6">
                    <h2 className="bg-gradient-to-r from-primary to-primary-light bg-clip-text font-bold text-transparent text-xl">
                      SEDUC COREAÚ
                    </h2>
                  </div>

                  <nav className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-1">
                      {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Button
                            className="h-11 w-full justify-start gap-3"
                            key={item.label}
                            onClick={() => navigateAndClose(item.href)}
                            variant={
                              isActive(item.href) ? "secondary" : "ghost"
                            }
                          >
                            <Icon className="h-5 w-5" />
                            {item.label}
                          </Button>
                        );
                      })}

                      {user && (
                        <>
                          <div className="my-4 border-t" />
                          <Button
                            className="h-11 w-full justify-start gap-3"
                            onClick={() =>
                              navigateAndClose("/painel/minhas-inscricoes")
                            }
                            variant={
                              isActive("/painel/minhas-inscricoes")
                                ? "secondary"
                                : "ghost"
                            }
                          >
                            <Calendar className="h-5 w-5" />
                            Minhas Inscrições
                          </Button>
                        </>
                      )}
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
              href="/"
            >
              <GraduationCap className="h-8 w-8 text-primary" />
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight">SEDUC</span>
                <span className="text-muted-foreground text-xs">Coreaú</span>
              </div>
            </Link>
          </div>

          {/* Menu Desktop */}
          <nav className="hidden items-center gap-6 lg:flex">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  className={`flex items-center gap-2 font-medium text-sm transition-colors hover:text-primary ${
                    isActive(item.href) ? "text-primary" : "text-foreground/60"
                  }`}
                  href={item.href}
                  key={item.href}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}

            {user && (
              <Link
                className={`flex items-center gap-2 font-medium text-sm transition-colors hover:text-primary ${
                  isActive("/painel/minhas-inscricoes")
                    ? "text-primary"
                    : "text-foreground/60"
                }`}
                href="/painel/minhas-inscricoes"
              >
                <Calendar className="h-4 w-4" />
                Minhas Inscrições
              </Link>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    aria-label="Abrir menu do usuário"
                    className="rounded-full"
                    size="icon"
                    variant="ghost"
                  >
                    {user.image ? (
                      <img
                        alt={user.name || "Usuário"}
                        className="h-8 w-8 rounded-full object-cover"
                        src={user.image}
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="font-medium text-sm leading-none">
                        {user.name}
                      </p>
                      <p className="text-muted-foreground text-xs leading-none">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link href="/painel/minhas-inscricoes">
                      <Calendar className="mr-2 h-4 w-4" />
                      Minhas Inscrições
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="text-red-500 focus:text-red-500"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  asChild
                  className="text-sm sm:text-base"
                  size="sm"
                  variant="ghost"
                >
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button asChild className="text-sm sm:text-base" size="sm">
                  <Link href="/signup">Cadastrar</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
