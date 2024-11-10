document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productData = JSON.parse(urlParams.get('product_data'));

    if (!productData) {
        alert("Ошибка: нет данных о продукте.");
        return;
    }

    // Обновляем информацию о продукте
    document.getElementById('product-img').src = productData.image;
    document.getElementById('product-name').textContent = productData.name;
    document.getElementById('product-price').textContent = `${productData.price} ₽`;
    if (productData.old_price) {
        document.getElementById('product-old-price').textContent = `${productData.old_price} ₽`;
    }
    document.getElementById('product-description').textContent = productData.description;

    // Загрузка отзывов
    const reviewsList = document.getElementById('reviews-list');
    if (productData.reviews && productData.reviews.length > 0) {
        productData.reviews.forEach(review => {
            const li = document.createElement('li');
            li.textContent = review;
            reviewsList.appendChild(li);
        });
    } else {
        const noReviews = document.createElement('li');
        noReviews.textContent = 'Отзывов пока нет';
        reviewsList.appendChild(noReviews);
    }

    // Обработчик кнопки оплаты
    document.getElementById('pay-button').addEventListener('click', () => {
        document.getElementById('modal').style.display = 'flex';
    });

    // Закрытие модального окна
    document.querySelector('.close').addEventListener('click', () => {
        document.getElementById('modal').style.display = 'none';
    });

    // Отправка данных заказа
    document.getElementById('user-form').addEventListener('submit', (event) => {
        event.preventDefault();

        const fullName = document.getElementById('full-name').value;
        const phoneNumber = document.getElementById('phone-number').value;
        const email = document.getElementById('email').value;

        const orderData = {
            product_id: productData.id,
            user_data: {
                full_name: fullName,
                phone_number: phoneNumber,
                email: email
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
                alert("Заказ успешно оформлен!");
                window.location.href = "https://t.me/QSale_iphone_bot";
            } else {
                alert("Ошибка при оформлении заказа: " + data.message);
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Произошла ошибка. Попробуйте снова.');
        });
    });
});
