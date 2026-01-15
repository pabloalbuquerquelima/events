import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getFeaturedEvents } from "@/server/events";
import {
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  TrendingUp,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { EventCarousel } from "../components/event-carousel";

export default async function LandingPage() {
  const { events } = await getFeaturedEvents();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-32 pb-20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="container mx-auto max-w-6xl">
          <div className="animate-fade-in space-y-6 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
              <Trophy className="h-5 w-5 text-primary" />
              <span className="font-medium text-primary text-sm">
                1º lugar no IDEB Brasil 2023
              </span>
            </div>

            <h1 className="font-bold text-4xl tracking-tight md:text-6xl">
              Secretaria de Educação
              <br />
              <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                Coreaú
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-muted-foreground text-xl">
              Excelência em educação com resultados comprovados. Melhor escola
              do Brasil e 13 escolas premiadas no SPAECE 2024.
            </p>

            <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/eventos">
                  <Calendar className="mr-2 h-5 w-5" />
                  Ver Eventos
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#about">Saiba Mais</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Trophy className="mx-auto mb-4 h-12 w-12 text-primary" />
                <h3 className="mb-2 font-bold text-3xl text-primary">
                  1º Lugar
                </h3>
                <p className="text-muted-foreground">IDEB Brasil 2023</p>
                <p className="mt-2 text-muted-foreground text-sm">
                  Melhor escola do país
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Award className="mx-auto mb-4 h-12 w-12 text-secondary" />
                <h3 className="mb-2 font-bold text-3xl text-secondary">
                  13 Escolas
                </h3>
                <p className="text-muted-foreground">Premiadas SPAECE 2024</p>
                <p className="mt-2 text-muted-foreground text-sm">
                  Destaque estadual
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <TrendingUp className="mx-auto mb-4 h-12 w-12 text-primary" />
                <h3 className="mb-2 font-bold text-3xl text-primary">100%</h3>
                <p className="text-muted-foreground">
                  Compromisso com qualidade
                </p>
                <p className="mt-2 text-muted-foreground text-sm">
                  Educação de excelência
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="px-4 py-20" id="about">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-bold text-3xl md:text-4xl">
              Sobre a SEDUC Coreaú
            </h2>
            <div className="mx-auto mb-6 h-1 w-20 rounded-full bg-gradient-to-r from-primary to-secondary" />
          </div>

          <div className="prose prose-lg mx-auto text-muted-foreground">
            <p className="text-center leading-relaxed">
              A Secretaria de Educação de Coreaú é referência nacional em
              qualidade educacional. Nossa missão é transformar vidas através da
              educação de excelência, com foco no desenvolvimento integral de
              nossos estudantes.
            </p>

            <p className="mt-6 text-center leading-relaxed">
              Com a conquista do 1º lugar no IDEB 2023 e 13 escolas premiadas no
              SPAECE 2024, demonstramos nosso compromisso com a inovação
              pedagógica e a valorização dos profissionais da educação.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      {events.length > 0 && (
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-4 py-20">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <Badge className="mb-4" variant="outline">
                Eventos em Destaque
              </Badge>
              <h2 className="mb-4 font-bold text-3xl md:text-4xl">
                Próximos Eventos
              </h2>
              <p className="text-muted-foreground">
                Participe de nossos eventos educacionais
              </p>
            </div>

            <EventCarousel events={events} />

            <div className="mt-8 text-center">
              <Button asChild size="lg" variant="outline">
                <Link href="/eventos">
                  Ver Todos os Eventos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Values Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-bold text-3xl md:text-4xl">
              Nossos Valores
            </h2>
            <div className="mx-auto mb-6 h-1 w-20 rounded-full bg-gradient-to-r from-primary to-secondary" />
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <BookOpen className="mb-4 h-10 w-10 text-primary" />
                <CardTitle>Excelência</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Buscamos constantemente a qualidade em todos os processos
                  educacionais.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Award className="mb-4 h-10 w-10 text-secondary" />
                <CardTitle>Inovação</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Implementamos práticas pedagógicas modernas e eficazes.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Trophy className="mb-4 h-10 w-10 text-primary" />
                <CardTitle>Compromisso</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Dedicação total ao desenvolvimento de cada estudante.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
