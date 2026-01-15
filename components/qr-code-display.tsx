"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download } from "lucide-react";

interface QRCodeDisplayProps {
  qrCode: string;
  eventTitle: string;
}

export function QRCodeDisplay({ qrCode, eventTitle }: QRCodeDisplayProps) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `qr-code-${eventTitle.replace(/\s+/g, "-").toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code de Entrada</CardTitle>
        <CardDescription>
          Apresente este código na entrada do evento
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <img
            alt="QR Code"
            className="h-64 w-64 object-contain"
            src={qrCode}
          />
        </div>
        <Button className="w-full" onClick={handleDownload} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Baixar QR Code
        </Button>
      </CardContent>
    </Card>
  );
}
