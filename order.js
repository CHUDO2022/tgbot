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
    if (!telegramUser || !telegramUser.id) {
        alert('Ошибка: не удалось получить данные пользователя.');
        console.error('Данные пользователя:', telegramUser);
        return;
    }

    // Обновляем UI с данными продукта
    const productName = document.getElementById('product-name');
    const productPrice = document.getElementById('product-price');
    const productOldPrice = document.getElementById('product-old-price');
    const productDescription = document.getElementById('product-description');
    const stockStatus = document.getElementById('stock-status');

    if (productName) productName.textContent = productData.name;
    if (productPrice) productPrice.textContent = `${productData.price} ₽`;
    if (productOldPrice && productData.old_price) {
        productOldPrice.textContent = `${productData.old_price} ₽`;
    }
    if (productDescription) productDescription.textContent = productData.description;

    // Проверка наличия товара
    if (productData.in_stock === 'Да') {
        stockStatus.textContent = 'В наличии';
        stockStatus.classList.add('in-stock');
    } else {
        stockStatus.textContent = 'Нет в наличии';
        stockStatus.classList.add('out-of-stock');
    }

    // Инициализация слайдера изображений
    function initializeImageSlider(images) {
        const sliderContainer = document.getElementById('image-slider');
        const imageElement = document.createElement('img');
        imageElement.src = images.length > 0 ? images[0] : 'https://via.placeholder.com/600x300';
        imageElement.alt = 'Product Image';
        imageElement.onerror = () => {
            imageElement.src = 'https://via.placeholder.com/600x300';
        };

        let currentIndex = 0;

        // Функция для обновления изображения
        function updateImage(index) {
            if (index >= 0 && index < images.length) {
                imageElement.src = images[index];
            }
        }

        // Добавляем кнопки навигации
        const prevButton = document.getElementById('prev-slide');
        const nextButton = document.getElementById('next-slide');

        prevButton.onclick = () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateImage(currentIndex);
        };

        nextButton.onclick = () => {
            currentIndex = (currentIndex + 1) % images.length;
            updateImage(currentIndex);
        };

        sliderContainer.appendChild(imageElement);
    }

    // Инициализация слайдера
    initializeImageSlider(productData.images || []);

    // Обработчик кнопки "Перейти к оплате"
    const payButton = document.getElementById('pay-button');
    payButton.onclick = () => {
        const fullName = document.getElementById("full-name").value;
        const phoneNumber = document.getElementById("phone-number").value;
        const email = document.getElementById("email").value;

        const selectedOptions = {
            color: document.querySelector('.color-option.selected')?.getAttribute('data-value')?.toLowerCase(),
            memory: document.querySelector('.memory-option.selected')?.textContent.toLowerCase(),
            connectivity: document.querySelector('.connectivity-option.selected')?.textContent.toLowerCase(),
        };

        if (!fullName || !phoneNumber || !email) {
            alert('Пожалуйста, заполните все поля формы.');
            return;
        }

        const orderData = {
            product_id: productData.id,
            selectedOptions,
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
                alert('Заказ успешно оформлен!');
                window.location.href = "https://t.me/QSale_iphone_bot";
            } else {
                alert(`Ошибка при отправке заказа: ${data.message}`);
            }
        })
        .catch(error => {
            alert('Произошла ошибка при отправке заказа. Попробуйте снова.');
            console.error('Error:', error);
        });
    };

    // Закрытие модального окна
    const closeButton = document.getElementById('close-button');
    closeButton.onclick = () => {
        window.Telegram.WebApp.close();
    };
});
