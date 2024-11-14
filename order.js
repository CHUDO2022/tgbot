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

    const imageSlider = document.getElementById('image-slider');
    const reviewsSlider = document.getElementById('reviews-slider');
    const images = productData.images || [];
    const reviews = productData.reviews || [];
    let currentImageIndex = 0;
    let currentReviewIndex = 0;

    function updateImageSlider() {
        imageSlider.innerHTML = `<img src="${images[currentImageIndex]}" class="slider-img">`;
        updateDots('image-dots', currentImageIndex, images.length);
    }

    function updateReviewsSlider() {
        reviewsSlider.innerHTML = `<img src="${reviews[currentReviewIndex]}" class="slider-img">`;
        updateDots('review-dots', currentReviewIndex, reviews.length);
    }

    function updateDots(dotsContainerId, activeIndex, totalDots) {
        const dotsContainer = document.getElementById(dotsContainerId);
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('span');
            dot.className = 'dot';
            if (i === activeIndex) dot.classList.add('active');
            dotsContainer.appendChild(dot);
        }
    }

    updateImageSlider();
    updateReviewsSlider();

    // Добавление обработчиков для стрелок
    document.querySelector('.slider-arrow-left').addEventListener('click', () => {
        currentImageIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : images.length - 1;
        updateImageSlider();
    });

    document.querySelector('.slider-arrow-right').addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateImageSlider();
    });

    reviewsSlider.addEventListener('click', () => {
        currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
        updateReviewsSlider();
    });

    // Свайп на мобильных устройствах
    let startX = 0;

    imageSlider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    imageSlider.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        if (endX < startX) {
            currentImageIndex = (currentImageIndex + 1) % images.length;
        } else if (endX > startX) {
            currentImageIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : images.length - 1;
        }
        updateImageSlider();
    });

    reviewsSlider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    reviewsSlider.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        if (endX < startX) {
            currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
        } else if (endX > startX) {
            currentReviewIndex = (currentReviewIndex > 0) ? currentReviewIndex - 1 : reviews.length - 1;
        }
        updateReviewsSlider();
    });

    // Модальное окно
    const modal = document.getElementById("modal");
    document.getElementById('pay-button').addEventListener('click', () => {
        modal.style.display = "block";
    });

    document.querySelector(".close").addEventListener('click', () => {
        modal.style.display = "none";
    });

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
