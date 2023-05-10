const apiKey = 'AIzaSyAMwp2PrmXiQj2Qyi0v3TJVWFD5Jl0eF2I'; 
const sheetId = '16gHjqHQJCbZApcKYUCtJkcoIsIKcJ30VkK-OVaYqwUU'; 
const sheetName = 'LastDay';

// Now we're fetching up to column "W"
const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A1:W?key=${apiKey}`;

let allRows = [];

fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    allRows = data.values;
    allRows = allRows.filter(row => row[2]); // Filter out rows without a Clan Name
    const uniqueClans = [...new Set(allRows.map(row => row[2]))].sort();

    const dropdown = document.getElementById('clan-filter');
    dropdown.innerHTML = '<option value="">All Clans</option>' + uniqueClans.map(clan => `<option value="${clan}">${clan}</option>`).join('');

    dropdown.addEventListener('change', (event) => {
      const selectedClan = event.target.value;
      updateTable(selectedClan);
    });

    updateTable();
  })
  .catch((error) => console.error('Error fetching data:', error));

function updateTable(clanFilter = '') {
  const filteredRows = clanFilter ? allRows.filter(row => row[2] === clanFilter) : [...allRows];

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
    const nomeDiscord = row[22] || ''; // New variable for "Nome Discord"

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
