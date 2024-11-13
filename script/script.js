const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

// Função para fechar o alerta manualmente
  function closeAlert() {
    document.getElementById('alert').style.display = 'none';
  }

  // Configura o alerta para desaparecer automaticamente após 3 segundos
  setTimeout(closeAlert, 5000);

let cart =[];

// abrir o carrinho
cartBtn.addEventListener("click", function () {
    cartModal.style.display = "flex"
    updateCartModal();
});

//fechar o modal ao clicar fora do modal
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }
});

closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none"
});

menu.addEventListener("click", function (event) {
    let parentButton = event.target.closest(".add-to-cart-btn")
    
    
    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        

        //adicionar ao carrinho
        addToCart(name, price)
    }
});

//função para adicionar no carrinho
function addToCart(name, price) {
const exitingItem = cart.find(item => item.name === name)
    
    if (exitingItem) {
        exitingItem.quanty += 1;

    } else {
        cart.push({
            name,
            price,
            quanty: 1,
        });
    }

    updateCartModal();
    
};

function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = 
        `
        <div class="flex ietms-center justify-between">
            <div class="">
                <p class="font-bold">${item.name}</p>
                <p>Qtd: ${item.quanty}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>

            <div>
                <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>
            </div>


        </div>
        `;
        total += item.price * item.quanty;
        cartItemsContainer.appendChild(cartItemElement)
        
    });

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerText = cart.length;
};

//função para remover o item do carrinho
cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name")
        
        removeItemCart(name);
        
    }
});

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];
        
        if (item.quanty > 1) {
            item.quanty -= 1;
            updateCartModal();
            return;
        }
        cart.splice(index, 1);
        updateCartModal();
    }
};

addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500");
        addressWarn.classList.add("hidden");
    }
});

checkoutBtn.addEventListener("click", function () {
    const isOpen = checkRestauranteOpen();
    if (!isOpen) {
        Toastify({
            text: "Ops... O restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "ef4444",
            },
          }).showToast();

        return;
    }

    if (cart.length === 0) return;
    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
    };

    const cartItems = cart.map((item) => {
        return (
            `
${item.name}
Quantidade: (${item.quanty});
Preço: R$ ${item.price}
            `
        )
    }).join();
    const message = encodeURIComponent(cartItems)
    const phone = "+5500123456789"

window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank");
    
    cart = [];
    updateCartModal();

});

function checkRestauranteOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestauranteOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
} else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}
