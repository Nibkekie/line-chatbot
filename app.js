require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const line = require('./utils/line');
const gemini = require('./utils/gemini');

const app = express();
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('LINE Chatbot is running!');
});


app.post('/webhook', async (req, res) => {
  const events = req.body.events;
  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const userInput = event.message.text;
      const geminiReply = await gemini.textOnly(userInput);
      await line.reply(event.replyToken, [{ type: 'text', text: geminiReply }]);
    }
  }
  // ตอบกลับ LINE ด้วย HTTP 200 เพื่อยืนยันการรับข้อมูล
  res.status(200).send('OK');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
