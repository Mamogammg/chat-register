const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const IP = '0.0.0.0'; // Reemplaza esto con tu dirección IP local
const PORT = 8000;

// Configurar middleware para analizar solicitudes JSON
app.use(bodyParser.json());

// Datos iniciales (esto es solo un ejemplo)
let data = {};

const server = http.createServer((req, res) => {
  console.log(req.url)
  console.log(req.headers['user-agent'])
  console.log(req)
  if (req.url === '/' || req.url === '' || req.url.includes('/?')) {
    const indexPath = path.join(__dirname, 'index.html');

    // Leer el archivo "index.html" de manera asíncrona
    fs.readFile(indexPath, 'utf8', (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error interno del servidor');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
  } else if (req.url === '/data') {
    if (req.method === 'GET') {
      res.setHeader("response",JSON.stringify(data))
      res.writeHead(200, { 'Content-Type': 'text/plain' },);
      res.end(JSON.stringify(data))
    } else if (req.method === 'POST') {
      let body = "";
      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        try {
          body = JSON.parse(body)
          console.log(body)
          var [clave, valor] = Object.entries(body)[0]
          var id = body["id"]
          data[clave] = {[id]: valor}
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: 'Data saved successfully' }));
        } catch (e) {
          console.log(e)
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Invalid JSON format' }));
        }
      })
    }
  } else if (req.url.includes('/get_code')) {
    if (req.method === 'GET') {
      const indexPath = path.join(__dirname, 'get_code.html');

    // Leer el archivo "index.html" de manera asíncrona
    fs.readFile(indexPath, 'utf8', (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error interno del servidor');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
    } else if (req.method === 'POST') {
      let body = "";
      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        try {
          body = JSON.parse(body)
          console.log(body)
          var [clave, valor] = Object.entries(body)[0]
          var id = body["id"]
          data[clave] = {[id]: valor}
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: 'Data saved successfully' }));
        } catch (e) {
          console.log(e)
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Invalid JSON format' }));
        }
      })
    }
  } else {
    // Enviar una respuesta 404 para cualquier otra solicitud
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Página no encontrada');
  }
});

server.listen(PORT, IP, () => {
  console.log(`Servidor corriendo en http://${IP}:${PORT}/`);
});
