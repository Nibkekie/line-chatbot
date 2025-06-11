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

      // ถ้าผู้ใช้พิมพ์ว่า "เมนู" ให้ส่ง Flex Message แทน
      if (userInput.trim() === "เมนู") {
        const flexMsg = {
          type: "flex",
          altText: "เมนูหลัก",
          contents: {
            type: "bubble",
            hero: {
              type: "image",
              url: "https://example.com/your-image.jpg", // เปลี่ยนเป็นรูปจริง
              size: "full",
              aspectRatio: "20:13",
              aspectMode: "cover"
            },
            body: {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "text",
                  text: "เมนูหลัก",
                  weight: "bold",
                  size: "xl"
                },
                {
                  type: "text",
                  text: "เลือกเมนูที่ต้องการ",
                  size: "sm",
                  color: "#666666"
                }
              ]
            },
            footer: {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "button",
                  style: "primary",
                  action: {
                    type: "message",
                    label: "สอบถาม",
                    text: "สอบถาม"
                  }
                },
                {
                  type: "button",
                  style: "secondary",
                  action: {
                    type: "message",
                    label: "ติดต่อ",
                    text: "ติดต่อ"
                  }
                }
              ]
            }
          }
        };

        await line.reply(event.replyToken, [flexMsg]);
      } else {
        // ถ้าไม่ใช่ "เมนู" ให้ตอบด้วย Gemini ตามปกติ
        const geminiReply = await gemini.textOnly(userInput);
        await line.reply(event.replyToken, [{ type: 'text', text: geminiReply }]);
      }
    }
  }
  res.status(200).send('OK');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
