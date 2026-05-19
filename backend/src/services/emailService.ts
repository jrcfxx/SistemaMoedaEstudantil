import nodemailer, { Transporter } from 'nodemailer';

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.ethereal.email',
      port: Number(process.env.MAIL_PORT) || 587,
      secure: process.env.MAIL_SECURE === 'true',
      auth: {
        user: process.env.MAIL_USER || '',
        pass: process.env.MAIL_PASS || '',
      },
    });
  }
  return transporter;
}

export interface EmailMoedasRecebidas {
  tipo: 'MOEDAS_RECEBIDAS';
  destinatario: string;
  nomeAluno: string;
  nomeProfessor: string;
  valor: number;
  motivo: string;
  saldoAtual: number;
}

export interface EmailResgateRealizado {
  tipo: 'RESGATE_REALIZADO';
  destinatarioAluno: string;
  nomeAluno: string;
  destinatarioEmpresa: string;
  nomeEmpresa: string;
  tituloVantagem: string;
  custoMoedas: number;
  codigoCupom: string;
  saldoRestante: number;
}

export type EmailPayload = EmailMoedasRecebidas | EmailResgateRealizado;

export const emailService = {
  async enviarMoedasRecebidas(payload: EmailMoedasRecebidas): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🪙 Moeda Estudantil</h1>
          <p style="color: #c7d2fe; margin: 8px 0 0;">Você recebeu moedas!</p>
        </div>
        <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="color: #334155; font-size: 16px;">Olá, <strong>${payload.nomeAluno}</strong>!</p>
          <p style="color: #64748b;">O professor <strong>${payload.nomeProfessor}</strong> enviou moedas para você:</p>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
            <p style="color: #15803d; font-size: 32px; font-weight: bold; margin: 0;">🪙 +${payload.valor}</p>
            <p style="color: #166534; font-size: 14px; margin: 8px 0 0;">moedas recebidas</p>
          </div>
          <p style="color: #64748b;"><strong>Motivo:</strong> ${payload.motivo}</p>
          <p style="color: #64748b;"><strong>Saldo atual:</strong> 🪙 ${payload.saldoAtual} moedas</p>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 30px; text-align: center;">Sistema de Moeda Estudantil — PUC Minas</p>
        </div>
      </div>`;

    await getTransporter().sendMail({
      from: `"Moeda Estudantil" <${process.env.MAIL_FROM || 'noreply@moedaestudantil.edu.br'}>`,
      to: payload.destinatario,
      subject: `🪙 Você recebeu ${payload.valor} moeda(s) de ${payload.nomeProfessor}!`,
      html,
    });
  },

  async enviarResgateRealizado(payload: EmailResgateRealizado): Promise<void> {
    const htmlAluno = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🎁 Moeda Estudantil</h1>
          <p style="color: #c7d2fe; margin: 8px 0 0;">Resgate confirmado!</p>
        </div>
        <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="color: #334155; font-size: 16px;">Olá, <strong>${payload.nomeAluno}</strong>!</p>
          <p style="color: #64748b;">Seu resgate da vantagem <strong>${payload.tituloVantagem}</strong> foi confirmado.</p>
          <div style="background: #eef2ff; border: 2px dashed #818cf8; border-radius: 12px; padding: 24px; margin: 20px 0; text-align: center;">
            <p style="color: #6366f1; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; margin: 0;">Código do Cupom</p>
            <p style="color: #312e81; font-size: 28px; font-weight: bold; font-family: monospace; letter-spacing: 4px; margin: 10px 0;">${payload.codigoCupom}</p>
            <p style="color: #6366f1; font-size: 12px; margin: 0;">Apresente este código para resgatar sua vantagem</p>
          </div>
          <p style="color: #64748b;"><strong>Parceiro:</strong> ${payload.nomeEmpresa}</p>
          <p style="color: #64748b;"><strong>Custo:</strong> 🪙 ${payload.custoMoedas} moedas</p>
          <p style="color: #64748b;"><strong>Saldo restante:</strong> 🪙 ${payload.saldoRestante} moedas</p>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 30px; text-align: center;">Sistema de Moeda Estudantil — PUC Minas</p>
        </div>
      </div>`;

    const htmlEmpresa = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0f172a, #1e293b); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🏪 Moeda Estudantil</h1>
          <p style="color: #94a3b8; margin: 8px 0 0;">Novo resgate de vantagem</p>
        </div>
        <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="color: #334155; font-size: 16px;">Olá, <strong>${payload.nomeEmpresa}</strong>!</p>
          <p style="color: #64748b;">O aluno <strong>${payload.nomeAluno}</strong> resgatou uma vantagem da sua empresa.</p>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0 0 8px;"><strong>Vantagem:</strong> ${payload.tituloVantagem}</p>
            <p style="margin: 0 0 8px;"><strong>Aluno:</strong> ${payload.nomeAluno}</p>
            <p style="margin: 0; font-size: 18px; font-family: monospace;"><strong>Cupom:</strong> <span style="color: #4f46e5;">${payload.codigoCupom}</span></p>
          </div>
          <p style="color: #64748b; font-size: 14px;">Valide o código acima ao atender o aluno.</p>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 30px; text-align: center;">Sistema de Moeda Estudantil — PUC Minas</p>
        </div>
      </div>`;

    await Promise.all([
      getTransporter().sendMail({
        from: `"Moeda Estudantil" <${process.env.MAIL_FROM || 'noreply@moedaestudantil.edu.br'}>`,
        to: payload.destinatarioAluno,
        subject: `🎁 Resgate confirmado: ${payload.tituloVantagem} — Cupom ${payload.codigoCupom}`,
        html: htmlAluno,
      }),
      getTransporter().sendMail({
        from: `"Moeda Estudantil" <${process.env.MAIL_FROM || 'noreply@moedaestudantil.edu.br'}>`,
        to: payload.destinatarioEmpresa,
        subject: `🏪 Novo resgate: ${payload.tituloVantagem} por ${payload.nomeAluno}`,
        html: htmlEmpresa,
      }),
    ]);
  },

  async enviar(payload: EmailPayload): Promise<void> {
    if (payload.tipo === 'MOEDAS_RECEBIDAS') {
      await emailService.enviarMoedasRecebidas(payload);
    } else {
      await emailService.enviarResgateRealizado(payload);
    }
  },
};
