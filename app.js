let tg = window.Telegram.WebApp;

tg.expand();

tg.MainButton.textColor = '#FFFFFF';
tg.MainButton.color = '#2cab37';

let item = "";

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
        tg.MainButton.setText("Вы выбрали товар 1!");
        item = "1";
        tg.MainButton.show();
        logAndSendClick(item);
    }
});

btn2.addEventListener("click", function() {
    if (tg.MainButton.isVisible) {
        tg.MainButton.hide();
    } else {
        tg.MainButton.setText("Вы выбрали товар 2!");
        item = "2";
        tg.MainButton.show();
        logAndSendClick(item);
    }
});

btn3.addEventListener("click", function() {
    if (tg.MainButton.isVisible) {
        tg.MainButton.hide();
    } else {
        tg.MainButton.setText("Вы выбрали товар 3!");
        item = "3";
        tg.MainButton.show();
        logAndSendClick(item);
    }
});

btn4.addEventListener("click", function() {
    if (tg.MainButton.isVisible) {
        tg.MainButton.hide();
    } else {
        tg.MainButton.setText("Вы выбрали товар 4!");
        item = "4";
        tg.MainButton.show();
        logAndSendClick(item);
    }
});

btn5.addEventListener("click", function() {
    if (tg.MainButton.isVisible) {
        tg.MainButton.hide();
    } else {
        tg.MainButton.setText("Вы выбрали товар 5!");
        item = "5";
        tg.MainButton.show();
        logAndSendClick(item);
    }
});

btn6.addEventListener("click", function() {
    if (tg.MainButton.isVisible) {
        tg.MainButton.hide();
    } else {
        tg.MainButton.setText("Вы выбрали товар 6!");
        item = "6";
        tg.MainButton.show();
        logAndSendClick(item);
    }
});

Telegram.WebApp.onEvent("mainButtonClicked", function() {
    tg.sendData(item);
});

let usercard = document.getElementById("usercard");

let userImage = document.createElement("img");
userImage.src = tg.initDataUnsafe.user.photo_url;
userImage.alt = "User Photo";
userImage.style.borderRadius = "50%";
userImage.style.width = "100px";
userImage.style.height = "100px";
userImage.style.objectFit = "cover";

let userName = document.createElement("p");
userName.innerText = `${tg.initDataUnsafe.user.first_name} ${tg.initDataUnsafe.user.last_name}`;

usercard.appendChild(userImage);
usercard.appendChild(userName);
