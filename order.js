document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Загружаем данные с сервера
        const response = await fetch('https://gadgetmark.ru/get-products');
        const data = await response.json();

        // Получаем информацию о продукте из параметров URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('product_id'));

        // Ищем продукт по ID
        const productData = data.products.find(item => item.id === productId);

        if (!productData) {
            alert("Ошибка: данные о продукте не найдены.");
            return;
        }

        // Извлечение данных пользователя из localStorage
        const telegramUser = JSON.parse(localStorage.getItem('telegramUser'));

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
        const inStock = productData.in_stock && productData.in_stock.toLowerCase() === 'да';
        productAvailability.textContent = inStock ? "В наличии" : "Нет в наличии";
        productAvailability.style.color = inStock ? "green" : "red";

        // Установка основного изображения товара
        if (productImg && productData.image) {
            productImg.src = productData.image;
            productImg.onerror = () => {
                productImg.src = 'https://via.placeholder.com/600x300';
            };
        }

        // Установка данных о продукте
        productName.textContent = productData.name || 'Название не указано';
        productPrice.textContent = productData.price ? `${productData.price} ₽` : 'Цена не указана';
        productOldPrice.textContent = productData.old_price ? `${productData.old_price} ₽` : '';
        productDescription.textContent = productData.description || 'Описание недоступно';

        // Инициализация слайдера изображений
        if (sliderContainer && Array.isArray(productData.images) && productData.images.length > 0) {
            sliderContainer.innerHTML = '';
            productData.images.forEach(url => {
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
        } else {
            sliderContainer.textContent = "Изображения недоступны";
        }

        // Инициализация слайдера отзывов
        if (reviewsContainer && Array.isArray(productData.reviews) && productData.reviews.length > 0) {
            reviewsContainer.innerHTML = '';
            productData.reviews.forEach(url => {
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
        } else {
            reviewsContainer.textContent = "Отзывы недоступны";
        }

        // Обработчик кнопки "Перейти к оплате"
        const btn = document.getElementById("pay-button");
        btn.onclick = () => {
            if (!inStock) {
                alert("Товар отсутствует на складе.");
                return;
            }
            window.location.href = "https://t.me/QSale_iphone_bot";
        };
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        alert('Не удалось загрузить данные о продукте.');
    }
});
