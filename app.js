document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    const userCard = document.getElementById('usercard');
    const telegram = window.Telegram.WebApp;

    const homeBtn = document.getElementById('home-btn');
    const profileBtn = document.getElementById('profile-btn');
    const mainContent = document.getElementById('main-content');
    const profileContent = document.getElementById('profile-content');
    const profileInfo = document.getElementById('profile-info');

    homeBtn.addEventListener('click', () => {
        mainContent.classList.remove('hidden');
        profileContent.classList.add('hidden');
    });

    profileBtn.addEventListener('click', () => {
        mainContent.classList.add('hidden');
        profileContent.classList.remove('hidden');

        // Запрашиваем данные профиля пользователя у Telegram бота
        telegram.sendData(JSON.stringify({ action: 'get_profile' }));
    });

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.id.replace('btn', ''); // Извлекаем номер товара из id кнопки
            const message = `Вы выбрали такой товар №${productId}`;
            userCard.textContent = message;

            // Отправляем данные в Telegram бот
            const data = { productId: productId, message: message };
            telegram.sendData(JSON.stringify(data));

            // Для отладки выводим данные в консоль
            console.log('Отправленные данные:', data);
        });
    });

    const closeBtn = document.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        telegram.close();
    });

    // Получаем данные из Telegram бота
    telegram.onEvent('web_app_data', function(data) {
        const profileData = JSON.parse(data);
        profileInfo.innerHTML = `
            <p>Имя: ${profileData.name}</p>
            <p>Email: ${profileData.email}</p>
        `;
    });
});
