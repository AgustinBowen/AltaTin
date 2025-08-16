const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');


app.use(express.json());
const DATA_FILE = 'clientes.json';

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

const readData = () => {
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
};

const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

function validarNombreApellido(valor) {
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (!regex.test(valor)) {
        return "Solo se permiten letras en este campo.";
    }
    return null;
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
        return "El email no tiene un formato válido.";
    }
    return null;
}

function validarTelefono(telefono) {
    const regex = /^[0-9-]+$/;
    if (!regex.test(telefono)) {
        return "El teléfono solo puede contener números y '-'.";
    }
    return null;
}


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
    const newCliente = req.body;
    const { nombre, apellido, email, telefono } = req.body;
    let errores = {};

    let error1 = validarNombreApellido(nombre);
    let error2 = validarNombreApellido(apellido);
    let error3 = validarEmail(email);
    let error4 = validarTelefono(telefono);

    if (error1) errores.nombre = error1;
    if (error2) errores.apellido = error2;
    if (error3) errores.email = error3;
    if (error4) errores.telefono = error4;

    if (Object.keys(errores).length > 0) {
        return res.status(400).json({ errores });
    }

    const clientes = readData();
    clientes.push(newCliente);
    writeData(clientes);

    res.status(201).json({ mensaje: "Cliente agregado con éxito", cliente: newCliente });
});

