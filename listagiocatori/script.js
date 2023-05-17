const apiKey = 'AIzaSyAMwp2PrmXiQj2Qyi0v3TJVWFD5Jl0eF2I'; 
const sheetId = '16gHjqHQJCbZApcKYUCtJkcoIsIKcJ30VkK-OVaYqwUU';
const sheetName = 'LastDay';

const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A1:W?key=${apiKey}`;

let allRows = [];
let usernameToRows = {};

fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    allRows = data.values.filter(row => row[2]); // Exclude rows with an empty Clan Name
    allRows.shift(); // Remove the header row

    // Create a mapping of usernames to rows
    usernameToRows = allRows.reduce((map, row) => {
        const username = row[21];
        if (!map[username]) {
            map[username] = [];
        }
        map[username].push(row);
        return map;
    }, {});

    const uniqueClans = [...new Set(allRows.map(row => row[2]))].filter(Boolean).sort(); // Exclude empty Clan Names and sort

    const dropdown = document.getElementById('clan-filter');
    dropdown.innerHTML = '<option value="">All Clans</option>' + uniqueClans.map(clan => `<option value="${clan}">${clan}</option>`).join('');

    dropdown.addEventListener('change', (event) => {
      const selectedClan = event.target.value;
      updateTable(selectedClan, document.getElementById('multi-account-checkbox').checked);
    });

    const checkbox = document.getElementById('multi-account-checkbox');
    checkbox.addEventListener('change', (event) => {
        updateTable(document.getElementById('clan-filter').value, event.target.checked);
    });

    updateTable();
    createSummaryTable();
  })
  .catch((error) => console.error('Error fetching data:', error));

function updateTable(clanFilter = '', showMultipleAccounts = false) {
  let filteredRows = clanFilter ? allRows.filter(row => row[2] === clanFilter) : [...allRows];

  if (showMultipleAccounts) {
      filteredRows = filteredRows.filter(row => usernameToRows[row[21]].length > 1);
  }

  // ... Rest of your function
}

function createSummaryTable() {
  const summaryTbody = document.getElementById('summary-content').querySelector('tbody');
  summaryTbody.innerHTML = ''; // Clear the summary table body

  const clans = ['I7B', 'I7B2', 'I7B3'];

  let totalPlayers = 0;
  let totalTelegram = 0;
  let totalDiscord = 0;

  clans.forEach(clan => {
    const playersInClan = allRows.filter(row => row[2] === clan);
    const telegramInClan = playersInClan.filter(row => row[20]).length;
    const discordInClan = playersInClan.filter(row => row[22]).length;

    totalPlayers += playersInClan.length;
    totalTelegram += telegramInClan;
    totalDiscord += discordInClan;

    const summaryContent = `<tr><td>${clan}</td><td>${playersInClan.length}/50</td><td>${telegramInClan}/50</td><td>${discordInClan}/50</td></tr>`;
    summaryTbody.insertAdjacentHTML('beforeend', summaryContent);
  });
   const totalContent = `<tr class="total-row"><td>Total</td><td>${totalPlayers}/150</td><td>${totalTelegram}/150</td><td>${totalDiscord}/150</td></tr>`;
  summaryTbody.insertAdjacentHTML('beforeend', totalContent);
}

