/**
 * Importation des fonctions du script "ls.js"
 */
import {localStorageHas, localStorageSave, localStorageGet} from './ls.js';

/*
*
* On récupère l'id du produit grâce à l'URL
*
*/
const url = new URLSearchParams(window.location.search);
const id = url.get("id");
const PRODUCT_KEY_LOCALSTORAGE = 'products';

/*
*
* Récupération de l'ID des produits de l'API
*
*/
fetch(`http://localhost:3000/api/products/${id}`)
    // Retour du résultat en JSON.
    .then((result) => result.json())
    // On nomme le résulat apiProduct.
    .then((apiProduct) => {
        // On affiche ce qui a été récupéré sous forme tableau dans la console.
        // Fonction affichage du produit
        displayProduct(apiProduct);
    })
    // Une erreur est survenue si détecté
    .catch((error) => {
        console.log(error);
    });

/*
*
* Fonction d'affichage du produit sur la page
*
*/
function displayProduct(product) {
    // Création des varibles de ciblage des éléments
    const imageAlt = document.getElementById('item__img');
    const title = document.getElementById('title');
    const price = document.getElementById('price');
    const description = document.getElementById('description');
    const colors = document.getElementById('colors');
    
    // On modifie nos éléments en appliquant les valeurs stockées dans l'API
    imageAlt.innerHTML += `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
    title.textContent = `${product.name}`;
    price.textContent = `${product.price}`;
    description.textContent = `${product.description}`;

    // On met une boucle pour parcourir les couleurs disponible pour chaque produit associé
    for (let color of product.colors) {
        // On ajoute les options couleurs avec leurs valeurs
        colors.innerHTML += `<option value="${color}">${color}</option>`;
    }
}

/*
*
* Ajout du produit au localStorage (panier)
*
*/

// On définit les variables à prendre en compte pour le localStorage.
const addProductCart = document.getElementById('addToCart');
const quantity = document.getElementById('quantity');
const colors = document.getElementById('colors');
const price = document.getElementById('price');
const title = document.getElementById('title');
const imageAlt = document.getElementById('imageAlt');

// La fonction va nous permettre d'ajouter un produit dans le localStorage
addProductCart.onclick = () =>{
    const product = {
        id: id,
        quantity: quantity.value,
        colors: colors.value,
        price: price.value,
        title: title.value,
        /*imageAlt: imageAlt.value,*/
    }

    addProductToLocalStorage(product);
}


/**
 * - Lorsqu’on ajoute un produit au panier, si celui-ci n'était pas déjà présent dans le panier, on ajoute un nouvel élément dans l’array.
 * - Lorsqu’on ajoute un produit au panier, si celui-ci était déjà présent dans le panier (même id + même couleur), on
 * incrémente simplement la quantité du produit correspondant dans l’array
 * @param {Object} product
 */
 function addProductToLocalStorage(product) {
    const array = [];
    // TODO :
        // - Récupérer la valeur courante de l'objet stocké dans le LS
        // - Mettre à jour la valeur courante en mémoire avec le nouvel objet que l'on veut insérer
        // - Mettre à jour le LS avec la nouvelle valeur
    if (localStorageHas(PRODUCT_KEY_LOCALSTORAGE)) {
        const array = localStorageGet(PRODUCT_KEY_LOCALSTORAGE);
        const object = array.find(_product => (_product.id === product.id) && (_product.colors === product.colors) && (_product.title === product.title) && (_product.price === product.price));

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

console.log(imageAlt); 

/**
 * 
 * Fonction de personnalisation du bouton "Ajouter au panier"
 * 
 */
function btnChange(choice) {
    const btn = document.getElementById('addToCart');

    if (choice.value != '') {
        btn.disabled = false;
    } 
    else {
        btn.disabled = true;
    }
}
btnChange();