document.addEventListener('DOMContentLoaded', () => {
    console.log("Инициализация страницы оформления заказа");

    const urlParams = new URLSearchParams(window.location.search);
    const productData = JSON.parse(urlParams.get('product_data'));
    const telegramUser = JSON.parse(localStorage.getItem('telegramUser'));

    // Проверка данных продукта и пользователя
    if (!productData) {
        alert("Ошибка: нет данных о продукте.");
        console.error("Нет данных о продукте в URL.");
        return;
    }

    if (!telegramUser || !telegramUser.id) {
        alert("Ошибка: данные пользователя не загружены.");
        console.error("Данные пользователя не найдены в localStorage.");
        return;
    }

    // Заполняем информацию о продукте
    const productImg = document.getElementById('product-img');
    const productName = document.getElementById('product-name');
    const productPrice = document.getElementById('product-price');
    const productDescription = document.getElementById('product-description');

    if (productImg) productImg.src = productData.image;
    if (productName) productName.textContent = productData.name;
    if (productPrice) productPrice.textContent = `${productData.price} ₽`;
    if (productDescription) productDescription.textContent = productData.description;

    // Получаем элементы модального окна и кнопки
    const payButton = document.getElementById("pay-button");
    const modal = document.getElementById("modal");
    const closeModal = document.querySelector(".close");

    // Проверка существования элементов
    if (!payButton) {
        alert("Кнопка 'Перейти к оплате' не найдена.");
        console.error("Элемент с id 'pay-button' отсутствует в HTML.");
        return;
    }

    if (!modal) {
        alert("Модальное окно не найдено.");
        console.error("Элемент с id 'modal' отсутствует в HTML.");
        return;
    }

    if (!closeModal) {
        alert("Кнопка закрытия модального окна не найдена.");
        console.error("Элемент с классом 'close' отсутствует в HTML.");
        return;
    }

    // Обработчик нажатия кнопки "Перейти к оплате"
    payButton.addEventListener('click', () => {
        console.log("Нажата кнопка 'Перейти к оплате'. Проверяем данные перед открытием модального окна:");
        console.log("Product ID:", productData.id);
        console.log("User ID:", telegramUser.id);

        modal.style.display = "block";
    });

    // Закрытие модального окна
    closeModal.addEventListener('click', () => {
        console.log("Нажата кнопка закрытия модального окна.");
        modal.style.display = "none";
    });

    // Обработка отправки формы
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

        console.log("Отправляем данные заказа:", orderData);

        fetch('https://gadgetmark.ru/validate-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Ответ сервера:", data);
            if (data.status === "success") {
                modal.style.display = "none";
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
