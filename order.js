document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log("Инициализация страницы оформления заказа...");

        // Получаем данные о продукте из URL
        const urlParams = new URLSearchParams(window.location.search);
        const encodedProductData = urlParams.get('product_data');

        if (!encodedProductData) {
            alert("Ошибка: данные о продукте не переданы.");
            console.error("Отсутствуют данные о продукте в URL.");
            return;
        }

        // Декодируем данные из URL и парсим JSON
        const decodedProductData = decodeURIComponent(encodedProductData);
        console.log("Декодированные данные:", decodedProductData);

        let productData;
        try {
            productData = JSON.parse(decodedProductData);
        } catch (error) {
            alert("Ошибка: не удалось распознать данные о продукте.");
            console.error("Ошибка при парсинге JSON:", error);
            return;
        }

        console.log("Данные о продукте после парсинга:", productData);

        // Проверка поля 'in_stock'
        const inStock = productData.in_stock && productData.in_stock.toLowerCase() === 'да';
        console.log("Наличие товара:", inStock);

        // Обновляем UI с данными продукта
        const productImg = document.getElementById('product-img');
        const productName = document.getElementById('product-name');
        const productPrice = document.getElementById('product-price');
        const productOldPrice = document.getElementById('product-old-price');
        const productDescription = document.getElementById('product-description');
        const productAvailability = document.getElementById('product-availability');
        const sliderContainer = document.getElementById('slider-container');
        const reviewsContainer = document.getElementById('reviews-container');

        productAvailability.textContent = inStock ? "В наличии" : "Нет в наличии";
        productAvailability.style.color = inStock ? "green" : "red";

        if (productImg && productData.image) {
            productImg.src = productData.image;
            productImg.onerror = () => {
                productImg.src = 'https://via.placeholder.com/600x300';
                console.error("Ошибка загрузки изображения товара.");
            };
        }

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
            console.warn("Изображения товара отсутствуют.");
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
            console.warn("Фотографии отзывов отсутствуют.");
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
        console.error("Ошибка при загрузке данных:", error);
        alert("Не удалось загрузить данные о продукте. Попробуйте позже.");
    }
});
