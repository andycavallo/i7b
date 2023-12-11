const apiKey = 'AIzaSyAMwp2PrmXiQj2Qyi0v3TJVWFD5Jl0eF2I';
const sheetId = '16gHjqHQJCbZApcKYUCtJkcoIsIKcJ30VkK-OVaYqwUU';
const sheetName = 'LastDay';

const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A1:W?key=${apiKey}`;

let allRows = [];
let usernameToRows = {};

fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
        allRows = data.values.filter(row => row[2]);
        allRows.shift();

        usernameToRows = allRows.reduce((map, row) => {
            const username = row[21];
            if (username) {
                if (!map[username]) {
                    map[username] = [];
                }
                map[username].push(row);
            }
            return map;
        }, {});

        const uniqueClans = [...new Set(allRows.map(row => row[2]))].filter(Boolean).sort();

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

function calculate_score(position, trophies) {
    if (position === 0) multiplier = 0.5;
    else if (position < 10) multiplier = 0.4;
    else if (position < 20) multiplier = 0.3;
    else if (position < 30) multiplier = 0.2;
    else if (position < 40) multiplier = 0.1;
    else if (position < 50) multiplier = 0.05;
    else multiplier = 0;
    return parseFloat(trophies) * multiplier;
}

function simulateScoreAfterMovements() {
    const allPlayers = allRows.map(row => ({
        clan: row[2],
        trophies: parseFloat(row[8]),
    })).sort((a, b) => b.trophies - a.trophies);

    const clans = ['I7B', 'I7B2', 'I7B3'];
    const clanLimits = { 'I7B': 50, 'I7B2': 50, 'I7B3': 50 };
    const clanScoresAfterMovements = { 'I7B': 0, 'I7B2': 0, 'I7B3': 0 };

    allPlayers.forEach((player, index) => {
        for (const clan of clans) {
            if (clanLimits[clan] > 0) {
                clanLimits[clan]--;
                clanScoresAfterMovements[clan] += calculate_score(index % 50, player.trophies);
                break;
            }
        }
    });

    return clanScoresAfterMovements;
}

function createSummaryTable() {
    const summaryTbody = document.getElementById('summary-content').querySelector('tbody');
    summaryTbody.innerHTML = '';

    const scoresAfterMovements = simulateScoreAfterMovements();
    const clans = ['I7B', 'I7B2', 'I7B3'];

    clans.forEach(clan => {
        const playersInClan = allRows.filter(row => row[2] === clan);
        const sortedPlayersInClan = playersInClan.sort((a, b) => b[8] - a[8]).slice(0, 50);

        let clanScore = 0;
        sortedPlayersInClan.forEach((row, index) => {
            clanScore += calculate_score(index, row[8]);
        });

        clanScore = Math.round(clanScore);
        const scoreAfterMovements = scoresAfterMovements[clan];

        const telegramInClan = sortedPlayersInClan.filter(row => row[20]).length;
        const discordInClan = sortedPlayersInClan.filter(row => row[22]).length;

        const summaryContent = `<tr><td>${clan}</td><td>${sortedPlayersInClan.length}/50</td><td>${telegramInClan}/50</td><td>${discordInClan}/50</td><td>${clanScore}</td><td>${scoreAfterMovements}</td></tr>`;
        summaryTbody.insertAdjacentHTML('beforeend', summaryContent);
    });
}
