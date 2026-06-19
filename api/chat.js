// Cette fonction tourne sur le serveur Vercel, jamais dans le navigateur
export default async function handler(req, res) {
  
  // On accepte uniquement les requêtes de type POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  // On récupère l'historique de conversation envoyé par script.js
  const { messages, system } = req.body;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: system,
        messages: messages
      })
    });

    const data = await response.json();
    
    // On renvoie la réponse de Claude à script.js
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'appel à Claude" });
  }
}