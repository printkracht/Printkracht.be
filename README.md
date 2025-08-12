# Printkracht – Next.js site (wrap & gebouw-folie calculators)

- Next.js 14 (App Router) + Tailwind
- **Wrap calculator**: voertuigtype/coverage/van-afmetingen → m² + **€120/m²** (incl. plaatsing) + **waste x1.10** + optioneel **Ontwerp €245**
- **Gebouw**-zonwerende folie calculator (per ruit)
- **E-mail API** (Nodemailer via SMTP) voor offerteaanvragen
- CCVision **CAR-SIGNER** knop op /design (via `NEXT_PUBLIC_CAR_SIGNER_URL`)

## Snel starten
```bash
npm i
cp .env.example .env.local
# Vul SMTP_* en NEXT_PUBLIC_CAR_SIGNER_URL in
npm run dev
```

## Deploy (Vercel)
1. Push naar GitHub.
2. Importeer in Vercel.
3. Zet env vars: SMTP_*, QUOTE_EMAIL_TO, QUOTE_EMAIL_FROM, NEXT_PUBLIC_CAR_SIGNER_URL.
4. Koppel je domein in Vercel (DNS wizard).

## Vercel vs Cursor
- **Vercel** = hosting/deploy + domains + serverless/edge functies.
- **Cursor** = AI-IDE (VS Code-achtig) die je helpt code schrijven/genereren.
Gebruik Cursor om te bouwen, Vercel om te hosten.
