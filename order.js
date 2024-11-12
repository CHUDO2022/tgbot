document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productData = JSON.parse(urlParams.get('product_data'));

    // Проверка наличия данных о продукте
    if (!productData) {
        alert("Ошибка: нет данных о продукте.");
        return;
    }

    const telegramUser = JSON.parse(localStorage.getItem('telegramUser'));

    // Проверка наличия данных пользователя
    if (!telegramUser) {
        console.error("Данные пользователя не найдены.");
        return;
    }

    const productImg = document.getElementById('product-img');
    const productName = document.getElementById('product-name');
    const productPrice = document.getElementById('product-price');
    const productOldPrice = document.getElementById('product-old-price');
    const productDescription = document.getElementById('product-description');
    const stockStatus = document.getElementById('stock-status');
    const imageSlider = document.getElementById('image-slider');
    const reviewSlider = document.getElementById('review-slider');
    const btn = document.getElementById("pay-button");

    // Установка данных о продукте
    productImg.src = productData.image || 'https://via.placeholder.com/600x300';
    productName.textContent = productData.name || 'Название не указано';
    productPrice.textContent = productData.price ? `${productData.price} ₽` : 'Цена не указана';
    productOldPrice.textContent = productData.old_price ? `${productData.old_price} ₽` : '';
    productDescription.textContent = productData.description || 'Описание отсутствует';

    // Проверка наличия товара
    if (productData.in_stock === 'Да') {
        stockStatus.textContent = 'В наличии';
        stockStatus.style.color = 'green';
    } else {
        stockStatus.textContent = 'Нет в наличии';
        stockStatus.style.color = 'red';
    }

    // Создаем слайдер изображений
    if (productData.images && productData.images.length > 0) {
        productData.images.forEach(imgUrl => {
            const img = document.createElement('img');
            img.src = imgUrl;
            img.alt = 'Изображение товара';
            img.classList.add('slider-img');
            imageSlider.appendChild(img);
        });
    } else {
        imageSlider.textContent = 'Дополнительные изображения недоступны';
    }

    // Создаем слайдер отзывов
    if (productData.reviews && productData.reviews.length > 0) {
        productData.reviews.forEach(reviewUrl => {
            const reviewImg = document.createElement('img');
            reviewImg.src = reviewUrl;
            reviewImg.alt = 'Отзыв о товаре';
            reviewImg.classList.add('review-img');
            reviewSlider.appendChild(reviewImg);
        });
    } else {
        reviewSlider.textContent = 'Отзывы отсутствуют';
    }

    // Обработчик кнопки "Перейти к оплате"
    btn.onclick = () => {
        if (productData.in_stock !== 'Да') {
            alert('Товар отсутствует в наличии. Заказ невозможен.');
            return;
        }

        const modal = document.getElementById("modal");
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
                alert('Заказ успешно оформлен!');
                window.location.href = "https://t.me/QSale_iphone_bot";
            } else {
                alert(data.message || 'Ошибка при оформлении заказа.');
            }
        })
        .catch(error => {
            alert('Произошла ошибка при обработке заказа.');
            console.error('Error:', error);
        });
    });

    // Закрытие модального окна
    const closeModalBtn = document.querySelector(".close");
    closeModalBtn.onclick = () => {
        const modal = document.getElementById("modal");
        modal.style.display = "none";
    };
});
