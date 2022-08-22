/**
 * On crée une fonction anonyme qui s'exécute immédiatement afin d'éviter de polluer l'espace global
 */
(function() {
    const url = new URLSearchParams(window.location.search);
    const numOrder = url.get("orderId");

    document.querySelector('#orderId').textContent = `${numOrder}`;

    localStorage.removeItem('contact');
    localStorage.removeItem('products');
})();