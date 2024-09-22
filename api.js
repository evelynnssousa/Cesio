import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Inicializando a instância do GoogleGenerativeAI com a chave de API
const apiKey = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI({ apiKey });
const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"})

app.post('/gerarPergunta', async (req, res) => {
    const { dificuldade, tema } = req.body;

    // Montando o prompt
    const promptText = `Gere uma pergunta sobre o tema ${tema} com dificuldade ${dificuldade}, 4 alternativas de resposta, e uma explicação da correta. Retorne no formato JSON com a seguinte estrutura:
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
        console.log(`Recebido: dificuldade = ${dificuldade}, tema = ${tema}`);

        const response = await model.generateContent({
            prompt: promptText,
            maxTokens: 100, 
        });

        console.log('Resposta da API:', response); // Logando a resposta da API

        if (response && response.text) {
            const perguntaTexto = response.text;

            // Supondo que a resposta da API esteja em JSON
            const resultadoJSON = JSON.parse(perguntaTexto);

            return res.json({
                pergunta: resultadoJSON.question,
                alternativas: resultadoJSON.answers.map(alt => alt.Text),
                explicacao: resultadoJSON.explicacao
            });
        } else {
            throw new Error('Resposta inválida da API');
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
