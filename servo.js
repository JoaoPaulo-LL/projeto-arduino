const five = require("johnny-five");
const board = new five.Board();

board.on("ready", function () {
    console.log("Arduino conectado!");
  
    const relay = new five.Relay(9);

    const sensorTensao = new five.Sensor({
      pin: "A0",
      freq: 500,
    });
  
    // Definir um limite mínimo de tensão para ativar o relé
    const limite_min = 300;
  
    sensorTensao.on("data", function () {
      console.log(`Tensão medida: ${this.value}`);
  
      if (this.value > limite_min) {
        relay.on(); // Ativa o relé 
        console.log("Energia suficiente! Relé ativado.");
      } else {
        relay.off(); // Desativa o relé
        console.log("Energia insuficiente. Relé desligado.");
      }
    });
  
    this.on("exit", function () {
      relay.off();
      console.log("Desligado!");
    });
  });