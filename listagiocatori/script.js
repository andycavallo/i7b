const apiKey = 'AIzaSyAMwp2PrmXiQj2Qyi0v3TJVWFD5Jl0eF2I'; // Replace with your API key
const sheetId = '16gHjqHQJCbZApcKYUCtJkcoIsIKcJ30VkK-OVaYqwUU'; // Replace with your Google Sheet ID
const sheetName = 'LastDay'; // Replace with your sheet name if different

const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A1:V?key=${apiKey}`;

fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
        const rows = data.values;
        rows.sort((a, b) => {
            const clanA = a[2] || '';
            const clanB = b[2] || '';
            const trophiesA = parseInt(a[8]) || 0;
            const trophiesB = parseInt(b[8]) || 0;

            if (clanA === clanB) {
                return trophiesB - trophiesA;
            } else {
                return clanA.localeCompare(clanB);
            }
        });

        let content = '';

        rows.forEach((row, rowIndex) => {
            const clanName = row[2] || '';
            const id = row[6] || '';
            const name = row[7] || '';
            const trophies = row[8] || '';
            const grado = row[19] || '';
            const nomeTelegram = row[20] || '';
            let usernameTelegram = row[21] || '';
            if (usernameTelegram) {
                usernameTelegram = `<a href='https://t.me/${usernameTelegram}'>${usernameTelegram}</a>`;
            }

            let rowClass = '';
            if (grado.includes('Generale')) {
                rowClass = 'generale';
            } else if (grado.includes('Capitano')) {
                rowClass = 'capitano';
            } else if (grado.includes('Tenente')) {
                rowClass = 'tenente';
            }

        content += `<tr class="${rowClass}"><td>${clanName}</td><td>${id}</td><td>${name}</td><td>${trophies}</td><td>${grado}</td><td>${nomeTelegram}</td><td>${usernameTelegram}</td></tr>`;
    });

    document.getElementById('content').innerHTML = content;
})
.catch((error) => console.error('Error fetching data:', error));

