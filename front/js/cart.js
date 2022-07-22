/**
 * Importation des fonctions du script "ls.js"
 */
import {localStorageHas, localStorageGet, localStorageSave} from './ls.js';



const PRODUCT_KEY_LOCALSTORAGE = 'products';

if (localStorageHas(PRODUCT_KEY_LOCALSTORAGE)) {
    const products = localStorageGet(PRODUCT_KEY_LOCALSTORAGE);
    displayCart(products);
} else {
    console.log('Pas de panier');
}

/**
 * 
 * Fonction d'affichage du panier
 * 
 */
function displayCart(products) {
    // On crée un élément <section> en mémoire
    const documentFragment = document.createElement('section');
    // On récupére l'élément items situé dans le DOM
    let itemsContainer = document.getElementById('cart__items');

    // On boucle les éléments de notre panier
    for (let product of products) {
        documentFragment.innerHTML += `
            <article class="cart__item" data-id="${product.id}" data-colors="${product.colors}" data-quantity="${product.quantity}" data-price="${product.price}">
                <div class="cart__item__img">
                    <img id="imageAlt" src="${product.image}" alt="${product.imageAlt}">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${product.title}</h2>
                        <p>${product.colors}</p>
                        <p>${product.price} €</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="quantity" name="quantity" min="1" max="100" value="${product.quantity}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem" data-id="${product.id}" data-color="${product.colors}">Supprimer</p>
                        </div>
                    </div>
                </div>
            </article>
        `
        }
    // On insère la string concaténée directement dans le contenu de l'élément du DOM
    // L'opération d'insertion ou de modification ne s'effectue qu'une seule fois
    itemsContainer.innerHTML = documentFragment.innerHTML;

    quantityModify();
    productTotal();
}

/**
 * Fonction de modification de la quantité d'un article dans le panier
 */
function quantityModify() {
    //On définit la variable
    const cart = document.querySelectorAll(".cart__item");

    cart.forEach((cart) => {
        cart.addEventListener("change", (event) => {
            // On vérifie l'information de la valeur au clic
            const carts = localStorageGet(PRODUCT_KEY_LOCALSTORAGE);

            //On récupère la valeur de la quantité
            let qtyValue = event.target.value;
            
            //document.querySelector(".quantity").innerText = qtyValue;

            const qtyProduct = carts.map(product => {
                if (qtyValue === product.quantity){
                    qtyValue = product.quantity += 1
                }else{
                    console.log('Quantité pas incrémenté');
                }
            });
        
            localStorageSave(PRODUCT_KEY_LOCALSTORAGE, qtyProduct);

            productTotal();
        });
    });
    /*
    // On écoute ce qu'il se passe dans itemQuantity de l'article concerné
    cart.forEach((cart) => {
        cart.addEventListener("change", (event) => {
        // On vérifie l'information de la valeur au clic
        const carts = localStorageGet(PRODUCT_KEY_LOCALSTORAGE);

        //On récupère la valeur de la quantité
        let qtyValue = event.target.value;

        const qty = carts.map(product => product.quantity);

        cart.dataset.quantity = qtyValue
        
        localStorageSave(PRODUCT_KEY_LOCALSTORAGE, qty)

        // On appelle la fonction pour mettre à jour la valeur
        productTotal();
        
        // On boucle pour modifier la quantité du produit du panier grace à une nouvelle valeur
        for (let product of carts) {
            if (product.id === cart.dataset.id && product.colors === cart.dataset.colors) {
                product.quantity = evt.target.value;
                localStorageSave(PRODUCT_KEY_LOCALSTORAGE);
                // Mise à jour du dataset quantité
                cart.dataset.quantity = evt.target.value;
                // On appelle la fonction pour mettre à jour la valeur
                productTotal();
          }
        }
    });
});
*/
}



const deleteButtonElements = Array.from(document.querySelectorAll('.deleteItem'));
deleteButtonElements.forEach((element) => {
    element.addEventListener('click', () => {
        const article = element.closest('.cart__item');

        deleteProduct(article);
    });
});

/**
 * Fonction de suppression du produit dans le panier
 */
function deleteProduct(article) {
    const id = article.dataset.id;
    const colors = article.dataset.colors;
    let products = localStorageGet(PRODUCT_KEY_LOCALSTORAGE);
    products = products.filter(x => !(x.id === id && x.colors === colors));

    article.remove();
    localStorageSave(PRODUCT_KEY_LOCALSTORAGE, products);
}



/**
 * Fonction d'affichage du nombre d'article et du prix total dans le panier
 */
function productTotal() {
    // On définit nos variables en tant que nombre
    let articlesTotal = 0;
    let priceTotal = 0;
    // on cible notre élement
    const cart = document.querySelectorAll(".cart__item");
    // On boucle pour chaque élément
    cart.forEach((cart) => {
      //On récupère les quantités des produits avec le dataset
      articlesTotal += JSON.parse(cart.dataset.quantity);
      // On multiplie la quantité et le prix pour obtenir le total produit grâce au dataset
      priceTotal += cart.dataset.quantity * cart.dataset.price;
    });
    // Affichage du nombre d'article
    document.getElementById("totalQuantity").textContent = articlesTotal;
    // Affichage du prix total
    document.getElementById("totalPrice").textContent = priceTotal;
  }