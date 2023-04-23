const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');

const botToken = '6272905596:AAH2fuVa-sgg1nGzuz473vjij2tG7n8Xptc';
const chatId = '-593849708';
const apiUrl = 'AIzaSyAMwp2PrmXiQj2Qyi0v3TJVWFD5Jl0eF2I';

const bot = new TelegramBot(botToken, { polling: true });

bot.onText(/\/botbello spostamenti/, async () => {
  const playersToMove = await fetchPlayersToMove();

  if (playersToMove.length === 0) {
    bot.sendMessage(chatId, 'No players need to change their clan.');
  } else {
    const message = playersToMove.join('\n');
    bot.sendMessage(chatId, `Players who need to change their clan:\n\n${message}`);
  }
});

async function fetchPlayersToMove() {
  const response = await fetch(apiUrl);
  const data = await response.json();

  const rows = data.values;
  const playersToMove = [];

  rows.forEach((row, rowIndex) => {
    if (rowIndex === 0) return; // Skip header row

    const rank = parseInt(row[0]);
    const currentClan = row[2];

    let targetClan;
    if (rank >= 1 && rank <= 50) {
      targetClan = 'I7B';
    } else if (rank >= 51 && rank <= 100) {
      targetClan = 'I7B2';
    } else {
      targetClan = 'I7B3';
    }

    const spostamento = currentClan !== targetClan ? `${currentClan} -> ${targetClan}` : '';

    if (spostamento) {
      const playerName = row[1]; // Assuming column B contains the player's name
      playersToMove.push(`${playerName}: ${spostamento}`);
    }
  });

  return playersToMove;
}
