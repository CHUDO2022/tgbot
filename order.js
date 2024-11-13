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
    if (!telegramUser || !telegramUser.id) {
        alert("Ошибка: данные пользователя не загружены.");
        return;
    }

    // Заполнение информации о продукте
    const productImg = document.getElementById('product-img');
    const productName = document.getElementById('product-name');
    const productPrice = document.getElementById('product-price');
    const productOldPrice = document.getElementById('product-old-price');
    const productDescription = document.getElementById('product-description');

    if (productImg) productImg.src = productData.image;
    if (productName) productName.textContent = productData.name;
    if (productPrice) productPrice.textContent = `${productData.price} ₽`;
    if (productOldPrice && productData.old_price) {
        productOldPrice.textContent = `${productData.old_price} ₽`;
    }
    if (productDescription) productDescription.textContent = productData.description;

    // Слайдер изображений товара
    const imageSlider = document.getElementById('image-slider');
    const images = productData.images || [];
    let currentIndex = 0;

    function updateImageSlider() {
        imageSlider.innerHTML = `<img src="${images[currentIndex]}" class="slider-img">`;
    }

    updateImageSlider();

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
            currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
        } else if (swipeDistance < -swipeThreshold) {
            currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
        }

        updateImageSlider();
    });

    // Слайдер отзывов
    const reviewsSlider = document.getElementById('reviews-slider');
    const reviews = productData.reviews || [];

    function updateReviewsSlider() {
        if (reviews.length === 0) {
            reviewsSlider.innerHTML = `<p>Отзывы отсутствуют</p>`;
        } else {
            reviewsSlider.innerHTML = `<img src="${reviews[currentIndex]}" class="slider-img">`;
        }
    }

    updateReviewsSlider();

    reviewsSlider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    reviewsSlider.addEventListener('touchmove', (e) => {
        currentX = e.touches[0].clientX;
    });

    reviewsSlider.addEventListener('touchend', () => {
        const swipeDistance = currentX - startX;
        const swipeThreshold = 50;

        if (swipeDistance > swipeThreshold) {
            currentIndex = (currentIndex === 0) ? reviews.length - 1 : currentIndex - 1;
        } else if (swipeDistance < -swipeThreshold) {
            currentIndex = (currentIndex === reviews.length - 1) ? 0 : currentIndex + 1;
        }

        updateReviewsSlider();
    });

    // Модальное окно
    const modal = document.getElementById("modal");
    const payButton = document.getElementById("pay-button");
    const closeModal = document.querySelector(".close");

    // Открытие модального окна
    payButton.addEventListener('click', () => {
        modal.style.display = "block";
    });

    // Закрытие модального окна
    closeModal.addEventListener('click', () => {
        modal.style.display = "none";
    });

    // Обработка отправки формы
    const form = document.getElementById("user-form");
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const fullName = document.getElementById("full-name").value;
        const phoneNumber = document.getElementById("phone-number").value;
        const email = document.getElementById("email").value;

        // Создание данных заказа
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
                alert(`Ошибка при отправке заказа: ${data.message}`);
            }
        })
        .catch(() => {
            alert("Произошла ошибка при отправке заказа. Пожалуйста, попробуйте снова.");
        });
    });
});
