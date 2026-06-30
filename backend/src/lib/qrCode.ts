import QRCode from 'qrcode';

export async function gerarQrCodeDataUrl(conteudo: string): Promise<string> {
  return QRCode.toDataURL(conteudo, { width: 200, margin: 2 });
}
