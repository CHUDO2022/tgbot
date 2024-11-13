document.addEventListener('DOMContentLoaded', () => { 
    const urlParams = new URLSearchParams(window.location.search);
    const productData = JSON.parse(urlParams.get('product_data'));
    const telegramUser = JSON.parse(localStorage.getItem('telegramUser'));

    // Проверка данных товара
    if (!productData) {
        alert("Ошибка: нет данных о продукте.");
        return;
    }

    // Проверка данных пользователя
    if (!telegramUser || !telegramUser.id) {
        alert("Ошибка: не загружены данные пользователя или отсутствует user_id.");
        return;
    }

    alert(`Данные пользователя загружены: user_id = ${telegramUser.id}, username = ${telegramUser.username}`);

    const imageSlider = document.getElementById('image-slider');
    const reviewsSlider = document.getElementById('reviews-slider');
    const images = productData.images || [];
    const reviews = productData.reviews || [];
    let currentIndex = 0;

    // Функция обновления слайдера изображений
    function updateImageSlider() {
        imageSlider.innerHTML = `<img src="${images[currentIndex]}" class="slider-img">`;
    }

    updateImageSlider();

    // Функция обновления слайдера отзывов
    function updateReviewsSlider() {
        if (reviews.length === 0) {
            reviewsSlider.innerHTML = `<p>Отзывы отсутствуют</p>`;
        } else {
            reviewsSlider.innerHTML = `<img src="${reviews[currentIndex]}" class="slider-img">`;
        }
    }

    updateReviewsSlider();

    // Обработка отправки формы
    const form = document.getElementById('user-form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const fullName = document.getElementById('full-name').value;
        const phoneNumber = document.getElementById('phone-number').value;
        const email = document.getElementById('email').value;

        const telegramUser = JSON.parse(localStorage.getItem('telegramUser'));

        if (!telegramUser || !telegramUser.id) {
            alert("Ошибка: данные пользователя отсутствуют при отправке заказа.");
            return;
        }

        alert(`Подготовка данных заказа: user_id = ${telegramUser.id}`);

        const orderData = {
            product_id: productData.id,
            user_id: telegramUser.id,
            user_data: {
                full_name: fullName,
                phone_number: phoneNumber,
                email: email,
                username: telegramUser.username
            }
        };

        alert(`Отправка данных заказа: product_id = ${orderData.product_id}, user_id = ${orderData.user_id}`);

        // Проверка наличия user_id
        if (!orderData.user_id) {
            alert("Ошибка: user_id отсутствует в данных заказа.");
            return;
        }

        // Отправка данных заказа
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
                alert("Заказ успешно отправлен!");
                window.location.href = "https://t.me/QSale_iphone_bot";
            } else {
                alert(`Ошибка при отправке заказа: ${data.message}`);
            }
        })
        .catch(error => {
            alert("Произошла ошибка при отправке заказа.");
        });
    });
});
