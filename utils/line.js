const axios = require('axios');

const LINE_HEADER = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`
};

const reply = (token, payload) => {
  return axios.post('https://api.line.me/v2/bot/message/reply', {
    replyToken: token,
    messages: payload
  }, { headers: LINE_HEADER });
};

module.exports = { reply };
