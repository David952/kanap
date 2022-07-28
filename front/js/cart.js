/**
 * Importation des fonctions du script "ls.js"
 */
import {localStorageHas, localStorageGet, localStorageSave} from './ls.js';



const PRODUCT_KEY_LOCALSTORAGE = 'products';

function init() {
    if (localStorageHas(PRODUCT_KEY_LOCALSTORAGE)) {
        const products = localStorageGet(PRODUCT_KEY_LOCALSTORAGE);
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
            }
        });
    });

    computeTotalPrice();
}

/**
 * Fonction d'affichage du panier
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
}

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
function computeTotalPrice() {
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
        firstName : firstName.value,
        lastName : lastName.value,
        address : address.value,
        city : city.value,
        email : email.value,
    }
    localStorageSave('contact', formValues);
})

/**
 * Expression régulière (RegExp)
 */

const form = document.getElementById('contactForm');

//Prénom
form.firstName.addEventListener('change', () => {
    validFirstName(this);
})

const validFirstName = function(inputFirstName){
    //Création de la RegExp pour la validation du prénom
    let regFirstName = new RegExp('/^[a-zA-Z]+ [a-zA-Z]+$/');

    const testFirstName = regFirstName.test(inputFirstName.value);
    const firstNameErrMsg = document.getElementById('firstNameErrorMsg');

    if(testFirstName === false) {
        firstNameErrMsg.innerHTML = 'Prénom non valide';
        firstNameErrMsg.style.color = "red";
        return false;
    } else {
        firstNameErrMsg.innerHTML = 'Prénom valide';
        firstNameErrMsg.style.color = "green";
        return true;
    }
}

//Nom
form.lastName.addEventListener('change', () => {
    validLastName(this);
})

const validLastName = function(inputLastName){
    //Création de la RegExp pour la validation du prénom
    let regLastName = new RegExp('/^[a-zA-Z]+ [a-zA-Z]+$/');

    const testLastName = regLastName.test(inputLastName.value);
    const lastNameErrMsg = document.getElementById('lastNameErrorMsg');

    if(testLastName === false) {
        lastNameErrMsg.innerHTML = 'Nom non valide';
        lastNameErrMsg.style.color = "red";
        return false;
    } else {
        lastNameErrMsg.innerHTML = 'Nom valide';
        lastNameErrMsg.style.color = "green";
        return true;
    }
}

//Adresse
form.address.addEventListener('change', () => {
    validAddress(this);
})

const validAddress = function(inputAddress){
    //Création de la RegExp pour la validation du prénom
    let regAddress = new RegExp('((^[0-9]*).?((BIS)|(TER)|(QUATER))?)?((\W+)|(^))(([a-z]+.)*)([0-9]{5})?.(([');

    const testAddress = regAddress.test(inputAddress.value);
    const addressErrMsg = document.getElementById('addressErrorMsg');

    if(testAddress === false) {
        addressErrMsg.innerHTML = 'Adresse non valide';
        addressErrMsg.style.color = "red";
        return false;
    } else {
        addressErrMsg.innerHTML = 'Adresse valide';
        addressErrMsg.style.color = "green";
        return true;
    }
}

//Ville
form.city.addEventListener('change', () => {
    validCity(this);
})

const validCity = function(inputCity){
    //Création de la RegExp pour la validation du prénom
    let regCity = new RegExp('^[a-zA-Z\u0080-\u024F\s\/\-\)\(\`\.\"\']+$');

    const testCity = regCity.test(inputCity.value);
    const cityErrMsg = document.getElementById('cityErrorMsg');

    if(testCity === false) {
        cityErrMsg.innerHTML = 'Ville non valide';
        cityErrMsg.style.color = "red";
        return false;
    } else {
        cityErrMsg.innerHTML = 'Ville valide';
        cityErrMsg.style.color = "green";
        return true;
    }
}

//Email 
form.email.addEventListener('change', () => {
    validEmail(this);
})

const validEmail = function(inputEmail){
    //Création de la RegExp pour la validation du prénom
    let regEmail = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$', 'g');

    const testEmail = regEmail.test(inputEmail.value);
    const emailErrMsg = document.getElementById('emailErrorMsg');

    if(testEmail === false) {
        emailErrMsg.innerHTML = 'Email non valide';
        emailErrMsg.style.color = "red";
        return false;
    } else {
        emailErrMsg.innerHTML = 'Email valide';
        emailErrMsg.style.color = "green";
        return true;
    }
}
//On vérifie que les données du formulaire sont valides
form.addEventListener('submit', (event) => {
    //On casse l'envoi du formulaire par défaut
    event.preventDefault();
    if (validFirstName(form.firstName) && validLastName(form.lastName) && validAddress(form.address) && validCity(form.city) && validEmail(form.email)) {
        form.submit();
    }
})


init();