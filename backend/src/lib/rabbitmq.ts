import amqp, { ChannelModel, Channel } from 'amqplib';

let connection: ChannelModel | null = null;
let channel: Channel | null = null;

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

export const EMAIL_QUEUE = 'email_notifications';

export async function connectRabbitMQ(): Promise<void> {
  try {
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(EMAIL_QUEUE, { durable: true });

    connection.on('error', (err: Error) => {
      console.error('[RabbitMQ] Erro de conexão:', err.message);
      connection = null;
      channel = null;
    });

    connection.on('close', () => {
      console.warn('[RabbitMQ] Conexão encerrada.');
      connection = null;
      channel = null;
    });

    console.log('[RabbitMQ] Conectado com sucesso.');
  } catch (err) {
    console.error('[RabbitMQ] Falha ao conectar:', (err as Error).message);
  }
}

export function getChannel(): Channel | null {
  return channel;
}

export async function closeRabbitMQ(): Promise<void> {
  try {
    await channel?.close();
    await connection?.close();
  } catch {
    // ignore
  }
}
