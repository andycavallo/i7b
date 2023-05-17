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
        if (username) { // Add this line to check if the username is not empty
            if (!map[username]) {
                map[username] = [];
            }
            map[username].push(row);
        }
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
        filteredRows = filteredRows.filter(row => {
            const username = row[21];
            return username && usernameToRows[username].length > 1;
        });
    }

  filteredRows.sort((a, b) => {
    if (a[2] === b[2]) {
        return b[8] - a[8]; // Sort by Trophies if Clan name is the same
    }
    return a[2].localeCompare(b[2]); // Sort by Clan name
});

const tbody = document.getElementById('content').querySelector('tbody');
tbody.innerHTML = ''; // Clear the table body

filteredRows.forEach(row => {
    const clanName = row[2];
    const id = row[6] || '';
    const name = row[7] || '';
    const trophies = row[8] || '';
    const grado = row[19] || '';
    const nomeTelegram = row[20] || '';
    const usernameTelegram = row[21] ? `<a href="https://t.me/${row[21]}" target="_blank">${row[21]}</a>` : '';
    const nomeDiscord = row[22] || '';

    let rowClass = '';
    if (grado.includes('Generale')) {
        rowClass = 'generale';
    } else if (grado.includes('Capitano')) {
        rowClass = 'capitano';
    } else if (grado.includes('Tenente')) {
        rowClass = 'tenente';
    }

    const content = `<tr class="${rowClass}"><td>${clanName}</td><td>${id}</td><td>${name}</td><td>${trophies}</td><td>${grado}</td><td>${nomeTelegram}</td><td>${usernameTelegram}</td><td>${nomeDiscord}</td></tr>`;
    tbody.insertAdjacentHTML('beforeend', content);
});

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

