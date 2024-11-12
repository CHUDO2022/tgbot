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
        alert("Ошибка: нет данных о пользователе.");
        return;
    }

    // Обновляем UI с данными продукта
    const productName = document.getElementById('product-name');
    const productPrice = document.getElementById('product-price');
    const productOldPrice = document.getElementById('product-old-price');
    const productDescription = document.getElementById('product-description');
    const stockStatus = document.getElementById('stock-status');

    // Установка данных о продукте в UI
    productName.textContent = productData.name;
    productPrice.textContent = `${productData.price} ₽`;
    productOldPrice.textContent = productData.old_price ? `Старая цена: ${productData.old_price} ₽` : '';
    productDescription.textContent = productData.description;
    stockStatus.textContent = productData.in_stock === 'Да' ? 'В наличии' : 'Нет в наличии';

    // Создаём слайдер изображений
    const sliderContainer = document.getElementById('image-slider');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    let currentImageIndex = 0;
    const images = productData.images || [];

    // Функция для обновления изображения в слайдере
    function updateSlider() {
        if (images.length > 0) {
            sliderContainer.src = images[currentImageIndex];
        } else {
            sliderContainer.src = 'https://via.placeholder.com/600x300'; // Заглушка, если изображения отсутствуют
        }
    }

    // Обработчики кнопок слайдера
    prevBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateSlider();
    });

    nextBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateSlider();
    });

    // Инициализируем слайдер
    updateSlider();

    // Обработчик отправки формы заказа
    const orderForm = document.getElementById('user-form');
    orderForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const fullName = document.getElementById('full-name').value;
        const phoneNumber = document.getElementById('phone-number').value;
        const email = document.getElementById('email').value;

        // Проверка заполнения полей
        if (!fullName || !phoneNumber || !email) {
            alert('Пожалуйста, заполните все поля.');
            return;
        }

        // Данные заказа
        const orderData = {
            product_id: productData.id,
            selectedOptions: {
                color: productData.colors?.[0] || 'Не выбран',
                memory: productData.memory?.[0] || 'Не выбрано',
                connectivity: productData.connectivity?.[0] || 'Не выбрано',
            },
            user_data: {
                user_id: telegramUser.id,
                full_name: fullName,
                phone_number: phoneNumber,
                email: email,
                username: telegramUser.username || ''
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
            if (data.status === 'success') {
                alert('Заказ успешно оформлен!');
                window.location.href = 'https://t.me/QSale_iphone_bot';
            } else {
                alert(`Ошибка при отправке заказа: ${data.message}`);
            }
        })
        .catch(error => {
            alert('Произошла ошибка при обработке заказа. Пожалуйста, попробуйте снова.');
            console.error('Error:', error);
        });
    });
});
