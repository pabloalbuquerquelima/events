"use client";

import { ChevronLeft, ChevronRight, FileX } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MOCK_DOCUMENTS } from "../_data/mock-documents";
import { DocumentCard } from "./document-card";
import { DocumentFilters, type Filters } from "./document-filters";

const ITEMS_PER_PAGE = 9;

export function DocumentList() {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: "Todas",
    fileType: "Todos",
    year: "Todos",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = MOCK_DOCUMENTS.filter((doc) => {
    const matchesSearch =
      filters.search === "" ||
      doc.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      doc.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      doc.tags.some((tag) =>
        tag.toLowerCase().includes(filters.search.toLowerCase())
      );

    const matchesCategory =
      filters.category === "Todas" || doc.category === filters.category;
    const matchesFileType =
      filters.fileType === "Todos" || doc.fileType === filters.fileType;
    const matchesYear = filters.year === "Todos" || doc.year === filters.year;

    return matchesSearch && matchesCategory && matchesFileType && matchesYear;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <DocumentFilters
        filters={filters}
        onChange={handleFilterChange}
        totalResults={filtered.length}
      />

      {paginated.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FileX className="mb-4 h-16 w-16 text-muted-foreground/40" />
          <h3 className="mb-2 font-semibold text-lg">
            Nenhum documento encontrado
          </h3>
          <p className="text-muted-foreground text-sm">
            Tente ajustar os filtros ou fazer uma busca diferente.
          </p>
          <Button
            className="mt-4"
            onClick={() =>
              handleFilterChange({
                search: "",
                category: "Todas",
                fileType: "Todos",
                year: "Todos",
              })
            }
            variant="outline"
          >
            Limpar todos os filtros
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {paginated.map((doc) => (
              <DocumentCard document={doc} key={doc.id} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                size="icon"
                variant="outline"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    const isNearCurrent = Math.abs(page - currentPage) <= 1;
                    const isEdge = page === 1 || page === totalPages;
                    if (!(isNearCurrent || isEdge)) {
                      if (page === 2 || page === totalPages - 1) {
                        return (
                          <span
                            className="px-1 text-muted-foreground"
                            key={page}
                          >
                            …
                          </span>
                        );
                      }
                      return null;
                    }
                    return (
                      <Button
                        className="h-9 w-9"
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        size="icon"
                        variant={currentPage === page ? "default" : "outline"}
                      >
                        {page}
                      </Button>
                    );
                  }
                )}
              </div>

              <Button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                size="icon"
                variant="outline"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
