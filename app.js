document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const tabs = document.querySelectorAll('.tab-button');
    const modalTabButtons = document.querySelectorAll('.modal-tab-button');
    const moreCategoriesBtn = document.getElementById('more-categories-btn');
    const moreCategoriesModal = document.getElementById('more-categories-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
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
    const searchInput = document.querySelector('.search-bar input');
    const autoCompleteList = document.createElement('ul');
    autoCompleteList.className = 'autocomplete-list';
    document.querySelector('.search-bar').appendChild(autoCompleteList);

    let productNames = [];  // Массив для хранения названий товаров

    // Адаптация темы интерфейса под профиль пользователя в Telegram
    const themeParams = telegram.themeParams;
    document.documentElement.style.setProperty('--background-color', themeParams.bg_color || '#232e3c');
    document.documentElement.style.setProperty('--card-background-color', themeParams.secondary_bg_color || '#17212b');
    document.documentElement.style.setProperty('--button-background-color', themeParams.button_color || '#232e3c');
    document.documentElement.style.setProperty('--text-color', themeParams.text_color || '#ffffff');
    document.documentElement.style.setProperty('--highlight-color', themeParams.link_color || '#007aff');
    document.documentElement.style.setProperty('--close-button-color', themeParams.button_text_color || '#ff3b30');
    document.documentElement.style.setProperty('--invite-text-color', themeParams.text_color || '#000000');

    // Изменение цвета текста кнопки "Зови друзей"
    inviteTitle.style.color = themeParams.text_color || '#000000';
    inviteText.style.color = themeParams.text_color || '#000000';

    homeBtn.addEventListener('click', () => {
        mainContent.classList.remove('hidden');
        orderPage.classList.add('hidden');
        homeBtn.classList.add('hidden');
    });

    statsBtn.addEventListener('click', () => {
        fetch('https://gadgetmark.ru/get-log', {
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

    // Функция для загрузки продуктов с сервера
    function loadProducts() {
        fetch('https://gadgetmark.ru/get-products')
            .then(response => response.json())
            .then(data => {
                const products = data.products;
                productNames = products.map(product => product.name); // Сохраняем названия товаров

                // Создаем карточки для всех продуктов
                products.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.classList.add('item');
                    productCard.setAttribute('data-category', product.category);
                    productCard.dataset.colors = JSON.stringify(product.colors || []);
                    productCard.dataset.memory = JSON.stringify(product.memory || []);
                    productCard.dataset.connectivity = JSON.stringify(product.connectivity || []);
                    productCard.dataset.description = product.description;  // Сохраняем описание в атрибуте

                    // HTML для карточки товара
                    productCard.innerHTML = `
                        <img src="${product.image}" alt="${product.name}" class="img">
                        <div class="product-info">
                            <h3>${product.name}</h3>
                            <p class="price">Цена: ${product.price} ₽</p>
                            ${product.old_price ? `<p class="old-price">Старая цена: <s>${product.old_price} ₽</s></p>` : ''}
                            <button class="btn" id="btn${product.id}">Добавить</button>
                        </div>
                    `;

                    // Добавление карточки товара в контейнер
                    productList.appendChild(productCard);
                });

                // Обновляем обработчики событий на новых кнопках "Добавить"
                attachButtonEvents();

                // Изначально показываем товары первой вкладки
                showCategory('tab1');
            })
            .catch(error => console.error('Ошибка при получении данных:', error));
    }

    // Функция для отображения товаров определенной категории
    function showCategory(category) {
        const items = document.querySelectorAll('.item');
        items.forEach(item => {
            if (item.getAttribute('data-category') === category) {
                item.style.display = 'block';  // показываем товары из выбранной категории
            } else {
                item.style.display = 'none';  // скрываем товары из других категорий
            }
        });
    }

    // Функция для отображения автодополнения
    function showAutoComplete(text) {
        const matches = productNames.filter(name => name.toLowerCase().startsWith(text.toLowerCase()));
        autoCompleteList.innerHTML = '';
        matches.forEach(match => {
            const li = document.createElement('li');
            li.textContent = match;
            li.addEventListener('click', () => {
                searchInput.value = match;
                autoCompleteList.innerHTML = '';  // Очищаем список после выбора
                searchInput.value = '';  // Очищаем поле поиска после выбора
                searchProducts();  // Вызываем функцию поиска товаров
            });
            autoCompleteList.appendChild(li);
        });
    }

    // Функция для поиска товаров и отображения автодополнения
    function searchProducts() {
        const searchText = searchInput.value.toLowerCase();
        const items = document.querySelectorAll('.item');
        items.forEach(item => {
            const productName = item.querySelector('h3').textContent.toLowerCase();
            if (productName.includes(searchText)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
        if (searchText.length > 0) {
            showAutoComplete(searchText);
        } else {
            autoCompleteList.innerHTML = '';  // Очищаем список, если поле ввода пусто
        }
    }

    // Закрытие списка автодополнения при клике вне поля поиска
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.search-bar')) {
            autoCompleteList.innerHTML = '';  // Очищаем список при клике вне поля поиска
        }
    });

    // Обработчики для кнопок "Добавить"
    function attachButtonEvents() {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.id.replace('btn', '');
                const productCard = document.querySelector(`#btn${productId}`).closest('.item');
                const productImg = productCard.querySelector('img').src;
                const productName = productCard.querySelector('h3').textContent;
                const productPrice = parseFloat(productCard.querySelector('.price').textContent.replace('Цена: ', '').replace(' ₽', ''));
                const productOldPrice = productCard.querySelector('.old-price') ? parseFloat(productCard.querySelector('.old-price').textContent.replace('Старая цена: ', '').replace(' ₽', '')) : '';
                const productDescription = productCard.dataset.description;  // Получаем описание

                const product = {
                    id: parseInt(productId, 10),  // Преобразуем productId в число
                    image: productImg,
                    name: productName,
                    price: productPrice,
                    old_price: productOldPrice,
                    description: productDescription,  // Добавляем описание в объект
                    colors: productCard.dataset.colors ? JSON.parse(productCard.dataset.colors) : [],
                    memory: productCard.dataset.memory ? JSON.parse(productCard.dataset.memory) : [],
                    connectivity: productCard.dataset.connectivity ? JSON.parse(productCard.dataset.connectivity) : []
                };

                // Переход на страницу оформления заказа с передачей данных через URL
                window.location.href = `order.html?product_data=${encodeURIComponent(JSON.stringify(product))}`;
            });
        });
    }

    // Обработчик кликов по вкладкам
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetCategory = tab.getAttribute('data-tab');

            // Убираем класс активной вкладки у всех и добавляем к текущей
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Показать товары соответствующей категории
            showCategory(targetCategory);
        });
    });

    // Открытие и закрытие модального окна
    moreCategoriesBtn.addEventListener('click', () => {
        moreCategoriesModal.classList.remove('hidden');
        moreCategoriesModal.style.display = 'block';
    });

    closeModalBtn.addEventListener('click', () => {
        moreCategoriesModal.classList.add('hidden');
        moreCategoriesModal.style.display = 'none';
    });

    modalTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetCategory = button.getAttribute('data-tab');

            // Закрываем модальное окно
            moreCategoriesModal.classList.add('hidden');
            moreCategoriesModal.style.display = 'none';

            // Показать товары соответствующей категории
            showCategory(targetCategory);

            // Обновляем активную вкладку (но не в верхней навигации, чтобы логика осталась простой)
            tabs.forEach(t => t.classList.remove('active'));
        });
    });

    // Изначально показываем карточки первой вкладки
    tabs[0].click();

    // Загрузка товаров при инициализации страницы
    loadProducts();

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

        // Сохранение данных пользователя в localStorage для использования на других страницах
        localStorage.setItem('telegramUser', JSON.stringify(user));

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
        fetch('https://gadgetmark.ru/user-data', {
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

    // Обработчик для ввода в строку поиска
    searchInput.addEventListener('input', searchProducts);

    // Загрузка товаров при инициализации страницы
    loadProducts();
});
