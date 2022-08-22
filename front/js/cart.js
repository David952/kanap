import { localStorageHas, localStorageGet, localStorageSave } from './ls.js';

// On crée une fonction anonyme qui s'exécute immédiatement afin d'éviter de polluer l'espace global
(function () {
    const PRODUCTS_KEY_LOCALSTORAGE = 'products';
    const CONTACT_KEY_LOCALSTORAGE = 'contact';
    const totalPriceCart = document.getElementById('totalPrice');

    let products = localStorageGet(PRODUCTS_KEY_LOCALSTORAGE);
    let apiProducts = [];

    /**
     * Fonction d'initialisation du panier
     */
    (async function init() {
        if (products && products.length > 0) {
            document.getElementById("cartTitle").textContent = 'Mon panier';
            apiProducts = await getApiPrices(products);
            displayCart(products);

            /******* EVENTS *******/
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

                        localStorageSave(PRODUCTS_KEY_LOCALSTORAGE, products);
                        computeTotalProducts();
                        computeTotalPrice();
                    }
                });
            });

            computeTotalProducts();
            computeTotalPrice();

            /******* FORM SUBMIT *******/

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
        localStorageSave(PRODUCTS_KEY_LOCALSTORAGE, products);

        if (products.length === 0) {
            localStorage.removeItem(PRODUCTS_KEY_LOCALSTORAGE);
        }
    }

    /**
     * Fonction d'affichage du prix total du panier
     */
    function computeTotalPrice() {
        let priceTotal = 0;
        
        for (let i = 0; i < products.length; i++) {
            priceTotal = priceTotal + (Number(products[i].quantity) * Number(apiProducts[i].price));
        }
        
        /*
        const cartElement = document.querySelectorAll('.cart__item');
        cartElement.forEach((product) => {
            priceTotal = priceTotal + (product.dataset.quantity * product.dataset.price);
            console.log('-------------');
            console.log(product.dataset.quantity);
            console.log(product.dataset.price);
        })
        */
       
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
     * Formulaire du panier. On cible le formulaire
     */
    const form = document.getElementById('contactForm');
    const addFormContact = document.getElementById("order");
    const formValuesValidation = {
        firstName: false,
        lastName: false,
        address: false,
        city: false,
        email: false
    };

    //Au clique du bouton on enregistre les données du formulaire dans le localStorage
    addFormContact.addEventListener('click', () => {
        const formValues = {
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            address: form.address.value,
            city: form.city.value,
            email: form.email.value,
        }
        localStorageSave(CONTACT_KEY_LOCALSTORAGE, formValues);
    });
        

    /**
     * Fonction de validation du prénom
     * @return {Boolean} - Si le prénom est valide la reponse sera "true"
     */
    function validationFirstName() {
        //Création de la RegExp pour la validation du prénom
        let regFirstName = new RegExp('^[A-Za-z -]{2,15}$');

        const testFirstName = regFirstName.test(form.firstName.value);
        const firstNameErrMsg = document.getElementById('firstNameErrorMsg');

        if (!testFirstName) {
            firstNameErrMsg.textContent = 'Prénom non valide. Veuillez commencer votre prénom par une majuscule';
            firstNameErrMsg.style.color = "#d10000";
            return false;
        } else {
            firstNameErrMsg.textContent = 'Prénom valide';
            firstNameErrMsg.style.color = "#04ff04";
            return true;
        }
    }

    form.firstName.addEventListener('input', () => {
        formValuesValidation.firstName = validationFirstName();
        validate();
    });

    /**
     * Fonction de validation du nom
     * @return {Boolean} - Si le nom est valide la reponse sera "true"
     */
    function validationLastName() {
        //Création de la RegExp pour la validation du nom
        let regLastName = new RegExp("^[A-Z '-]{2,20}$");

        const testLastName = regLastName.test(form.lastName.value);
        const lastNameErrMsg = document.getElementById('lastNameErrorMsg');

        if (testLastName === false) {
            lastNameErrMsg.textContent = 'Nom non valide. Veuillez écrire votre nom en majuscule';
            lastNameErrMsg.style.color = "#d10000";
            return false;
        } else {
            lastNameErrMsg.textContent = 'Nom valide';
            lastNameErrMsg.style.color = "#04ff04";
            return true;
        }
    }

    form.lastName.addEventListener('input', () => {
        formValuesValidation.lastName = validationLastName();
        validate();
    });
    
    /**
     * Fonction de validation de l'adresse
     * @return {Boolean} - Si l'adresse est valide la reponse sera "true"
     */
    function validationAddress() {
        //Création de la RegExp pour la validation de l'adresse
        let regAddress = new RegExp("^([0-9]{1,4})([A-Za-z-ÂâÉéÈè ]{3,21})[ ]([a-zA-Z-',ÂâÉéÈèÊê]{1,55})$", 'gm');

        const testAddress = regAddress.test(form.address.value);
        const addressErrMsg = document.getElementById('addressErrorMsg');

        if (testAddress === false) {
            addressErrMsg.textContent = 'Adresse non valide. Veuillez insérer le numéro, le type et le nom de la voie';
            addressErrMsg.style.color = "#d10000";
            return false;
        } else {
            addressErrMsg.textContent = 'Adresse valide';
            addressErrMsg.style.color = "#04ff04";
            return true;
            
        }
    }

    form.address.addEventListener('input', () => {
        formValuesValidation.address = validationAddress();
        validate();
    });

    /**
     * Fonction de validation de la ville
     * @return {Boolean} - Si la ville est valide la reponse sera "true"
     */
    function validationCity() {
        //Création de la RegExp pour la validation de la ville
        let regCity = new RegExp("^[A-Za-z '-]{2,25}$");

        const testCity = regCity.test(form.city.value);
        const cityErrMsg = document.getElementById('cityErrorMsg');

        if (testCity === false) {
            cityErrMsg.textContent = 'Ville non valide. Veuillez commencer par une majuscule';
            cityErrMsg.style.color = "#d10000";
            return false;
        } else {
            cityErrMsg.textContent = 'Ville valide';
            cityErrMsg.style.color = "#04ff04";
            return true;
        }
    }

    form.city.addEventListener('input', () => {
        formValuesValidation.city = validationCity();
        validate();
    });

    /**
     * Fonction de validation de l'email
     * @return {Boolean} - Si l'email est valide la reponse sera "true"
     */
    function validationEmail() {
        //Création de la RegExp pour la validation de l'email
        let regEmail = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$');

        const testEmail = regEmail.test(form.email.value);
        const emailErrMsg = document.getElementById('emailErrorMsg');

        if (testEmail === false) {
            emailErrMsg.textContent = 'Email non valide. Veuillez mettre une adresse e-mail correcte';
            emailErrMsg.style.color = "#d10000";
            return false;
        } else {
            emailErrMsg.textContent = 'Email valide';
            emailErrMsg.style.color = "#04ff04";
            return true;
        }
    }

    form.email.addEventListener('input', () => {
        formValuesValidation.email = validationEmail();
        validate();
    });
    
    /**
     * Fonction de validation du formulaire
     */
    function validate(){
        //On cible tous les champs de texte du formulaire
        const formInputs = document.querySelectorAll('input');

        const validation = Object.values(formValuesValidation).every(item => item);
        console.log(validation);
        /*
        if (!validation) {
            alert('La validation est incorrecte');
            return;
        } else {
            console.log('Validation correcte');
        }*/
        
        //On boucle pour écouter chaque champs
        for (let input of formInputs) {
            input.addEventListener('input', () => {
                //Si les 5 champs sont remplis puis valide et qu'on a un produit dans le localStorage qui est dans le panier.
                if (validation && localStorageHas(PRODUCTS_KEY_LOCALSTORAGE)) {
                    addFormContact.removeAttribute('disabled');
                    form.addEventListener('submit', () => {
                        sendApi();
                    });
                //Sinon le bouton "Commander !" reste desactiver
                } else {
                    addFormContact.setAttribute("disabled", "disabled");
                }
            });
        }
    }

    /**
     * Fonction de récupération des données client et produit du panier
     */
    function prepareData() {
        const contactData = localStorageGet(CONTACT_KEY_LOCALSTORAGE);

        return {
            products: products.map(product => product.id),
            contact: {
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
        const data = prepareData();

        fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            })
            .then((result) => result.json())
            .then((dataForApi) => {
                window.location.href = `/front/html/confirmation.html?orderId=${dataForApi.orderId}`;
            })
            .catch((error) => {
                console.log(error);
            })
    }
})();
