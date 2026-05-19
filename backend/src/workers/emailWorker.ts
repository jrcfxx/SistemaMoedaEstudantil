import { getChannel, EMAIL_QUEUE } from '../lib/rabbitmq';
import { emailService, EmailPayload } from '../services/emailService';

export function startEmailWorker(): void {
  const channel = getChannel();
  if (!channel) {
    console.warn('[EmailWorker] Canal RabbitMQ indisponível — worker não iniciado.');
    return;
  }

  channel.prefetch(1);

  channel.consume(EMAIL_QUEUE, async (msg) => {
    if (!msg) return;

    try {
      const payload: EmailPayload = JSON.parse(msg.content.toString());
      await emailService.enviar(payload);
      console.log(`[EmailWorker] E-mail enviado com sucesso: ${payload.tipo}`);
      channel.ack(msg);
    } catch (err) {
      console.error('[EmailWorker] Erro ao processar mensagem:', (err as Error).message);
      channel.nack(msg, false, false);
    }
  });

  console.log('[EmailWorker] Aguardando mensagens na fila:', EMAIL_QUEUE);
}
