import { localStorageHas, localStorageGet, localStorageSave } from './ls.js';

const PRODUCT_KEY_LOCALSTORAGE = 'products';

function init() {
    if (localStorageHas(PRODUCT_KEY_LOCALSTORAGE)) {
        const products = localStorageGet(PRODUCT_KEY_LOCALSTORAGE);
        getApiPrices(products);
        displayCart(products);
    }

    const deleteButtonElements = Array.from(document.querySelectorAll('.deleteItem'));
    deleteButtonElements.forEach((element) => {
        element.addEventListener('click', () => {
            const article = element.closest('.cart__item');
            deleteProduct(article);
        });
    });

    // Lors d'un changement de valeur, on veut modifier la valeur correspondante dans le LS
    const quantityInputElements = document.querySelectorAll('.quantity');
    quantityInputElements.forEach(element => {
        element.addEventListener('change', () => {
            const parentElement = element.closest('.cart__item');
            const id = parentElement.dataset.id;
            const colors = parentElement.dataset.colors;
            const array = localStorageGet(PRODUCT_KEY_LOCALSTORAGE);
            const object = array.find(product => product.id === id && product.colors === colors);

            if (object) {
                object.quantity = Number(element.value);
                localStorageSave(PRODUCT_KEY_LOCALSTORAGE, array);
                computeTotalProducts();
                computeTotalPrice(prices);
            }
        });
    });

    computeTotalProducts();
}

/**
 * Fonction de récupération du prix des produits depuis l'API
 */
 async function getApiPrices(products) {    
    // On crée une variable en mémoire contenant tous les IDs des produits
    let prices = products.map(product => product.id);

    const results = await Promise.all(prices.map(id =>
        fetch(`http://localhost:3000/api/products/${id}`).then(response => response.json())
        ));

    prices = results.map(product => product.price);
}

/**
 * Fonction d'affichage du panier
 */
async function displayCart(products) {
    // On crée une variable en mémoire
    let html = '';
    let prices = getApiPrices();
    console.log(getApiPrices());
    // On récupére l'élément items situé dans le DOM
    let itemsContainer = document.getElementById('cart__items');
    
    // On boucle les éléments de notre panier
    for (let i = 0; i < products.length; i++) {
        html += `
            <article class="cart__item" data-id="${products[i].id}" data-colors="${products[i].colors}" data-quantity="${products[i].quantity}" data-price="${prices[i]}">
                <div class="cart__item__img">
                    <img id="imageAlt" src="${products[i].image}" alt="${products[i].imageAlt}">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${products[i].title}</h2>
                        <p>${products[i].colors}</p>
                        <p>${prices[i].price} €</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="quantity" name="quantity" min="1" max="100" value="${products[i].quantity}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem" data-id="${products[i].id}" data-color="${products[i].colors}">Supprimer</p>
                        </div>
                    </div>
                </div>
            </article>
        `
    }

    // On insère la string concaténée directement dans le contenu de l'élément du DOM
    // L'opération d'insertion ou de modification ne s'effectue qu'une seule fois
    itemsContainer.innerHTML = html;
    
    //computeTotalPrice(prices);
}

/**
 * Fonction d'affichage du prix total du panier
 */
/*
function computeTotalPrice(prices) {
    // TODO: David A. - Ajouter le prix total du panier
    
    // On définit nos variables en tant que nombre
    let priceTotal = 0;
    //Pour obtenir le prix total on multiplie la quantité et le prix du produit
    prices.forEach(product => {
        priceTotal += product.quantity * product.price;
    });
    // Affichage du prix total
    document.getElementById("totalPrice").textContent = priceTotal;
    
    console.log(prices);
}*/

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
 * Fonction d'affichage du nombre d'article dans le panier
 */
function computeTotalProducts() {
    //On récupère la clé du localStorage
    const products = localStorageGet(PRODUCT_KEY_LOCALSTORAGE);

    if (products && products.length > 0) {
        // On définit nos variables en tant que nombre
        let articlesTotal = 0;
        // Pour chaque produit on récupère la quantité et on calcule le prix total
        products.forEach(product => {
            articlesTotal += product.quantity;
        });
        // Affichage du nombre d'article
        document.getElementById("totalQuantity").textContent = articlesTotal;
    }
}

/**
 * Formulaire du panier 
 */
//On cible les champs du formulaire
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const address = document.getElementById('address');
const city = document.getElementById('city');
const email = document.getElementById('email');
// On cible le bouton du formulaire
const addFormContact = document.getElementById("order");
//Au clique du bouton on enregistre les données du formulaire dans le localStorage
addFormContact.addEventListener('click', () => {
    const formValues = {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value,
    }
    localStorageSave('contact', formValues);
})

/**
 * Expression régulière (RegExp)
 */

const form = document.getElementById('contactForm');

let inputFormNumber = 0;

//Prénom
form.firstName.addEventListener('input', () => {
    validFirstName(this);
})

function validFirstName() {
    //Création de la RegExp pour la validation du prénom
    let regFirstName = new RegExp('^[A-Za-z\\s]{2,15}$');

    const testFirstName = regFirstName.test(form.firstName.value);
    const firstNameErrMsg = document.getElementById('firstNameErrorMsg');

    if (!testFirstName) {
        firstNameErrMsg.innerHTML = 'Prénom non valide';
        firstNameErrMsg.style.color = "#d10000";

    } else {
        firstNameErrMsg.innerHTML = 'Prénom valide';
        firstNameErrMsg.style.color = "#04ff04";
        inputFormNumber++;
    }
}
//Nom
form.lastName.addEventListener('input', () => {
    validLastName(this);
})

function validLastName() {
    //Création de la RegExp pour la validation du nom
    let regLastName = new RegExp('^[A-Z\\s]{2,20}$');

    const testLastName = regLastName.test(form.lastName.value);
    const lastNameErrMsg = document.getElementById('lastNameErrorMsg');

    if (testLastName === false) {
        lastNameErrMsg.innerHTML = 'Nom non valide';
        lastNameErrMsg.style.color = "#d10000";

    } else {
        lastNameErrMsg.innerHTML = 'Nom valide';
        lastNameErrMsg.style.color = "#04ff04";
        inputFormNumber++;
    }
}

//Adresse
form.address.addEventListener('input', () => {
    validAddress(this);
})

function validAddress() {
    //Création de la RegExp pour la validation de l'adresse
    let regAddress = new RegExp('^[0-9A-Za-z\\s-]{1,35}$');

    const testAddress = regAddress.test(form.address.value);
    const addressErrMsg = document.getElementById('addressErrorMsg');

    if (testAddress === false) {
        addressErrMsg.innerHTML = 'Adresse non valide';
        addressErrMsg.style.color = "#d10000";

    } else {
        addressErrMsg.innerHTML = 'Adresse valide';
        addressErrMsg.style.color = "#04ff04";
        inputFormNumber++;
    }
}

//Ville
form.city.addEventListener('input', () => {
    validCity(this);
})

function validCity() {
    //Création de la RegExp pour la validation de la ville
    let regCity = new RegExp('^[A-Za-z\\s-]{2,25}$');

    const testCity = regCity.test(form.city.value);
    const cityErrMsg = document.getElementById('cityErrorMsg');

    if (testCity === false) {
        cityErrMsg.innerHTML = 'Ville non valide';
        cityErrMsg.style.color = "#d10000";
    } else {
        cityErrMsg.innerHTML = 'Ville valide';
        cityErrMsg.style.color = "#04ff04";
        inputFormNumber++;
    }
}

//Email 
form.email.addEventListener('input', () => {
    validEmail(this);
})

function validEmail() {
    //Création de la RegExp pour la validation de l'email
    let regEmail = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$');

    const testEmail = regEmail.test(form.email.value);
    const emailErrMsg = document.getElementById('emailErrorMsg');

    if (testEmail === false) {
        emailErrMsg.innerHTML = 'Email non valide';
        emailErrMsg.style.color = "#d10000";
    } else {
        emailErrMsg.innerHTML = 'Email valide';
        emailErrMsg.style.color = "#04ff04";
        inputFormNumber++;
    }
}

if (inputFormNumber === 5 && localStorageHas(PRODUCT_KEY_LOCALSTORAGE)) {
    addFormContact.removeAttribute('disabled');
    //On vérifie que les données du formulaire sont valides
    addFormContact.addEventListener('submit', (event) => {
        //On casse l'envoi du formulaire par défaut
        event.preventDefault();
        if (validFirstName(form.firstName) && validLastName(form.lastName) && validAddress(form.address) && validCity(form.city) && validEmail(form.email)) {
            form.submit();
        }
    })
} else {
    addFormContact.setAttribute("disabled", "disabled");
}

init();