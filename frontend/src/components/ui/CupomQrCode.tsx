import { QRCodeSVG } from 'qrcode.react';

interface CupomQrCodeProps {
  codigoCupom: string;
  size?: number;
  className?: string;
}

export function CupomQrCode({ codigoCupom, size = 160, className }: CupomQrCodeProps) {
  return (
    <QRCodeSVG
      value={codigoCupom}
      size={size}
      level="M"
      className={className}
      aria-label={`QR Code do cupom ${codigoCupom}`}
    />
  );
}
