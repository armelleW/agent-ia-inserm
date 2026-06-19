export default async function handler(req, res) {
  
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { messages, system } = req.body;

  // DEBUG TEMPORAIRE : on renvoie direct ce qu'on a reçu, sans appeler Claude
  return res.status(200).json({
    debug: true,
    system_recu: system,
    messages_recus: messages,
    body_complet: req.body
  });
}