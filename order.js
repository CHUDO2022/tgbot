document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productData = JSON.parse(urlParams.get('product_data'));

    // Проверка наличия данных о продукте
    if (!productData) {
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
    const inStockStatus = document.getElementById('in-stock-status');

    // Установка данных о продукте в UI
    productImg.src = productData.image || 'https://via.placeholder.com/600x300';
    productName.textContent = productData.name;
    productPrice.textContent = `${productData.price} ₽`;
    productOldPrice.textContent = productData.old_price ? `${productData.old_price} ₽` : '';
    productDescription.textContent = productData.description;
    inStockStatus.textContent = productData.in_stock === 'Да' ? 'В наличии' : 'Нет в наличии';

    // Инициализация слайдера изображений
    const imageSliderContainer = document.getElementById('image-slider');
    if (productData.images && productData.images.length > 0) {
        productData.images.forEach(img => {
            const slide = document.createElement('div');
            slide.classList.add('slide');
            slide.innerHTML = `<img src="${img}" alt="Product Image" class="slider-img">`;
            imageSliderContainer.appendChild(slide);
        });
        initSlider(imageSliderContainer);
    }

    // Инициализация слайдера отзывов
    const reviewsSliderContainer = document.getElementById('reviews-slider');
    if (productData.reviews && productData.reviews.length > 0) {
        productData.reviews.forEach(reviewImg => {
            const slide = document.createElement('div');
            slide.classList.add('slide');
            slide.innerHTML = `<img src="${reviewImg}" alt="Review Image" class="slider-img">`;
            reviewsSliderContainer.appendChild(slide);
        });
        initSlider(reviewsSliderContainer);
    }

    // Функция для инициализации слайдера
    function initSlider(container) {
        let currentIndex = 0;
        const slides = container.querySelectorAll('.slide');

        // Функция для показа текущего слайда
        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.style.display = i === index ? 'block' : 'none';
            });
        }

        // Изначально показываем первый слайд
        showSlide(currentIndex);

        // Автопрокрутка слайдера
        setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        }, 3000);
    }

    // Обработчик кнопки "Перейти к оплате"
    const btn = document.getElementById("pay-button");
    btn.onclick = () => {
        const selectedOptions = {
            color: document.querySelector('.color-option.selected')?.getAttribute('data-value')?.toLowerCase(),
            memory: document.querySelector('.memory-option.selected')?.textContent.toLowerCase(),
            connectivity: document.querySelector('.connectivity-option.selected')?.textContent.toLowerCase(),
        };

        if (!selectedOptions.color || !selectedOptions.memory || !selectedOptions.connectivity) {
            alert('Пожалуйста, выберите все опции товара перед отправкой заказа.');
        } else {
            alert('Переход к оплате...');
        }
    };
});
