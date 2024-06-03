function ham() {
  let ham = document.querySelector(".menu-btn>ion-icon");
  let menu = document.querySelector(".nav");
  if (ham.getAttribute("name") == "menu-outline") {
    ham.style.transform = "rotateZ(0deg)";
    menu.style.height = "171px";
    ham.setAttribute("name", "close-outline");
  } else {
    ham.style.transform = "rotateZ(360deg)";
    menu.style.height = "0px";
    ham.setAttribute("name", "menu-outline");
  }
}

function checkout() {
  if (document.getElementById("total").innerText != 0) {
    if (document.querySelector(".address").style.display == "none") {
      document.querySelector(".address").style.display = "flex";
    } else {
      document.querySelector(".address").style.display = "none";
    }
  } else {
    alert("Please select from Menu first");
  }
}

function add(n) {
  let k = parseInt(n.querySelector(".qty").innerText);
  n.querySelector(".qty").innerText = ++k;
  let parent = n.parentNode;
  let price1 = parent.querySelector(".price1");
  let price = parent.querySelector(".price");
  parent = price1.innerText.replace("$", "");
  parent = parseFloat(parent);
  price.innerText = parent * k + "$";
  config();
}

function remove(n) {
  let k = parseInt(n.querySelector(".qty").innerText);
  if (k - 1 > 0) n.querySelector(".qty").innerText = --k;
  let parent = n.parentNode;
  let price1 = parent.querySelector(".price1");
  let price = parent.querySelector(".price");
  parent = price1.innerText.replace("$", "");
  parent = parseFloat(parent);
  price.innerText = parent * k + "$";
  config();
}

function removeCartItem(button) {
  let cartCard = button.closest(".cartcard");
  cartCard.querySelector(".price").innerText = "0$";
  cartCard.style.display = "none";
  eraseCookie(cartCard.querySelector(".qty").getAttribute("data-id"));
  console.log(getCookie("count") > 0 ? parseInt(getCookie("count") - 1) : 0);
  setCookie(
    "count",
    JSON.stringify(
      parseInt(getCookie("count")) > 0 ? parseInt(getCookie("count") - 1) : 0
    ),
    14
  );
  document.getElementById("cart-count").innerText = getCookie("count");
  config();
}

function config() {
  let total = document.getElementById("total");
  let n = 0;
  document.querySelectorAll(".price").forEach((e) => {
    n += parseFloat(e.innerText);
  });
  total.innerText = n;
}

function showToast(n) {
  document.getElementById("toast").innerText = n;
  document.getElementById("toast").style.left = "1%";
}

function hideToast() {
  document.getElementById("toast").style.left = "-100%";
}

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
  let nameEQ = name + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function eraseCookie(name) {
  // document.cookie = name + '=; Max-Age=-99999999;';
  document.cookie =
    name + "=; Max-Age=-99999999;" + ("/" ? " path=" + "/" + ";" : "");
}

// let itemCount = getCookie("count") != null ? getCookie("count") : 0;

if (getCookie("count") != null)
  document.getElementById("cart-count").innerText = getCookie("count");
// else
//   document.getElementById("cart-count").innerText = 0;

let cookie = document.cookie.split("; ");

cookie.pop();

cookie = cookie.map((item) => parseInt(item.split("=")[0]));

cookie = JSON.stringify(cookie);

cookie = JSON.parse(cookie);

const cart = document.getElementById("cart");

async function postData(data) {
  const response = await fetch("/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: data }),
  });
  return response.json();
}

async function post(
  name,
  phone,
  street,
  house,
  city,
  ids = [],
  qty = [],
  total
) {
  const response = await fetch("/confirm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      n: name,
      p: phone,
      s: street,
      h: house,
      c: city,
      id: ids,
      q: qty,
      t: total,
    }),
  });
  return response.text();
}

if (getCookie("count") != null || getCookie("count") != undefined)
  cookie.forEach(async (e) => {
    let data = await postData(e);
    console.log(data);
    const div = document.createElement("div");
    div.classList.add("cartcard");

    div.innerHTML = `
  <div>
      <img src="../img/1 Hamburger, 1 Durum + 1 Doner.jpeg" alt="">
      <div class="cartdiv">
          <h3>${data.name}</h3>
          <h5 class="price1">${data.price}€</h5>
          <button class="remove" onclick="removeCartItem(this)">remove</button>
      </div>
  </div>
  <div class="qtyup">
      <ion-icon name="remove-circle-outline" onclick="remove(this.parentNode)"></ion-icon>
      <p class="qty" data-id="${data.id}">1</p>
      <ion-icon name="add-circle-outline" onclick="add(this.parentNode)"></ion-icon>
  </div>
  <p class="price">${data.price}€</p>
`;

    cart.prepend(div);
    config();
  });

document.getElementById("order").addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const street = document.getElementById("street").value;
  const house = document.getElementById("house").value;
  const city = document.getElementById("city").value;

  if (name != "" && phone != "" && street != "" && house != "" && city != "") {
    hideToast();
    showToast('Wait a Moment!');
    let id = [],
      qty = [];
    document.querySelectorAll(".qty").forEach((e) => {
      id.push(e.getAttribute("data-id"));
      qty.push(e.innerText);
    });
    const total = document.getElementById("total").innerText;
    const res = await post(name, phone, street, house, city, id, qty, total);
    // console.log(res);
    id.forEach(id => {
      console.log(`Erasing cookie for ID: ${id}`);
      eraseCookie(id);
    });
    checkout();
    eraseCookie("count");
    document.getElementById('cart-count').innerText='0';
    hideToast();
    showToast("Order Completed Successfully!");
    setTimeout(hideToast, 5000);
    document.getElementById("cart").innerHTML = `<div style="width: 100%; height: 80vh; display: flex; justify-content: center; align-items: center; font-size: 2rem; font-weight: bold; color: #cb3129; text-align: center;">Order Completed Successfully!<br>For Inquiries Contact<br>+34-664-17-26-76</div>`;
  } else {
    hideToast();
    showToast("Please Fill in All the Fields");
    setTimeout(hideToast, 1000);
  }
});
