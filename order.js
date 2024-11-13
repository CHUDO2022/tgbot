document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productData = JSON.parse(urlParams.get('product_data'));
    const telegramUser = JSON.parse(localStorage.getItem('telegramUser'));

    // Проверка наличия данных продукта и пользователя
    if (!productData || !telegramUser || !telegramUser.id) {
        alert("Ошибка: нет данных о продукте или пользователе.");
        console.error('Отсутствуют данные о продукте или user_id.');
        return;
    }

    const imageSlider = document.getElementById('image-slider');
    const reviewSlider = document.getElementById('review-slider');
    const productName = document.getElementById('product-name');
    const productPrice = document.getElementById('product-price');
    const productDescription = document.getElementById('product-description');
    const stockStatus = document.getElementById('stock-status');
    const payButton = document.getElementById('pay-button');
    const modal = document.getElementById('user-modal');
    const closeModal = document.querySelector('.close-modal');

    let currentIndex = 0;
    let startX = 0;
    let currentX = 0;

    // Функция для отображения изображений продукта
    function updateSlider() {
        if (productData.images && productData.images.length > 0) {
            imageSlider.innerHTML = `<img src="${productData.images[currentIndex]}" class="slider-img">`;
        } else {
            imageSlider.innerHTML = '<img src="https://via.placeholder.com/600x300" class="slider-img" alt="Нет изображения">';
        }
    }

    // Функция для отображения отзывов
    function updateReviewSlider() {
        if (productData.reviews && productData.reviews.length > 0) {
            reviewSlider.innerHTML = `<img src="${productData.reviews[currentIndex]}" class="slider-img">`;
        } else {
            reviewSlider.innerHTML = '<p>Отзывы отсутствуют</p>';
        }
    }

    updateSlider();
    updateReviewSlider();

    // Обработчики свайпа для изображений продукта
    imageSlider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    imageSlider.addEventListener('touchmove', (e) => {
        currentX = e.touches[0].clientX;
    });

    imageSlider.addEventListener('touchend', () => {
        const swipeDistance = currentX - startX;
        const swipeThreshold = 50;

        if (swipeDistance > swipeThreshold) {
            currentIndex = (currentIndex === 0) ? productData.images.length - 1 : currentIndex - 1;
        } else if (swipeDistance < -swipeThreshold) {
            currentIndex = (currentIndex === productData.images.length - 1) ? 0 : currentIndex + 1;
        }

        updateSlider();
    });

    // Обработчики свайпа для отзывов
    reviewSlider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    reviewSlider.addEventListener('touchmove', (e) => {
        currentX = e.touches[0].clientX;
    });

    reviewSlider.addEventListener('touchend', () => {
        const swipeDistance = currentX - startX;
        const swipeThreshold = 50;

        if (swipeDistance > swipeThreshold) {
            currentIndex = (currentIndex === 0) ? productData.reviews.length - 1 : currentIndex - 1;
        } else if (swipeDistance < -swipeThreshold) {
            currentIndex = (currentIndex === productData.reviews.length - 1) ? 0 : currentIndex + 1;
        }

        updateReviewSlider();
    });

    // Заполняем информацию о продукте
    productName.textContent = productData.name;
    productPrice.textContent = `${productData.price} ₽`;
    productDescription.textContent = productData.description;
    stockStatus.textContent = productData.in_stock === 'Да' ? 'В наличии' : 'Нет в наличии';

    // Открытие модального окна при нажатии на "Перейти к оплате"
    payButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Обработка отправки формы
    const form = document.getElementById('user-form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const fullName = document.getElementById('full-name').value;
        const phoneNumber = document.getElementById('phone-number').value;
        const email = document.getElementById('email').value;

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
            console.error('Ошибка:', error);
        });
    });
});
