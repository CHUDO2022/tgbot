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

    // Инициализация слайдера изображений
    const imageSlider = document.getElementById('image-slider');
    const imageDotsContainer = document.getElementById('image-dots-container');
    const images = productData.images || [];
    let currentImageIndex = 0;

    function updateImageSlider() {
        imageSlider.innerHTML = `<img src="${images[currentImageIndex]}" class="slider-img">`;
        updateDots(imageDotsContainer, images.length, currentImageIndex, (index) => {
            currentImageIndex = index;
            updateImageSlider();
        });
    }

    // Инициализация слайдера отзывов
    const reviewsSlider = document.getElementById('reviews-slider');
    const reviewsDotsContainer = document.getElementById('reviews-dots-container');
    const reviews = productData.reviews || [];
    let currentReviewIndex = 0;

    function updateReviewsSlider() {
        reviewsSlider.innerHTML = `<img src="${reviews[currentReviewIndex]}" class="slider-img">`;
        updateDots(reviewsDotsContainer, reviews.length, currentReviewIndex, (index) => {
            currentReviewIndex = index;
            updateReviewsSlider();
        });
    }

    // Функция для создания точек и привязки к текущему слайдеру
    function updateDots(dotsContainer, itemCount, activeIndex, onClick) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < itemCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === activeIndex) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => onClick(i));
            dotsContainer.appendChild(dot);
        }
    }

    // Добавление свайпа для слайдера изображений
    function handleSwipe(sliderElement, updateFunction, items, currentIndexRef) {
        let startX = 0;

        sliderElement.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        sliderElement.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            if (startX - endX > 50) {
                currentIndexRef.value = (currentIndexRef.value + 1) % items.length;
            } else if (endX - startX > 50) {
                currentIndexRef.value = (currentIndexRef.value - 1 + items.length) % items.length;
            }
            updateFunction();
        });
    }

    // Устанавливаем начальные значения слайдеров и точек
    updateImageSlider();
    updateReviewsSlider();

    // Настройка свайпов
    handleSwipe(imageSlider, updateImageSlider, images, { value: currentImageIndex });
    handleSwipe(reviewsSlider, updateReviewsSlider, reviews, { value: currentReviewIndex });

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
