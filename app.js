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

    const secondBotToken = '7307212089:AAGGDLqhcmGXldUeulbkXOvGAyCl17iuCB4';
    const secondBotUrl = `https://api.telegram.org/bot${secondBotToken}/sendDocument`;

    // Список разрешенных user ID для доступа к кнопке статистики
    const allowedUserIds = ['698266175', '987654321']; // Замените на ваши user ID

    // Инициализация базы данных
    let db;
    const request = indexedDB.open('ProductStatisticsDB', 1);

    request.onerror = (event) => {
        console.error('Ошибка при открытии базы данных', event);
    };

    request.onsuccess = (event) => {
        db = event.target.result;
    };

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        const objectStore = db.createObjectStore('productStatistics', { keyPath: 'userId' });
        objectStore.createIndex('productId', 'productId', { unique: false });
    };

    // Функция для обновления статистики
    function updateProductStatistics(productId, userId, username) {
        const transaction = db.transaction(['productStatistics'], 'readwrite');
        const objectStore = transaction.objectStore('productStatistics');

        objectStore.get(userId).onsuccess = (event) => {
            const userStatistics = event.target.result || { userId: userId, stats: {} };

            if (userStatistics.stats[productId]) {
                userStatistics.stats[productId].count++;
            } else {
                userStatistics.stats[productId] = { count: 1, username: username };
            }

            objectStore.put(userStatistics);
        };
    }

    // Функция для создания текстового файла со статистикой
    function createStatisticsFile() {
        const transaction = db.transaction(['productStatistics'], 'readonly');
        const objectStore = transaction.objectStore('productStatistics');
        const request = objectStore.getAll();

        request.onsuccess = () => {
            const productStatistics = request.result;
            let fileContent = 'Статистика переходов:\n';
            
            productStatistics.forEach(userStats => {
                for (const [productId, data] of Object.entries(userStats.stats)) {
                    fileContent += `Пользователь ${data.username || 'undefined'} (ID: ${userStats.userId}), Товар ${productId}: ${data.count} переходов\n`;
                }
            });

            const blob = new Blob([fileContent], { type: 'text/plain' });
            const file = new File([blob], 'statistics.txt', { type: 'text/plain' });
            sendStatisticsToSecondBot(file);
        };
    }

    // Функция для отправки текстового файла второму боту
    function sendStatisticsToSecondBot(file) {
        const formData = new FormData();
        formData.append('chat_id', '698266175'); // Замените 'YOUR_CHAT_ID' на актуальный chat_id
        formData.append('document', file);

        fetch(secondBotUrl, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                console.log('Статистика отправлена второму боту:', data);
            } else {
                console.error('Ошибка при отправке статистики второму боту:', data);
            }
        })
        .catch(error => {
            console.error('Ошибка при отправке статистики второму боту:', error);
        });
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
        createStatisticsFile();
    });

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.id.replace('btn', ''); // Извлекаем номер товара из id кнопки
            const message = `Вы выбрали такой товар №${productId}`;
            userCard.textContent = message;

            // Получаем данные пользователя
            const user = telegram.initDataUnsafe.user;

            if (user) {
                // Обновляем статистику переходов
                updateProductStatistics(productId, user.id, user.username);

                // Отправляем данные в Telegram бот
                const data = { productId: productId, message: message, query_id: telegram.initDataUnsafe.query_id };
                telegram.sendData(JSON.stringify(data));
                // Для отладки выводим данные в консоль
                console.log('Отправленные данные:', data);
            }
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

        // Проверяем, имеет ли пользователь доступ к кнопке статистики
        if (allowedUserIds.includes(String(user.id))) {
            statsBtn.style.display = 'block'; // Показываем кнопку статистики, если пользователь в списке разрешенных
        } else {
            statsBtn.style.display = 'none'; // Скрываем кнопку статистики, если пользователь не в списке разрешенных
        }
    } else {
        console.log('Нет данных пользователя'); // Отладочный вывод
        statsBtn.style.display = 'none'; // Скрываем кнопку статистики, если нет данных пользователя
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
