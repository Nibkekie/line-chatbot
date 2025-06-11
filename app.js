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
      const userInput = event.message.text.trim();

      // ✅ ถ้าผู้ใช้พิมพ์ "ติดต่อ" แสดง Flex Message
      if (userInput === 'ติดต่อ') {
        const flexMsg = {
          type: 'flex',
          altText: 'ติดต่อเรา',
          contents: {
            type: 'bubble',
            hero: {
              type: 'image',
              url: 'https://i.pinimg.com/736x/26/3b/03/263b03a8ec8b34ea74b20e42dea0b0b7.jpg',
              size: 'full',
              aspectRatio: '20:13',
              aspectMode: 'cover'
            },
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: 'ติดต่อเรา',
                  weight: 'bold',
                  size: 'xl',
                  margin: 'md'
                },
                {
                  type: 'text',
                  text: 'หากคุณมีคำถามหรือต้องการความช่วยเหลือ กดปุ่มด้านล่างเพื่อเริ่มต้น',
                  size: 'sm',
                  color: '#666666',
                  wrap: true,
                  margin: 'md'
                }
              ]
            },
            footer: {
              type: 'box',
              layout: 'vertical',
              spacing: 'sm',
              contents: [
                {
                  type: 'button',
                  style: 'primary',
                  color: '#00C300',
                  action: {
                    type: 'uri',
                    label: 'ติดต่อผ่าน LINE',
                    uri: 'https://line.me/R/ti/p/~pinky3456789' // ✅ เปลี่ยนเป็น LINE ID ของคุณ
                  }
                },
                {
                  type: 'button',
                  style: 'secondary',
                  action: {
                    type: 'uri',
                    label: 'เยี่ยมชมเว็บไซต์',
                    uri: 'https://www.youtube.com/watch?v=iCjfiQuAIbo' // ✅ เปลี่ยนเป็นเว็บไซต์ของคุณ
                  }
                }
              ],
              flex: 0
            }
          }
        };

        await line.reply(event.replyToken, [flexMsg]);
        continue; // ✅ ข้ามการใช้ Gemini
      }

      // ✅ ถ้าไม่ใช่ "ติดต่อ" จะเรียก Gemini
      const geminiReply = await gemini.textOnly(userInput);
      await line.reply(event.replyToken, [{ type: 'text', text: geminiReply }]);
    }
  }

  res.status(200).send('OK');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
