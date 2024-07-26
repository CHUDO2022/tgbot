document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    const userCard = document.getElementById('usercard');
    const telegram = window.Telegram.WebApp;
    const userInfo = document.getElementById('user-info');
    const homeBtn = document.getElementById('home-btn');
    const mainContent = document.getElementById('main-content');
    const statsBtn = document.getElementById('stats-btn');
    const orderPage = document.getElementById('order-page');

    homeBtn.addEventListener('click', () => {
        mainContent.classList.remove('hidden');
        orderPage.classList.add('hidden');
    });

    statsBtn.addEventListener('click', () => {
        fetch('https://57e9-178-129-118-231.ngrok-free.app/get-log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Log file sent to Telegram successfully");
            } else {
                alert("Error sending log file: " + data.message);
            }
        })
        .catch(error => {
            console.error('Ошибка при получении файла:', error);
        });
    });

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.id.replace('btn', ''); // Извлекаем номер товара из id кнопки
            const message = `Вы выбрали такой товар №${productId}`;
            userCard.textContent = message;

            // Переход на страницу оформления заказа
            mainContent.classList.add('hidden');
            orderPage.classList.remove('hidden');

            // Отправляем данные на сервер
            const data = { productId: productId, message: message, query_id: telegram.initDataUnsafe.query_id };
            fetch('https://57e9-178-129-118-231.ngrok-free.app/webapp-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Ответ от сервера:', data);
            })
            .catch(error => {
                console.error('Ошибка:', error);
            });

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

        // Проверка наличия пользователя в списке разрешенных для кнопки "Статистика"
        const allowedUsers = [698266175, 6039728055, 408985787]; // Здесь укажите ID пользователей, которым доступна кнопка
        if (allowedUsers.includes(user.id)) {
            statsBtn.style.display = 'block'; // Показываем кнопку "Статистика"
        } else {
            statsBtn.style.display = 'none'; // Скрываем кнопку "Статистика"
        }

        // Отправляем данные пользователя на сервер
        const userData = {
            action: 'get_user_data',
            user_id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            phone_number: initDataUnsafe.user.phone_number || '',  // Проверка наличия номера телефона
            query_id: telegram.initDataUnsafe.query_id
        };
        fetch('https://57e9-178-129-118-231.ngrok-free.app/user-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Ответ от сервера:', data);
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });

        console.log('Отправленные данные пользователя:', userData); // Отладочный вывод
    } else {
        console.log('Нет данных пользователя'); // Отладочный вывод
    }

    // Получаем данные из Telegram бота
    telegram.onEvent('web_app_data', function(data) {
        const profileData = JSON.parse(data);
        console.log('Получены данные профиля:', profileData); // Отладочный вывод
        userInfo.innerHTML = `
            <img src="https://cdn-icons-png.flaticon.com/512/149/149452.png" alt="User Icon">
            <span>
                <span class="username">${profileData.first_name}</span>
                <span class="status">Новичок</span>
            </span>
        `;
    });
});
