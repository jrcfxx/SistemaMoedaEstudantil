import { getChannel, EMAIL_QUEUE } from './rabbitmq';
import { EmailPayload } from '../services/emailService';

export function publishEmail(payload: EmailPayload): void {
  const channel = getChannel();
  if (!channel) {
    console.warn('[EmailQueue] Canal RabbitMQ indisponível — e-mail não enfileirado:', payload.tipo);
    return;
  }
  const content = Buffer.from(JSON.stringify(payload));
  channel.sendToQueue(EMAIL_QUEUE, content, { persistent: true });
}
