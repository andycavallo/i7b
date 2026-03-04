const apiKey = 'AIzaSyAMwp2PrmXiQj2Qyi0v3TJVWFD5Jl0eF2I';
const sheetId = '16gHjqHQJCbZApcKYUCtJkcoIsIKcJ30VkK-OVaYqwUU';
const sheetName = 'LastDay';
const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A1:S?key=${apiKey}`;

fetch(apiUrl)
  .then((response) => response.json())
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

      content += `<tr class="${rowClass}"><td>${row[0]}</td><td>${row[2]}</td><td>${row[7]}</td><td>${row[8]}</td><td>${row[11]}</td><td>${spostamentoHeaderText}</td></tr>`;
    });
    content += '</table>';
    document.getElementById('content').innerHTML = content;
  })
  .catch((error) => console.error('Error fetching data:', error));
