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

    rows.forEach((row) => {
      content += '<tr>';
      const filteredRow = [
        row[0], // Column A
        row[2], // Column C
        row[7], // Column H
        row[8], // Column I
        row[11], // Column L
      ];
      filteredRow.forEach((cell) => {
        content += `<td>${cell}</td>`;
      });
      content += '</tr>';
    });

    content += '</table>';
    document.getElementById('content').innerHTML = content;
  })
  .catch((error) => console.error('Error fetching data:', error));
