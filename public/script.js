document.addEventListener("DOMContentLoaded", function() {
    const tensaoElement = document.getElementById("valor-tensao");
    const reléButton = document.getElementById("relé-btn");

    // Função para atualizar a tensão no front-end
    function atualizarTensao() {
        fetch("http://localhost:3000/tensao")
            .then(response => response.json())
            .then(data => {
                tensaoElement.textContent = data.tensao; // Atualiza a tensão
            })
            .catch(error => console.error("Erro ao obter tensão:", error));
    }

    // Função para ligar/desligar o relé
    reléButton.addEventListener("click", function() {
        fetch("http://localhost:3000/relé", { method: "POST" })
            .then(response => response.json())
            .then(data => {
                if (data.status === "ligado") {
                    alert("Relé ativado!");
                } else {
                    alert("Relé desligado!");
                }
            })
            .catch(error => console.error("Erro ao controlar relé:", error));
    });

    // Atualiza a tensão a cada 1 segundo
    setInterval(atualizarTensao, 1000);
});
