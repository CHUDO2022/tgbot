document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    const userCard = document.getElementById('usercard');
    const telegram = window.Telegram.WebApp;
    const userInfo = document.getElementById('user-info');
    const userFooter = document.getElementById('user-footer');

    const homeBtn = document.getElementById('home-btn');
    const profileBtn = document.getElementById('profile-btn');
    const mainContent = document.getElementById('main-content');
    const profileContent = document.getElementById('profile-content');
    const statsContent = document.getElementById('stats-content');
    const profileInfo = document.getElementById('profile-info');
    const statsInfo = document.getElementById('stats-info');

    const secondBotToken = '7307212089:AAGGDLqhcmGXldUeulbkXOvGAyCl17iuCB4';  // Замените на токен второго бота
    const secondBotUrl = `https://api.telegram.org/bot${secondBotToken}/sendMessage`;

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

    // Функция для отправки статистики второму боту
    function sendStatisticsToSecondBot(productId) {
        const message = {
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            user_id: user.id,
            product_id: productId
        };

        fetch(secondBotUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: '698266175',  // Замените на ваш chat_id
                text: JSON.stringify(message)
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Статистика отправлена второму боту:', data);
        })
        .catch(error => {
            console.error('Ошибка при отправке статистики второму боту:', error);
        });
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.id.replace('btn', ''); // Извлекаем номер товара из id кнопки
            const message = `Вы выбрали такой товар №${productId}`;
            userCard.textContent = message;

            // Отправка данных второму боту
            sendStatisticsToSecondBot(productId);

            // Для отладки выводим данные в консоль
            console.log('Выбранный товар:', productId);
        });
    });

    const closeBtn = document.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        telegram.close();
    });

    // Обработчик события получения данных из Telegram бота
    telegram.onEvent('web_app_data', function(data) {
        const profileData = JSON.parse(data);
        console.log('Получены данные профиля:', profileData); // Отладочный вывод
        profileInfo.innerHTML = `
            <p>Имя: ${profileData.first_name} ${profileData.last_name}</p>
            <p>Username: ${profileData.username}</p>
            <p>Phone: ${profileData.phone_number}</p>
            <p>ID: ${profileData.user_id}</p>
        `;
        userInfo.innerHTML = `
            <img src="https://cdn-icons-png.flaticon.com/512/149/149452.png" alt="User Icon">
            <span>
                <span class="username">${profileData.first_name}</span>
                <span class="status">Новичок</span>
            </span>
        `;
    });
});
