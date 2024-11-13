document.getElementById("user-form").addEventListener("submit", function(event) {
    event.preventDefault();

    // Извлекаем значения из полей ввода
    const fullName = document.getElementById("full-name")?.value || "";
    const phoneNumber = document.getElementById("phone-number")?.value || "";
    const email = document.getElementById("email")?.value || "";

    // Логируем значения полей формы
    alert(`Проверка значений формы:\n
        Full Name: ${fullName}\n
        Phone Number: ${phoneNumber}\n
        Email: ${email}`);

    // Проверяем, что поля заполнены
    if (!fullName || !phoneNumber || !email) {
        alert("Ошибка: Все поля формы должны быть заполнены.");
        return;
    }

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

    // Проверяем перед отправкой
    alert(`Отправляем данные на сервер:\n
        Product ID: ${orderData.product_id}\n
        User ID: ${orderData.user_data.user_id}\n
        Full Name: ${orderData.user_data.full_name}\n
        Phone Number: ${orderData.user_data.phone_number}\n
        Email: ${orderData.user_data.email}`);

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
