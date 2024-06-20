async function saveToJson() {
    const userInput = document.getElementById('rollnumber').value;

    const blob = new Blob([JSON.stringify({ userInput })], { type: 'application/json' });
    const handle = await window.showSaveFilePicker({
        suggestedName: 'output.json',
        types: [{
            description: 'JSON Files',
            accept: { 'application/json': ['.json'] },
        }],
    });

    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();

    alert('Data saved to JSON file.');
}