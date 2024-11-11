document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productData = JSON.parse(urlParams.get('product_data'));

    // Проверка наличия данных о продукте
    if (!productData) {
        alert("Ошибка: нет данных о продукте.");
        return;
    }

    // Извлечение данных пользователя из localStorage
    const telegramUser = JSON.parse(localStorage.getItem('telegramUser'));

    // Проверка наличия данных пользователя
    if (!telegramUser) {
        console.error("Данные пользователя не найдены.");
        return;
    }

    // Обновляем UI с данными продукта
    const productImg = document.getElementById('product-img');
    const productName = document.getElementById('product-name');
    const productPrice = document.getElementById('product-price');
    const productOldPrice = document.getElementById('product-old-price');
    const productDescription = document.getElementById('product-description');

    // Установка данных о продукте в UI
    if (productImg && productData.image) {
        console.log('URL изображения:', productData.image);
        productImg.src = productData.image;
        productImg.onerror = () => {
            productImg.src = 'https://via.placeholder.com/600x300'; // Заглушка на случай ошибки загрузки
            console.error('Ошибка загрузки изображения, заменяем на заглушку.');
        };
    } else {
        console.error('Ссылка на изображение отсутствует или некорректна.');
        productImg.src = 'https://via.placeholder.com/600x300'; // Заглушка, если ссылка отсутствует
    }

    if (productName) productName.textContent = productData.name;
    if (productPrice) productPrice.textContent = `${productData.price} ₽`;
    if (productOldPrice && productData.old_price) {
        productOldPrice.textContent = `${productData.old_price} ₽`;
    }
    if (productDescription) productDescription.textContent = productData.description;

    // Функция для настройки опций
    const setupOptions = (containerId, options, className, useBackgroundColor = false) => {
        const container = document.getElementById(containerId);
        if (container && options) {
            options.forEach(option => {
                const div = document.createElement('div');
                div.className = className;
                if (useBackgroundColor) {
                    div.style.backgroundColor = option.toLowerCase();
                    div.setAttribute('data-value', option);
                } else {
                    div.textContent = option;
                }
                div.addEventListener('click', () => {
                    container.querySelectorAll(`.${className}`).forEach(opt => opt.classList.remove('selected'));
                    div.classList.add('selected');
                });
                container.appendChild(div);
            });
        }
    };

    // Настройка опций для цвета, памяти и связи
    setupOptions('color-options', productData.colors, 'color-option', true);
    setupOptions('memory-options', productData.memory, 'memory-option');
    setupOptions('connectivity-options', productData.connectivity, 'connectivity-option');

    // Модальные окна и обработка ошибок
    const modal = document.getElementById("modal");
    const btn = document.getElementById("pay-button");
    const span = document.querySelector(".close");

    const optionCheckModal = document.getElementById("option-check-modal");
    const closeOptionCheckBtn = document.getElementById("close-option-check-button");
    const closeOptionCheckSpan = document.querySelector(".close-option-check");

    // Функция показа модального окна проверки опций
    function showOptionCheckModal(message) {
        document.getElementById("option-check-message").textContent = message;
        optionCheckModal.style.display = "block";
    }

    closeOptionCheckBtn.onclick = () => optionCheckModal.style.display = "none";
    closeOptionCheckSpan.onclick = () => optionCheckModal.style.display = "none";

    // Закрытие модальных окон при клике вне их области
    window.onclick = event => {
        if (event.target === optionCheckModal) {
            optionCheckModal.style.display = "none";
        } else if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    // Обработчик кнопки "Перейти к оплате"
    btn.onclick = () => {
        const selectedOptions = {
            color: document.querySelector('.color-option.selected')?.getAttribute('data-value')?.toLowerCase(),
            memory: document.querySelector('.memory-option.selected')?.textContent.toLowerCase(),
            connectivity: document.querySelector('.connectivity-option.selected')?.textContent.toLowerCase(),
        };

        if (!selectedOptions.color || !selectedOptions.memory || !selectedOptions.connectivity) {
            showOptionCheckModal('Пожалуйста, выберите все опции товара перед отправкой заказа.');
        } else {
            modal.style.display = "block";
        }
    };

    // Обработчик отправки формы заказа
    document.getElementById("user-form").addEventListener("submit", function(event) {
        event.preventDefault();

        const fullName = document.getElementById("full-name").value;
        const phoneNumber = document.getElementById("phone-number").value;
        const email = document.getElementById("email").value;

        const orderData = {
            product_id: productData.id,
            selectedOptions: {
                color: document.querySelector('.color-option.selected')?.getAttribute('data-value')?.toLowerCase(),
                memory: document.querySelector('.memory-option.selected')?.textContent.toLowerCase(),
                connectivity: document.querySelector('.connectivity-option.selected')?.textContent.toLowerCase(),
            },
            user_data: {
                user_id: telegramUser.id,
                full_name: fullName,
                phone_number: phoneNumber,
                email: email,
                username: telegramUser.username
            }
        };

        // Отправка данных заказа на сервер
        fetch('https://gadgetmark.ru/validate-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                modal.style.display = "none";
                window.location.href = "https://t.me/QSale_iphone_bot";
            } else {
                showOptionCheckModal(data.message);
            }
        })
        .catch(error => {
            showOptionCheckModal('Произошла ошибка при обработке заказа. Пожалуйста, попробуйте снова.');
            console.error('Error:', error);
        });
    });
});
