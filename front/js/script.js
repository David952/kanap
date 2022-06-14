/*
*
* Récupération de tous les produits de l'API
*
*/
fetch("http://localhost:3000/api/products")
    // Retour du résultat en JSON.
    .then((result) => result.json())
    // On nomme le résulat apiItems.
    .then((apiItems) => {
        // On affiche ce qui a été récupéré sous forme tableau dans la console.
        console.table(apiItems);
        // Fonction d'affichage des produits de l'API
        displayItems(apiItems);
    })
    // Une erreur est survenue si détecté
    .catch((error) => {
        console.log(error);
    });
/*
*
* Fonction d'affichage des produits sur la page
*
*/
function displayItems(items) {
    // On pointe une variable en mémoire
    const documentFragment = document.createElement('div');
    // Création de la variable de la section des articles
    let itemsContainer = document.getElementById('items');
    // Boucle pour 'article' dans index
    for (let item of items) {
        // Création et ajout des articles
        documentFragment.innerHTML += `
            <a href="./product.html?id=${item._id}">
                <article>
                    <img src="${item.imageUrl}" alt="${item.altTxt}">
                    <h3 class="productName">${item.name}</h3>
                    <p class="productDescription">${item.description}</p>
                </article>
            </a>
        `
    }
    // 
    itemsContainer.innerHTML = documentFragment.innerHTML;
}