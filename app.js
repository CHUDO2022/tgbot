Skip to content
Navigation Menu
CHUDO2022
/
tgbot

Type / to search
Code
Issues
Pull requests
Actions
Projects
Wiki
Security
1
Insights
Settings
Commit
Update app.js
 main
@CHUDO2022
CHUDO2022 committed 4 hours ago 
1 parent 846cccd
commit 18f32ac
Showing 1 changed file with 3 additions and 2 deletions.
  5 changes: 3 additions & 2 deletions5  
app.js
Copied!
Original file line number	Diff line number	Diff line change
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    const userCard = document.getElementById('usercard');
    const telegram = window.Telegram.WebApp;
    const userInfo = document.getElementById('user-info');
    const userFooter = document.getElementById('user-footer');
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
    });
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.id.replace('btn', ''); // Извлекаем номер товара из id кнопки
            const message = `Вы выбрали такой товар №${productId}`;
            userCard.textContent = message;

            // Отправляем данные в Telegram бот
            const data = { productId: productId, message: message };
            const data = { productId: productId, message: message, query_id: telegram.initDataUnsafe.query_id };
            telegram.sendData(JSON.stringify(data));

            // Для отладки выводим данные в консоль
            console.log('Отправленные данные:', data);
        });
    });
    const closeBtn = document.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        telegram.close();
    });
    // Получаем данные о пользователе из Telegram Web Apps API
    const initDataUnsafe = telegram.initDataUnsafe;
    console.log('initDataUnsafe:', initDataUnsafe);  // Отладочный вывод
    
    const user = initDataUnsafe.user;
    if (user) {
        console.log('Данные пользователя:', user); // Отладочный вывод
        let profName = document.createElement('p'); //создаем параграф
        profName.innerText = `${user.first_name} ${user.last_name || ''} (${user.username || ''}) [${user.language_code || ''}]`;
        userCard.appendChild(profName); //добавляем 
        let userid = document.createElement('p'); //создаем еще параграф 
        userid.innerText = `ID: ${user.id}`; //показываем user_id
        userCard.appendChild(userid); //добавляем
        userInfo.innerHTML = `
            <img src="https://cdn-icons-png.flaticon.com/512/149/149452.png" alt="User Icon">
            <span>
                <span class="username">${user.first_name}</span>
                <span class="status">Новичок</span>
            </span>
        `;
        // Отправляем данные пользователя в Telegram бот
        const userData = {
            action: 'get_user_data',
            user_id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            phone_number: initDataUnsafe.user.phone_number || ''  // Проверка наличия номера телефона
            phone_number: initDataUnsafe.user.phone_number || '',  // Проверка наличия номера телефона
            query_id: telegram.initDataUnsafe.query_id
        };
        telegram.sendData(JSON.stringify(userData));
        console.log('Отправленные данные пользователя:', userData); // Отладочный вывод
        // Отображаем имя пользователя внизу страницы
        userFooter.innerText = `Пользователь: ${user.first_name} ${user.last_name || ''} (${user.username || ''})`;
    } else {
        console.log('Нет данных пользователя'); // Отладочный вывод
    }
    // Получаем данные из Telegram бота
    telegram.onEvent('web_app_data', function(data) {
        const profileData = JSON.parse(data);
        console.log('Получены данные профиля:', profileData); // Отладочный вывод
        profileInfo.innerHTML = `
            <p>Имя: ${profileData.first_name} ${profileData.last_name}</p>
            <p>Username: ${profileData.username}</p>
            <p>Phone: ${profileData.phone_number}</p>
            <p>ID: ${profileData.user_id}</p>
        `;
        userInfo.innerHTML = `
            <img src="https://cdn-icons-png.flaticon.com/512/149/149452.png" alt="User Icon">
            <span>
                <span class="username">${profileData.first_name}</span>
                <span class="status">Новичок</span>
            </span>
        `;
    });
});
0 comments on commit 18f32ac
@CHUDO2022
Comment
 
Leave a comment
 
 You’re receiving notifications because you’re watching this repository.
Footer
© 2024 GitHub, Inc.
Footer navigation
Terms
Privacy
Security
Status
Docs
Contact
Manage cookies
Do not share my personal information
Copied!
