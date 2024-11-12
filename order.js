document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productData = JSON.parse(urlParams.get('product_data'));

    // Проверка наличия данных о продукте
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
    const availabilityStatus = document.getElementById('availability-status');
    const imageSlider = document.getElementById('image-slider');
    const reviewSection = document.getElementById('review-section');

    // Установка данных о продукте в UI
    if (productImg && productData.image) {
        productImg.src = productData.image;
        productImg.onerror = () => {
            productImg.src = 'https://via.placeholder.com/600x300';
            console.error('Ошибка загрузки изображения, заменяем на заглушку.');
        };
    }

    if (productName) productName.textContent = productData.name;
    if (productPrice) productPrice.textContent = productData.price ? `${productData.price} ₽` : 'Цена не указана';
    if (productOldPrice && productData.old_price) {
        productOldPrice.textContent = `${productData.old_price} ₽`;
    }
    if (productDescription) productDescription.textContent = productData.description;
    if (availabilityStatus) {
        availabilityStatus.textContent = productData.in_stock === 'Да' ? 'В наличии' : 'Нет в наличии';
        availabilityStatus.style.color = productData.in_stock === 'Да' ? 'green' : 'red';
    }

    // Функция для создания слайдера изображений
    function createImageSlider(images) {
        imageSlider.innerHTML = '';
        if (images && images.length > 0) {
            images.forEach((imageUrl) => {
                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = 'Изображение товара';
                img.classList.add('slider-image');
                imageSlider.appendChild(img);
            });
        } else {
            imageSlider.innerHTML = '<p>Изображения недоступны</p>';
        }
    }

    // Функция для отображения отзывов
    function displayReviews(reviews) {
        reviewSection.innerHTML = '';
        if (reviews && reviews.length > 0) {
            reviews.forEach((reviewUrl) => {
                const img = document.createElement('img');
                img.src = reviewUrl;
                img.alt = 'Изображение отзыва';
                img.classList.add('review-image');
                reviewSection.appendChild(img);
            });
        } else {
            reviewSection.innerHTML = '<p>Отзывы отсутствуют</p>';
        }
    }

    // Инициализируем слайдер изображений и отзывы
    createImageSlider(productData.images);
    displayReviews(productData.reviews);

    // Обработчик кнопки "Перейти к оплате"
    const payButton = document.getElementById('pay-button');
    payButton.addEventListener('click', () => {
        if (productData.in_stock !== 'Да') {
            alert('Товар отсутствует на складе.');
            return;
        }
        document.getElementById('modal').style.display = 'block';
    });

    // Обработчик отправки формы заказа
    document.getElementById('user-form').addEventListener('submit', (event) => {
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
            if (data.status === 'success') {
                alert('Заказ успешно оформлен!');
                window.location.href = 'https://t.me/QSale_iphone_bot';
            } else {
                alert('Ошибка при оформлении заказа: ' + data.message);
            }
        })
        .catch(error => {
            alert('Произошла ошибка при отправке заказа. Попробуйте позже.');
            console.error('Ошибка:', error);
        });
    });
});
