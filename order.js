document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productData = JSON.parse(urlParams.get('product_data'));

    if (!productData) {
        alert("Нет данных о продукте в URL");
        return;
    }

    const telegramUser = JSON.parse(localStorage.getItem('telegramUser'));

    if (!telegramUser) {
        alert("Данные пользователя не найдены.");
        return;
    }

    const imageSlider = document.getElementById('image-slider');
    const reviewsSlider = document.getElementById('reviews-slider');
    const dotsContainer = document.getElementById('dots-container');
    const reviewDotsContainer = document.getElementById('review-dots-container');
    const images = productData.images || [];
    const reviews = productData.reviews || [];
    let currentImageIndex = 0;
    let currentReviewIndex = 0;

    // Функция обновления слайдера изображений
    function updateImageSlider() {
        if (images.length > 0) {
            imageSlider.innerHTML = `<img src="${images[currentImageIndex]}" class="slider-img">`;
            updateDots(dotsContainer, images.length, currentImageIndex);
        } else {
            imageSlider.innerHTML = `<p>Изображения отсутствуют</p>`;
        }
    }

    // Функция обновления слайдера отзывов
    function updateReviewsSlider() {
        if (reviews.length > 0) {
            reviewsSlider.innerHTML = `<img src="${reviews[currentReviewIndex]}" class="slider-img">`;
            updateDots(reviewDotsContainer, reviews.length, currentReviewIndex);
        } else {
            reviewsSlider.innerHTML = `<p>Отзывы отсутствуют</p>`;
        }
    }

    // Функция обновления точек
    function updateDots(container, count, activeIndex) {
        container.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === activeIndex) dot.classList.add('active');
            dot.addEventListener('click', () => {
                if (container === dotsContainer) {
                    currentImageIndex = i;
                    updateImageSlider();
                } else {
                    currentReviewIndex = i;
                    updateReviewsSlider();
                }
            });
            container.appendChild(dot);
        }
    }

    // Обработчики для навигации изображений
    imageSlider.addEventListener('click', (e) => {
        const clickX = e.clientX;
        const sliderWidth = imageSlider.clientWidth;
        if (clickX < sliderWidth / 2) {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        } else {
            currentImageIndex = (currentImageIndex + 1) % images.length;
        }
        updateImageSlider();
    });

    // Обработчики для навигации отзывов
    reviewsSlider.addEventListener('click', (e) => {
        const clickX = e.clientX;
        const sliderWidth = reviewsSlider.clientWidth;
        if (clickX < sliderWidth / 2) {
            currentReviewIndex = (currentReviewIndex - 1 + reviews.length) % reviews.length;
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
    const modal = document.getElementById("modal");

    payButton.addEventListener('click', () => {
        if (!modal) {
            alert("Модальное окно не найдено.");
            return;
        }
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
