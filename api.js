import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const apiKey = process.env.GOOGLE_API_KEY || 'AIzaSyD81j@GY-Q3gSEPngXHGSBqWBihn3Wtb_Y';

app.post('/gerarPergunta', async (req, res) => {
    const { dificuldade, tema } = req.body;

    const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

    try {
        console.log(`Recebido: dificuldade = ${dificuldade}, tema = ${tema}`);

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                prompt: {
                    text: `Gere uma pergunta sobre o tema ${tema} com dificuldade ${dificuldade}, 4 alternativas de resposta, e uma explicação da correta.`
                }
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Resposta da API recebida:", data);

            if (data.candidates && data.candidates[0]) {
                const perguntaTexto = data.candidates[0].text;

                // Processando a pergunta
                const pergunta = perguntaTexto.split('Alternativas:')[0].trim();
                const alternativasTexto = perguntaTexto.split('Alternativas:')[1].split('Explicação:')[0].trim();
                const alternativas = alternativasTexto.split('\n');
                const explicacao = perguntaTexto.split('Explicação:')[1].trim();

                return res.json({
                    pergunta,
                    alternativas,
                    explicacao
                });
            } else {
                throw new Error('Resposta inválida da API: candidatos não encontrados');
            }
        } else {
            console.error('Erro na API do Google:', response.statusText);
            return res.status(500).json({ error: 'Erro na API do Google', details: response.statusText });
        }
    } catch (error) {
        console.error('Erro no servidor:', error.message);
        return res.status(500).json({ error: 'Erro no servidor', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

app.get('/', (req, res) => {
    res.send('Servidor está funcionando');
});

