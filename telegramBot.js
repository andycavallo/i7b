import 'dotenv/config';
import { Telegraf } from 'telegraf';
import fetch from 'node-fetch';

const requiredEnvironment = [
  'TELEGRAM_BOT_TOKEN',
  'GOOGLE_SHEETS_API_KEY',
  'GOOGLE_SHEETS_SHEET_ID',
  'ALLOWED_CHAT_ID',
];

for (const name of requiredEnvironment) {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const sheetId = process.env.GOOGLE_SHEETS_SHEET_ID;
const sheetRange = process.env.GOOGLE_SHEETS_RANGE || 'LastDay!A1:S';
const allowedChatId = process.env.ALLOWED_CHAT_ID;

const apiUrl = new URL(
  `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}/values/${sheetRange}`,
);
apiUrl.searchParams.set('key', process.env.GOOGLE_SHEETS_API_KEY);

const bot = new Telegraf(botToken);

bot.use((ctx, next) => {
  if (String(ctx.chat?.id) !== String(allowedChatId)) {
    return ctx.reply('Chat non autorizzata.');
  }
  return next();
});

bot.start((ctx) => {
  ctx.reply('Welcome to the spostamenti bot! Type /spostamenti to see which players need to change their clan.');
});

bot.command('spostamenti', async (ctx) => {
  try {
    const playersToMove = await fetchPlayersToMove();

    if (playersToMove.length === 0) {
      return ctx.reply('No players need to change their clan.');
    }

    return ctx.reply(`Players who need to change their clan:\n\n${playersToMove.join('\n')}`);
  } catch (error) {
    console.error('Unable to fetch player movements:', error.message);
    return ctx.reply('Impossibile recuperare i dati in questo momento.');
  }
});

async function fetchPlayersToMove() {
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`Google Sheets API returned HTTP ${response.status}`);
  }

  const data = await response.json();
  const rows = Array.isArray(data.values) ? data.values : [];
  const playersToMove = [];

  rows.forEach((row, rowIndex) => {
    if (rowIndex === 0) return;

    const rank = Number.parseInt(row[0], 10);
    const currentClan = row[2];
    let targetClan;

    if (rank >= 1 && rank <= 50) {
      targetClan = 'I7B';
    } else if (rank >= 51 && rank <= 100) {
      targetClan = 'I7B2';
    } else {
      targetClan = 'I7B3';
    }

    if (currentClan !== targetClan) {
      playersToMove.push(`${row[1]}: ${currentClan} -> ${targetClan}`);
    }
  });

  return playersToMove;
}

bot.launch().then(() => console.log('Bot started'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
