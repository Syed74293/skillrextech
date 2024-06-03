function adjustHeaderHeight() {
  nav_offsetHeight = document.querySelector(".nav").offsetHeight;
  const navHeight = document.querySelector("nav").offsetHeight;
  const headerSection = document.getElementById("headerSection");
  headerSection.style.height = `calc(100vh - ${navHeight}px)`;
}

window.addEventListener("load", adjustHeaderHeight);
window.addEventListener("resize", adjustHeaderHeight);

// Scrollto Function
document.getElementById("contactus").onclick = () => {
  const targetElement = document.getElementById("contact");
  window.scrollTo({
    top: targetElement.offsetTop,
    behavior: "smooth",
  });
};

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

let itemCount = getCookie("count") != null ? getCookie("count") : 0;

if (getCookie("count") != null)
  document.getElementById("cart-count").innerText = getCookie("count");

document.querySelectorAll(".cartbtn").forEach((e) => {
  e.addEventListener("click", () => {
    let k = e.getAttribute("data-id");
    if (k != null || k != undefined)
      if (getCookie(k) == null) {
        setCookie(k, k, 14);
        setCookie("count", ++itemCount, 14);
        document.getElementById("cart-count").innerText = itemCount;
        hideToast();
        showToast("Added to Cart");
        setTimeout(hideToast, 1000);
      } else {
        hideToast();
        showToast("Already Added to Cart");
        setTimeout(hideToast, 1000);
      }
  });
});

const msgsent= async ()=>{
  try{
    hideToast();
    showToast('Sending Message');
    const response = await fetch("/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: document.getElementById('name').value, email: document.getElementById('email').value, phone: document.getElementById('phone').value, message: document.getElementById('message').value }),
    });
    document.getElementById('name').value='';
    document.getElementById('email').value='';
    document.getElementById('phone').value='';
    document.getElementById('message').value='';
    hideToast();
    showToast('Message Sent');
    setTimeout(hideToast, 2000);
  }
  catch{
    hideToast();
    showToast('Connection Error!');
    setTimeout(hideToast, 2000);
  }
}