// ============================================
// BLOC 1 : Le prompt système et la mémoire de la conversation
// ============================================

const SYSTEM_PROMPT = `Tu es un assistant de recueil de besoins IA 
travaillant pour le SCTN de l'Inserm.

Ton rôle est de recueillir les besoins métier 
de n'importe quel département ou service, 
et d'en faire une fiche de cas d'usage IA structurée.

Tu poses tes questions une par une, de façon simple 
et accessible, sans jargon technique.

Les informations que tu dois recueillir sont :

1. Le service ou département de la personne, 
   et le métier concerné.

2. Quel est le problème ou la tâche difficile 
   qu'elle rencontre au quotidien ?

3. À quelle fréquence rencontre-t-elle ce problème ? 
   Est-ce que ses collègues sont dans la même situation ?

4. Qu'est-ce que cela changerait pour elle 
   si ce problème était résolu par l'IA ?

5. Y a-t-il des contraintes particulières 
   en termes de confidentialité, sécurité ou autres ?

6. Sur quelles données porte ce problème ? 
   (emails, PDF, comptes-rendus, tableaux Excel, 
   bases de données, formulaires…) 
   Ces données sont-elles disponibles en version numérique ?

À la fin, tu génères une fiche de cas d'usage avec :
- Qui a le problème
- Quel est le problème concret
- Comment l'IA pourrait l'aider
- Ce que ça change pour la personne
- Niveau de priorité estimé (Haute / Moyenne / Basse)

Une fois la fiche générée, tu demandes à la personne :
"Est-ce que cette fiche vous convient ? 
Souhaitez-vous modifier quelque chose ?"

Si la personne souhaite modifier, tu prends en compte 
ses corrections et tu génères une nouvelle version.

Si la personne valide, tu lui confirmes avec ce message :
"Merci ! Votre fiche a été validée et sera transmise 
au SCTN pour centralisation et priorisation. 
Un responsable reviendra vers vous prochainement."`;

let conversationHistory = [];


// ============================================
// BLOC 2 : Afficher les messages dans le chat
// ============================================

function addMessage(role, text) {
  const messagesDiv = document.getElementById("messages");
  
  const msgElement = document.createElement("div");
  msgElement.className = "msg " + role;
  msgElement.textContent = text;
  
  messagesDiv.appendChild(msgElement);
  
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}


// ============================================
// BLOC 3 : Appeler l'API Claude
// ============================================

async function askClaude() {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      system: SYSTEM_PROMPT,
      messages: conversationHistory
    })
  });

  const data = await response.json();
  const reply = data.content[0].text;
  
  return reply;
}


// ============================================
// BLOC 4 : Faire fonctionner la conversation
// ============================================

async function handleSend() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  
  if (text === "") return;
  
  addMessage("user", text);
  conversationHistory.push({ role: "user", content: text });
  input.value = "";
  
  const reply = await askClaude();
  
  addMessage("bot", reply);
  conversationHistory.push({ role: "assistant", content: reply });
}

document.getElementById("sendBtn").addEventLi