document.addEventListener("DOMContentLoaded", function() {
    const tensaoElement = document.getElementById("tensao");
    const reléButton = document.getElementById("desligar");

    // Dados iniciais para o gráfico
    const dadosTensao = {
        series: [{
            name: "Tensão",
            data: []
        }],
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: false
            }
        },
        xaxis: {
            type: 'datetime',
            labels: {
                format: 'HH:mm:ss'
            }
        },
        yaxis: {
            title: {
                text: 'Tensão (V)'
            }
        },
        title: {
            text: 'Gráfico de Tensão',
            align: 'center'
        }
    };

    // Criação do gráfico com ApexCharts
    const graficoTensao = new ApexCharts(document.querySelector("#grafico-tensao"), dadosTensao);
    graficoTensao.render();

    // Função para atualizar a tensão no front-end e no gráfico
    function atualizarTensao() {
        fetch("http://localhost:3000/tensao")
            .then(response => response.json())
            .then(data => {
                const tensao = data.tensao;
                tensaoElement.textContent = tensao; // Atualiza a tensão no front-end

                // Adiciona a nova tensão ao gráfico
                const timestamp = new Date().getTime();
                dadosTensao.series[0].data.push([timestamp, tensao]);

                // Limita a quantidade de dados no gráfico para não sobrecarregar
                if (dadosTensao.series[0].data.length > 30) {
                    dadosTensao.series[0].data.shift(); // Remove o primeiro item (mais antigo)
                }

                graficoTensao.updateSeries(dadosTensao.series);
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
                    reléButton.classList.remove('off');
                    reléButton.classList.add('on');
                    reléButton.textContent = 'Desligar Relé';
                } else {
                    alert("Relé desligado!");
                    reléButton.classList.remove('on');
                    reléButton.classList.add('off');
                    reléButton.textContent = 'Ligar Relé';
                }
            })
            .catch(error => console.error("Erro ao controlar relé:", error));
    });

    // Atualiza a tensão a cada 1 segundo
    setInterval(atualizarTensao, 1000);
});
