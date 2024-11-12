document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productData = JSON.parse(urlParams.get('product_data'));

    if (!productData) {
        alert("Ошибка: нет данных о продукте.");
        return;
    }

    const productName = document.getElementById('product-name');
    const productPrice = document.getElementById('product-price');
    const productOldPrice = document.getElementById('product-old-price');
    const productDescription = document.getElementById('product-description');
    const inStockStatus = document.getElementById('in-stock-status');

    productName.textContent = productData.name;
    productPrice.textContent = `${productData.price} ₽`;
    productOldPrice.textContent = productData.old_price ? `${productData.old_price} ₽` : '';
    productDescription.textContent = productData.description;
    inStockStatus.textContent = productData.in_stock === 'Да' ? 'В наличии' : 'Нет в наличии';

    const imageSliderContainer = document.getElementById('image-slider');
    const reviewsSliderContainer = document.getElementById('reviews-slider');

    // Инициализация слайдера изображений
    productData.images.forEach(image => {
        const slide = document.createElement('div');
        slide.classList.add('slide');
        slide.innerHTML = `<img src="${image}" alt="Product Image" class="slider-img">`;
        imageSliderContainer.appendChild(slide);
    });

    // Инициализация слайдера отзывов
    productData.reviews.forEach(review => {
        const slide = document.createElement('div');
        slide.classList.add('slide');
        slide.innerHTML = `<img src="${review}" alt="Review Image" class="slider-img">`;
        reviewsSliderContainer.appendChild(slide);
    });

    initSlider(imageSliderContainer);
    initSlider(reviewsSliderContainer);

    // Функция для инициализации слайдера
    function initSlider(container) {
        let currentIndex = 0;
        const slides = container.querySelectorAll('.slide');

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.style.display = i === index ? 'block' : 'none';
            });
        }

        showSlide(currentIndex);

        setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        }, 3000);
    }
});
