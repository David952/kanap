import { localStorageHas, localStorageSave, localStorageGet } from './ls.js';

/**
 * On crée une fonction anonyme qui s'exécute immédiatement afin d'éviter de polluer l'espace global
 */
(function () {
    // On récupère l'id du produit grâce à l'URL et on définit les variables qui serviront dans notre script
    const url = new URLSearchParams(window.location.search);
    const id = url.get("id");
    const PRODUCTS_KEY_LOCALSTORAGE = 'products';

    const title = document.getElementById('title');
    const colors = document.getElementById('colors');
    const description = document.getElementById('description');
    const quantity = document.getElementById('quantity');
    const price = document.getElementById('price');
    const addProductCart = document.getElementById('addToCart');

    /**
     * Fonction d'initialisation de la page du produit
     */
    (async function init() {
        // Récupération de l'ID des produits de l'API
        await createProduct();

        const image = document.getElementById('image');

        // Titre de la page
        document.title = title.innerText;

        addProductCart.addEventListener('click', () => {
            const product = {
                id: id,
                quantity: Number(quantity.value),
                colors: colors.value,
                title: title.innerHTML,
                image: image.src,
                imageAlt: image.alt,
                description: description.innerHTML,
            }
            
            addProductToLocalStorage(product);
        });
        // Changer le status du bouton lorsque le select et/ou la quantité change de valeur
        colors.addEventListener('change', btnColorQtyChange);
        quantity.addEventListener('change', btnColorQtyChange);
    })();

    /**
     * Récupération de l'ID des produits de l'API
     */
    async function createProduct() {
        await fetch(`http://localhost:3000/api/products/${id}`)
            // Retour du résultat en JSON.
            .then((result) => result.json())
            .then((apiProduct) => {
                displayProduct(apiProduct);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    /**
     * Fonction d'affichage du produit sur la page
     * @param {Object} product
     */
    function displayProduct(product) {
        const imageContainer = document.getElementById('item__img');

        // On modifie nos éléments en appliquant les valeurs stockées dans l'API
        imageContainer.innerHTML = `<img id="image" src="${product.imageUrl}" alt="${product.altTxt}" />`;
        title.textContent = `${product.name}`;
        price.textContent = `${product.price}`;
        description.textContent = `${product.description}`;

        // On met une boucle pour parcourir les couleurs disponible pour chaque produit associé
        for (let color of product.colors) {
            // On ajoute les options couleurs avec leurs valeurs
            colors.options[colors.options.length] = new Option(`${color}`, `${color}`);
        }
    }

    /**
     * Fonction d'ajout d'un produit dans le localStorage
     *
     * - Lorsqu’on ajoute un produit au panier, si celui-ci n'était pas déjà présent dans le panier, on ajoute un nouvel élément dans l’array.
     * - Lorsqu’on ajoute un produit au panier, si celui-ci était déjà présent dans le panier (même id + même couleur), on incrémente simplement la quantité du produit correspondant dans l’array
     * @param {Object} product
     */
    function addProductToLocalStorage(product) {
        const array = [];
        if (localStorageHas(PRODUCTS_KEY_LOCALSTORAGE)) {
            const array = localStorageGet(PRODUCTS_KEY_LOCALSTORAGE);
            const object = array.find(_product => (_product.id === product.id) && (_product.colors === product.colors) && (_product.title === product.title) && (_product.price === product.price) && (_product.image === product.image) && (_product.imageAlt === product.imageAlt));

            if (object) {
                object.quantity = Number(product.quantity) + Number(object.quantity);
                localStorageSave(PRODUCTS_KEY_LOCALSTORAGE, array);
            } else {
                array.push(product);
                localStorageSave(PRODUCTS_KEY_LOCALSTORAGE, array);
            }
        } else {
            array.push(product);
            localStorageSave(PRODUCTS_KEY_LOCALSTORAGE, array);
        }
    }

    /**
     * Fonction de personnalisation du bouton "Ajouter au panier"
     */
    function btnColorQtyChange() {
        const defaultValue = 'Sélectionnez une couleur';
        const selectedValue = colors.value;
        const quantityValue = Number(quantity.value);

        if ((selectedValue && selectedValue !== defaultValue) && quantityValue > 0) {
            addProductCart.disabled = false;
        } else {
            addProductCart.disabled = true;
        }
    }
})();