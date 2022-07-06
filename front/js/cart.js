/**
 * Importation des fonctions du script "ls.js"
 */
import {localStorageHas, localStorageGet} from './ls.js';



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
            <article class="cart__item" data-id="${product.id}" data-color="${product.colors}">
                <div class="cart__item__img">
                    <img id="imageAlt" src="${product.imageUrl}" alt="${product.altTxt}">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${product.title}</h2>
                        <p>${product.colors}</p>
                        <p>${product.price}</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="quantity" name="quantity" min="1" max="100" value="${product.quantity}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>
            </article>
        `
        }
    // On insère la string concaténée directement dans le contenu de l'élément du DOM
    // L'opération d'insertion ou de modification ne s'effectue qu'une seule fois
    itemsContainer.innerHTML = documentFragment.innerHTML;
}