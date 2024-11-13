document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productData = JSON.parse(urlParams.get('product_data'));
    const telegramUser = JSON.parse(localStorage.getItem('telegramUser'));

    if (!productData || !telegramUser) {
        alert("Ошибка: нет данных о продукте или пользователе.");
        return;
    }

    const imageSlider = document.getElementById('image-slider');
    const reviewSlider = document.getElementById('review-slider');
    const images = productData.images || [];
    const reviews = productData.reviews || [];
    let currentImageIndex = 0;
    let currentReviewIndex = 0;

    // Функция обновления слайдера изображений товара
    function updateImageSlider() {
        if (images.length > 0) {
            imageSlider.innerHTML = `<img src="${images[currentImageIndex]}" class="slider-img">`;
        } else {
            imageSlider.innerHTML = '<p>Изображения отсутствуют</p>';
        }
    }

    // Функция обновления слайдера отзывов
    function updateReviewSlider() {
        if (reviews.length > 0) {
            reviewSlider.innerHTML = `<img src="${reviews[currentReviewIndex]}" class="slider-img">`;
        } else {
            reviewSlider.innerHTML = '<p>Отзывы отсутствуют</p>';
        }
    }

    updateImageSlider();
    updateReviewSlider();

    // Обработчики свайпа для изображений товара
    imageSlider.addEventListener('touchstart', (e) => startX = e.touches[0].clientX);
    imageSlider.addEventListener('touchend', (e) => {
        const swipeDistance = e.changedTouches[0].clientX - startX;
        const swipeThreshold = 50;

        if (swipeDistance > swipeThreshold) {
            currentImageIndex = (currentImageIndex === 0) ? images.length - 1 : currentImageIndex - 1;
        } else if (swipeDistance < -swipeThreshold) {
            currentImageIndex = (currentImageIndex === images.length - 1) ? 0 : currentImageIndex + 1;
        }

        updateImageSlider();
    });

    // Обработчики свайпа для отзывов
    reviewSlider.addEventListener('touchstart', (e) => startX = e.touches[0].clientX);
    reviewSlider.addEventListener('touchend', (e) => {
        const swipeDistance = e.changedTouches[0].clientX - startX;
        const swipeThreshold = 50;

        if (swipeDistance > swipeThreshold) {
            currentReviewIndex = (currentReviewIndex === 0) ? reviews.length - 1 : currentReviewIndex - 1;
        } else if (swipeDistance < -swipeThreshold) {
            currentReviewIndex = (currentReviewIndex === reviews.length - 1) ? 0 : currentReviewIndex + 1;
        }

        updateReviewSlider();
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
            }
        })
        .catch(error => {
            alert("Произошла ошибка при отправке заказа.");
            console.error('Ошибка:', error);
        });
    });
});
