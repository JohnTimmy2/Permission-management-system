// Sends email via Resend's HTTP API (port 443) instead of raw SMTP —
// several hosts (Railway included) block outbound SMTP ports, so a
// traditional nodemailer/Gmail setup can hang or time out in production.

const RESEND_API_KEY = process.env.RESEND_API_KEY;

async function sendMail({ from, to, subject, html }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Resend API error: ${res.status}`);
  }

  return res.json();
}

const transporter = { sendMail };
export default transporter;
