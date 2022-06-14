/*
*
* Récupération de tous les produits de l'API
*
*/
fetch("http://localhost:3000/api/products")
    // Retour du résultat en JSON.
    .then((result) => result.json())
    // On nomme le résulat apiProducts.
    .then((apiProducts) => {
        // On affiche ce qui a été récupéré sous forme tableau dans la console.
        console.table(apiProducts);
        // Fonction d'affichage des produits de l'API
        displayProducts(apiProducts);
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
function displayProducts(products) {
    // On crée un élément <div> en mémoire
    const documentFragment = document.createElement('div');
    // On récupére l'élément items situé dans le DOM
    let itemsContainer = document.getElementById('items');

    // On boucle sur tous les articles
    for (let product of products) {
        // Création et ajout des articles
        documentFragment.innerHTML += `
            <a href="./product.html?id=${product._id}">
                <article>
                    <img src="${product.imageUrl}" alt="${product.altTxt}">
                    <h3 class="productName">${product.name}</h3>
                    <p class="productDescription">${product.description}</p>
                </article>
            </a>
        `
    }
    // On insère la string concaténée directement dans le contenu de l'élément du DOM
    // L'opération d'insertion ou de modification ne s'effectue qu'une seule fois
    itemsContainer.innerHTML = documentFragment.innerHTML;
}