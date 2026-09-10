const apiKey = window.APP_CONFIG?.googleSheetsApiKey;
if (!apiKey) {
  const contentElement = document.getElementById('content');
  if (contentElement) contentElement.textContent = 'Configurazione Google mancante.';
  throw new Error('Missing window.APP_CONFIG.googleSheetsApiKey');
}

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}[character]));
const sheetId = '16gHjqHQJCbZApcKYUCtJkcoIsIKcJ30VkK-OVaYqwUU';
const sheetName = 'LastDay';
const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A1:S?key=${encodeURIComponent(apiKey)}`;

fetch(apiUrl)
  .then((response) => {
    if (!response.ok) throw new Error(`Google Sheets API returned HTTP ${response.status}`);
    return response.json();
  })
  .then((data) => {
    const rows = data.values;
    let content = '<table>';
    rows.forEach((row, rowIndex) => {
      const rank = parseInt(row[0]);
      const currentClan = row[2];

      let targetClan;
      if (rank >= 1 && rank <= 50) {
        targetClan = 'MII1';
      } else if (rank >= 51 && rank <= 100) {
        targetClan = 'MII2';
      } else if (rank >= 101 && rank <= 150) {
        targetClan = 'MII3';
      } else {
        targetClan = 'MII4';
      }

      const spostamento = currentClan !== targetClan ? `${currentClan} -> ${targetClan}` : '';
      const rowClass = spostamento && rowIndex !== 0 ? 'change-clan' : '';
      const spostamentoHeaderText = rowIndex === 0 ? 'Spostamento' : spostamento;

      content += `<tr class="${rowClass}"><td>${escapeHtml(row[0])}</td><td>${escapeHtml(row[2])}</td><td>${escapeHtml(row[7])}</td><td>${escapeHtml(row[8])}</td><td>${escapeHtml(row[11])}</td><td>${escapeHtml(spostamentoHeaderText)}</td></tr>`;
    });
    content += '</table>';
    document.getElementById('content').innerHTML = content;
  })
  .catch((error) => console.error('Error fetching data:', error));
