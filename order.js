document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productData = JSON.parse(urlParams.get('product_data'));
    const telegramUser = JSON.parse(localStorage.getItem('telegramUser'));

    // Проверка данных товара и пользователя
    console.log("Инициализация страницы...");
    console.log("Данные товара:", productData);
    console.log("Данные пользователя из localStorage:", telegramUser);

    if (!productData) {
        alert("Ошибка: нет данных о продукте.");
        console.error("Нет данных о продукте.");
        return;
    }

    if (!telegramUser) {
        alert("Ошибка: данные пользователя отсутствуют.");
        console.error("Данные пользователя отсутствуют в localStorage.");
        return;
    }

    if (!telegramUser.id) {
        alert("Ошибка: user_id отсутствует.");
        console.error("user_id отсутствует в данных пользователя:", telegramUser);
        return;
    }

    const imageSlider = document.getElementById('image-slider');
    const reviewsSlider = document.getElementById('reviews-slider');
    const images = productData.images || [];
    const reviews = productData.reviews || [];
    let currentImageIndex = 0;
    let currentReviewIndex = 0;
    let startX = 0;
    let currentX = 0;

    // Функция для обновления слайдера изображений товара
    function updateImageSlider() {
        imageSlider.innerHTML = `<img src="${images[currentImageIndex]}" class="slider-img">`;
    }

    updateImageSlider();

    // Обработчики свайпа для слайдера изображений товара
    imageSlider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    imageSlider.addEventListener('touchmove', (e) => {
        currentX = e.touches[0].clientX;
    });

    imageSlider.addEventListener('touchend', () => {
        const swipeDistance = currentX - startX;
        const swipeThreshold = 50;

        if (swipeDistance > swipeThreshold) {
            currentImageIndex = (currentImageIndex === 0) ? images.length - 1 : currentImageIndex - 1;
        } else if (swipeDistance < -swipeThreshold) {
            currentImageIndex = (currentImageIndex === images.length - 1) ? 0 : currentImageIndex + 1;
        }

        updateImageSlider();
    });

    // Функция для обновления слайдера отзывов
    function updateReviewsSlider() {
        if (reviews.length === 0) {
            reviewsSlider.innerHTML = `<p>Отзывы отсутствуют</p>`;
        } else {
            reviewsSlider.innerHTML = `<img src="${reviews[currentReviewIndex]}" class="slider-img">`;
        }
    }

    updateReviewsSlider();

    // Обработчики свайпа для слайдера отзывов
    reviewsSlider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    reviewsSlider.addEventListener('touchmove', (e) => {
        currentX = e.touches[0].clientX;
    });

    reviewsSlider.addEventListener('touchend', () => {
        const swipeDistance = currentX - startX;
        const swipeThreshold = 50;

        if (swipeDistance > swipeThreshold) {
            currentReviewIndex = (currentReviewIndex === 0) ? reviews.length - 1 : currentReviewIndex - 1;
        } else if (swipeDistance < -swipeThreshold) {
            currentReviewIndex = (currentReviewIndex === reviews.length - 1) ? 0 : currentReviewIndex + 1;
        }

        updateReviewsSlider();
    });

    // Заполняем информацию о продукте
    document.getElementById('product-name').textContent = productData.name;
    document.getElementById('product-price').textContent = `${productData.price} ₽`;
    document.getElementById('product-description').textContent = productData.description;
    document.getElementById('stock-status').textContent = productData.in_stock === 'Да' ? 'В наличии' : 'Нет в наличии';

    // Открытие модального окна при нажатии на "Перейти к оплате"
    const payButton = document.getElementById('pay-button');
    const modal = document.getElementById('user-modal');
    const closeModal = document.querySelector('.close-modal');

    payButton.addEventListener('click', () => {
        console.log("Кнопка 'Перейти к оплате' нажата");
        console.log("Данные пользователя перед отправкой:", telegramUser);
        modal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Обработка отправки формы
    const form = document.getElementById('user-form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const fullName = document.getElementById('full-name').value;
        const phoneNumber = document.getElementById('phone-number').value;
        const email = document.getElementById('email').value;

        const orderData = {
            product_id: productData.id,
            user_id: telegramUser.id,
            user_data: {
                full_name: fullName,
                phone_number: phoneNumber,
                email: email,
                username: telegramUser.username
            }
        };

        // Проверка перед отправкой
        console.log("Данные заказа перед отправкой:", orderData);

        if (!orderData.user_id) {
            alert("Ошибка: user_id отсутствует.");
            console.error("user_id отсутствует в данных заказа:", orderData);
            return;
        }

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
                alert("Заказ успешно отправлен!");
                window.location.href = "https://t.me/QSale_iphone_bot";
            } else {
                alert(`Ошибка при отправке заказа: ${data.message}`);
                console.error("Ответ сервера:", data);
            }
        })
        .catch(error => {
            alert("Произошла ошибка при отправке заказа.");
            console.error('Ошибка при отправке:', error);
        });
    });
});
