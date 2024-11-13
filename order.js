document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productData = JSON.parse(urlParams.get('product_data'));
    const telegramUser = JSON.parse(localStorage.getItem('telegramUser'));

    if (!productData || !telegramUser) {
        alert("Ошибка: нет данных о продукте или пользователе.");
        return;
    }

    const imageSlider = document.getElementById('image-slider');
    const reviewsSlider = document.getElementById('reviews-slider');
    const images = productData.images || [];
    const reviews = productData.reviews || [];
    let currentIndex = 0;
    let reviewIndex = 0;

    // Функция для обновления слайдера изображений товара
    function updateImageSlider() {
        imageSlider.innerHTML = `<img src="${images[currentIndex]}" class="slider-img">`;
    }

    // Функция для обновления слайдера отзывов
    function updateReviewsSlider() {
        if (reviews.length > 0) {
            reviewsSlider.innerHTML = `<img src="${reviews[reviewIndex]}" class="review-img">`;
        } else {
            reviewsSlider.innerHTML = `<p>Отзывы отсутствуют</p>`;
        }
    }

    updateImageSlider();
    updateReviewsSlider();

    // Обработчики для свайпа изображений
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
            currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
        } else if (swipeDistance < -swipeThreshold) {
            currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
        }

        updateImageSlider();
    });

    // Обработчики для свайпа отзывов
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
            reviewIndex = (reviewIndex === 0) ? reviews.length - 1 : reviewIndex - 1;
        } else if (swipeDistance < -swipeThreshold) {
            reviewIndex = (reviewIndex === reviews.length - 1) ? 0 : reviewIndex + 1;
        }

        updateReviewsSlider();
    });

    // Заполняем информацию о продукте
    document.getElementById('product-name').textContent = productData.name;
    document.getElementById('product-price').textContent = `${productData.price} ₽`;
    document.getElementById('product-description').textContent = productData.description;
    document.getElementById('stock-status').textContent = productData.in_stock === 'Да' ? 'В наличии' : 'Нет в наличии';

    // Обработка кнопки "Перейти к оплате"
    const payButton = document.getElementById('pay-button');
    const modal = document.getElementById('user-modal');
    const closeModal = document.querySelector('.close-modal');

    payButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
});
