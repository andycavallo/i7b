const apiKey = 'AIzaSyAMwp2PrmXiQj2Qyi0v3TJVWFD5Jl0eF2I'; // Replace with your API key
const sheetId = '1oFaCCfJBVwENz3SAzDIpEHigq4nMPARlihgvTxldml4'; // Replace with your Google Sheet ID
const sheetName = 'LastDay'; // Replace with your sheet name if different

// Replace 'A1:D10' with the range you want to fetch from your Google Sheet
const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A1:AB200?key=${apiKey}`;

fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
        const rows = data.values;
        let content = '<table>';

        rows.forEach((row) => {
            content += '<tr>';
            row.forEach((cell) => {
                content += `<td>${cell}</td>`;
            });
            content += '</tr>';
        });

        content += '</table>';
        document.getElementById('content').innerHTML = content;
    })
    .catch((error) => console.error('Error fetching data:', error));
