/*
*
* Récupération de tous les produits de l'API
*
*/
fetch("http://localhost:3000/api/products")
    // Retour du résultat en JSON.
    .then((resultat) => resultat.json())
    // On nomme le résulat apiProduits.
    .then((apiProduits) => {
        // On affiche ce qui a été récupéré sous forme tableau dans la console.
        console.table(apiProduits);
        // Fonction d'affichage des produits de l'API
        articlesProduits(apiProduits);
    })
    // Une erreur est survenue si détecté
    .catch((error) => {
        alert(error)
    });
/*
*
* Fonction d'affichage des produits sur la page
*
*/
function articlesProduits(index) {
    // Création de la variable de la section des articles
    let articles = document.getElementById('items');
    // Boucle pour 'article' dans index
    for (let article of index) {
        // Création et ajout des articles
        articles.innerHTML += `
        <a href="./product.html?id=${article._id}">
            <article>
                <img src="${article.imageUrl}" alt="${article.altTxt}">
                <h3 class="productName">${article.name}1</h3>
                <p class="productDescription">${article.description}</p>
            </article>
        </a>`
    }
}