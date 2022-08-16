import { localStorageHas, localStorageSave, localStorageGet } from './ls.js';

/**
* On récupère l'id du produit grâce à l'URL
* On définit les variables qui serviront dans notre script
*/
const url = new URLSearchParams(window.location.search);
const id = url.get("id");
const PRODUCT_KEY_LOCALSTORAGE = 'products';
const title = document.getElementById('title');
const image = document.getElementById('image');
const colors = document.getElementById('colors');
const description = document.getElementById('description');
const quantity = document.getElementById('quantity');
const price = document.getElementById('price');
const addProductCart = document.getElementById('addToCart');

/**
 * Fonction d'initialisation de la page du produit
 * @returns {Promise<void>}
 */
async function init() {
    // Récupération de l'ID des produits de l'API
    await fetch(`http://localhost:3000/api/products/${id}`)
        // Retour du résultat en JSON.
        .then((result) => result.json())
        .then((apiProduct) => {
            displayProduct(apiProduct);
        })
        .catch((error) => {
            console.log(error);
        });
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
        }

        if (quantity.value === 0) return;

        addProductToLocalStorage(product);
    });
    // Changer le status du bouton lorsque le select change de valeur
    colors.addEventListener('change', btnChange);
    quantity.addEventListener('change', quantityChange);
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
    // - Récupérer la valeur courante de l'objet stocké dans le LS
    // - Mettre à jour la valeur courante en mémoire avec le nouvel objet que l'on veut insérer
    // - Mettre à jour le LS avec la nouvelle valeur
    if (localStorageHas(PRODUCT_KEY_LOCALSTORAGE)) {
        const array = localStorageGet(PRODUCT_KEY_LOCALSTORAGE);
        const object = array.find(_product => (_product.id === product.id) && (_product.colors === product.colors) && (_product.title === product.title) && (_product.price === product.price) && (_product.image === product.image) && (_product.imageAlt === product.imageAlt)) ;

        if (object) {
            object.quantity = Number(product.quantity) + Number(object.quantity);
            localStorageSave(PRODUCT_KEY_LOCALSTORAGE, array);
        } else {
            array.push(product);
            localStorageSave(PRODUCT_KEY_LOCALSTORAGE, array);
        }
    } else {
        array.push(product);
        localStorageSave(PRODUCT_KEY_LOCALSTORAGE, array);
    }
}

/**
 * Fonction de personnalisation du bouton "Ajouter au panier"
 */
function btnChange() {
    const defaultValue = 'Sélectionnez une couleur';
    const selectedValue = colors.value;
    const quantityValue = Number(quantity.value);

    if ((selectedValue && selectedValue !== defaultValue) && quantityValue > 0) {
        addProductCart.disabled = false;
    } else {
        addProductCart.disabled = true;
    }
}

/**
 * Fonction de personnalisation de la quantité
 */
function quantityChange() {
    const defaultValue = 'Sélectionnez une couleur';
    const selectedValue = colors.value;
    const quantityValue = Number(this.value);

    if ((selectedValue && selectedValue !== defaultValue) && quantityValue > 0) {
        addProductCart.disabled = false;
    } else {
        addProductCart.disabled = true;
    }
}

init();