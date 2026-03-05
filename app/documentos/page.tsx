import { BookOpen, Download, FileText, FolderOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DocumentList } from "./_components/document-list";
import { MOCK_DOCUMENTS } from "./_data/mock-documents";

export default function DocumentosPage() {
  const totalDocuments = MOCK_DOCUMENTS.length;
  const totalDownloadable = MOCK_DOCUMENTS.length;
  const categories = [...new Set(MOCK_DOCUMENTS.map((d) => d.category))].length;
  const lastUpdate = new Date(
    Math.max(...MOCK_DOCUMENTS.map((d) => new Date(d.publishedAt).getTime()))
  ).toLocaleDateString("pt-BR");

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-4 pt-32 pb-16">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-secondary/5 blur-3xl" />
        </div>

        <div className="container mx-auto max-w-6xl">
          <div className="mb-6 flex items-center gap-2">
            <Badge variant="outline">
              <FolderOpen className="mr-1 h-3.5 w-3.5" />
              Documentos Oficiais
            </Badge>
          </div>

          <h1 className="mb-4 bg-gradient-to-r from-primary to-primary-light bg-clip-text font-bold text-4xl text-transparent tracking-tight md:text-5xl">
            Central de Documentos
          </h1>

          <p className="max-w-2xl text-muted-foreground text-xl">
            Acesse e baixe resoluções, portarias, editais, relatórios e demais
            documentos oficiais da Secretaria de Educação de Coreaú.
          </p>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border bg-background/80 p-4 backdrop-blur-sm">
              <FileText className="mb-2 h-6 w-6 text-primary" />
              <p className="font-bold text-2xl text-primary">
                {totalDocuments}
              </p>
              <p className="text-muted-foreground text-sm">Documentos</p>
            </div>
            <div className="rounded-xl border bg-background/80 p-4 backdrop-blur-sm">
              <Download className="mb-2 h-6 w-6 text-primary" />
              <p className="font-bold text-2xl text-primary">
                {totalDownloadable}
              </p>
              <p className="text-muted-foreground text-sm">Para download</p>
            </div>
            <div className="rounded-xl border bg-background/80 p-4 backdrop-blur-sm">
              <BookOpen className="mb-2 h-6 w-6 text-primary" />
              <p className="font-bold text-2xl text-primary">{categories}</p>
              <p className="text-muted-foreground text-sm">Categorias</p>
            </div>
            {/* <div className="rounded-xl border bg-background/80 p-4 backdrop-blur-sm">
              <FolderOpen className="mb-2 h-6 w-6 text-primary" />
              <p className="font-bold text-primary text-sm">{lastUpdate}</p>
              <p className="text-muted-foreground text-sm">
                Última atualização
              </p>
            </div> */}
          </div>
        </div>
      </section>

      {/* Documents list */}
      <section className="px-4 py-12">
        <div className="container mx-auto max-w-6xl">
          <DocumentList />
        </div>
      </section>
    </div>
  );
}
