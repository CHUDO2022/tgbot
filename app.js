document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    const userCard = document.getElementById('usercard');
    const telegram = window.Telegram.WebApp;
    const userInfo = document.getElementById('user-info');

    const apiUrl = 'http://YOUR_SERVER_IP:5000/log';  // Замените на URL вашего сервера

    const user = telegram.initDataUnsafe?.user || null;

    // Проверка и инициализация Telegram Web Apps SDK
    if (!user) {
        console.error("Telegram Web Apps SDK не инициализирован. Проверьте правильность инициализации.");
        return;
    }

    console.log('Данные пользователя:', user);

    // Отображение данных пользователя
    let profName = document.createElement('p');
    profName.innerText = `${user.first_name} ${user.last_name || ''} (${user.username || ''}) [${user.language_code || ''}]`;
    userCard.appendChild(profName);

    let userid = document.createElement('p');
    userid.innerText = `ID: ${user.id}`;
    userCard.appendChild(userid);

    userInfo.innerHTML = `
        <img src="https://cdn-icons-png.flaticon.com/512/149/149452.png" alt="User Icon">
        <span>
            <span class="username">${user.first_name}</span>
            <span class="status">Новичок</span>
        </span>
    `;

    // Функция для отправки статистики на сервер
    function sendStatisticsToServer(productId) {
        const data = {
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            user_id: user.id,
            product_id: productId
        };

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Статистика отправлена на сервер:', data);
        })
        .catch(error => {
            console.error('Ошибка при отправке статистики на сервер:', error);
        });
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.id.replace('btn', ''); // Извлекаем номер товара из id кнопки
            sendStatisticsToServer(productId);
        });
    });
});
