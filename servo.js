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

  const relay = new five.Relay(15); // Relé no pino 9
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

  // Inicia o servidor na porta 3000
  app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
  });
});