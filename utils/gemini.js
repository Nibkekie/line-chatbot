const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const textOnly = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });

    const fullPrompt = `
คุณคือ AI ผู้ช่วยที่ให้คำตอบสั้น กระชับ และเป็นกันเอง

คำถามผู้ใช้:
${text}

กรุณาตอบกลับ:
`;

    const result = await model.generateContent(fullPrompt);
    const response = result.response.text();
    return response;
  } catch (err) {
    console.error("Gemini error:", err.response?.data || err.message || err);
    return "ขอโทษค่ะ ฉันไม่สามารถตอบได้ตอนนี้";
  }
};

module.exports = { textOnly };
