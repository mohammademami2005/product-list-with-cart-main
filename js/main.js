$(document).ready(function () {
  $.getJSON("../data.json", function (data) {
    const dessertList = $(".cardContainer");
    data.forEach(function (dessert) {
      const dessertItem = `
        <div class="dessert-item">
          <div>
            <picture>
              <source media="(max-width:768px)" srcset="${
                dessert.image.mobile
              }">
              <source media="(max-width:1024px)" srcset="${
                dessert.image.tablet
              }">
              <img src="${dessert.image.desktop}" alt="${
        dessert.name
      }" class="dessert-image">
            </picture>
          </div>
          <button class="btn">
            <img src="../assets/images/icon-add-to-cart.svg" alt="Add to Cart">
            <span>Add to Cart</span>
          </button>
          <p class="category">${dessert.category}</p>
          <h3>${dessert.name}</h3>
          <p class="price">$${dessert.price.toFixed(2)}</p>
        </div>
      `;
      dessertList.append(dessertItem);
    });
    addToCart();
  }).fail(function () {
    console.error("Failed to fetch data.");
  });

  function addToCart() {
    $(".btn").on("click", function (event) {
      event.preventDefault();
      const dessertName = $(this).siblings("h3").text();
      const dessertPrice = parseFloat(
        $(this).siblings(".price").text().replace("$", "")
      );

      // Create the cart item HTML
      let cartItemValue = `
        <div class="cart-item">
          <div class="d-flex flex-column" id="cartItemDiv">
            <p class="dessertName">${dessertName}</p>
            <div class="d-flex justify-content-start gap-2" id="div3">
              <span class="numberOfProduct">1x</span>
              <span class="priceOfProduct">@ $${dessertPrice.toFixed(2)}</span>
              <span class="totalPriceInCart">$${dessertPrice.toFixed(2)}</span>
            </div>
          </div>
          <img class="btn remove-item" src="../assets/images/icon-remove-item.svg" alt="Remove Item">
        </div>
      `;

      let newBtn = `
      <div class="newBtn">
        <button id="minus">-</button>
        <span class="numberOfProduct">1</span>
        <button id="plus">+</button>
      </div>
      `;
     
      $(this).closest(".btn").replaceWith(newBtn);
      $("#cart-items").empty();
      $("#cart-items").before(cartItemValue);
      updateCartCount();
      updateOrderTotal();
    });
  }

  // Function to handle the plus button click
  $(document).on("click", "#plus", function (event) {
    event.preventDefault();
    const cartItem = $(this).closest(".row");
    let numberOfProduct =
      parseInt(cartItem.find(".numberOfProduct").text()) || 0;
    numberOfProduct++;

    cartItem.find(".numberOfProduct").text(`${numberOfProduct}x`);

    // Update total price
    const pricePerItem = parseFloat(
      cartItem.find(".priceOfProduct").text().replace("@ $", "")
    );
    const totalPrice = (numberOfProduct * pricePerItem).toFixed(2);
    cartItem.find(".totalPriceInCart").text(`$${totalPrice}`);

    updateOrderTotal();
  });

  // Function to handle the minus button click
  $(document).on("click", "#minus", function (event) {
    event.preventDefault();
    const cartItem = $(this).closest(".row");
    let numberOfProduct =
      parseInt(cartItem.find(".numberOfProduct").text()) || 0;

    if (numberOfProduct > 1) {
      numberOfProduct -= 1;
      cartItem.find(".numberOfProduct").text(`${numberOfProduct}x`);

      // Update total price
      const pricePerItem = parseFloat(
        cartItem.find(".priceOfProduct").text().replace("@ $", "")
      );
      const totalPrice = (numberOfProduct * pricePerItem).toFixed(2);
      cartItem.find(".totalPriceInCart").text(`$${totalPrice}`);
    } else {
      const cartDefault = `                
      <p>Your Cart (<span id="cart-count">0</span>)</p>
      <div id="cart-items">
        <img src="assets/images/illustration-empty-cart.svg" alt="">
        <p>Your added items will appear here</p>
      </div>`;
      let oldBtn = `
      <button class="btn">
        <img src="../assets/images/icon-add-to-cart.svg" alt="Add to Cart">
        <span>Add to Cart</span>
      </button>
    `;
      $(".cartContainer").empty().append(cartDefault);
      // $(this).html(oldBtn);
    }

    updateOrderTotal();
    updateCartCount();
  });

  // Function to remove item from cart
  $(document).on("click", ".remove-item", function () {
    $(this).closest(".cart-item").remove();
    updateOrderTotal();
    updateCartCount();
  });

  function updateCartCount() {
    const cartCount = $("#cart-items").children().length;
    $("#cart-count").text(cartCount);
    console.log(cartCount);
  }

  function updateOrderTotal() {
    let total = 0;
    $(".totalPriceInCart").each(function () {
      total += parseFloat($(this).text().replace("$", ""));
    });
    $("#orderTotal").text(total.toFixed(2));
  }
});
