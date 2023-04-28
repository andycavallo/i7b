const apiKey = 'AIzaSyAMwp2PrmXiQj2Qyi0v3TJVWFD5Jl0eF2I'; // Replace with your API key
const sheetId = '16gHjqHQJCbZApcKYUCtJkcoIsIKcJ30VkK-OVaYqwUU'; // Replace with your Google Sheet ID
const sheetName = 'LastDay'; // Replace with your sheet name if different

const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A1:V?key=${apiKey}`;

fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    const rows = data.values;
    let players = [];

    rows.forEach((row, rowIndex) => {
      if(rowIndex === 0) return; // Skip header row

      const playerName = row[7] || ''; // Assuming this is column H
      const currentClan = row[2] || ''; // Assuming this is column C
      const trophies = parseInt(row[8]) || ''; // Assuming this is column I
      const grado = row[19] || ''; // Assuming this is column T
      const nomeTelegram = row[20] || ''; // Assuming this is column U
      const usernameTelegram = row[21] || ''; // Assuming this is column V

      players.push({currentClan, playerName, trophies, grado, nomeTelegram, usernameTelegram});
    });

    // Sort players first by clan name and then by trophies
    players.sort((a, b) => {
      if (!a.currentClan && !b.currentClan) return 0;
      if (!a.currentClan) return 1;
      if (!b.currentClan) return -1;
      if (a.currentClan !== b.currentClan) return a.currentClan.localeCompare(b.currentClan);
      return b.trophies - a.trophies;
    });

    let content = '<table>';
    content += '<tr><td>Clan</td><td>Name</td><td>Trophies</td><td>Grado</td><td>Nome Telegram</td><td>Username Telegram</td></tr>'; // Table headers

    players.forEach(player => {
      let rowClass = '';
      switch(player.grado) {
        case 'Generale':
          rowClass = 'generale';
          break;
        case 'Capitano':
          rowClass = 'capitano';
          break;
        case 'Tenente':
          rowClass = 'tenente';
          break;
      }
      
      content += `<tr class="${rowClass}"><td>${player.currentClan}</td><td>${player.playerName}</td><td>${player.trophies}</td><td>${player.grado}</td><td>${player.nomeTelegram}</td><td><a href="https://t.me/${player.usernameTelegram}" target="_blank">${player.usernameTelegram}</a></td></tr>`;
    });

    content += '</table>';

    document.getElementById('content').innerHTML = content;
  })
  .catch((error) => console.error('Error fetching data:', error));
