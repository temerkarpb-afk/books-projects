const bookMap = {
    'math-1': 'img3.webp', 'math-2': 'img4.webp', 'math-3': 'img5.webp', 'math-4': 'img6.webp', 'math-5': 'img7.webp', 'math-6': 'img8.webp', 'math-7': 'img9.webp', 'math-8': 'img10.webp', 'math-9': 'img11.webp', 'math-10': 'img12.webp', 'math-11': 'img13.webp',
    'rus-1': 'img14.webp', 'rus-2': 'img15.webp', 'rus-3': 'img16.webp', 'rus-4': 'img17.webp', 'rus-5': 'img18.webp', 'rus-6': 'img19.webp', 'rus-7': 'img20.webp', 'rus-8': 'img21.webp', 'rus-9': 'img22.webp', 'rus-10': 'img23.webp', 'rus-11': 'img24.webp',
    'eng-1': 'img25.webp', 'eng-2': 'img26.webp', 'eng-3': 'img27.webp', 'eng-4': 'img28.webp', 'eng-5': 'img29.webp', 'eng-6': 'img30.webp', 'eng-7': 'img31.webp', 'eng-8': 'img32.webp', 'eng-9': 'img33.webp', 'eng-10': 'img34.webp', 'eng-11': 'img35.webp'
};

const INITIAL_QUESTIONS = [
    { q: "12 + 8 * 2 равно...", opts: ["40", "28", "32"], a: "28" },
    { q: "Как переводится 'Library'?", opts: ["Школа", "Библиотека", "Магазин"], a: "Библиотека" },
    { q: "Квадратный корень из 144", opts: ["12", "14", "16"], a: "12" }
];

let isLoggedIn = false;
let extraBooks = JSON.parse(localStorage.getItem('addedBooks')) || [];
let dynamicTests = JSON.parse(localStorage.getItem('customTests')) || INITIAL_QUESTIONS;

// Функция открытия учебника
window.openBook = (title, img) => {
    const viewer = document.getElementById('book-display');
    document.getElementById('book-image').src = img;
    document.getElementById('current-class-title').textContent = title;
    viewer.style.display = 'block';
    viewer.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

// Базовые кнопки
document.querySelectorAll('.class-selector button').forEach(btn => {
    btn.onclick = () => {
        const id = btn.id;
        if (bookMap[id]) openBook(btn.dataset.class, bookMap[id]);
    };
});

// Поиск
document.getElementById('searchInput').oninput = function() {
    let val = this.value.toLowerCase().trim();
    document.querySelectorAll('.subject-card').forEach(card => {
        let text = card.querySelector('h3').innerText.toLowerCase();
        card.style.display = text.includes(val) ? "block" : "none";
    });
};

// Авторизация
const loginModal = document.getElementById('loginModal');
document.getElementById('loginTrigger').onclick = () => {
    if (!isLoggedIn) loginModal.style.display = 'flex';
    else {
        isLoggedIn = false;
        document.getElementById('loginTrigger').innerHTML = "<i class='bx bx-user-circle'></i> <span>Войти</span>";
        document.getElementById('adminPanel').classList.remove('active');
    }
};

document.getElementById('loginForm').onsubmit = (e) => {
    e.preventDefault();
    if (document.getElementById('username').value === 'admin' && document.getElementById('password').value === '123') {
        isLoggedIn = true;
        document.getElementById('loginTrigger').innerHTML = "<i class='bx bx-log-out-circle'></i> <span>Выйти</span>";
        loginModal.style.display = 'none';
        document.getElementById('loginForm').reset();
    } else {
        document.getElementById('errorMessage').textContent = 'Ошибка входа';
    }
};

// Тесты
document.getElementById('openTestModal').onclick = () => {
    document.getElementById('testModal').style.display = 'flex';
    const container = document.getElementById('testContainer');
    container.innerHTML = dynamicTests.map((q, i) => `
        <div class="test-item">
            <p>${i+1}. ${q.q}</p>
            ${q.opts.map(o => `<label style="display:block; margin:8px 0; cursor:pointer;"><input type="radio" name="q${i}" value="${o}"> ${o}</label>`).join('')}
        </div>
    `).join('');
};

document.getElementById('submitTest').onclick = () => {
    let score = 0;
    dynamicTests.forEach((q, i) => {
        const sel = document.querySelector(`input[name="q${i}"]:checked`);
        if (sel && sel.value === q.a) score++;
    });
    alert(`Результат: ${score} из ${dynamicTests.length}`);
    document.getElementById('testModal').style.display = 'none';
};

// Админка
const adminPanel = document.getElementById('adminPanel');
document.getElementById('adminBurger').onclick = () => {
    if (isLoggedIn) {
        adminPanel.classList.toggle('active');
        renderAdminList();
        updateStats();
    } else alert('Войдите как админ!');
};

function updateStats() {
    if(document.getElementById('statBooks')) document.getElementById('statBooks').textContent = extraBooks.length + 33;
    if(document.getElementById('statTests')) document.getElementById('statTests').textContent = dynamicTests.length;
}

// Добавление книги
document.getElementById('addBookBtn').onclick = () => {
    const name = document.getElementById('bookName').value;
    const imgUrl = document.getElementById('bookImg').value;
    const subject = document.getElementById('bookSubject').value;

    if (name && imgUrl) {
        extraBooks.push({ name, imgUrl, subject, id: Date.now() });
        localStorage.setItem('addedBooks', JSON.stringify(extraBooks));
        document.getElementById('bookName').value = '';
        document.getElementById('bookImg').value = '';
        renderAdminList();
        renderInPlace();
        updateStats();
    }
};

// Добавление вопроса
document.getElementById('addTestBtn').onclick = () => {
    const q = document.getElementById('testQ').value;
    const a = document.getElementById('testA').value;
    const w1 = document.getElementById('testW1').value;
    const w2 = document.getElementById('testW2').value;

    if (q && a && w1 && w2) {
        const opts = [a, w1, w2, "Вариант не указан"].sort(() => Math.random() - 0.5);
        dynamicTests.push({ q, opts, a });
        localStorage.setItem('customTests', JSON.stringify(dynamicTests));
        document.getElementById('testQ').value = '';
        document.getElementById('testA').value = '';
        document.getElementById('testW1').value = '';
        document.getElementById('testW2').value = '';
        updateStats();
        alert("Вопрос добавлен!");
    }
};

// Отрисовка в сетках (Математика, Русский, Английский, Доп)
function renderInPlace() {
    document.querySelectorAll('.extra-btn').forEach(b => b.remove());

    extraBooks.forEach(book => {
        const container = document.getElementById(`${book.subject}-container`);
        if (container) {
            const btn = document.createElement('button');
            btn.className = 'extra-btn';
            btn.innerHTML = `<i class='bx bx-book-add'></i>`;
            btn.title = book.name;
            btn.onclick = () => openBook(book.name, book.imgUrl);
            container.appendChild(btn);
        }
    });
}

function renderAdminList() {
    const list = document.getElementById('bookList');
    if(list) {
        list.innerHTML = extraBooks.map(book => `
            <li><span>${book.name} (${book.subject})</span><button class="del-btn" onclick="deleteBook(${book.id})"><i class='bx bx-trash'></i></button></li>
        `).join('');
    }
}

window.deleteBook = (id) => {
    extraBooks = extraBooks.filter(b => b.id !== id);
    localStorage.setItem('addedBooks', JSON.stringify(extraBooks));
    renderAdminList();
    renderInPlace();
    updateStats();
};

document.querySelectorAll('.close-modal, .close-test, .close-admin').forEach(btn => {
    btn.onclick = () => {
        loginModal.style.display = 'none';
        document.getElementById('testModal').style.display = 'none';
        adminPanel.classList.remove('active');
    }
});

// Запуск
renderInPlace();
updateStats();
