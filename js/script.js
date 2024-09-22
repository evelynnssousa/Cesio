const palavras = [
    'AMBULATORIOS', 'CESIO', 'HOSPITAIS', 'NEUTRON', 'RADIOSOTOPOS', 
    'CHUMBO', 'FERRO', 'ISOTOPOS', 'POTASSIO', 'CAPSULA', 
    'GAMA', 'NUCLEAR', 'RADIACAO'
];

let palavrasEncontradas = 0; // Contador de palavras encontradas
let palavrasColocadas = []; // Lista de palavras que foram corretamente colocadas na grid
const gridSize = 12;  // Tamanho do tabuleiro

function toggleMenu() {
    const nav = document.querySelector('nav');
    nav.classList.toggle('active');
}

function createGrid() {
    const grid = document.getElementById('word-search');
    grid.innerHTML = ''; // Limpa o conteúdo

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const gridArray = Array(gridSize * gridSize).fill(''); // Cria um array vazio para a grid

    // Função para verificar se a palavra pode ser posicionada sem colisões
    function canPlaceWord(word, startRow, startCol, direction) {
        let row = startRow;
        let col = startCol;

        for (let i = 0; i < word.length; i++) {
            if (row >= gridSize || col >= gridSize || (gridArray[row * gridSize + col] !== '' && gridArray[row * gridSize + col] !== word[i])) {
                return false; // Palavra não cabe ou colisão com uma letra diferente
            }
            if (direction === 'horizontal') col++;
            if (direction === 'vertical') row++;
            if (direction === 'diagonal') { row++; col++; }
        }
        return true;
    }

    // Função para posicionar palavras na grade
    function placeWord(word) {
        const directions = ['horizontal', 'vertical', 'diagonal'];
        let placed = false;

        for (let attempts = 0; attempts < 100 && !placed; attempts++) {
            const direction = directions[Math.floor(Math.random() * directions.length)];
            let startRow = Math.floor(Math.random() * gridSize);
            let startCol = Math.floor(Math.random() * gridSize);

            if (direction === 'horizontal' && startCol + word.length <= gridSize && canPlaceWord(word, startRow, startCol, 'horizontal')) {
                for (let i = 0; i < word.length; i++) {
                    gridArray[startRow * gridSize + startCol + i] = word[i];
                }
                placed = true;
            } else if (direction === 'vertical' && startRow + word.length <= gridSize && canPlaceWord(word, startRow, startCol, 'vertical')) {
                for (let i = 0; i < word.length; i++) {
                    gridArray[(startRow + i) * gridSize + startCol] = word[i];
                }
                placed = true;
            } else if (direction === 'diagonal' && startRow + word.length <= gridSize && startCol + word.length <= gridSize && canPlaceWord(word, startRow, startCol, 'diagonal')) {
                for (let i = 0; i < word.length; i++) {
                    gridArray[(startRow + i) * gridSize + startCol + i] = word[i];
                }
                placed = true;
            }
        }

        if (placed) {
            palavrasColocadas.push(word); // Somente adiciona a palavra na lista se ela foi colocada
        } else {
            console.error(`Não foi possível colocar a palavra: ${word}`);
        }
    }

    // Posiciona cada palavra da lista, sem repetir ou sobrescrever incorretamente
    palavras.forEach(word => placeWord(word));

    // Preenche o restante da grid com letras aleatórias
    for (let i = 0; i < gridArray.length; i++) {
        if (gridArray[i] === '') {
            gridArray[i] = letters[Math.floor(Math.random() * letters.length)];
        }
    }

    // Cria os blocos do grid no HTML
    const gridDiv = document.createElement('div');
    gridDiv.className = 'grid';
    gridArray.forEach((letter) => {
        const div = document.createElement('div');
        div.textContent = letter;
        div.addEventListener('click', selectLetter);
        gridDiv.appendChild(div);
    });
    grid.appendChild(gridDiv);
}

let selectedLetters = [];

function selectLetter(event) {
    const letter = event.target;
    const letterPosition = Array.prototype.indexOf.call(letter.parentNode.children, letter);

    if (selectedLetters.includes(letterPosition)) {
        // Se a letra já está selecionada, desmarcá-la
        letter.classList.remove('selected');
        letter.style.backgroundColor = ''; // Volta ao estado original
        selectedLetters = selectedLetters.filter(index => index !== letterPosition); // Remove da lista de selecionadas
    } else {
        // Se a letra ainda não está selecionada, marcá-la
        letter.classList.add('selected');
        letter.style.backgroundColor = 'yellow'; // Marca como selecionada
        letter.style.transition = 'background-color 0.3s ease'; // Adiciona transição suave
        selectedLetters.push(letterPosition); // Adiciona à lista de selecionadas
    }

    checkWord(); // Verifica se a palavra foi formada
}

function checkWord() {
    const selectedWord = selectedLetters.map(index => document.querySelectorAll('.grid div')[index].textContent).join('');

    // Permite a verificação da palavra mesmo que as letras estejam fora de ordem
    const sortedSelectedWord = selectedWord.split('').sort().join('');
    const palavrasPossiveis = palavrasColocadas.map(palavra => palavra.split('').sort().join(''));

    if (palavrasPossiveis.includes(sortedSelectedWord)) {
        selectedLetters.forEach(index => {
            const letterDiv = document.querySelectorAll('.grid div')[index];
            letterDiv.classList.add('found');
            letterDiv.style.backgroundColor = 'green'; 
            letterDiv.style.transition = 'background-color 0.5s ease'; // Transição suave para verde
        });
        riscarPalavra(selectedWord); // Riscar a palavra encontrada
        selectedLetters = [];
        palavrasEncontradas++;

        if (palavrasEncontradas === palavrasColocadas.length) {
            setTimeout(() => {
                alert("Parabéns! Você encontrou todas as palavras!");
            }, 300);
        }
    } else {
        // Se a palavra ainda não estiver completa, mantém as letras amarelas
        selectedLetters.forEach(index => {
            const letterDiv = document.querySelectorAll('.grid div')[index];
            letterDiv.style.backgroundColor = 'yellow';
        });
    }
}

// Função para riscar a palavra na lista de palavras encontradas
function riscarPalavra(palavra) {
    const palavraLi = document.querySelector(`#word-list li[data-palavra="${palavra}"]`);
    if (palavraLi) {
        palavraLi.style.textDecoration = 'line-through'; // Adiciona o risco
    }
}

function createWordList() {
    const wordList = document.getElementById('word-list');
    const ul = document.createElement('ul');
    palavrasColocadas.forEach(palavra => {
        const li = document.createElement('li');
        li.textContent = palavra.charAt(0) + palavra.slice(1).toLowerCase(); // Formata a palavra
        li.setAttribute('data-palavra', palavra); // Adiciona um atributo para referência
        ul.appendChild(li);
    });
    wordList.appendChild(ul);
}

createGrid();
createWordList();
