document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productData = JSON.parse(urlParams.get('product_data'));
    const telegramUser = JSON.parse(localStorage.getItem('telegramUser'));

    // Проверка наличия данных о продукте и пользователе
    if (!productData || !telegramUser) {
        alert("Ошибка: нет данных о продукте или пользователе.");
        return;
    }

    // Элементы слайдера и данных
    const imageSlider = document.getElementById('image-slider');
    const imageDots = document.getElementById('image-dots');
    const reviewsSlider = document.getElementById('reviews-slider');
    const reviewsDots = document.getElementById('reviews-dots');
    const images = productData.images || [];
    const reviews = productData.reviews || [];
    let currentImageIndex = 0;
    let currentReviewIndex = 0;

    // Функция обновления слайдера
    function updateSlider(slider, dots, items, currentIndex) {
        slider.innerHTML = `<img src="${items[currentIndex]}" class="slider-img">`;
        dots.innerHTML = items.map((_, index) =>
            `<div class="dot ${index === currentIndex ? 'active' : ''}" data-index="${index}"></div>`
        ).join('');
    }

    // Обработчик кликов по точкам
    function addDotClickHandler(dots, updateFunction) {
        dots.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-index');
            if (index !== null) {
                updateFunction(parseInt(index, 10));
            }
        });
    }

    // Функции обновления изображений и отзывов
    function updateImage(index) {
        currentImageIndex = index;
        updateSlider(imageSlider, imageDots, images, currentImageIndex);
    }

    function updateReview(index) {
        currentReviewIndex = index;
        updateSlider(reviewsSlider, reviewsDots, reviews, currentReviewIndex);
    }

    // Инициализация слайдеров
    updateImage(0);
    updateReview(0);
    addDotClickHandler(imageDots, updateImage);
    addDotClickHandler(reviewsDots, updateReview);

    // Заполнение информации о продукте
    document.getElementById('product-name').textContent = productData.name;
    document.getElementById('product-price').textContent = `${productData.price} ₽`;
    document.getElementById('product-description').textContent = productData.description;

    // Обработка кнопки "Перейти к оплате"
    const payButton = document.getElementById('pay-button');
    const modal = document.getElementById("modal");

    payButton.addEventListener('click', () => {
        if (!modal) {
            alert("Модальное окно не найдено.");
            return;
        }
        modal.style.display = "block";
    });

    // Закрытие модального окна
    document.querySelector(".close").addEventListener('click', () => {
        modal.style.display = "none";
    });

    // Обработка отправки формы
    document.getElementById("user-form").addEventListener("submit", (event) => {
        event.preventDefault();

        const fullName = document.getElementById("full-name").value;
        const phoneNumber = document.getElementById("phone-number").value;
        const email = document.getElementById("email").value;

        const orderData = {
            product_id: productData.id,
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
                alert(`Ошибка при отправке заказа: ${data.message}`);
            }
        })
        .catch(error => {
            alert("Произошла ошибка при отправке заказа.");
            console.error('Ошибка:', error);
        });
    });
});
