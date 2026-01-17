import {
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  GraduationCap,
  Sparkles,
  Star,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
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
import { EventCarousel } from "../components/event-carousel";

export default async function LandingPage() {
  const { events } = await getFeaturedEvents();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-32 pb-20">
        {/* BACKGROUND DESKTOP */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-20 hidden bg-center bg-cover md:block"
          style={{ backgroundImage: "url('/banner-page.png')" }}
        />

        <div className="container mx-auto max-w-6xl">
          <div className="animate-fade-in space-y-6 text-left">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2">
              <Trophy className="h-5 w-5 text-primary" />
              <span className="font-medium text-primary text-sm">
                1º lugar no IDEB Brasil 2023
              </span>
            </div>

            <h1 className="bg-gradient-to-r from-primary to-primary-light bg-clip-text font-bold text-3xl text-transparent tracking-tight md:text-5xl">
              Secretaria de Educação
              <br />
              <span className="text-neutral-800">do Município de Coreaú</span>
            </h1>

            <p className="max-w-xl text-muted-foreground text-xl">
              Excelência em educação com resultados comprovados. Melhor escola
              do Brasil e 13 escolas premiadas no SPAECE 2024.
            </p>

            <div className="flex flex-col items-start gap-4 pt-4 sm:flex-row">
              <Button asChild size="lg">
                <Link className="flex items-center" href="/eventos">
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

        {/* BACKGROUND MOBILE (DIV ABAIXO) */}
        <div
          aria-hidden
          className="mt-16 h-64 w-full bg-center bg-cover md:hidden"
          style={{ backgroundImage: "url('/banner-page-sm.png')" }}
        />
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
                <Award className="mx-auto mb-4 h-12 w-12 text-primary" />
                <h3 className="mb-2 font-bold text-3xl text-primary">
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
                <Award className="mb-4 h-10 w-10 text-primary" />
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

      {/* NOVA SEÇÃO: Timeline de Evolução */}
      <section className="relative overflow-hidden px-4 py-20">
        {/* Padrão de fundo decorativo */}
        <div className="pointer-events-none absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary blur-3xl" />
          <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-secondary blur-3xl" />
        </div>

        <div className="container relative mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <Badge className="mb-4" variant="outline">
              <TrendingUp className="mr-2 h-4 w-4" />
              Nossa Trajetória
            </Badge>
            <h2 className="mb-4 font-bold text-3xl md:text-4xl">
              Evolução Contínua
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Uma jornada de conquistas e crescimento constante
            </p>
          </div>

          <div className="relative">
            {/* Linha central vertical */}
            <div className="absolute top-0 bottom-0 left-1/2 w-1 -translate-x-1/2 bg-gradient-to-b from-primary via-secondary to-primary" />

            <div className="space-y-12">
              {/* Item 1 */}
              <div className="relative flex items-center gap-8">
                <div className="flex-1 text-right">
                  <Card className="ml-auto max-w-md border-primary/20 bg-white">
                    <CardHeader>
                      <CardTitle>2020</CardTitle>
                      <CardDescription>Início da Transformação</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">
                        Implementação de novas metodologias e modernização da
                        infraestrutura educacional.
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg ring-4 ring-white">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1" />
              </div>

              {/* Item 2 */}
              <div className="relative flex items-center gap-8">
                <div className="flex-1" />
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-primary shadow-lg ring-4 ring-white">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <Card className="mr-auto max-w-md border-secondary/20 bg-white">
                    <CardHeader>
                      <CardTitle>2021</CardTitle>
                      <CardDescription>Capacitação em Massa</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">
                        Programa intensivo de formação para mais de 300
                        professores e gestores escolares.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Item 3 */}
              <div className="relative flex items-center gap-8">
                <div className="flex-1 text-right">
                  <Card className="ml-auto max-w-md border-primary/20 bg-white">
                    <CardHeader>
                      <CardTitle>2022</CardTitle>
                      <CardDescription>Primeiras Conquistas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">
                        Reconhecimento estadual com 7 escolas premiadas no
                        SPAECE.
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg ring-4 ring-white">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1" />
              </div>

              {/* Item 4 */}
              <div className="relative flex items-center gap-8">
                <div className="flex-1" />
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg ring-4 ring-white">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <Card className="mr-auto max-w-md border-amber-500/20 bg-white">
                    <CardHeader>
                      <CardTitle>2023</CardTitle>
                      <CardDescription>Topo do Brasil</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">
                        1º lugar nacional no IDEB, colocando Coreaú no mapa da
                        educação brasileira.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Item 5 */}
              <div className="relative flex items-center gap-8">
                <div className="flex-1 text-right">
                  <Card className="ml-auto max-w-md border-emerald-500/20 bg-white">
                    <CardHeader>
                      <CardTitle>2024</CardTitle>
                      <CardDescription>Expansão do Sucesso</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">
                        13 escolas premiadas no SPAECE, consolidando nossa
                        liderança educacional.
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg ring-4 ring-white">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NOVA SEÇÃO: Call to Action com efeitos visuais */}
      <section className="relative overflow-hidden px-4 py-24">
        <img
          alt=""
          className="absolute top-0 left-0 h-full w-full object-cover"
          src="/banner-page-final.png"
        />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-primary/5 to-transparent" />
          <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-secondary/5 to-transparent" />
        </div>

        <div className="container relative mx-auto max-w-4xl text-center">
          <div className="inline-block animate-pulse rounded-full bg-primary/10 p-4">
            <GraduationCap className="h-12 w-12 text-primary" />
          </div>

          <h2 className="mt-8 mb-6 font-bold text-3xl md:text-5xl">
            Faça Parte dessa Transformação
          </h2>

          <p className="mb-10 text-lg text-muted-foreground md:text-xl">
            Junte-se a nós na construção de um futuro melhor através da
            educação. Acompanhe nossos eventos, programas e iniciativas.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              className="shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              size="lg"
            >
              <Link href="/eventos">
                <Calendar className="mr-2 h-5 w-5" />
                Explore Nossos Eventos
              </Link>
            </Button>

            <Button
              asChild
              className="bg-white text-black shadow-xl transition-all duration-300 hover:scale-105 hover:bg-accent-foreground hover:text-white hover:shadow-2xl"
              size="lg"
            >
              <Link href="/contato">
                <ArrowRight className="mr-2 h-5 w-5" />
                Entre em Contato
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
