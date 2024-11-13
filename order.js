document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productData = JSON.parse(urlParams.get('product_data'));
    const telegramUser = JSON.parse(localStorage.getItem('telegramUser'));

    if (!productData || !telegramUser) {
        alert("Ошибка: нет данных о продукте или пользователе.");
        return;
    }

    const imageSlider = document.getElementById('image-slider');
    const images = productData.images || [];
    let currentIndex = 0;
    let startX = 0;
    let currentX = 0;

    // Отображение первого изображения
    function updateSlider() {
        imageSlider.innerHTML = `<img src="${images[currentIndex]}" class="slider-img">`;
    }

    updateSlider();

    // Обработчики свайпа
    imageSlider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    imageSlider.addEventListener('touchmove', (e) => {
        currentX = e.touches[0].clientX;
    });

    imageSlider.addEventListener('touchend', () => {
        const swipeDistance = currentX - startX;
        const swipeThreshold = 50; // Минимальное расстояние для распознавания свайпа

        if (swipeDistance > swipeThreshold) {
            // Свайп вправо
            currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
        } else if (swipeDistance < -swipeThreshold) {
            // Свайп влево
            currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
        }

        updateSlider();
    });

    // Заполняем информацию о продукте
    document.getElementById('product-name').textContent = productData.name;
    document.getElementById('product-price').textContent = `${productData.price} ₽`;
    document.getElementById('product-description').textContent = productData.description;
    document.getElementById('stock-status').textContent = productData.in_stock === 'Да' ? 'В наличии' : 'Нет в наличии';

    // Открытие модального окна при нажатии на "Перейти к оплате"
    const payButton = document.getElementById('pay-button');
    const modal = document.getElementById('user-modal');
    const closeModal = document.querySelector('.close-modal');

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
