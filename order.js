document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productData = JSON.parse(urlParams.get('product_data'));
    const telegramUser = JSON.parse(localStorage.getItem('telegramUser'));

    if (!productData) {
        alert("Нет данных о продукте в URL");
        return;
    }

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
        updateDots('image-dots', images.length, currentImageIndex);
    }

    function updateReviewsSlider() {
        reviewsSlider.innerHTML = `<img src="${reviews[currentReviewIndex]}" class="slider-img">`;
        updateDots('review-dots', reviews.length, currentReviewIndex);
    }

    function updateDots(dotContainerId, dotCount, activeIndex) {
        const dotContainer = document.getElementById(dotContainerId);
        dotContainer.innerHTML = '';
        for (let i = 0; i < dotCount; i++) {
            const dot = document.createElement('span');
            dot.className = 'dot';
            if (i === activeIndex) dot.classList.add('active');
            dotContainer.appendChild(dot);
        }
    }

    function handleSwipe(slider, updateFunc, itemCount, getCurrentIndex, setCurrentIndex) {
        let startX = 0;
        let currentX = 0;

        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        slider.addEventListener('touchmove', (e) => {
            currentX = e.touches[0].clientX;
        });

        slider.addEventListener('touchend', () => {
            const swipeDistance = currentX - startX;
            const swipeThreshold = 50;

            if (swipeDistance > swipeThreshold) {
                setCurrentIndex((getCurrentIndex() - 1 + itemCount) % itemCount);
            } else if (swipeDistance < -swipeThreshold) {
                setCurrentIndex((getCurrentIndex() + 1) % itemCount);
            }

            updateFunc();
        });

        slider.addEventListener('click', (e) => {
            if (e.clientX < slider.clientWidth / 2) {
                setCurrentIndex((getCurrentIndex() - 1 + itemCount) % itemCount);
            } else {
                setCurrentIndex((getCurrentIndex() + 1) % itemCount);
            }
            updateFunc();
        });
    }

    handleSwipe(imageSlider, updateImageSlider, images.length, () => currentImageIndex, (index) => currentImageIndex = index);
    handleSwipe(reviewsSlider, updateReviewsSlider, reviews.length, () => currentReviewIndex, (index) => currentReviewIndex = index);

    updateImageSlider();
    updateReviewsSlider();

    document.getElementById('product-name').textContent = productData.name;
    document.getElementById('product-price').textContent = `${productData.price} ₽`;
    document.getElementById('product-old-price').textContent = `Старая цена: ${productData.old_price} ₽`;
    document.getElementById('stock-status').textContent = productData.in_stock ? 'В наличии' : 'Нет в наличии';
    document.getElementById('product-description').textContent = productData.description;

    const payButton = document.getElementById('pay-button');
    const modal = document.getElementById("modal");

    payButton.addEventListener('click', () => {
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
