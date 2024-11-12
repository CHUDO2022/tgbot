document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productData = JSON.parse(urlParams.get('product_data'));

    if (!productData) {
        alert("Ошибка: нет данных о продукте.");
        return;
    }

    const telegramUser = JSON.parse(localStorage.getItem('telegramUser'));

    if (!telegramUser) {
        console.error("Данные пользователя не найдены.");
        return;
    }

    const productImg = document.getElementById('product-img');
    const productName = document.getElementById('product-name');
    const productPrice = document.getElementById('product-price');
    const productOldPrice = document.getElementById('product-old-price');
    const productDescription = document.getElementById('product-description');
    const stockStatus = document.getElementById('stock-status');
    const imageSlider = document.getElementById('image-slider');
    const reviewSlider = document.getElementById('review-slider');
    const btn = document.getElementById("pay-button");

    productImg.src = productData.image || 'https://via.placeholder.com/600x300';
    productName.textContent = productData.name;
    productPrice.textContent = productData.price ? `${productData.price} ₽` : 'Цена не указана';
    productOldPrice.textContent = productData.old_price ? `${productData.old_price} ₽` : '';
    productDescription.textContent = productData.description;

    stockStatus.textContent = productData.in_stock === 'Да' ? 'В наличии' : 'Нет в наличии';
    stockStatus.style.color = productData.in_stock === 'Да' ? 'green' : 'red';

    productData.images.forEach(imgUrl => {
        const img = document.createElement('img');
        img.src = imgUrl;
        img.classList.add('slider-img');
        imageSlider.appendChild(img);
    });

    productData.reviews.forEach(reviewUrl => {
        const reviewImg = document.createElement('img');
        reviewImg.src = reviewUrl;
        reviewImg.classList.add('slider-img');
        reviewSlider.appendChild(reviewImg);
    });

    btn.onclick = () => {
        if (productData.in_stock !== 'Да') {
            alert('Товар отсутствует в наличии.');
            return;
        }
        const modal = document.getElementById("modal");
        modal.style.display = "block";
    };

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
                alert('Заказ успешно оформлен!');
                window.location.href = "https://t.me/QSale_iphone_bot";
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            alert('Ошибка при оформлении заказа.');
            console.error(error);
        });
    });

    document.querySelector(".close").onclick = () => {
        const modal = document.getElementById("modal");
        modal.style.display = "none";
    };
});
