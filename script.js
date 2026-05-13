let attempts = 0;
const MAX_ATTEMPTS = 3;
let correctOrder = [1, 2, 3, 4]; // правильный порядок картинок

// Создаём кусочки капчи
function initCaptcha() {
    const puzzle = document.getElementById('captcha-puzzle');
    const pool = document.getElementById('captcha-pool');
    puzzle.innerHTML = '';
    pool.innerHTML = '';

    // Перемешиваем
    let pieces = [1,2,3,4].sort(() => Math.random() - 0.5);
    
    pieces.forEach(num => {
        const div = document.createElement('div');
        div.className = 'piece';
        div.draggable = true;
        div.dataset.id = num;
        div.style.backgroundImage = `url(images/${num}.png)`;
        
        // drag events
        div.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text', div.dataset.id);
            div.classList.add('dragging');
        });
        div.addEventListener('dragend', () => div.classList.remove('dragging'));
        
        pool.appendChild(div);
    });

    // drop zones в puzzle
    for (let i = 0; i < 4; i++) {
        const slot = document.createElement('div');
        slot.className = 'piece';
        slot.style.backgroundColor = '#eee';
        slot.dataset.position = i;
        
        slot.addEventListener('dragover', e => e.preventDefault());
        slot.addEventListener('drop', e => {
            e.preventDefault();
            const id = e.dataTransfer.getData('text');
            const piece = document.querySelector(`.piece[data-id="${id}"]`);
            if (piece) {
                slot.style.backgroundImage = piece.style.backgroundImage;
                slot.dataset.id = id;
                piece.remove();
            }
        });
        
        puzzle.appendChild(slot);
    }
}

// Проверка капчи
function checkCaptcha() {
    const slots = document.querySelectorAll('#captcha-puzzle .piece');
    const currentOrder = Array.from(slots).map(slot => parseInt(slot.dataset.id));
    
    const isCorrect = currentOrder.every((val, idx) => val === correctOrder[idx]);

    if (isCorrect) {
        document.getElementById('message').innerHTML = 
            '<span style="color:green">Капча пройдена! Вход выполнен.</span>';
    } else {
        attempts++;
        document.getElementById('message').innerHTML = 
            `<span style="color:red">Неверный порядок! Попытка ${attempts}/${MAX_ATTEMPTS}</span>`;
        
        if (attempts >= MAX_ATTEMPTS) {
            document.querySelector('button').disabled = true;
            document.getElementById('message').innerHTML += '<br><strong>Аккаунт заблокирован</strong>';
        } else {
            initCaptcha(); // новая капча
        }
    }
}

// Запуск
window.onload = initCaptcha;
