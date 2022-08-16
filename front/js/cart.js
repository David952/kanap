import { localStorageHas, localStorageGet, localStorageSave } from './ls.js';

const PRODUCT_KEY_LOCALSTORAGE = 'products';

let products = localStorageGet(PRODUCT_KEY_LOCALSTORAGE);
let apiProducts;

/**
 * Fonction d'initialisation du panier
 */
(async function init() {
    if (products && products.length > 0) {
        document.getElementById("cartTitle").textContent = 'Mon panier';
        apiProducts = await getApiPrices(products);
        displayCart(products);

        /* Events */
        // On ajoute un écouteur d'événement sur chaque bouton de suppression
        const deleteButtonElements = Array.from(document.querySelectorAll('.deleteItem'));
        deleteButtonElements.forEach((element, i) => {
            element.addEventListener('click', () => {
                const article = element.closest('.cart__item');

                apiProducts.splice(i, 1);
                deleteProduct(article);
                computeTotalPrice();
                computeTotalProducts();
            });
        });

        // Lors d'un changement de valeur, on veut modifier la valeur correspondante dans le LS
        const quantityInputElements = document.querySelectorAll('.quantity');
        quantityInputElements.forEach(element => {
            element.addEventListener('change', () => {
                const parentElement = element.closest('.cart__item');
                const id = parentElement.dataset.id;
                const colors = parentElement.dataset.colors;
                const object = products.find(product => product.id === id && product.colors === colors);

                if (!!object) {
                    object.quantity = Number(element.value);

                    localStorageSave(PRODUCT_KEY_LOCALSTORAGE, products);
                    computeTotalProducts();
                    computeTotalPrice();
                }
            });
        });

        computeTotalProducts();
        computeTotalPrice();
    }
})();

/**
 * Fonction de récupération du prix des produits depuis l'API
 * @param {Array} products - Les produits du panier
 */
async function getApiPrices(products) {
    // On crée une variable en mémoire contenant tous les IDs des produits
    let ids = products.map(product => product.id);

    return await Promise.all(ids.map(id =>
        fetch(`http://localhost:3000/api/products/${id}`).then(response => response.json())
    ));
}

/**
 * Fonction d'affichage du panier
 * @param {Array} products - Les produits du panier
 */
function displayCart(products) {
    // On récupére l'élément items situé dans le DOM
    let itemsContainer = document.getElementById('cart__items');
    const fragment = document.createDocumentFragment();

    // On boucle les éléments de notre panier
    for (let i = 0; i < products.length; i++) {
        const product = createCart(i);
        fragment.appendChild(product);
    }
    
    itemsContainer.appendChild(fragment);
}

/**
 * Fonction de création des produits de manière dynamique
 * @param {Number} i - L'index du produit
 * @returns {Element}
 */
function createCart(i) {
    const template = document.createElement('template');
    template.innerHTML = `
        <article class="cart__item" data-id="${products[i].id}" data-colors="${products[i].colors}" data-quantity="${products[i].quantity}" data-price="${apiProducts[i].price}">
            <div class="cart__item__img">
                <img id="imageAlt" src="${products[i].image}" alt="${products[i].imageAlt}">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${products[i].title}</h2>
                    <p>${products[i].colors}</p>
                    <p>${apiProducts[i].price} €</p>
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
    `;

    return template.content.firstElementChild;
}

/**
 * Fonction de suppression du produit dans le panier
 * @param {HTMLElement} article - L'élément du panier
 */
function deleteProduct(article) {
    const id = article.dataset.id;
    const colors = article.dataset.colors;
    products = products.filter(x => !(x.id === id && x.colors === colors));

    article.remove();
    localStorageSave(PRODUCT_KEY_LOCALSTORAGE, products);
}

/**
 * Fonction d'affichage du prix total du panier
 */
function computeTotalPrice() {
    let priceTotal = 0;

    for (let i = 0; i < products.length; i++) {
        priceTotal += Number(products[i].quantity) * apiProducts[i].price;
    }

    // Affichage du prix total
    document.getElementById("totalPrice").textContent = String(priceTotal);
}

/**
 * Fonction d'affichage du nombre d'article dans le panier
 */
function computeTotalProducts() {
    if (products && products.length > 0) {
        let articlesTotal = 0;
        // Pour chaque produit on récupère la quantité
        products.forEach(product => {
            articlesTotal += product.quantity;
        });
        // Affichage du nombre d'article
        document.getElementById("totalQuantity").textContent = articlesTotal;
    } else {
        document.getElementById("totalQuantity").textContent = '0';
    }
}

/**
 * Formulaire du panier. On cible les champs du formulaire
 */
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
 * Fonction de contrôle du formulaire avec les Expressions régulières (RegExp)
 */
function formControl() {
    const form = document.getElementById('contactForm');

    /**
     * Fonction de validation du prénom
     * @return {Boolean} - Si le prénom est valide la reponse sera "true"
     */
    function validFirstName() {
        //Création de la RegExp pour la validation du prénom
        let regFirstName = new RegExp('^[A-Za-z\\s]{2,15}$');

        const testFirstName = regFirstName.test(form.firstName.value);
        const firstNameErrMsg = document.getElementById('firstNameErrorMsg');

        if (!testFirstName) {
            firstNameErrMsg.textContent = 'Prénom non valide. Veuillez commencer votre prénom par une majuscule';
            firstNameErrMsg.style.color = "#d10000";
        } else {
            firstNameErrMsg.textContent = 'Prénom valide';
            firstNameErrMsg.style.color = "#04ff04";
            return true;
        }
    }

    form.firstName.addEventListener('input', () => {
        validFirstName(this);
    })

    /**
     * Fonction de validation du nom
     * @return {Boolean} - Si le nom est valide la reponse sera "true"
     */
    function validLastName() {
        //Création de la RegExp pour la validation du nom
        let regLastName = new RegExp('^[A-Z\\s]{2,20}$');

        const testLastName = regLastName.test(form.lastName.value);
        const lastNameErrMsg = document.getElementById('lastNameErrorMsg');

        if (testLastName === false) {
            lastNameErrMsg.textContent = 'Nom non valide. Veuillez écrire votre nom en majuscule';
            lastNameErrMsg.style.color = "#d10000";
        } else {
            lastNameErrMsg.textContent = 'Nom valide';
            lastNameErrMsg.style.color = "#04ff04";
            return true;
        }
    }

    form.lastName.addEventListener('input', () => {
        validLastName(this);
    })
    
    /**
     * Fonction de validation de l'adresse
     * @return {Boolean} - Si l'adresse est valide la reponse sera "true"
     */
    function validAddress() {
        //Création de la RegExp pour la validation de l'adresse
        let regAddress = new RegExp('^[0-9a-zA-Z\\s-]{1,25}$');

        const testAddress = regAddress.test(form.address.value);
        const addressErrMsg = document.getElementById('addressErrorMsg');

        if (testAddress === false) {
            addressErrMsg.textContent = 'Adresse non valide. Veuillez insérer une adresse correcte';
            addressErrMsg.style.color = "#d10000";
        } else {
            addressErrMsg.textContent = 'Adresse valide';
            addressErrMsg.style.color = "#04ff04";
            return true;
            
        }
    }

    form.address.addEventListener('input', () => {
        validAddress(this);
    })

    /**
     * Fonction de validation de la ville
     * @return {Boolean} - Si la ville est valide la reponse sera "true"
     */
    function validCity() {
        //Création de la RegExp pour la validation de la ville
        let regCity = new RegExp('^[A-Za-z\\s-]{2,25}$');

        const testCity = regCity.test(form.city.value);
        const cityErrMsg = document.getElementById('cityErrorMsg');

        if (testCity === false) {
            cityErrMsg.textContent = 'Ville non valide. Veuillez commencer par une majuscule';
            cityErrMsg.style.color = "#d10000";
        } else {
            cityErrMsg.textContent = 'Ville valide';
            cityErrMsg.style.color = "#04ff04";
            return true;
        }
    }

    form.city.addEventListener('input', () => {
        validCity(this);
    })

    /**
     * Fonction de validation de l'email
     * @return {Boolean} - Si l'email est valide la reponse sera "true"
     */
    function validEmail() {
        //Création de la RegExp pour la validation de l'email
        let regEmail = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$');

        const testEmail = regEmail.test(form.email.value);
        const emailErrMsg = document.getElementById('emailErrorMsg');

        if (testEmail === false) {
            emailErrMsg.textContent = 'Email non valide. Veuillez mettre une adresse e-mail correcte';
            emailErrMsg.style.color = "#d10000";
        } else {
            emailErrMsg.textContent = 'Email valide';
            emailErrMsg.style.color = "#04ff04";
            return true;
        }
    }

    form.email.addEventListener('input', () => {
        validEmail(this);
    })
    
    /**
     * Fonction de validation du formulaire
     */
    function validate(){
        //On cible tous les champs de texte du formulaire
        const formInputs = document.querySelectorAll('input');
        //On boucle pour écouter chaque champs
        for (let input of formInputs) {
            input.addEventListener('input', () => {
                //Si les 5 champs sont remplis puis valide et qu'on a un produit dans le localStorage.
                if (validFirstName() && validLastName() && validAddress() && validCity() && validEmail() === true && localStorageHas(PRODUCT_KEY_LOCALSTORAGE) && products.length > 0) {
                    addFormContact.removeAttribute('disabled');
                    //On vérifie que les données du formulaire sont valides
                    form.addEventListener('submit', (event) => {
                        //On casse l'envoi du formulaire par défaut
                        event.preventDefault();
                        if (validFirstName(form.firstName) && validLastName(form.lastName) && validAddress(form.address) && validCity(form.city) && validEmail(form.email) && products.length > 0) {
                            sendApi();
                        } else {
                            window.location.href = "http://127.0.0.1:5500/front/html/index.html";
                            localStorage.removeItem(PRODUCT_KEY_LOCALSTORAGE);
                            localStorage.removeItem("contact");
                        }
                    })
                //Sinon le bouton "Commander !" reste desactiver
                } else {
                    addFormContact.setAttribute("disabled", "disabled");
                }
            });
        }
    }
    validate();
}
formControl();

/**
 * Fonction de récupération de l'id des produits pour le mettre dans un tableau
 */
let idProduct = [];
function productArray(){
    for (let product of products) {
        idProduct.push(product.id);
    }
}

/**
 * Fonction de récupération des données client et produit du panier
 */
let contactData;
let order;
function dataForApi(){
    contactData = localStorageGet('contact');
    order = {
        products : idProduct,
        contact : {
            firstName: contactData.firstName,
            lastName: contactData.lastName,
            address: contactData.address,
            city: contactData.city,
            email: contactData.email,
        },
    };
}

/**
 * Fonction d'envoi des données à l'API
 */
function sendApi() {
productArray();
dataForApi();

fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
    })
    .then((result) => result.json())
    .then((data) => {
        window.location.href = `http://127.0.0.1:5500/front/html/confirmation.html?orderId=${data.orderId}`;
    })
    .catch((error) => {
      console.log(error);
    });
}