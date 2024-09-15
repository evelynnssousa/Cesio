(function () {
    'use strict';

    var $form = document.querySelector('[data-js="form"]');
    var $search = document.querySelector('[data-js="search"]');
    var $tbody = document.querySelector('[data-js="tbody"]');

    var letters = [
        // Atualize a matriz de letras com as novas palavras
        ['a', 'm', 'b', 'u', 'l', 'a', 't', 'o', 'r', 'i', 'o', 's'],
        ['c', 'e', 's', 'i', 'o', 'x', 'z', 'u', 'h', 'l', 'm', 'n'],
        ['h', 'o', 's', 'p', 'i', 't', 'a', 'i', 's', 'a', 'e', 'o'],
        ['n', 'e', 'u', 't', 'r', 'o', 'n', 'y', 'w', 'g', 'u', 'r'],
        ['r', 'a', 'd', 'i', 'o', 's', 'o', 't', 'o', 'p', 'o', 's'],
        ['d', 'e', 'u', 'r', 'a', 'n', 'i', 'o', 'u', 'i', 'q', 's'],
        ['c', 'h', 'u', 'm', 'b', 'o', 'k', 'c', 'z', 'v', 'f', 'p'],
        ['f', 'e', 'r', 'r', 'o', 'b', 'l', 'm', 's', 'd', 'o', 't'],
        ['i', 's', 'o', 't', 'o', 'p', 'o', 's', 'l', 'c', 'x', 'o'],
        ['p', 'o', 't', 'a', 's', 's', 'i', 'o', 'e', 'r', 'j', 'l'],
        ['c', 'a', 'p', 's', 'u', 'l', 'a', 'b', 'h', 'r', 'g', 'v'],
        ['g', 'a', 'm', 'a', 'x', 't', 'y', 'u', 'v', 'm', 'k', 'p']
    ];

    var indexes = [
        // Atualize os índices para as novas palavras
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9], [0, 10], [0, 11]], // ambulatórios
        [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4]], // césio
        [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7]], // hospitais
        [[3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5]], // nêutron
        [[4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8], [4, 9]], // radiosótopos de urânio
        [[6, 0], [6, 1], [6, 2], [6, 3], [6, 4]], // chumbo
        [[7, 0], [7, 1], [7, 2], [7, 3], [7, 4]], // ferro
        [[8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 6]], // isótopos
        [[9, 0], [9, 1], [9, 2], [9, 3], [9, 4], [9, 5], [9, 6]], // potássio
        [[10, 0], [10, 1], [10, 2], [10, 3], [10, 4], [10, 5], [10, 6]], // cápsula
        [[11, 0], [11, 1], [11, 2], [11, 3]], // gama
        [[11, 7], [11, 8], [11, 9], [11, 10], [11, 11]], // nuclear
        [[4, 0], [4, 1], [4, 2], [4, 3]] // radiação
    ];

    var gameWords = ['ambulatórios', 'césio', 'hospitais', 'nêutron', 'radiosótopos de urânio', 'chumbo', 'ferro', 'isótopos', 'potássio', 'cápsula', 'gama', 'nuclear', 'radiação'];

    letters.map(function (item, index) {
        var line = document.createElement('tr');
        line.setAttribute('data-js', 'line' + index);
        $tbody.appendChild(line);
        letters[index].forEach(function (letter) {
            line.insertAdjacentHTML('beforeend', '<td>' + letter + '</td>');
        });
    });

    // Seleção de palavras com mouse ou toque
    var selectedCells = [];
    var isMouseDown = false;

    document.body.style.userSelect = 'none';

    function clearSelection() {
        selectedCells.forEach(function (cell) {
            cell.classList.remove('color');
        });
        selectedCells = [];
    }

    function checkIfWordSelected() {
        var selectedIndexes = selectedCells.map(function (cell) {
            var line = Array.prototype.indexOf.call(cell.parentElement.parentElement.children, cell.parentElement);
            var column = Array.prototype.indexOf.call(cell.parentElement.children, cell);
            return [line, column];
        });

        return indexes.some(function (wordIndexes) {
            return JSON.stringify(wordIndexes) === JSON.stringify(selectedIndexes);
        });
    }

    function handleMouseDown(event) {
        isMouseDown = true;
        selectCell(event.target);
    }

    function handleMouseMove(event) {
        if (isMouseDown) {
            selectCell(event.target);
        }
    }

    function handleMouseUp() {
        isMouseDown = false;
        if (checkIfWordSelected()) {
            selectedCells.forEach(function (cell) {
                cell.classList.add('selected'); // Mantém a palavra marcada
            });
        } else {
            clearSelection(); // Limpa se estiver errada
        }
    }

    function selectCell(cell) {
        if (cell.tagName === 'TD' && !cell.classList.contains('selected')) {
            cell.classList.add('color');
            selectedCells.push(cell);
        }
    }

    $tbody.addEventListener('mousedown', handleMouseDown);
    $tbody.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    $tbody.addEventListener('touchstart', function (event) {
        selectCell(event.targetTouches[0].target);
    });

    $tbody.addEventListener('touchmove', function (event) {
        selectCell(event.targetTouches[0].target);
    });

    $tbody.addEventListener('touchend', function () {
        if (checkIfWordSelected()) {
            selectedCells.forEach(function (cell) {
                cell.classList.add('selected');
            });
        } else {
            clearSelection();
        }
    });

})();
