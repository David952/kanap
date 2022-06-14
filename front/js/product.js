/*
*
* On récupère l'id du produit grâce à l'URL
*
*/
const url = new URLSearchParams(window.location.search);
const id = url.get("id");
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
    const image = document.getElementById('item__img');
    const title = document.getElementById('title');
    const price = document.getElementById('price');
    const description = document.getElementById('description');
    const colors = document.getElementById('colors');
    
    // On modifie nos éléments en appliquant les valeurs stockées dans l'API
    image.innerHTML += `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
    title.textContent = `${product.name}`;
    price.textContent = `${product.price}`;
    description.textContent = `${product.description}`;

    // On met une boucle pour parcourir les couleurs disponible pour chaque produit associé
    for (let color of product.colors) {
        // On ajoute les options couleurs avec leurs valeurs
        colors.innerHTML += `<option value="${color}">${color}</option>`;
    }
}