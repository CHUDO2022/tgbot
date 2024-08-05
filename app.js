document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    const tabs = document.querySelectorAll('.tab-button');
    const items = document.querySelectorAll('.item');
    const telegram = window.Telegram.WebApp;
    const userInfo = document.getElementById('user-info');
    const homeBtn = document.getElementById('home-btn');
    const mainContent = document.getElementById('main-content');
    const statsBtn = document.getElementById('stats-btn');
    const orderPage = document.getElementById('order-page');
    const orderImg = document.getElementById('order-img');
    const orderText = document.getElementById('order-text');
    const inviteTitle = document.querySelector('.invite-title');
    const inviteText = document.querySelector('.invite-text');

    // Адаптация темы интерфейса под профиль пользователя в Telegram
    const themeParams = telegram.themeParams;
    document.documentElement.style.setProperty('--background-color', themeParams.bg_color || '#232e3c');
    document.documentElement.style.setProperty('--card-background-color', themeParams.secondary_bg_color || '#17212b');
    document.documentElement.style.setProperty('--button-background-color', themeParams.button_color || '#232e3c');
    document.documentElement.style.setProperty('--text-color', themeParams.text_color || '#ffffff');
    document.documentElement.style.setProperty('--highlight-color', themeParams.link_color || '#007aff');
    document.documentElement.style.setProperty('--close-button-color', themeParams.button_text_color || '#ff3b30');
    document.documentElement.style.setProperty('--invite-text-color', themeParams.text_color || '#000000'); // Цвет текста для кнопки "Зови друзей"

    // Изменение цвета текста кнопки "Зови друзей"
    inviteTitle.style.color = themeParams.text_color || '#000000';
    inviteText.style.color = themeParams.text_color || '#000000';

    homeBtn.addEventListener('click', () => {
        mainContent.classList.remove('hidden');
        orderPage.classList.add('hidden');
        homeBtn.classList.add('hidden');
    });

    statsBtn.addEventListener('click', () => {
        fetch('https://5945-31-8-241-75.ngrok-free.app/get-log', {
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
            const productImg = document.getElementById(`img${productId}`).src; // Получаем ссылку на изображение товара
            const message = `Вы выбрали такой товар №${productId}`;

            // Логирование на сервер перед переходом
            const data = { productId: productId, message: message, query_id: telegram.initDataUnsafe.query_id };
            fetch('https://5945-31-8-241-75.ngrok-free.app/webapp-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Ответ от сервера:', data);

                // После успешного логирования выполняем переход на страницу оформления заказа
                window.location.href = `order.html?product_id=${productId}&product_img=${encodeURIComponent(productImg)}`;
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

        let profName = document.createElement('p'); // создаем параграф
        profName.innerText = `${user.first_name} ${user.last_name || ''} (${user.username || ''}) [${user.language_code || ''}]`;
        userInfo.appendChild(profName); // добавляем

        let userid = document.createElement('p'); // создаем еще параграф
        userid.innerText = `ID: ${user.id}`; // показываем user_id
        userInfo.appendChild(userid); // добавляем

        userInfo.innerHTML = `
            <img src="https://cdn-icons-png.flaticon.com/512/149/149452.png" alt="User Icon">
            <span>
                <span class="username">${user.first_name} ${user.last_name || ''}</span>
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
        fetch('https://5945-31-8-241-75.ngrok-free.app/user-data', {
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
                <span class="username">${profileData.first_name} ${profileData.last_name || ''}</span>
                <span class="status">Новичок</span>
            </span>
        `;
    });

    // Логика переключения вкладок и отображения соответствующих карточек товаров
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetCategory = tab.getAttribute('data-tab');

            // Скрываем все карточки и показываем только те, которые соответствуют выбранной категории
            items.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                if (itemCategory === targetCategory) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });

            // Обновляем активную вкладку
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // Изначально показываем карточки первой вкладки
    tabs[0].click();
});
