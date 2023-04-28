const apiKey = 'AIzaSyAMwp2PrmXiQj2Qyi0v3TJVWFD5Jl0eF2I'; // Replace with your API key
const sheetId = '16gHjqHQJCbZApcKYUCtJkcoIsIKcJ30VkK-OVaYqwUU'; // Replace with your Google Sheet ID
const sheetName = 'LastDay'; // Replace with your sheet name if different

const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A1:V?key=${apiKey}`;

fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    const rows = data.values;
    rows.shift(); // Remove the header row

    rows.sort((a, b) => {
      if (a[2] === b[2]) {
        return b[8] - a[8]; // Sort by Trophies if Clan name is the same
      }
      return a[2].localeCompare(b[2]); // Sort by Clan name
    });

    rows.forEach((row) => {
      const clanName = row[2] || '';
      const id = row[6] || '';
      const name = row[7] || '';
      const trophies = row[8] || '';
      const grado = row[19] || '';
      const nomeTelegram = row[20] || '';
      const usernameTelegram = row[21] ? `<a href="https://t.me/${row[21]}" target="_blank">${row[21]}</a>` : '';

      let rowClass = '';
      if (grado.includes('Generale')) {
        rowClass = 'generale';
      } else if (grado.includes('Capitano')) {
        rowClass = 'capitano';
      } else if (grado.includes('Tenente')) {
        rowClass = 'tenente';
      }
      const content = `<tr class="${rowClass}"><td>${clanName}</td><td>${id}</td><td>${name}</td><td>${trophies}</td><td>${grado}</td><td>${nomeTelegram}</td><td>${usernameTelegram}</td></tr>`;
      document.getElementById('content').insertAdjacentHTML('beforeend', content);
    });
  })
  .catch((error) => console.error('Error fetching data:', error));
