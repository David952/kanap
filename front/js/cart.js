import { localStorageHas, localStorageGet, localStorageSave } from './ls.js';

// On crée une fonction anonyme qui s'exécute immédiatement afin d'éviter de polluer l'espace global
(function () {
    const PRODUCTS_KEY_LOCALSTORAGE = 'products';

    let products = localStorageGet(PRODUCTS_KEY_LOCALSTORAGE);
    let apiProducts = [];

    const form = document.getElementById('contactForm');
    const submitButton = document.getElementById("order");
    const formValuesValidation = {
        firstName: false,
        lastName: false,
        address: false,
        city: false,
        email: false
    };

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
                    const object = products.find(product => product.id === id && product.colors === colors);

                    if (!!object) {
                        object.quantity = Number(element.value);

                        localStorageSave(PRODUCTS_KEY_LOCALSTORAGE, products);
                        computeTotalQuantity();
                        computeTotalPrice();
                    }
                });
            });

            computeTotalQuantity();
            computeTotalPrice();

            // Au clic du bouton, on enregistre les données du formulaire dans le localStorage
            submitButton.addEventListener('click', (event) => {
                //On empêche l'envoi par défaut
                event.preventDefault();

                const formValues = {
                    firstName: form.firstName.value,
                    lastName: form.lastName.value,
                    address: form.address.value,
                    city: form.city.value,
                    email: form.email.value,
                }

                sendApi(formValues);
            });

            //On contrôle les champs du formulaire
            form.firstName.addEventListener('input', () => {
                formValuesValidation.firstName = validationFirstName();
                validate();
            });

            form.lastName.addEventListener('input', () => {
                formValuesValidation.lastName = validationLastName();
                validate();
            });

            form.address.addEventListener('input', () => {
                formValuesValidation.address = validationAddress();
                validate();
            });

            form.city.addEventListener('input', () => {
                formValuesValidation.city = validationCity();
                validate();
            });

            form.email.addEventListener('input', () => {
                formValuesValidation.email = validationEmail();
                validate();
            });
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
        let itemsContainer = document.getElementById('cart__items');
        const fragment = document.createDocumentFragment();

        // On boucle les éléments de notre panier
        for (let i = 0; i < products.length; i++) {
            const product = createArticle(i);
            fragment.appendChild(product);
        }

        itemsContainer.appendChild(fragment);
    }

    /**
     * Fonction de création des produits de manière dynamique
     * @param {Number} i - L'index du produit
     * @returns {HTMLElement} - L'élément HTML créé
     */
    function createArticle(i) {
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
                            <p class="deleteItem">Supprimer</p>
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
        let filteredIndex;

        const filteredProduct = products.filter((product, index) => {
            if (product.id === id && product.colors === colors) {
                filteredIndex = index;

                return true;
            }
        });

        if (filteredProduct) {
            products.splice(filteredIndex, 1);
            apiProducts.splice(filteredIndex, 1);
            localStorageSave(PRODUCTS_KEY_LOCALSTORAGE, products);

            article.remove();
            computeTotalQuantity();
            computeTotalPrice();
        }

        if (products.length === 0) {
            localStorage.removeItem(PRODUCTS_KEY_LOCALSTORAGE);
        }
    }

    /**
     * Fonction d'affichage du prix total du panier
     */
    function computeTotalPrice() {
        let priceTotal = 0;

        products.forEach((product, i) => {
            priceTotal += product.quantity * apiProducts[i].price;
        });

        document.getElementById("totalPrice").textContent = String(priceTotal);
    }

    /**
     * Fonction d'affichage du nombre d'articles dans le panier
     */
    function computeTotalQuantity() {
        if (products && products.length > 0) {
            let articlesTotal = 0;
            // Pour chaque produit on récupère la quantité
            products.forEach(product => {
                articlesTotal += product.quantity;
            });
            document.getElementById("totalQuantity").textContent = articlesTotal;

        } else {
            document.getElementById("totalQuantity").textContent = '0';
        }
    }

    /**
     * Fonction de validation du prénom
     * @return {Boolean} - Si le prénom est valide la réponse sera "true"
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

    /**
     * Fonction de validation de l'adresse
     * @return {Boolean} - Si l'adresse est valide la réponse sera "true"
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

    /**
     * Fonction de validation de la ville
     * @return {Boolean} - Si la ville est valide la réponse sera "true"
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

    /**
     * Fonction de validation de l'email
     * @return {Boolean} - Si l'email est valide la réponse sera "true"
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

    /**
     * Fonction de validation du formulaire
     */
    function validate() {
        const validation = Object.values(formValuesValidation).every(item => item);
        console.log(validation);

        if (validation && localStorageHas(PRODUCTS_KEY_LOCALSTORAGE)) {
            submitButton.removeAttribute('disabled');
        } else {
            submitButton.setAttribute("disabled", "disabled");
        }
    }

    /**
     * Fonction d'envoi des données à l'API
     * @param {Object} formValues - Les données du formulaire à envoyer
     */
    function sendApi(formValues) {
        const data = {
            products: products.map(product => product.id),
            contact: {
                firstName: formValues.firstName,
                lastName: formValues.lastName,
                address: formValues.address,
                city: formValues.city,
                email: formValues.email,
            },
        };

        fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            })
            .then((result) => result.json())
            .then((dataForApi) => {
                window.location.href = `confirmation.html?orderId=${dataForApi.orderId}`;
            })
            .catch((error) => {
                console.log(error);
            });
    }
})();