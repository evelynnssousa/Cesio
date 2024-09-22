const http = require('http');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = "AIzaSyBc1V0aD1WeeRfFtcC8stNPFvxMYL7P4O8";
const genAI = new GoogleGenerativeAI(apiKey);
const port = process.env.PORT || 3000;

// Função para manipular o corpo da requisição
function parseRequestBody(req, callback) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        callback(JSON.parse(body));
    });
}

// Função para lidar com a rota /gerarPergunta
async function gerarPerguntaHandler(req, res, body) {
    const { dificuldade, tema, quantidade } = body;

    // Garantir que a quantidade seja um número válido
    const numPerguntas = Math.min(Math.max(parseInt(quantidade, 10), 1), 10);

    const perguntasGeradas = [];

    for (let i = 0; i < numPerguntas; i++) {
        const promptText = `Gere uma pergunta sobre o tema ${tema} com dificuldade ${dificuldade}, 4 alternativas de resposta, e uma explicação da correta. Retorne no formato JSON com a seguinte estrutura(não é necessário especificar que o arquivo está em JSON):
        {
          "question": "Pergunta",
          "answers": [
            { "Text": "alternativa 1", "correct": "boolean" },
            { "Text": "alternativa 2", "correct": "boolean" },
            { "Text": "alternativa 3", "correct": "boolean" },
            { "Text": "alternativa 4", "correct": "boolean" }
          ],
          "explicacao": "Explicação da resposta correta"
        }`;

        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const result = await model.generateContent(promptText);
            const response = await result.response;
            const text = response.text();  // Acessando o texto da resposta

            const resultadoJSON = JSON.parse(text);

            perguntasGeradas.push({
                pergunta: resultadoJSON.question,
                alternativas: resultadoJSON.answers,
                explicacao: resultadoJSON.explicacao
            });
        } catch (error) {
            console.error('Erro ao gerar pergunta:', error);
            res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.end(JSON.stringify({ error: 'Erro no servidor', details: error.message }));
            return;
        }
    }

    // Enviar todas as perguntas geradas
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify(perguntasGeradas));
}


// Criando o servidor HTTP
const server = http.createServer((req, res) => {
    // Tratando preflight requests (solicitações OPTIONS)
    if (req.method === 'OPTIONS') {
        res.writeHead(204, { 
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/gerarPergunta') {
        parseRequestBody(req, body => {
            gerarPerguntaHandler(req, res, body);
        });
    } else if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Servidor está funcionando');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Rota não encontrada');
    }
});

// Iniciando o servidor
server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
