// Função para mostrar uma mensagem de carregamento
function mostrarCarregando() {
    const container = document.getElementById('perguntasContainer');
    container.innerHTML = ''; // Limpa qualquer conteúdo anterior
    const carregandoDiv = document.createElement('div');
    carregandoDiv.id = 'carregando';
    carregandoDiv.innerHTML = '<p>Gerando pergunta...</p>';
    carregandoDiv.style.textAlign = 'center';
    carregandoDiv.style.fontSize = '18px';
    carregandoDiv.style.padding = '20px';
    carregandoDiv.style.fontStyle = 'italic';
    container.appendChild(carregandoDiv);
}

// Função para remover a mensagem de carregamento
function removerCarregando() {
    const carregandoDiv = document.getElementById('carregando');
    if (carregandoDiv) {
        carregandoDiv.remove();
    }
}

// Função para atualizar o HTML com as perguntas e alternativas
function atualizarInterface(pergunta, alternativas, explicacao, index) {
    const container = document.getElementById('perguntasContainer');

    const divPergunta = document.createElement('div');
    divPergunta.classList.add('bloco-questao'); // Adiciona a classe de animação

    setTimeout(() => {
        divPergunta.classList.add('visible'); // Ativa a animação após adição ao DOM
    }, 100); // Pequeno delay para a animação iniciar

    const perguntaElem = document.createElement('h2');
    perguntaElem.innerText = `Pergunta ${index + 1}: ${pergunta}`;
    divPergunta.appendChild(perguntaElem);

    const ulAlternativas = document.createElement('ul');

    alternativas.forEach((alt, idx) => {
        const li = document.createElement('li');
        li.innerText = `${idx + 1}. ${alt.Text}`;
        li.addEventListener('click', function () {
            const alternativasLi = ulAlternativas.querySelectorAll('li');
            alternativasLi.forEach(item => item.classList.remove('selecionada'));
            li.classList.add('selecionada');
            perguntasGeradas[index].alternativaSelecionada = alt;

            // Animação de zoom ao clicar na alternativa
            li.style.transition = "transform 0.2s ease";
            li.style.transform = "scale(1.05)";
            setTimeout(() => {
                li.style.transform = "scale(1)";
            }, 200);
        });
        ulAlternativas.appendChild(li);
    });

    divPergunta.appendChild(ulAlternativas);

    const botaoVerResposta = document.createElement('button');
    botaoVerResposta.innerText = 'Ver Resposta';
    botaoVerResposta.classList.add('ver-resposta');
    botaoVerResposta.addEventListener('click', function () {
        if (!perguntasGeradas[index].alternativaSelecionada) {
            alert('Por favor, selecione uma alternativa.');
            return;
        }

        const alternativasLi = ulAlternativas.querySelectorAll('li');
        alternativasLi.forEach((li, idx) => {
            if (alternativas[idx].correct) {
                li.classList.add('correct'); // Alternativa correta recebe a classe 'correct'
            } else {
                li.classList.add('incorrect'); // Alternativa incorreta recebe a classe 'incorrect'
            }

            li.style.pointerEvents = 'none'; // Desativa o clique nas alternativas
        });

        botaoVerResposta.disabled = true; // Desativa o botão após o clique

        const divExplicacao = document.createElement('div');
        divExplicacao.classList.add('resposta', 'fade-in');
        divExplicacao.innerHTML = `<strong>Explicação:</strong> ${explicacao}`;
        divPergunta.appendChild(divExplicacao);
    });

    divPergunta.appendChild(botaoVerResposta);
    container.appendChild(divPergunta);
}

// Função para lidar com o clique no botão "Gerar Pergunta"
document.getElementById('gerarPergunta').addEventListener('click', async function () {
    const dificuldade = document.getElementById('difficulty').value;
    const tema = document.getElementById('tema').value;
    const quantidade = document.getElementById('quantidadePerguntas').value;

    mostrarCarregando(); // Mostra a mensagem de carregamento

    try {
        const response = await fetch('http://127.0.0.1:3000/gerarPergunta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ dificuldade, tema, quantidade })
        });

        if (!response.ok) throw new Error('Erro na requisição');

        const resultado = await response.json();

        removerCarregando(); // Remove a mensagem de carregamento

        const container = document.getElementById('perguntasContainer');
        container.innerHTML = ''; // Limpa perguntas anteriores

        if (Array.isArray(resultado)) {
            perguntasGeradas = resultado.map((perguntaData, index) => {
                atualizarInterface(perguntaData.pergunta, perguntaData.alternativas, perguntaData.explicacao, index);
                return {
                    pergunta: perguntaData.pergunta,
                    alternativas: perguntaData.alternativas,
                    explicacao: perguntaData.explicacao,
                    alternativaSelecionada: null,
                };
            });
        }
    } catch (error) {
        removerCarregando(); // Remove a mensagem de carregamento em caso de erro
        alert('Erro ao gerar pergunta. Tente novamente.');
        console.error('Erro:', error);
    }
});
