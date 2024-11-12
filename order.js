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
    const stockStatus = document.getElementById('stock-status');
    const imageSlider = document.getElementById('image-slider');
    const reviewSlider = document.getElementById('review-slider');

    // Установка данных о продукте в UI
    if (productImg && productData.image) {
        productImg.src = productData.image;
        productImg.onerror = () => {
            productImg.src = 'https://via.placeholder.com/600x300';
        };
    }

    productName.textContent = productData.name || 'Название не указано';
    productPrice.textContent = productData.price ? `${productData.price} ₽` : 'Цена не указана';
    if (productOldPrice && productData.old_price) {
        productOldPrice.textContent = `${productData.old_price} ₽`;
    }
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
    if (imageSlider && productData.images && productData.images.length > 0) {
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
    if (reviewSlider && productData.reviews && productData.reviews.length > 0) {
        productData.reviews.forEach(reviewUrl => {
            const reviewImg = document.createElement('img');
            reviewImg.src = reviewUrl;
            reviewImg.alt = 'Отзыв о товаре';
            reviewImg.classList.add('review-img');
            reviewSlider.appendChild(reviewImg);
        });
    } else {
        reviewSlider.textContent = 'Изображения отзывов отсутствуют';
    }

    // Настройка опций
    const setupOptions = (containerId, options, className, useBackgroundColor = false) => {
        const container = document.getElementById(containerId);
        if (container && options) {
            options.forEach(option => {
                const div = document.createElement('div');
                div.className = className;
                if (useBackgroundColor) {
                    div.style.backgroundColor = option.toLowerCase();
                    div.setAttribute('data-value', option);
                } else {
                    div.textContent = option;
                }
                div.addEventListener('click', () => {
                    container.querySelectorAll(`.${className}`).forEach(opt => opt.classList.remove('selected'));
                    div.classList.add('selected');
                });
                container.appendChild(div);
            });
        }
    };

    // Настройка опций для цвета, памяти и связи
    setupOptions('color-options', productData.colors, 'color-option', true);
    setupOptions('memory-options', productData.memory, 'memory-option');
    setupOptions('connectivity-options', productData.connectivity, 'connectivity-option');

    // Обработчик кнопки "Перейти к оплате"
    const modal = document.getElementById("modal");
    const btn = document.getElementById("pay-button");
    btn.onclick = () => {
        const selectedOptions = {
            color: document.querySelector('.color-option.selected')?.getAttribute('data-value'),
            memory: document.querySelector('.memory-option.selected')?.textContent,
            connectivity: document.querySelector('.connectivity-option.selected')?.textContent,
        };

        if (!selectedOptions.color || !selectedOptions.memory || !selectedOptions.connectivity) {
            alert('Пожалуйста, выберите все опции товара перед отправкой заказа.');
        } else {
            modal.style.display = "block";
        }
    };

    // Обработчик отправки формы заказа
    document.getElementById("user-form").addEventListener("submit", function(event) {
        event.preventDefault();

        const fullName = document.getElementById("full-name").value;
        const phoneNumber = document.getElementById("phone-number").value;
        const email = document.getElementById("email").value;

        const orderData = {
            product_id: productData.id,
            selectedOptions: {
                color: selectedOptions.color,
                memory: selectedOptions.memory,
                connectivity: selectedOptions.connectivity,
            },
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
                modal.style.display = "none";
                window.location.href = "https://t.me/QSale_iphone_bot";
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            alert('Произошла ошибка при обработке заказа.');
            console.error('Error:', error);
        });
    });
});
