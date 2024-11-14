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
    const images = productData.images || [];
    let currentImageIndex = 0;

    function updateImageSlider() {
        if (images.length > 0) {
            imageSlider.innerHTML = `<img src="${images[currentImageIndex]}" class="slider-img">`;
            updateImageDots();
        } else {
            imageSlider.innerHTML = `<p>Изображения отсутствуют</p>`;
        }
    }

    function updateImageDots() {
        const dotsContainer = document.getElementById('image-dots');
        dotsContainer.innerHTML = '';
        for (let i = 0; i < images.length; i++) {
            const dot = document.createElement('span');
            dot.className = i === currentImageIndex ? 'dot active' : 'dot';
            dot.addEventListener('click', () => {
                currentImageIndex = i;
                updateImageSlider();
            });
            dotsContainer.appendChild(dot);
        }
    }

    // Смена изображения по нажатию или свайпу
    imageSlider.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateImageSlider();
    });

    updateImageSlider();

    // Слайдер для отзывов
    const reviewsSlider = document.getElementById('reviews-slider');
    const reviews = productData.reviews || [];
    let currentReviewIndex = 0;

    function updateReviewsSlider() {
        if (reviews.length > 0) {
            reviewsSlider.innerHTML = `<img src="${reviews[currentReviewIndex]}" class="slider-img">`;
            updateReviewDots();
        } else {
            reviewsSlider.innerHTML = `<p>Отзывы отсутствуют</p>`;
        }
    }

    function updateReviewDots() {
        const reviewDotsContainer = document.getElementById('review-dots');
        reviewDotsContainer.innerHTML = '';
        for (let i = 0; i < reviews.length; i++) {
            const dot = document.createElement('span');
            dot.className = i === currentReviewIndex ? 'dot active' : 'dot';
            dot.addEventListener('click', () => {
                currentReviewIndex = i;
                updateReviewsSlider();
            });
            reviewDotsContainer.appendChild(dot);
        }
    }

    // Смена отзыва по нажатию или свайпу
    reviewsSlider.addEventListener('click', () => {
        currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
        updateReviewsSlider();
    });

    updateReviewsSlider();

    // Заполнение информации о продукте
    document.getElementById('product-name').textContent = productData.name;
    document.getElementById('product-price').textContent = `${productData.price} ₽`;
    document.getElementById('product-old-price').textContent = `Старая цена: ${productData.old_price} ₽`;
    document.getElementById('stock-status').textContent = productData.in_stock ? 'В наличии' : 'Нет в наличии';
    document.getElementById('product-description').textContent = productData.description;

    // Обработка формы для отправки заказа
    document.getElementById('user-form').addEventListener("submit", function(event) {
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
                document.getElementById("modal").style.display = "none";
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

    // Открытие модального окна для ввода данных
    const payButton = document.getElementById('pay-button');
    const modal = document.getElementById("modal");

    payButton.addEventListener('click', () => {
        modal.style.display = "block";
    });

    document.querySelector(".close").addEventListener('click', () => {
        modal.style.display = "none";
    });
});
