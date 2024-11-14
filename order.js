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
    const images = productData.images || [];
    const reviews = productData.reviews || [];
    let currentImageIndex = 0;
    let currentReviewIndex = 0;

    // Обновление слайдера изображений и отзывов
    function updateImageSlider() {
        imageSlider.innerHTML = `<img src="${images[currentImageIndex]}" class="slider-img">`;
        updateDots('image-dots', images.length, currentImageIndex);
    }

    function updateReviewsSlider() {
        reviewsSlider.innerHTML = `<img src="${reviews[currentReviewIndex]}" class="slider-img">`;
        updateDots('review-dots', reviews.length, currentReviewIndex);
    }

    // Обновление индикаторов (точек)
    function updateDots(containerId, total, activeIndex) {
        const dotsContainer = document.getElementById(containerId);
        dotsContainer.innerHTML = '';
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('span');
            dot.className = 'dot';
            if (i === activeIndex) dot.classList.add('active');
            dotsContainer.appendChild(dot);
        }
    }

    // Установка начальных значений
    updateImageSlider();
    updateReviewsSlider();

    // Навигация по изображениям по клику и свайпу
    function navigateImages(direction) {
        currentImageIndex = (currentImageIndex + direction + images.length) % images.length;
        updateImageSlider();
    }

    function navigateReviews(direction) {
        currentReviewIndex = (currentReviewIndex + direction + reviews.length) % reviews.length;
        updateReviewsSlider();
    }

    // События для переключения изображений
    imageSlider.addEventListener('click', () => navigateImages(1));
    reviewsSlider.addEventListener('click', () => navigateReviews(1));

    imageSlider.addEventListener('touchstart', handleTouchStart, false);
    imageSlider.addEventListener('touchmove', handleTouchMove, false);
    reviewsSlider.addEventListener('touchstart', handleTouchStart, false);
    reviewsSlider.addEventListener('touchmove', handleTouchMove, false);

    let xDown = null;

    function handleTouchStart(evt) {
        xDown = evt.touches[0].clientX;
    }

    function handleTouchMove(evt) {
        if (!xDown) return;

        let xUp = evt.touches[0].clientX;
        let xDiff = xDown - xUp;

        if (xDiff > 0) {
            navigateImages(1);
        } else {
            navigateImages(-1);
        }
        xDown = null;
    }

    // Обновление информации о продукте
    document.getElementById('product-name').textContent = productData.name;
    document.getElementById('product-price').textContent = `${productData.price} ₽`;
    document.getElementById('product-description').textContent = productData.description;

    // Отображение старой цены, если есть
    if (productData.old_price) {
        const oldPriceElement = document.getElementById('product-old-price');
        oldPriceElement.textContent = `Старая цена: ${productData.old_price} ₽`;
        oldPriceElement.style.textDecoration = 'line-through';
    }

    // Отображение статуса наличия
    const stockStatusElement = document.getElementById('stock-status');
    stockStatusElement.textContent = productData.in_stock === 'Да' ? 'В наличии' : 'Нет в наличии';
    stockStatusElement.className = productData.in_stock === 'Да' ? 'in-stock' : 'out-of-stock';

    // Обработка кнопки "Перейти к оплате"
    const payButton = document.getElementById('pay-button');
    const modal = document.getElementById("modal");

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
