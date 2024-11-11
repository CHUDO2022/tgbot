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
    const productAvailability = document.getElementById('product-availability');
    const sliderContainer = document.getElementById('slider-container');

    // Проверка наличия товара и отображение статуса
    if (productData.in_stock) {
        productAvailability.textContent = "В наличии";
        productAvailability.style.color = "green";
    } else {
        productAvailability.textContent = "Нет в наличии";
        productAvailability.style.color = "red";
    }

    // Установка данных о продукте в UI
    if (productName) productName.textContent = productData.name;
    if (productPrice) productPrice.textContent = `${productData.price} ₽`;
    if (productOldPrice && productData.old_price) {
        productOldPrice.textContent = `${productData.old_price} ₽`;
    }
    if (productDescription) productDescription.textContent = productData.description;

    // Создание слайдера для изображений
    if (sliderContainer && productData.images && productData.images.length > 0) {
        sliderContainer.innerHTML = ''; // Очищаем контейнер

        productData.images.forEach((imageUrl) => {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'Изображение товара';
            img.classList.add('slider-image');
            sliderContainer.appendChild(img);
        });
    } else {
        sliderContainer.textContent = "Изображения недоступны";
    }

    // Инициализация слайдера (простая реализация)
    let currentSlide = 0;
    const images = sliderContainer.querySelectorAll('.slider-image');

    if (images.length > 0) {
        images[currentSlide].style.display = 'block';

        setInterval(() => {
            images[currentSlide].style.display = 'none';
            currentSlide = (currentSlide + 1) % images.length;
            images[currentSlide].style.display = 'block';
        }, 3000);
    }

    // Обработчик кнопки "Перейти к оплате"
    const btn = document.getElementById("pay-button");
    const modal = document.getElementById("modal");

    btn.onclick = () => {
        if (!productData.in_stock) {
            alert("Товар отсутствует на складе. Невозможно оформить заказ.");
            return;
        }
        modal.style.display = "block";
    };

    // Обработчик отправки формы заказа
    document.getElementById("user-form").addEventListener("submit", function(event) {
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
                modal.style.display = "none";
                window.location.href = "https://t.me/QSale_iphone_bot";
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            alert('Произошла ошибка при обработке заказа. Пожалуйста, попробуйте снова.');
            console.error('Error:', error);
        });
    });
});
