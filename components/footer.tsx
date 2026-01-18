import {
  Award,
  Bookmark,
  BookOpenCheck,
  CircleStar,
  Trophy,
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Identidade institucional */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">
              Secretaria de Educação
              <span className="block text-primary">Coreaú</span>
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Compromisso com a excelência educacional, inovação pedagógica e
              desenvolvimento integral dos estudantes do município de Coreaú.
            </p>
          </div>

          {/* Navegação */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wide">
              Navegação
            </h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>
                <Link className="transition-colors hover:text-primary" href="/">
                  Início
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-primary"
                  href="/eventos"
                >
                  Eventos
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-primary"
                  href="#about"
                >
                  Sobre
                </Link>
              </li>
            </ul>
          </div>

          {/* Institucional */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wide">
              Institucional
            </h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>
                <Link className="transition-colors hover:text-primary" href="#">
                  Termos de Serviço
                </Link>
              </li>
              <li>
                <Link className="transition-colors hover:text-primary" href="#">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link className="transition-colors hover:text-primary" href="#">
                  Transparência
                </Link>
              </li>
            </ul>
          </div>

          {/* Destaque institucional */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wide">
              Reconhecimento
            </h4>
            <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-4 py-3">
              <Trophy className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground text-sm">
                1º lugar no IDEB Brasil
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-4 py-3">
              <CircleStar className="text-primary md:h-12 md:w-12" />
              <span className="text-muted-foreground text-sm">
                1º Lugar do Ceará no SPAECE 2024 no 2º e 5º Ano do Ensino
                Fundamental
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-4 py-3">
              <BookOpenCheck className="text-primary md:h-10 md:w-10" />
              <span className="text-muted-foreground text-sm">
                Município com 100% das Crianças Alfabetizadas no ICA.
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-4 py-3">
              <Award className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground text-sm">
                13 escolas premiadas SPAECE
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-4 py-3">
              <Bookmark className="text-primary md:h-12 md:w-12" />
              <span className="text-muted-foreground text-sm">
                Município reconhecido com o Selo Petronilha Beatriz pela
                garantia da Equidade Racial.
              </span>
            </div>
          </div>
        </div>

        {/* Linha inferior */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-6 text-center text-muted-foreground text-sm md:flex-row md:text-left">
          <span>
            © {new Date().getFullYear()} Secretaria de Educação de Coreaú. Todos
            os direitos reservados.
          </span>

          <span className="text-xs">
            Educação pública de qualidade e compromisso social
          </span>
        </div>
      </div>
    </footer>
  );
}
