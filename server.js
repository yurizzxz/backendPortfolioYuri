const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: ["https://portfolioyuri.vercel.app", "http://localhost:3000"],
}));

app.use(express.json());

app.post("/send-email", (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `Mensagem de ${name} - ${email}`,
    text: `Mensagem de ${name} (${email}):\n\n${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Erro ao enviar e-mail:", error);
      return res.status(500).send("Erro ao enviar o e-mail");
    }
    console.log("E-mail enviado com sucesso:", info);
    res.status(200).send("E-mail enviado com sucesso");
  });
});

const port = 4000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
