<script>
// script.js
let attempts = 0;
const MAX_ATTEMPTS = 3;
const correctOrder = [1, 2, 3, 4]; // правильный порядок картинок

function initCaptcha() {
    const puzzle = document.getElementById('captcha-puzzle');
    const pool = document.getElementById('captcha-pool');
    
    puzzle.innerHTML = '';
    pool.innerHTML = '';

    // Перемешиваем кусочки
    let pieces = [1, 2, 3, 4].sort(() => Math.random() - 0.5);

    // Создаём кусочки в пул
    pieces.forEach(num => {
        const piece = createPiece(num);
        pool.appendChild(piece);
    });

    // Создаём 4 слота в пазле
    for (let i = 0; i < 4; i++) {
        const slot = document.createElement('div');
        slot.className = 'piece slot';
        slot.dataset.position = i;
        slot.style.backgroundColor = '#f0f0f0';
        slot.style.border = '2px dashed #aaa';

        // Drag & Drop события для слота
        slot.addEventListener('dragover', e => e.preventDefault());
        slot.addEventListener('drop', handleDrop);

        puzzle.appendChild(slot);
    }
}

function createPiece(num) {
    const piece = document.createElement('div');
    piece.className = 'piece';
    piece.draggable = true;
    piece.dataset.id = num;
    piece.style.backgroundImage = `url(images/${num}.png)`;
    piece.style.backgroundSize = 'cover';

    piece.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', piece.dataset.id);
        piece.classList.add('dragging');
    });

    piece.addEventListener('dragend', () => {
        piece.classList.remove('dragging');
    });

    return piece;
}

function handleDrop(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const draggedPiece = document.querySelector(`.piece[data-id="${id}"]`);
    if (!draggedPiece) return;

    const slot = e.currentTarget;

    // Если в слоте уже есть картинка — меняем местами
    if (slot.dataset.id) {
        const existingId = slot.dataset.id;
        const existingPiece = document.querySelector(`.piece[data-id="${existingId}"]`);
        
        // Возвращаем старую картинку обратно в пул
        if (existingPiece) {
            document.getElementById('captcha-pool').appendChild(existingPiece);
        }
    }

    // Ставим новую картинку в слот
    slot.style.backgroundImage = draggedPiece.style.backgroundImage;
    slot.style.backgroundSize = 'cover';
    slot.style.border = '2px solid #4CAF50';
    slot.dataset.id = id;

    // Удаляем перетащенную картинку из пула
    draggedPiece.remove();
}

// Проверка капчи
function checkCaptcha() {
    const slots = document.querySelectorAll('#captcha-puzzle .slot');
    const userOrder = Array.from(slots).map(slot => parseInt(slot.dataset.id || 0));

    const isCorrect = userOrder.every((val, index) => val === correctOrder[index]);

    const message = document.getElementById('message');

    if (isCorrect) {
        message.innerHTML = '<span style="color: green; font-size: 18px;">✅ Капча пройдена успешно!</span>';
        message.style.background = '#d4edda';
    } else {
        attempts++;
        message.innerHTML = `<span style="color: red;">❌ Неверный порядок! Попытка ${attempts}/${MAX_ATTEMPTS}</span>`;

        if (attempts >= MAX_ATTEMPTS) {
            document.querySelector('button').disabled = true;
            message.innerHTML += '<br><strong>Аккаунт временно заблокирован</strong>';
        } else {
            setTimeout(initCaptcha, 800); // новая капча
        }
    }
}

// Запуск при загрузке
window.onload = initCaptcha;
</script>
