document.addEventListener('DOMContentLoaded', () => {
    // Извлечение данных из URL
    const urlParams = new URLSearchParams(window.location.search);
    const productData = JSON.parse(urlParams.get('product_data'));

    if (!productData) {
        alert("Нет данных о продукте в URL");
        return;
    }

    // Извлекаем информацию о товаре
    const productName = document.getElementById('product-name');
    const productPrice = document.getElementById('product-price');
    const oldPrice = document.getElementById('product-old-price');
    const productDescription = document.getElementById('product-description');
    const productStock = document.getElementById('product-stock');  // Новый элемент для статуса наличия товара

    // Заполнение информации о продукте
    productName.textContent = productData.name;
    productPrice.textContent = `${productData.price} ₽`;

    // Если старая цена есть, показываем ее
    if (productData.old_price) {
        oldPrice.textContent = `Старая цена: ${productData.old_price} ₽`;
    } else {
        oldPrice.textContent = '';
    }

    productDescription.textContent = productData.description;

    // Обработка статуса наличия товара
    if (productData.stock && productData.stock === 'in_stock') {
        productStock.textContent = 'В наличии';
        productStock.style.color = 'green';
    } else {
        productStock.textContent = 'Нет в наличии';
        productStock.style.color = 'red';
    }

    // Слайдер изображений товара
    const imageSlider = document.getElementById('image-slider');
    const reviewsSlider = document.getElementById('reviews-slider');
    const images = productData.images || [];
    const reviews = productData.reviews || [];

    let currentImageIndex = 0;
    let currentReviewIndex = 0;

    // Функция обновления слайдера изображений
    function updateImageSlider() {
        if (images.length > 0) {
            imageSlider.innerHTML = `<img src="${images[currentImageIndex]}" class="slider-img">`;
        } else {
            imageSlider.innerHTML = `<p>Изображения отсутствуют</p>`;
        }
    }

    // Функция обновления слайдера отзывов
    function updateReviewsSlider() {
        if (reviews.length > 0) {
            reviewsSlider.innerHTML = `<img src="${reviews[currentReviewIndex]}" class="slider-img">`;
        } else {
            reviewsSlider.innerHTML = `<p>Отзывы отсутствуют</p>`;
        }
    }

    updateImageSlider();
    updateReviewsSlider();

    // Переключение изображений слайдера по клику
    imageSlider.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateImageSlider();
    });

    // Переключение отзывов слайдера по клику
    reviewsSlider.addEventListener('click', () => {
        currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
        updateReviewsSlider();
    });

    // Модальное окно
    const modal = document.getElementById("modal");
    const payButton = document.getElementById('pay-button');

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

    // Получаем данные пользователя из localStorage
    const telegramUser = JSON.parse(localStorage.getItem('telegramUser'));

    if (!telegramUser) {
        alert("Данные пользователя не найдены.");
        return;
    }

    // Отправка формы
    document.getElementById("user-form").addEventListener("submit", function(event) {
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
