document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    const userCard = document.getElementById('usercard');
    const telegram = window.Telegram.WebApp;
    const userInfo = document.getElementById('user-info');
    const userFooter = document.getElementById('user-footer');

    const homeBtn = document.getElementById('home-btn');
    const profileBtn = document.getElementById('profile-btn');
    const statsBtn = document.getElementById('stats-btn');
    const mainContent = document.getElementById('main-content');
    const profileContent = document.getElementById('profile-content');
    const statsContent = document.getElementById('stats-content');
    const profileInfo = document.getElementById('profile-info');
    const statsInfo = document.getElementById('stats-info');

    const secondBotToken = '7307212089:AAGGDLqhcmGXldUeulbkXOvGAyCl17iuCB4';  // Замените на токен второго бота
    const secondBotUrl = `https://api.telegram.org/bot${secondBotToken}/sendMessage`;
    const chatId = '698266175';  // Замените на ваш chat_id

    // Функция для обновления статистики в localStorage
    function updateProductStatistics(productId) {
        const productStatistics = JSON.parse(localStorage.getItem('productStatistics')) || {};
        if (productStatistics[productId]) {
            productStatistics[productId]++;
        } else {
            productStatistics[productId] = 1;
        }
        localStorage.setItem('productStatistics', JSON.stringify(productStatistics));
    }

    // Функция для отправки статистики второму боту
    function sendStatisticsToSecondBot() {
        const productStatistics = JSON.parse(localStorage.getItem('productStatistics')) || {};
        const message = Object.entries(productStatistics).map(([productId, count]) => `Товар ${productId}: ${count} переходов`).join('\n');
        
        fetch(secondBotUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message
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

    // Функция для отображения статистики
    function displayStatistics() {
        const productStatistics = JSON.parse(localStorage.getItem('productStatistics')) || {};
        statsInfo.innerHTML = '';
        for (const [productId, count] of Object.entries(productStatistics)) {
            const statItem = document.createElement('p');
            statItem.innerText = `Товар ${productId}: ${count} переходов`;
            statsInfo.appendChild(statItem);
        }
    }

    homeBtn.addEventListener('click', () => {
        mainContent.classList.remove('hidden');
        profileContent.classList.add('hidden');
        statsContent.classList.add('hidden');
    });

    profileBtn.addEventListener('click', () => {
        mainContent.classList.add('hidden');
        profileContent.classList.remove('hidden');
        statsContent.classList.add('hidden');
    });

    statsBtn.addEventListener('click', () => {
        mainContent.classList.add('hidden');
        profileContent.classList.add('hidden');
        statsContent.classList.remove('hidden');
        displayStatistics();
        sendStatisticsToSecondBot();
    });

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.id.replace('btn', ''); // Извлекаем номер товара из id кнопки
            const message = `Вы выбрали такой товар №${productId}`;
            userCard.textContent = message;

            // Обновляем статистику переходов
            updateProductStatistics(productId);

            // Отправляем данные в Telegram бот
            const data = { productId: productId, message: message, query_id: telegram.initDataUnsafe.query_id };
            telegram.sendData(JSON.stringify(data));

            // Для отладки выводим данные в консоль
            console.log('Отправленные данные:', data);
        });
    });

    const closeBtn = document.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        telegram.close();
    });

    // Получаем данные о пользователе из Telegram Web Apps API
    const initDataUnsafe = telegram.initDataUnsafe;
    console.log('initDataUnsafe:', initDataUnsafe);  // Отладочный вывод
    
    const user = initDataUnsafe.user;

    if (user) {
        console.log('Данные пользователя:', user); // Отладочный вывод

        let profName = document.createElement('p'); //создаем параграф
        profName.innerText = `${user.first_name} ${user.last_name || ''} (${user.username || ''}) [${user.language_code || ''}]`;
        userCard.appendChild(profName); //добавляем 

        let userid = document.createElement('p'); //создаем еще параграф 
        userid.innerText = `ID: ${user.id}`; //показываем user_id
        userCard.appendChild(userid); //добавляем

        userInfo.innerHTML = `
            <img src="https://cdn-icons-png.flaticon.com/512/149/149452.png" alt="User Icon">
            <span>
                <span class="username">${user.first_name}</span>
                <span class="status">Новичок</span>
            </span>
        `;

        // Отправляем данные пользователя в Telegram бот
        const userData = {
            action: 'get_user_data',
            user_id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            phone_number: initDataUnsafe.user.phone_number || '',  // Проверка наличия номера телефона
            query_id: telegram.initDataUnsafe.query_id
        };
        telegram.sendData(JSON.stringify(userData));
        console.log('Отправленные данные пользователя:', userData); // Отладочный вывод

        // Отображаем имя пользователя внизу страницы
        userFooter.innerText = `Пользователь: ${user.first_name} ${user.last_name || ''} (${user.username || ''})`;
    } else {
        console.log('Нет данных пользователя'); // Отладочный вывод
    }

    // Получаем данные из Telegram бота
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
