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
    const productName = document.getElementById('product-name');
    const productPrice = document.getElementById('product-price');
    const productOldPrice = document.getElementById('product-old-price');
    const productDescription = document.getElementById('product-description');
    const inStockStatus = document.getElementById('in-stock-status');
    const slidesContainer = document.getElementById('slides');
    const prevSlideBtn = document.getElementById('prev-slide');
    const nextSlideBtn = document.getElementById('next-slide');

    let currentSlideIndex = 0;

    // Проверка наличия изображений
    if (productData.images && productData.images.length > 0) {
        productData.images.forEach((imageUrl, index) => {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = productData.name;
            img.classList.add('slider-img');

            // Отображаем только первый слайд по умолчанию
            if (index === 0) {
                img.style.display = 'block';
            } else {
                img.style.display = 'none';
            }

            slidesContainer.appendChild(img);
        });
    } else {
        // Если изображений нет, показываем заглушку
        const placeholderImg = document.createElement('img');
        placeholderImg.src = 'https://via.placeholder.com/600x300';
        placeholderImg.alt = 'Изображение недоступно';
        placeholderImg.classList.add('slider-img');
        slidesContainer.appendChild(placeholderImg);
    }

    // Обработчики кнопок навигации слайдера
    prevSlideBtn.addEventListener('click', () => {
        changeSlide(-1);
    });

    nextSlideBtn.addEventListener('click', () => {
        changeSlide(1);
    });

    function changeSlide(direction) {
        const slides = document.querySelectorAll('.slider-img');
        slides[currentSlideIndex].style.display = 'none';
        currentSlideIndex = (currentSlideIndex + direction + slides.length) % slides.length;
        slides[currentSlideIndex].style.display = 'block';
    }

    // Установка данных о продукте в UI
    productName.textContent = productData.name;
    productPrice.textContent = `${productData.price} ₽`;
    productOldPrice.textContent = productData.old_price ? `Старая цена: ${productData.old_price} ₽` : '';
    productDescription.textContent = productData.description;
    inStockStatus.textContent = productData.in_stock === 'Да' ? 'В наличии' : 'Нет в наличии';
    inStockStatus.className = productData.in_stock === 'Да' ? 'in-stock' : 'out-of-stock';

    // Обработчик отправки формы заказа
    document.getElementById('user-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const fullName = document.getElementById('full-name').value;
        const phoneNumber = document.getElementById('phone-number').value;
        const email = document.getElementById('email').value;

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

        // Отправка данных заказа на сервер
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
                alert("Заказ успешно оформлен!");
                window.location.href = "https://t.me/QSale_iphone_bot";
            } else {
                alert("Ошибка при оформлении заказа: " + data.message);
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert("Произошла ошибка при обработке заказа.");
        });
    });
});
