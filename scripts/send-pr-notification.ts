const token = process.env.TG_PR_KEY;
const chatId = process.env.TG_CHAT_ID;
const prUrl = process.env.PR_URL;
const prAuthor = process.env.PR_AUTHOR;
const prTitle = process.env.PR_TITLE;
const prBranch = process.env.PR_BRANCH;

const message = `
🔔 Новый PR на ревью
🧑‍💻 Автор: ${prAuthor}
🌿 Ветка: \`${prBranch}\`
📌 Ссылка: [${prTitle}](${prUrl})
`;

const url = `https://api.telegram.org/bot${token}/sendMessage`;

const payload = {
  chat_id: chatId,
  text: message,
  parse_mode: "Markdown",
};

fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
})
  .then((res) => res.json())
  .then((data) => {
    console.log("Telegram response:", data);
  })
  .catch((err) => {
    console.error("Telegram error:", err);
  });
