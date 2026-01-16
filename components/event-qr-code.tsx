"use client";

import { Download, QrCode as QrCodeIcon } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface EventQRCodeProps {
  eventId: string;
  eventTitle: string;
}

export function EventQRCode({ eventId, eventTitle }: EventQRCodeProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function generateQRCode() {
      try {
        setIsLoading(true);

        // URL do evento que será codificada no QR Code
        const eventUrl = `${window.location.origin}/eventos/${eventId}`;

        // Gerar QR Code como Data URL
        const url = await QRCode.toDataURL(eventUrl, {
          width: 300,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        });

        setQrCodeUrl(url);
      } catch (error) {
        console.error("Error generating QR code:", error);
      } finally {
        setIsLoading(false);
      }
    }

    generateQRCode();
  }, [eventId]);

  const handleDownload = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `qrcode-${eventTitle.toLowerCase().replace(/\s+/g, "-")}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <QrCodeIcon className="h-5 w-5" />
            QR Code do Evento
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Skeleton className="h-[300px] w-[300px]" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <QrCodeIcon className="h-5 w-5" />
          QR Code do Evento
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        {qrCodeUrl && (
          <>
            <div className="rounded-lg border bg-white p-4">
              <img
                alt={`QR Code para ${eventTitle}`}
                className="h-auto w-full max-w-[300px]"
                src={qrCodeUrl}
              />
            </div>

            <p className="text-center text-muted-foreground text-sm">
              Escaneie para compartilhar o evento
            </p>

            <Button
              className="w-full"
              onClick={handleDownload}
              size="sm"
              variant="outline"
            >
              <Download className="mr-2 h-4 w-4" />
              Baixar QR Code
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
