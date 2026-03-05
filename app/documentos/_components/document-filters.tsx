"use client";

import { Filter, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DocumentCategory, DocumentFileType } from "./document-card";

export const ALL_CATEGORIES: DocumentCategory[] = [
  "Resoluções",
  "Portarias",
  "Editais",
  "Relatórios",
  "Formulários",
  "Comunicados",
];

export const ALL_FILE_TYPES: DocumentFileType[] = [
  "PDF",
  "DOCX",
  "XLSX",
  "PPTX",
];

export const YEARS = [2024, 2023, 2022, 2021, 2020];

export interface Filters {
  search: string;
  category: DocumentCategory | "Todas";
  fileType: DocumentFileType | "Todos";
  year: number | "Todos";
}

interface DocumentFiltersProps {
  filters: Filters;
  totalResults: number;
  onChange: (filters: Filters) => void;
}

export function DocumentFilters({
  filters,
  totalResults,
  onChange,
}: DocumentFiltersProps) {
  const hasActiveFilters =
    filters.search !== "" ||
    filters.category !== "Todas" ||
    filters.fileType !== "Todos" ||
    filters.year !== "Todos";

  const clearAll = () =>
    onChange({
      search: "",
      category: "Todas",
      fileType: "Todos",
      year: "Todos",
    });

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Buscar documentos..."
          value={filters.search}
        />
        {filters.search && (
          <button
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => onChange({ ...filters, search: "" })}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />

        <Select
          onValueChange={(v) =>
            onChange({ ...filters, category: v as DocumentCategory | "Todas" })
          }
          value={filters.category}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todas">Todas as categorias</SelectItem>
            {ALL_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(v) =>
            onChange({ ...filters, fileType: v as DocumentFileType | "Todos" })
          }
          value={String(filters.fileType)}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Formato" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos os formatos</SelectItem>
            {ALL_FILE_TYPES.map((ft) => (
              <SelectItem key={ft} value={ft}>
                {ft}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(v) =>
            onChange({ ...filters, year: v === "Todos" ? "Todos" : Number(v) })
          }
          value={String(filters.year)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos os anos</SelectItem>
            {YEARS.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            className="gap-1 text-xs"
            onClick={clearAll}
            size="sm"
            variant="ghost"
          >
            <X className="h-3.5 w-3.5" />
            Limpar filtros
          </Button>
        )}

        <span className="ml-auto text-muted-foreground text-sm">
          <strong className="text-foreground">{totalResults}</strong> documento
          {totalResults !== 1 ? "s" : ""} encontrado
          {totalResults !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Active filter badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.category !== "Todas" && (
            <Badge className="gap-1" variant="secondary">
              {filters.category}
              <button
                onClick={() => onChange({ ...filters, category: "Todas" })}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.fileType !== "Todos" && (
            <Badge className="gap-1" variant="secondary">
              {filters.fileType}
              <button
                onClick={() => onChange({ ...filters, fileType: "Todos" })}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.year !== "Todos" && (
            <Badge className="gap-1" variant="secondary">
              {filters.year}
              <button onClick={() => onChange({ ...filters, year: "Todos" })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
