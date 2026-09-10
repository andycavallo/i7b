# i7b

Static dashboards and a Telegram bot for the MII player data.

## Static dashboards

The browser pages need a Google Sheets API key at runtime. Copy
`config.example.js` to `config.js`, set a key restricted to the deployed origin
and the Google Sheets API, and deploy `index.html` and `listagiocatori/`.
`config.js` is ignored and must never be committed.

## Telegram bot

Create a local `.env` from `.env.example` and set:

- `TELEGRAM_BOT_TOKEN`
- `GOOGLE_SHEETS_API_KEY`
- `GOOGLE_SHEETS_SHEET_ID`
- `GOOGLE_SHEETS_RANGE` (optional)
- `ALLOWED_CHAT_ID`

The bot refuses to start when required variables are missing and ignores
messages from chats other than `ALLOWED_CHAT_ID`.

Run with:

```bash
npm install
npm start
```

Never commit `.env`, runtime configuration, API keys, or bot tokens.
