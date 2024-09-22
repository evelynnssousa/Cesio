// Função para atualizar o HTML com a pergunta e alternativas
function atualizarInterface(pergunta, alternativas, explicacao) {
    const perguntaElem = document.getElementById('pergunta');
    perguntaElem.innerText = pergunta;

    const ulAlternativas = document.getElementById('alternativas');
    ulAlternativas.innerHTML = '';

    alternativas.forEach((alt) => {
        const li = document.createElement('li');
        li.innerText = alt.trim();

        li.addEventListener('click', function () {
            if (alt.includes('(Correta)')) {
                li.style.backgroundColor = 'green';
            } else {
                li.style.backgroundColor = 'red';
            }
            document.getElementById('verResposta').style.display = 'block';
        });

        ulAlternativas.appendChild(li);
    });

    document.getElementById('verResposta').addEventListener('click', function () {
        document.getElementById('resposta').style.display = 'block';
        document.getElementById('explicacao').innerText = `Explicação: ${explicacao}`;
    });
}

// Função para lidar com o clique no botão "Gerar Pergunta"
document.getElementById('gerarPergunta').addEventListener('click', async function () {
    const dificuldade = document.getElementById('difficulty').value;
    const tema = document.getElementById('tema').value;

    // Exibir um estado de carregamento
    document.getElementById('pergunta').innerText = 'Gerando pergunta...';
    document.getElementById('alternativas').innerHTML = '';
    document.getElementById('resposta').style.display = 'none';
    document.getElementById('verResposta').style.display = 'none';

    try {
        const response = await fetch('http://localhost:3000/gerarPergunta', {  // <-- Altere a URL aqui
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ dificuldade, tema })
        });

        if (!response.ok) throw new Error('Erro na requisição');

        const resultado = await response.json();

        if (resultado) {
            const { pergunta, alternativas, explicacao } = resultado;
            atualizarInterface(pergunta, alternativas, explicacao);
        }
    } catch (error) {
        document.getElementById('pergunta').innerText = 'Erro ao gerar pergunta. Tente novamente.';
        console.error('Erro:', error);
    }
});
