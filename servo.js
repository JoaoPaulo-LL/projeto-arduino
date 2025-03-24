// const five = require("johnny-five");
// const board = new five.Board();

// board.on("ready", function () {
//   console.log("Arduino conectado!");

//   var relay = new five.Relay(9); // Certifique-se de que está no pino certo

//   const sensorTensao = new five.Sensor({
//     pin: "A0",
//     freq: 1000, // Frequência de leitura ajustada para evitar oscilação excessiva
//   });

//   const limite_min = 300; // Defina o limite de tensão

//   let relayState = false; // Estado inicial do relé (desligado)

//   sensorTensao.on("data", function () {
//     console.log(`Tensão medida: ${this.value}`);
//     // Se a tensão estiver acima do limite e o relé estiver desligado
//     if (this.value > limite_min && !relayState) {
//       relay.toggle(); // Liga o relé
//       relayState = true; // Atualiza o estado do relé
//       console.log("Energia suficiente! Relé ativado.");
//     }
//     // Se a tensão estiver abaixo do limite e o relé estiver ligado
//     else if (this.value <= limite_min && relayState) {
//       relay.close(); // Desliga o relé
//       relayState = false; // Atualiza o estado do relé
//       console.log("Energia insuficiente. Relé desligado.");
//     }
//   });

//   this.on("exit", function () {
//     relay.close(); // Desliga o relé quando o programa terminar
//     console.log("Desligado!");
//   });
// });


const express = require("express");
const five = require("johnny-five");
const path = require("path"); // Para definir o caminho correto para o arquivo HTML
const app = express();
const board = new five.Board();

let relayState = false;
let tensao = 0; // Valor da tensão medida

// Defina a pasta pública para servir os arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public"))); 

board.on("ready", function () {
  console.log("Arduino conectado!");

  const relay = new five.Relay(9); // Relé no pino 9
  const sensorTensao = new five.Sensor({
    pin: "A0",
    freq: 1000, // Frequência de leitura ajustada para evitar oscilação excessiva
  });

  const limite_min = 250; // Defina o limite de tensão

  sensorTensao.on("data", function () {
    tensao = this.value; // Atualiza a variável com a tensão medida
    console.log(`Tensão medida: ${tensao}`);
    
    // Controle automático do relé com base na tensão
    if (tensao > limite_min && !relayState) {
      relay.toggle();
      relayState = true;
      console.log("Energia suficiente! Relé ativado.");
    } else if (tensao <= limite_min && relayState) {
      relay.close();
      relayState = false;
      console.log("Energia insuficiente. Relé desligado.");
    }
  });

  // Rota para ligar o relé manualmente
  app.post("/ligar", (req, res) => {
    if (!relayState) {
      relay.toggle(); // Liga o relé
      relayState = true; // Atualiza o estado
      console.log("Relé ativado manualmente!");
    }
    res.send("Relé ativado");
  });

  // Rota para desligar o relé manualmente
  app.post("/desligar", (req, res) => {
    if (relayState) {
      relay.close(); // Desliga o relé
      relayState = false; // Atualiza o estado
      console.log("Relé desativado manualmente!");
    }
    res.send("Relé desligado");
  });

  // Rota para obter a tensão medida
  app.get("/tensao", (req, res) => {
    res.json({ tensao: tensao });
  });

  // Inicia o servidor na porta 3000
  app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
  });
});