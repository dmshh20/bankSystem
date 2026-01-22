import { randomInt } from 'node:crypto';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_CODE);


export async function sendEmail(code: string) {
  const { data, error } = await resend.emails.send({
    from: 'Glorious Bank <onboarding@resend.dev>',
    to: [process.env.RESEND_TO as string],
    subject: 'Glorious Bank',
    html: `<strong>Welcome!</strong> Here is your otp for logging. Dont show it to anyone. Code - ${code}`,
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
}