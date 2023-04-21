const apiKey = 'AIzaSyAMwp2PrmXiQj2Qyi0v3TJVWFD5Jl0eF2I'; // Replace with your API key
const sheetId = '16gHjqHQJCbZApcKYUCtJkcoIsIKcJ30VkK-OVaYqwUU'; // Replace with your Google Sheet ID
const sheetName = 'LastDay'; // Replace with your sheet name if different

// Replace 'A1:D10' with the range you want to fetch from your Google Sheet
const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A1:S?key=${apiKey}`;

fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    const rows = data.values;
    let content = '<table>';

    // Add table headers
    content += `<tr><th>Rank</th><th>Clan Name</th><th>Column H</th><th>Column I</th><th>Column L</th><th>Spostamento</th></tr>`;

    rows.forEach((row) => {
      const rank = parseInt(row[0]);
      const currentClan = row[2];

      let targetClan;
      if (rank >= 1 && rank <= 50) {
        targetClan = 'I7B';
      } else if (rank >= 51 && rank <= 101) {
        targetClan = 'I7B2';
      } else {
        targetClan = 'I7B3';
      }

      const spostamento = currentClan !== targetClan ? `${currentClan} -> ${targetClan}` : '';

      content += `<tr><td>${row[0]}</td><td>${row[2]}</td><td>${row[7]}</td><td>${row[8]}</td><td>${row[11]}</td><td>${spostamento}</td></tr>`;
    });

    content += '</table>';
    document.getElementById('content').innerHTML = content;
  })
  .catch((error) => console.error('Error fetching data:', error));

