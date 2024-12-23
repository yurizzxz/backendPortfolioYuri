const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();

const allowedOrigins = ['https://portfolioyuri.vercel.app', 'https://backendportfolioyuri.onrender.com'];

app.use(cors({
  origin: function(origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("As variáveis de ambiente EMAIL_USER e EMAIL_PASS não estão definidas.");
  process.exit(1);
}

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
    res.status(200).send("E-mail enviado com sucesso");
  });
});

const port = 4000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
