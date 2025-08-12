import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const phone = String(formData.get("phone") || "");
    const payload = String(formData.get("payload") || "{}");

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || "false") === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const to = process.env.QUOTE_EMAIL_TO || process.env.SMTP_USER || "";
    const from = process.env.QUOTE_EMAIL_FROM || process.env.SMTP_USER || "";
    if (!to || !from) throw new Error("QUOTE_EMAIL_TO or FROM not configured");

    await transporter.sendMail({
      to, from,
      subject: `Nieuwe offerte-aanvraag van ${name}`,
      replyTo: email,
      text: `Naam: ${name}
Email: ${email}
Tel: ${phone}

Payload:
${payload}
`,
    });

    return NextResponse.redirect("/", { status: 303 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Mail mislukt", detail: e?.message }, { status: 500 });
  }
}
