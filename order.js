document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productData = JSON.parse(urlParams.get('product_data'));

    if (!productData) {
        alert("Нет данных о продукте в URL");
        return;
    }

    // Извлечение данных пользователя из localStorage
    const telegramUser = JSON.parse(localStorage.getItem('telegramUser'));

    if (!telegramUser || !telegramUser.id) {
        alert("Ошибка: данные пользователя отсутствуют. Перейдите на главную страницу и попробуйте снова.");
        console.error("Данные пользователя не найдены или отсутствует user_id.");
        return;
    }

    // Логируем данные пользователя
    alert(`Данные пользователя загружены: user_id = ${telegramUser.id}, username = ${telegramUser.username}`);

    // Обработчик кнопки "Перейти к оплате"
    document.getElementById("pay-button").addEventListener("click", () => {
        const selectedOptions = {
            color: document.querySelector('.color-option.selected')?.getAttribute('data-value')?.toLowerCase(),
            memory: document.querySelector('.memory-option.selected')?.textContent.toLowerCase(),
            connectivity: document.querySelector('.connectivity-option.selected')?.textContent.toLowerCase(),
        };

        const fullName = document.getElementById("full-name").value;
        const phoneNumber = document.getElementById("phone-number").value;
        const email = document.getElementById("email").value;

        const orderData = {
            product_id: productData.id,
            selectedOptions: selectedOptions,
            user_data: {
                user_id: telegramUser.id,
                full_name: fullName,
                phone_number: phoneNumber,
                email: email,
                username: telegramUser.username
            }
        };

        // Выводим данные заказа в alert для отладки
        alert(`Данные заказа:\n
            Product ID: ${orderData.product_id}\n
            Выбранные опции: ${JSON.stringify(selectedOptions)}\n
            User ID: ${orderData.user_data.user_id}\n
            Full Name: ${orderData.user_data.full_name}\n
            Phone Number: ${orderData.user_data.phone_number}\n
            Email: ${orderData.user_data.email}\n
            Username: ${orderData.user_data.username}`);

        // Дополнительная проверка перед отправкой
        if (!orderData.user_data.user_id) {
            alert("Ошибка: user_id отсутствует перед отправкой заказа.");
            console.error("user_id отсутствует в данных заказа.");
            return;
        }

        // Отправляем данные на сервер
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
