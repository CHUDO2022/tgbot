document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productData = JSON.parse(urlParams.get('product_data'));

    // Проверка наличия данных о продукте
    if (!productData) {
        alert("Ошибка: нет данных о продукте.");
        return;
    }

    // Элементы страницы
    const imageSlider = document.getElementById('slides');
    const productName = document.getElementById('product-name');
    const productPrice = document.getElementById('product-price');
    const productOldPrice = document.getElementById('product-old-price');
    const inStockStatus = document.getElementById('in-stock-status');
    const productDescription = document.getElementById('product-description');
    const userForm = document.getElementById('user-form');

    // Установка данных о продукте
    productName.textContent = productData.name;
    productPrice.textContent = `${productData.price} ₽`;
    if (productData.old_price) {
        productOldPrice.textContent = `Старая цена: ${productData.old_price} ₽`;
    }
    inStockStatus.textContent = productData.in_stock === 'Да' ? 'В наличии' : 'Нет в наличии';
    inStockStatus.className = productData.in_stock === 'Да' ? 'in-stock' : 'out-of-stock';
    productDescription.textContent = productData.description;

    // Создание слайдера изображений
    if (productData.images && productData.images.length > 0) {
        console.log('Загрузка изображений:', productData.images);

        productData.images.forEach((imageUrl, index) => {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = `Изображение ${index + 1}`;
            img.classList.add('slider-img');

            // Обработка ошибки загрузки изображения
            img.onerror = () => {
                img.src = 'https://via.placeholder.com/600x300';
                console.error(`Ошибка загрузки изображения: ${imageUrl}`);
            };

            imageSlider.appendChild(img);
        });
    } else {
        console.error('Нет изображений для загрузки.');
        const placeholderImg = document.createElement('img');
        placeholderImg.src = 'https://via.placeholder.com/600x300';
        placeholderImg.alt = 'Изображение отсутствует';
        placeholderImg.classList.add('slider-img');
        imageSlider.appendChild(placeholderImg);
    }

    // Логика слайдера
    let currentSlide = 0;
    const slides = imageSlider.querySelectorAll('.slider-img');

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
        });
    }

    // Кнопки навигации слайдера
    document.getElementById('prev-slide').addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    });

    document.getElementById('next-slide').addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    });

    // Инициализация слайдера
    showSlide(currentSlide);

    // Обработчик формы заказа
    userForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const fullName = document.getElementById('full-name').value;
        const phoneNumber = document.getElementById('phone-number').value;
        const email = document.getElementById('email').value;

        // Проверка на заполненность полей
        if (!fullName || !phoneNumber || !email) {
            alert('Пожалуйста, заполните все поля формы.');
            return;
        }

        const orderData = {
            product_id: productData.id,
            selectedOptions: {
                color: productData.colors ? productData.colors[0] : 'Не указан',
                memory: productData.memory ? productData.memory[0] : 'Не указана',
                connectivity: productData.connectivity ? productData.connectivity[0] : 'Не указано',
            },
            user_data: {
                full_name: fullName,
                phone_number: phoneNumber,
                email: email,
            }
        };

        // Отправка данных заказа на сервер
        fetch('https://gadgetmark.ru/validate-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Ваш заказ успешно отправлен!');
                window.location.href = 'https://t.me/QSale_iphone_bot';
            } else {
                alert(`Ошибка при отправке заказа: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Ошибка при отправке заказа:', error);
            alert('Произошла ошибка. Пожалуйста, попробуйте снова.');
        });
    });
});
