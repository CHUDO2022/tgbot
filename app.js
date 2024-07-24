let tg = window.Telegram.WebApp;

tg.expand();
tg.MainButton.textColor = '#FFFFFF';
tg.MainButton.color = '#2cab37';

let item = "";

// Функция для отправки данных о нажатии
function sendClickData(buttonId, itemValue, itemText) {
    let timestamp = new Date().toISOString();
    let clickData = {
        item: itemValue,
        timestamp: timestamp,
        buttonId: buttonId,
        user: {
            first_name: tg.initDataUnsafe.user.first_name,
            last_name: tg.initDataUnsafe.user.last_name,
            username: tg.initDataUnsafe.user.username,
            id: tg.initDataUnsafe.user.id
        }
    };
    tg.sendData(JSON.stringify(clickData));
    tg.MainButton.setText(itemText);
    item = itemValue;
    tg.MainButton.show();
}

let btn1 = document.getElementById("btn1");
let btn2 = document.getElementById("btn2");
let btn3 = document.getElementById("btn3");
let btn4 = document.getElementById("btn4");
let btn5 = document.getElementById("btn5");
let btn6 = document.getElementById("btn6");

btn1.addEventListener("click", function() {
    if (tg.MainButton.isVisible) {
        tg.MainButton.hide();
    } else {
        sendClickData("btn1", "1", "Вы выбрали товар 1!");
    }
});

btn2.addEventListener("click", function() {
    if (tg.MainButton.isVisible) {
        tg.MainButton.hide();
    } else {
        sendClickData("btn2", "2", "Вы выбрали товар 2!");
    }
});

btn3.addEventListener("click", function() {
    if (tg.MainButton.isVisible) {
        tg.MainButton.hide();
    } else {
        sendClickData("btn3", "3", "Вы выбрали товар 3!");
    }
});

btn4.addEventListener("click", function() {
    if (tg.MainButton.isVisible) {
        tg.MainButton.hide();
    } else {
        sendClickData("btn4", "4", "Вы выбрали товар 4!");
    }
});

btn5.addEventListener("click", function() {
    if (tg.MainButton.isVisible) {
        tg.MainButton.hide();
    } else {
        sendClickData("btn5", "5", "Вы выбрали товар 5!");
    }
});

btn6.addEventListener("click", function() {
    if (tg.MainButton.isVisible) {
        tg.MainButton.hide();
    } else {
        sendClickData("btn6", "6", "Вы выбрали товар 6!");
    }
});

Telegram.WebApp.onEvent("mainButtonClicked", function() {
    tg.sendData(item);
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
