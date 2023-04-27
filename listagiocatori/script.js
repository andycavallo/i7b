const apiKey = 'AIzaSyAMwp2PrmXiQj2Qyi0v3TJVWFD5Jl0eF2I'; // Replace with your API key
const sheetId = '16gHjqHQJCbZApcKYUCtJkcoIsIKcJ30VkK-OVaYqwUU'; // Replace with your Google Sheet ID
const sheetName = 'LastDay'; // Replace with your sheet name if different

const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A1:S?key=${apiKey}`;

fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    const rows = data.values;
    let clans = {};

    rows.forEach((row, rowIndex) => {
      if(rowIndex === 0) return; // Skip header row

      const playerName = row[1];
      const currentClan = row[2];
      const trophies = parseInt(row[8]);

      if(!clans[currentClan]){
        clans[currentClan] = [];
      }
      
      clans[currentClan].push({playerName, trophies});
    });

    let content = '';

    for(let clan in clans){
      clans[clan].sort((a,b) => b.trophies - a.trophies); // Sort players within a clan by trophies

      content += `<h2>${clan}</h2><table>`;
      content += '<tr><td>Name</td><td>Trophies</td></tr>';

      clans[clan].forEach(player => {
        content += `<tr><td>${player.playerName}</td><td>${player.trophies}</td></tr>`;
      });

      content += '</table>';
    }

    document.getElementById('content').innerHTML = content;
  })
  .catch((error) => console.error('Error fetching data:', error));
