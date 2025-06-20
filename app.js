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

      // ✅ กรณีผู้ใช้เลือก "ติดต่อ"
      if (userInput === 'ติดต่อ') {
        const contactFlex = {
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
                  text: 'ช่องทางการติดต่อ',
                  weight: 'bold',
                  size: 'xl'
                },
                {
                  type: 'text',
                  text: 'สามารถทัก LINE หรือเยี่ยมชมเว็บไซต์ได้เลยค่ะ',
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
              contents: [
                {
                  type: 'button',
                  style: 'primary',
                  color: '#00C300',
                  action: {
                    type: 'uri',
                    label: 'ทักแชท LINE',
                    uri: 'https://line.me/R/ti/p/~pinky3456789' // ใส่ LINE ID คุณตรงนี้
                  }
                }
              ]
            }
          }
        };

        await line.reply(event.replyToken, [contactFlex]);
        continue;
      }

      // ✅ กรณีผู้ใช้เลือก "ใช้แชทบอท"
      if (userInput === 'ใช้แชทบอท') {
        const geminiReply = await gemini.textOnly('สวัสดี! มีอะไรให้ช่วยไหม');
        await line.reply(event.replyToken, [{ type: 'text', text: geminiReply }]);
        continue;
      }

      // ✅ ผู้ใช้พิมพ์อะไรก็ได้ → ตอบกลับ Flex ให้เลือกก่อน
      const menuFlex = {
        type: 'flex',
        altText: 'กรุณาเลือกเมนู',
        contents: {
          type: 'bubble',
          hero: {
              type: 'image',
              url: 'https://i.pinimg.com/736x/c0/7c/c7/c07cc7f0c48a44dc286555edb44bd227.jpg',
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
                text: 'คุณต้องการทำอะไร?',
                weight: 'bold',
                size: 'xl',
                margin: 'md'
              },
              {
                type: 'text',
                text: 'กรุณาเลือกเมนูด้านล่าง',
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
                action: {
                  type: 'message',
                  label: 'ใช้แชทบอท',
                  text: 'ใช้แชทบอท'
                }
              },
              {
                type: 'button',
                style: 'secondary',
                action: {
                  type: 'message',
                  label: 'ติดต่อ',
                  text: 'ติดต่อ'
                }
              }
            ]
          }
        }
      };

      await line.reply(event.replyToken, [menuFlex]);
    }
  }

  res.status(200).send('OK');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
