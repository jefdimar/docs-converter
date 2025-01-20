const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const converterService = require('./services/converterService');
const upload = require('./config/multerConfig');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/convert', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await converterService.convertDocument(req.file);
    res.json(result);

  } catch (error) {
    res.status(500).json({
      error: 'Error converting document',
      details: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Converter service running at http://localhost:${port}`);
});
