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

    if (!telegramUser) {
        console.error("Данные пользователя не найдены.");
        return;
    }

    // Элементы страницы
    const productImg = document.getElementById('product-img');
    const productName = document.getElementById('product-name');
    const productPrice = document.getElementById('product-price');
    const productOldPrice = document.getElementById('product-old-price');
    const productDescription = document.getElementById('product-description');
    const inStockStatus = document.getElementById('in-stock-status');
    const sliderContainer = document.getElementById('image-slider');
    const sliderDotsContainer = document.getElementById('slider-dots');

    // Установка данных о продукте в UI
    productName.textContent = productData.name;
    productPrice.textContent = `${productData.price} ₽`;
    productDescription.textContent = productData.description;
    inStockStatus.textContent = productData.in_stock === 'Да' ? 'В наличии' : 'Нет в наличии';
    inStockStatus.className = productData.in_stock === 'Да' ? 'in-stock' : 'out-of-stock';

    if (productOldPrice && productData.old_price) {
        productOldPrice.textContent = `Старая цена: ${productData.old_price} ₽`;
    } else {
        productOldPrice.style.display = 'none';
    }

    // Функция для создания слайдера изображений
    function createImageSlider(images) {
        sliderContainer.innerHTML = '';
        sliderDotsContainer.innerHTML = '';

        if (images.length === 0) {
            images = [productData.image]; // Если нет дополнительных изображений, используем основное
        }

        images.forEach((imgSrc, index) => {
            const slide = document.createElement('div');
            slide.classList.add('slide');
            if (index === 0) slide.classList.add('active');

            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = productData.name;
            slide.appendChild(img);

            sliderContainer.appendChild(slide);

            // Создаем точки для слайдера
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => showSlide(index));
            sliderDotsContainer.appendChild(dot);
        });
    }

    // Инициализация слайдера
    let currentSlideIndex = 0;

    function showSlide(index) {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');

        if (index >= slides.length) currentSlideIndex = 0;
        if (index < 0) currentSlideIndex = slides.length - 1;

        slides.forEach((slide, idx) => {
            slide.style.display = idx === currentSlideIndex ? 'block' : 'none';
        });

        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentSlideIndex);
        });
    }

    function nextSlide() {
        currentSlideIndex++;
        showSlide(currentSlideIndex);
    }

    function prevSlide() {
        currentSlideIndex--;
        showSlide(currentSlideIndex);
    }

    // Автоматическая смена слайдов
    setInterval(nextSlide, 5000);

    // Инициализируем слайдер изображений
    createImageSlider(productData.images || []);

    // Обработчик кнопки "Перейти к оплате"
    const payButton = document.getElementById('pay-button');
    payButton.addEventListener('click', () => {
        const fullName = document.getElementById('full-name').value;
        const phoneNumber = document.getElementById('phone-number').value;
        const email = document.getElementById('email').value;

        if (!fullName || !phoneNumber || !email) {
            alert("Пожалуйста, заполните все поля формы.");
            return;
        }

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

        // Отправляем данные заказа на сервер
        fetch('https://gadgetmark.ru/validate-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Заказ успешно оформлен!');
                window.location.href = 'https://t.me/QSale_iphone_bot';
            } else {
                alert(`Ошибка оформления заказа: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Ошибка при оформлении заказа:', error);
            alert('Произошла ошибка. Попробуйте позже.');
        });
    });

    // Обработчики кнопок слайдера
    document.getElementById('prev-slide').addEventListener('click', prevSlide);
    document.getElementById('next-slide').addEventListener('click', nextSlide);
});
