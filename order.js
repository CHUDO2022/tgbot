document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productData = JSON.parse(urlParams.get('product_data'));
    const telegramUser = JSON.parse(localStorage.getItem('telegramUser'));

    // Проверка данных товара и пользователя
    if (!productData) {
        alert("Ошибка: нет данных о продукте.");
        console.error("Нет данных о продукте.");
        return;
    }

    if (!telegramUser || !telegramUser.id) {
        alert("Ошибка: не загружены данные пользователя или отсутствует user_id.");
        console.error("Не загружены данные пользователя или отсутствует user_id.");
        return;
    }

    console.log(`Данные пользователя загружены: user_id = ${telegramUser.id}, username = ${telegramUser.username}`);

    const imageSlider = document.getElementById('image-slider');
    const reviewsSlider = document.getElementById('reviews-slider');
    const images = productData.images || [];
    const reviews = productData.reviews || [];
    let currentIndex = 0;

    // Обновление слайдера изображений
    function updateImageSlider() {
        imageSlider.innerHTML = `<img src="${images[currentIndex]}" class="slider-img">`;
    }

    updateImageSlider();

    // Обработчики свайпа для изображений
    imageSlider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    imageSlider.addEventListener('touchend', () => {
        const swipeDistance = currentX - startX;
        if (swipeDistance > 50) {
            currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
        } else if (swipeDistance < -50) {
            currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
        }
        updateImageSlider();
    });

    // Открытие модального окна
    const payButton = document.getElementById('pay-button');
    const modal = document.getElementById('user-modal');
    const closeModal = document.querySelector('.close-modal');

    payButton.addEventListener('click', () => {
        console.log("Нажата кнопка 'Перейти к оплате'");
        console.log(`Данные telegramUser перед открытием модального окна: ${JSON.stringify(telegramUser)}`);

        if (!telegramUser || !telegramUser.id) {
            alert("Ошибка: не загружены данные пользователя или отсутствует user_id.");
            console.error("user_id отсутствует при нажатии на 'Перейти к оплате'.");
            return;
        }

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
            user_id: telegramUser?.id,
            user_data: {
                full_name: fullName,
                phone_number: phoneNumber,
                email: email,
                username: telegramUser?.username
            }
        };

        // Логируем данные перед отправкой
        console.log("Перед отправкой:");
        console.log(`telegramUser из localStorage: ${JSON.stringify(telegramUser)}`);
        console.log(`orderData: ${JSON.stringify(orderData)}`);

        if (!orderData.user_id) {
            alert("Ошибка: user_id отсутствует перед отправкой.");
            console.error("user_id отсутствует:", orderData);
            return;
        }

        fetch('https://gadgetmark.ru/validate-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Ответ от сервера:", data);
            if (data.status === "success") {
                alert("Заказ успешно отправлен!");
                window.location.href = "https://t.me/QSale_iphone_bot";
            } else {
                alert(`Ошибка при отправке заказа: ${data.message}`);
            }
        })
        .catch(error => {
            alert("Произошла ошибка при отправке заказа.");
            console.error('Ошибка при отправке:', error);
        });
    });
});
