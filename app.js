let tg = window.Telegram.WebApp;

tg.expand();

tg.MainButton.textColor = '#FFFFFF';
tg.MainButton.color = '#2cab37';

let selectedItem = "";

// Функция для обработки кликов по кнопкам
function setupButton(buttonId, itemNumber) {
    let button = document.getElementById(buttonId);
    button.addEventListener("click", function() {
        if (tg.MainButton.isVisible) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.setText(`Вы выбрали товар ${itemNumber}!`);
            selectedItem = itemNumber;
            tg.MainButton.show();
            logAndSendClick(selectedItem);
        }
    });
}

// Логирование и отправка данных
function logAndSendClick(item) {
    let timestamp = new Date().toISOString();
    let logData = {
        item: item,
        timestamp: timestamp,
        user: {
            first_name: tg.initDataUnsafe.user.first_name,
            last_name: tg.initDataUnsafe.user.last_name,
            username: tg.initDataUnsafe.user.username,
            id: tg.initDataUnsafe.user.id
        }
    };

    // Отправка данных в телеграм бот
    tg.sendData(JSON.stringify(logData));
}

// Настройка всех кнопок
setupButton("btn1", "1");
setupButton("btn2", "2");
setupButton("btn3", "3");
setupButton("btn4", "4");
setupButton("btn5", "5");
setupButton("btn6", "6");

// Обработка клика по основной кнопке Telegram
Telegram.WebApp.onEvent("mainButtonClicked", function() {
    tg.sendData(selectedItem);
});

// Отображение информации о пользователе
let usercard = document.getElementById("usercard");

if (tg.initDataUnsafe.user) {
    let userImage = document.createElement("img");
    userImage.src = tg.initDataUnsafe.user.photo_url || 'default-avatar.png';
    userImage.alt = "User Photo";
    userImage.style.borderRadius = "50%";
    userImage.style.width = "100px";
    userImage.style.height = "100px";

    let userInfo = document.createElement("p");
    userInfo.innerText = `${tg.initDataUnsafe.user.first_name} ${tg.initDataUnsafe.user.last_name}\n@${tg.initDataUnsafe.user.username}`;

    usercard.appendChild(userImage);
    usercard.appendChild(userInfo);
}
