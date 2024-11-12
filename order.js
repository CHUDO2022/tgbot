document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productData = JSON.parse(urlParams.get('product_data'));

    // Проверка наличия данных о продукте
    if (!productData || typeof productData !== 'object') {
        alert("Ошибка: нет данных о продукте.");
        return;
    }

    // Извлечение данных пользователя из localStorage
    const telegramUser = JSON.parse(localStorage.getItem('telegramUser'));

    // Проверка наличия данных пользователя
    if (!telegramUser) {
        console.error("Данные пользователя не найдены.");
        return;
    }

    // Обновляем UI с данными продукта
    const productImg = document.getElementById('product-img');
    const productName = document.getElementById('product-name');
    const productPrice = document.getElementById('product-price');
    const productOldPrice = document.getElementById('product-old-price');
    const productDescription = document.getElementById('product-description');
    const productAvailability = document.getElementById('product-availability');
    const sliderContainer = document.getElementById('slider-container');
    const reviewsContainer = document.getElementById('reviews-container');

    // Проверка наличия товара
    const inStock = productData.in_stock === 'Да';
    productAvailability.textContent = inStock ? "В наличии" : "Нет в наличии";
    productAvailability.style.color = inStock ? "green" : "red";

    // Установка основного изображения товара
    if (productImg && productData.image) {
        productImg.src = productData.image;
        productImg.onerror = () => {
            productImg.src = 'https://via.placeholder.com/600x300';
        };
    } else {
        productImg.src = 'https://via.placeholder.com/600x300';
    }

    // Установка данных о продукте
    productName.textContent = productData.name || 'Название не указано';
    productPrice.textContent = productData.price ? `${productData.price} ₽` : 'Цена не указана';
    productOldPrice.textContent = productData.old_price ? `${productData.old_price} ₽` : '';
    productDescription.textContent = productData.description || 'Описание недоступно';

    // Создание слайдера изображений
    if (sliderContainer && Array.isArray(productData.images) && productData.images.length > 0) {
        sliderContainer.innerHTML = '';
        productData.images.forEach((url) => {
            const img = document.createElement('img');
            img.src = url;
            img.classList.add('slider-image');
            sliderContainer.appendChild(img);
        });

        let currentSlide = 0;
        const images = sliderContainer.querySelectorAll('.slider-image');
        images[currentSlide].style.display = 'block';

        setInterval(() => {
            images[currentSlide].style.display = 'none';
            currentSlide = (currentSlide + 1) % images.length;
            images[currentSlide].style.display = 'block';
        }, 3000);
    }

    // Слайдер для отзывов
    if (reviewsContainer && Array.isArray(productData.reviews) && productData.reviews.length > 0) {
        reviewsContainer.innerHTML = '';
        productData.reviews.forEach((url) => {
            const img = document.createElement('img');
            img.src = url;
            img.classList.add('review-image');
            reviewsContainer.appendChild(img);
        });

        let currentReview = 0;
        const reviewImages = reviewsContainer.querySelectorAll('.review-image');
        reviewImages[currentReview].style.display = 'block';

        setInterval(() => {
            reviewImages[currentReview].style.display = 'none';
            currentReview = (currentReview + 1) % reviewImages.length;
            reviewImages[currentReview].style.display = 'block';
        }, 3000);
    }

    // Обработчик кнопки "Перейти к оплате"
    const btn = document.getElementById("pay-button");
    const modal = document.getElementById("modal");

    btn.onclick = () => {
        if (!inStock) {
            alert("Товар отсутствует на складе.");
            return;
        }
        modal.style.display = "block";
    };

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
                email: email
            }
        };

        fetch('https://gadgetmark.ru/validate-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                modal.style.display = "none";
                window.location.href = "https://t.me/QSale_iphone_bot";
            } else {
                alert(data.message);
            }
        })
        .catch(() => {
            alert("Произошла ошибка. Попробуйте снова.");
        });
    });
});
