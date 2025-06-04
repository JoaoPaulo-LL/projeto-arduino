const express = require("express");
const fetch = require("node-fetch"); // ou 'undici' se estiver usando versão moderna do Node sd
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

const FIREBASE_URL =
  "https://project-arduino-e8951-default-rtdb.firebaseio.com";

// Rota para obter os dados da tensão
app.get("/tensao", async (req, res) => {
  try {
    const response = await fetch(`${FIREBASE_URL}/energia.json`);
    const data = await response.json();
    res.json({ tensao: data.valor });
  } catch (error) {
    console.error("Erro ao obter tensão:", error);
    res.status(500).json({ erro: "Erro ao buscar tensão" });
  }
});

// Rota para ligar o relé
app.post("/ligar", async (req, res) => {
  try {
    await fetch(`${FIREBASE_URL}/rele.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(true),
    });
    res.send("Relé ligado");
  } catch (error) {
    console.error("Erro ao ligar relé:", error);
    res.status(500).send("Erro ao ligar relé");
  }
});

// Rota para desligar o relé
app.post("/desligar", async (req, res) => {
  try {
    await fetch(`${FIREBASE_URL}/rele.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(false),
    });
    res.send("Relé desligado");
  } catch (error) {
    console.error("Erro ao desligar relé:", error);
    res.status(500).send("Erro ao desligar relé");
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
