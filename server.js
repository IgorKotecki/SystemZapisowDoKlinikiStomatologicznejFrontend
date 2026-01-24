const path = require('path');
const express = require('express');
const app = express();


const distPath = path.join(path.dirname(process.execPath), 'dist');

app.use(express.static(distPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

const port = 5173;
app.listen(port, () => console.log(`Server running on port ${port}`));