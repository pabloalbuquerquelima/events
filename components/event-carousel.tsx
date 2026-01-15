"use client";

import { Button } from "@/components/ui/button";
import type { Event } from "@/db/schema";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { EventCard } from "./event-card";

interface EventCarouselProps {
  events: Event[];
  itemsPerPage?: number;
}

export function EventCarousel({
  events,
  itemsPerPage = 3,
}: EventCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (events.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Nenhum evento disponível.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(events.length / itemsPerPage);
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < totalPages - 1;

  const goToPrevious = () => {
    if (canGoPrevious) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const goToNext = () => {
    if (canGoNext) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const displayedEvents = events.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  return (
    <div className="relative">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayedEvents.map((event) => (
          <EventCard event={event} key={event.id} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <Button
            disabled={!canGoPrevious}
            onClick={goToPrevious}
            size="icon"
            variant="outline"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-muted-foreground text-sm">
            {currentIndex + 1} / {totalPages}
          </span>

          <Button
            disabled={!canGoNext}
            onClick={goToNext}
            size="icon"
            variant="outline"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
