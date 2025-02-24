const express = require('express');
const path = require('path');
const app = express();
const port = 8000;
app.use(express.static(path.join(__dirname)));
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'index.html')); });
app.listen(port, '127.0.0.1', () => { console.log(`Server running at http://127.0.0.1:${port}`); });
