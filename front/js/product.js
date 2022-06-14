/*
*
* On récupère l'id du produit grâce à l'URL
*
*/
const url = new URLSearchParams(window.location.search);
const id = url.get("id");
console.log(id);
/*
*
* Récupération de tous les produits de l'API
*
*/
fetch("http://localhost:3000/api/products/")
    // Retour du résultat en JSON.
    .then((result) => result.json())
    // On nomme le résulat apiItems.
    .then((apiItems) => {
        // On affiche ce qui a été récupéré sous forme tableau dans la console.
        console.table(apiItems);
        //Fonction affichage du produit
        displayProduct(apiItems);
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
    // Une boucle pour rechercher chaque élément
    for (let display of product) {
        //On vérifie que l'id du produit correspond bien au produit choisit dans l'API
        if (id === display._id) {
            // On définit les éléments qui va être dynamique
            image.innerHTML += `<img src="${display.imageUrl}" alt="${display.altTxt}">`;
            title.textContent = `${display.name}`;
            price.textContent = `${display.price}`;
            description.textContent = `${display.description}`;
            //On met une boucle pour parcourir les couleurs disponible pour chaque produit associé
            for (let color of display.colors) {
                //On ajoute les options couleurs avec leurs valeurs
                colors.innerHTML += `<option value="${color}">${color}</option>`;
            }
        }
    }
}