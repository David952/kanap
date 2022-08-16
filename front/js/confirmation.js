const url = new URLSearchParams(window.location.search);
let numOrder = url.get("orderId");

document.querySelector('#orderId').textContent = `${numOrder}`;
numOrder = undefined;
//localStorage.clear()