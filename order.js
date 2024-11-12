document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log("Загрузка данных...");

        const urlParams = new URLSearchParams(window.location.search);
        const encodedProductData = urlParams.get('product_data');

        if (!encodedProductData) {
            alert("Ошибка: данные о продукте не переданы.");
            return;
        }

        const productData = JSON.parse(decodeURIComponent(encodedProductData));
        console.log("Данные о продукте:", productData);

        const inStock = productData.in_stock.toLowerCase() === 'да';

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

        productImg.src = productData.image || 'https://via.placeholder.com/600x300';
        productImg.onerror = () => {
            productImg.src = 'https://via.placeholder.com/600x300';
        };

        productName.textContent = productData.name || 'Название не указано';
        productPrice.textContent = productData.price ? `${productData.price} ₽` : 'Цена не указана';
        productOldPrice.textContent = productData.old_price ? `${productData.old_price} ₽` : '';
        productDescription.textContent = productData.description || 'Описание недоступно';

        // Слайдер изображений товара
        if (Array.isArray(productData.images) && productData.images.length > 0) {
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
        }

        // Слайдер отзывов
        if (Array.isArray(productData.reviews) && productData.reviews.length > 0) {
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
        console.error("Ошибка:", error);
        alert("Не удалось загрузить данные о продукте.");
    }
});
