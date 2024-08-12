document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productData = JSON.parse(urlParams.get('product_data'));

    if (!productData) {
        console.error("No product data found in the URL");
        return;
    }

    // Update the UI with product data
    const productImg = document.getElementById('product-img');
    const productName = document.getElementById('product-name');
    const productPrice = document.getElementById('product-price');
    const productOldPrice = document.getElementById('product-old-price');

    if (productImg) productImg.src = productData.image;
    if (productName) productName.textContent = productData.name;
    if (productPrice) productPrice.textContent = `${productData.price} ₽`;
    if (productOldPrice && productData.old_price) {
        productOldPrice.textContent = `${productData.old_price} ₽`;
    }

    // Dynamically populate color options
    const colorOptionsContainer = document.getElementById('color-options');
    if (colorOptionsContainer && productData.colors) {
        productData.colors.forEach(color => {
            const colorOption = document.createElement('div');
            colorOption.className = 'color-option';
            colorOption.style.backgroundColor = color.toLowerCase();
            colorOptionsContainer.appendChild(colorOption);
        });
    }

    // Dynamically populate memory options
    const memoryOptionsContainer = document.getElementById('memory-options');
    if (memoryOptionsContainer && productData.memory) {
        productData.memory.forEach(memory => {
            const memoryOption = document.createElement('div');
            memoryOption.className = 'memory-option';
            memoryOption.textContent = memory;
            memoryOptionsContainer.appendChild(memoryOption);
        });
    }

    // Dynamically populate connectivity options
    const connectivityOptionsContainer = document.getElementById('connectivity-options');
    if (connectivityOptionsContainer && productData.connectivity) {
        productData.connectivity.forEach(connectivity => {
            const connectivityOption = document.createElement('div');
            connectivityOption.className = 'connectivity-option';
            connectivityOption.textContent = connectivity;
            connectivityOptionsContainer.appendChild(connectivityOption);
        });
    }

    // Handle payment button click
    const payButton = document.getElementById('pay-button');
    if (payButton) {
        payButton.addEventListener('click', () => {
            const selectedOptions = {
                color: document.querySelector('.color-option.selected')?.style.backgroundColor,
                memory: document.querySelector('.memory-option.selected')?.textContent,
                connectivity: document.querySelector('.connectivity-option.selected')?.textContent,
            };

            // Send selected options to the server for validation
            fetch('http://127.0.0.1:8000/validate-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    product_id: productData.id,
                    selectedOptions: selectedOptions,
                    chat_id: "your_chat_id",  // замените на реальный chat_id
                    product_name: productData.name,
                    price: productData.price,
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    alert('Redirecting to payment...');
                } else {
                    showError(data.message);
                }
            })
            .catch(error => {
                showError('Произошла ошибка при обработке заказа. Пожалуйста, попробуйте снова.');
                console.error('Error:', error);
            });
        });
    }

    function showError(message) {
        alert(message); // временное решение, здесь можно добавить модальное окно для отображения ошибок
    }
});
