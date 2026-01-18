"use client";

import {
  Calendar,
  Home,
  LayoutDashboard,
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
import { useAdmin } from "@/hooks/use-admin";
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
  const { isAdmin } = useAdmin();
  const user = session?.user;

  const handleLogout = async () => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        console.error("Erro ao fazer logout:", error);
        return;
      }

      router.push("/login");
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
        {/* Linha principal com 3 colunas: left / center / right */}
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

                          {/* NOVO: Painel de Eventos para Admin */}
                          {isAdmin && (
                            <Button
                              className="h-11 w-full justify-start gap-3"
                              onClick={() =>
                                navigateAndClose("/painel/eventos")
                              }
                              variant={
                                pathname.startsWith("/painel/eventos")
                                  ? "secondary"
                                  : "ghost"
                              }
                            >
                              <LayoutDashboard className="h-5 w-5" />
                              Painel de Eventos
                            </Button>
                          )}
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
              <img
                alt="Logo"
                className="h-x w-auto object-contain"
                src="/logo-topbar.png"
              />
            </Link>
          </div>

          {/* Menu Desktop */}
          <div className="flex items-center gap-12">
            <nav className="hidden h-full items-center gap-6 lg:flex">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    className={`flex h-full items-center gap-2 font-medium text-sm leading-none transition-colors hover:text-primary ${
                      isActive(item.href)
                        ? "text-primary"
                        : "text-foreground/60"
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
                  className={`flex h-full items-center gap-2 font-medium text-sm leading-none transition-colors hover:text-primary ${
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

              {/* NOVO: Painel de Eventos para Admin no Desktop */}
              {isAdmin && (
                <Link
                  className={`flex h-full items-center gap-2 font-medium text-sm leading-none transition-colors hover:text-primary ${
                    pathname.startsWith("/painel/eventos")
                      ? "text-primary"
                      : "text-foreground/60"
                  }`}
                  href="/painel/eventos"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Painel de Eventos
                </Link>
              )}
            </nav>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    aria-label="Abrir menu do usuário"
                    className="rounded-full p-0"
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

                  {/* NOVO: Painel de Eventos no dropdown */}
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/painel/eventos">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Painel de Eventos
                      </Link>
                    </DropdownMenuItem>
                  )}

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
