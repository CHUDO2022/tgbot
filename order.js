document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productData = JSON.parse(urlParams.get('product_data'));
    const telegramUser = JSON.parse(localStorage.getItem('telegramUser'));

    if (!productData || !telegramUser) {
        alert("Ошибка: отсутствуют данные о продукте или пользователе.");
        return;
    }

    // Элементы слайдера
    const imageSlider = document.getElementById('image-slider');
    const reviewsSlider = document.getElementById('reviews-slider');
    const dotsContainer = document.getElementById('dots-container');
    const reviewDotsContainer = document.getElementById('review-dots-container');
    const images = productData.images || [];
    const reviews = productData.reviews || [];
    let currentImageIndex = 0;
    let currentReviewIndex = 0;

    // Функция для обновления слайдера изображений
    function updateImageSlider() {
        imageSlider.innerHTML = `<img src="${images[currentImageIndex]}" class="slider-img">`;
        updateDots(dotsContainer, images, currentImageIndex);
    }

    // Функция для обновления слайдера отзывов
    function updateReviewsSlider() {
        reviewsSlider.innerHTML = `<img src="${reviews[currentReviewIndex]}" class="slider-img">`;
        updateDots(reviewDotsContainer, reviews, currentReviewIndex);
    }

    // Функция для обновления точек
    function updateDots(container, items, activeIndex) {
        container.innerHTML = '';
        items.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = 'dot';
            if (index === activeIndex) dot.classList.add('active');
            container.appendChild(dot);
        });
    }

    // Обработчики для кликов по изображению
    imageSlider.addEventListener('click', (event) => {
        const clickX = event.clientX - imageSlider.getBoundingClientRect().left;
        const halfWidth = imageSlider.clientWidth / 2;
        if (clickX < halfWidth) {
            currentImageIndex = (currentImageIndex === 0) ? images.length - 1 : currentImageIndex - 1;
        } else {
            currentImageIndex = (currentImageIndex + 1) % images.length;
        }
        updateImageSlider();
    });

    // Обработчики для кликов по отзывам
    reviewsSlider.addEventListener('click', (event) => {
        const clickX = event.clientX - reviewsSlider.getBoundingClientRect().left;
        const halfWidth = reviewsSlider.clientWidth / 2;
        if (clickX < halfWidth) {
            currentReviewIndex = (currentReviewIndex === 0) ? reviews.length - 1 : currentReviewIndex - 1;
        } else {
            currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
        }
        updateReviewsSlider();
    });

    // Инициализация слайдеров
    updateImageSlider();
    updateReviewsSlider();

    // Обновление информации о продукте
    document.getElementById('product-name').textContent = productData.name;
    document.getElementById('product-price').textContent = `${productData.price} ₽`;
    document.getElementById('product-description').textContent = productData.description;

    // Обработка кнопки "Перейти к оплате"
    const payButton = document.getElementById('pay-button');
    const modal = document.getElementById('modal');

    payButton.addEventListener('click', () => {
        modal.style.display = "block";
    });

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
            console.error('Error:', error);
        });
    });
});
