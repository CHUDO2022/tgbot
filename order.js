document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productData = JSON.parse(urlParams.get('product_data'));

    if (!productData) {
        alert("Ошибка: нет данных о продукте.");
        return;
    }

    // Извлечение элементов
    const productImg = document.getElementById('product-img');
    const productName = document.getElementById('product-name');
    const productPrice = document.getElementById('product-price');
    const productOldPrice = document.getElementById('product-old-price');
    const productStock = document.getElementById('product-stock');
    const productDescription = document.getElementById('product-description');
    const payButton = document.getElementById('pay-button');
    const userModal = document.getElementById('user-modal');
    const closeModal = document.querySelector('.close-modal');
    const userForm = document.getElementById('user-form');

    // Установка данных о продукте
    let currentImageIndex = 0;
    const images = productData.images || [];

    if (images.length > 0) {
        productImg.src = images[currentImageIndex];
    }

    productName.textContent = productData.name;
    productPrice.textContent = `${productData.price} ₽`;
    productOldPrice.textContent = productData.old_price ? `Старая цена: ${productData.old_price} ₽` : '';
    productStock.textContent = productData.in_stock === 'Да' ? 'В наличии' : 'Нет в наличии';
    productDescription.textContent = productData.description;

    // Обработчики для переключения изображений
    document.getElementById('prev-button').addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        productImg.src = images[currentImageIndex];
    });

    document.getElementById('next-button').addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        productImg.src = images[currentImageIndex];
    });

    // Открытие модального окна
    payButton.addEventListener('click', () => {
        userModal.style.display = 'block';
    });

    // Закрытие модального окна
    closeModal.addEventListener('click', () => {
        userModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === userModal) {
            userModal.style.display = 'none';
        }
    });

    // Обработка отправки формы
    userForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const fullName = document.getElementById('full-name').value;
        const phoneNumber = document.getElementById('phone-number').value;
        const email = document.getElementById('email').value;

        const orderData = {
            product_id: productData.id,
            user_data: {
                full_name: fullName,
                phone_number: phoneNumber,
                email: email
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
                userModal.style.display = 'none';
            } else {
                alert(`Ошибка при отправке заказа: ${data.message}`);
            }
        })
        .catch(error => {
            alert('Произошла ошибка при отправке заказа.');
            console.error('Error:', error);
        });
    });
});
