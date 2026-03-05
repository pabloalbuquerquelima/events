import {
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  FileType,
  Presentation,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export type DocumentCategory =
  | "Resoluções"
  | "Portarias"
  | "Editais"
  | "Relatórios"
  | "Formulários"
  | "Comunicados";

export type DocumentFileType = "PDF" | "DOCX" | "XLSX" | "PPTX";

export interface Document {
  id: string;
  title: string;
  description: string;
  category: DocumentCategory;
  fileType: DocumentFileType;
  fileSize: string;
  publishedAt: string;
  year: number;
  downloadUrl: string;
  previewUrl?: string;
  tags: string[];
}

const fileTypeConfig: Record<
  DocumentFileType,
  { icon: React.ElementType; color: string; bg: string }
> = {
  PDF: { icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
  DOCX: { icon: FileType, color: "text-yellow-600", bg: "bg-yellow-50" },
  XLSX: { icon: FileSpreadsheet, color: "text-green-600", bg: "bg-green-50" },
  PPTX: { icon: Presentation, color: "text-orange-600", bg: "bg-orange-50" },
};

const categoryColors: Record<DocumentCategory, string> = {
  Resoluções: "bg-purple-100 text-purple-700 border-purple-200",
  Portarias: "bg-blue-100 text-blue-700 border-blue-200",
  Editais: "bg-amber-100 text-amber-700 border-amber-200",
  Relatórios: "bg-green-100 text-green-700 border-green-200",
  Formulários: "bg-pink-100 text-pink-700 border-pink-200",
  Comunicados: "bg-cyan-100 text-cyan-700 border-cyan-200",
};

interface DocumentCardProps {
  document: Document;
}

export function DocumentCard({ document }: DocumentCardProps) {
  const { icon: Icon, color, bg } = fileTypeConfig[document.fileType];

  return (
    <Card className="group flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${bg}`}
          >
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <Badge
                className={`border font-medium text-xs ${categoryColors[document.category]}`}
                variant="outline"
              >
                {document.category}
              </Badge>
              <span className="text-muted-foreground text-xs">
                {document.year}
              </span>
            </div>
            <h3 className="line-clamp-2 font-semibold text-sm leading-snug group-hover:text-primary">
              {document.title}
            </h3>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <p className="line-clamp-2 text-muted-foreground text-sm">
          {document.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1">
          {document.tags.slice(0, 3).map((tag) => (
            <span
              className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground text-xs"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t pt-3">
        <div className="text-muted-foreground text-xs">
          <span className="font-medium">{document.fileType}</span> ·{" "}
          {document.fileSize} ·{" "}
          {new Date(document.publishedAt).toLocaleDateString("pt-BR")}
        </div>

        <div className="flex gap-1">
          {document.previewUrl && (
            <Button className="h-8 w-8" size="icon" variant="ghost">
              <Eye className="h-4 w-4" />
            </Button>
          )}
          <Button asChild className="h-8 gap-1 px-3 text-xs" size="sm">
            <a download href={document.downloadUrl}>
              <Download className="h-3.5 w-3.5" />
              Baixar
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
