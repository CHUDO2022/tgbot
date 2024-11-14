document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productData = JSON.parse(urlParams.get('product_data'));

    if (!productData) {
        alert("Нет данных о продукте в URL");
        return;
    }

    const telegramUser = JSON.parse(localStorage.getItem('telegramUser'));

    if (!telegramUser) {
        alert("Данные пользователя не найдены.");
        return;
    }

    // Отображение изображений товара
    const imageSlider = document.getElementById('image-slider');
    const reviewsSlider = document.getElementById('reviews-slider');
    const images = productData.images || [];
    const reviews = productData.reviews || [];
    let currentImageIndex = 0;
    let currentReviewIndex = 0;

    function updateImageSlider() {
        if (images.length > 0) {
            imageSlider.innerHTML = `<img src="${images[currentImageIndex]}" class="slider-img">`;
        } else {
            imageSlider.innerHTML = `<p>Изображения отсутствуют</p>`;
        }
    }

    function updateReviewsSlider() {
        if (reviews.length > 0) {
            reviewsSlider.innerHTML = `<img src="${reviews[currentReviewIndex]}" class="slider-img">`;
        } else {
            reviewsSlider.innerHTML = `<p>Отзывы отсутствуют</p>`;
        }
    }

    updateImageSlider();
    updateReviewsSlider();

    // Обработчики для слайдера изображений
    imageSlider.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateImageSlider();
    });

    // Обработчики для слайдера отзывов
    reviewsSlider.addEventListener('click', () => {
        currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
        updateReviewsSlider();
    });

    // Заполняем информацию о продукте
    document.getElementById('product-name').textContent = productData.name;
    document.getElementById('product-price').textContent = `${productData.price} ₽`;
    document.getElementById('product-description').textContent = productData.description;

    // Обработка кнопки "Перейти к оплате"
    const payButton = document.getElementById('pay-button');
    const modal = document.getElementById("modal");

    payButton.addEventListener('click', () => {
        if (!modal) {
            alert("Модальное окно не найдено.");
            return;
        }
        modal.style.display = "block";
    });

    document.querySelector(".close").addEventListener('click', () => {
        modal.style.display = "none";
    });

    // Обработка отправки формы
    document.getElementById("user-form").addEventListener("submit", (event) => {
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
                modal.style.display = "none";
                window.location.href = "https://t.me/QSale_iphone_bot";
            } else {
                alert(`Ошибка при отправке заказа: ${data.message}`);
            }
        })
        .catch(error => {
            alert("Произошла ошибка при отправке заказа.");
            console.error('Error:', error);
        });
    });
});
