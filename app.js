const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');


app.use(express.json());
const DATA_FILE = 'clientes.json';

app.use(express.static(path.join(__dirname, 'public')));

const readData = () => {
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
};

const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/clientes', (req, res) => {
    const clientes = readData();
    res.json(clientes);
});

app.post('/clientes', (req, res) => {
    const newCliente = req.body; // The parsed JSON data is available here
    const clientes = readData();
    clientes.push(newCliente);
    writeData(clientes);
    res.json({ message: 'Data received successfully!' });
});
