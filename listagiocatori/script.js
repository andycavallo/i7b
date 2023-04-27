const apiKey = 'AIzaSyAMwp2PrmXiQj2Qyi0v3TJVWFD5Jl0eF2I'; // Replace with your API key
const sheetId = '16gHjqHQJCbZApcKYUCtJkcoIsIKcJ30VkK-OVaYqwUU'; // Replace with your Google Sheet ID
const sheetName = 'LastDay'; // Replace with your sheet name if different

const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A1:S?key=${apiKey}`;

fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    const rows = data.values;
    let players = [];

    rows.forEach((row, rowIndex) => {
      if(rowIndex === 0) return; // Skip header row

      const playerName = row[7]; // Assuming this is column H
      const currentClan = row[2]; // Assuming this is column C
      const trophies = parseInt(row[8]); // Assuming this is column I

      players.push({currentClan, playerName, trophies});
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
    content += '<tr><td>Clan</td><td>Name</td><td>Trophies</td></tr>'; // Table headers

    players.forEach(player => {
      content += `<tr><td>${player.currentClan}</td><td>${player.playerName}</td><td>${player.trophies}</td></tr>`;
    });

    content += '</table>';

    document.getElementById('content').innerHTML = content;
  })
  .catch((error) => console.error('Error fetching data:', error));
