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
fetch("http://localhost:3000/api/products")
    // Retour du résultat en JSON.
    .then((resultat) => resultat.json())
    // On nomme le résulat apiProduits.
    .then((apiProduits) => {
        // On affiche ce qui a été récupéré sous forme tableau dans la console.
        console.table(apiProduits);
    })
    // Une erreur est survenue si détecté
    .catch((error) => {
        alert(error)
    });
    /*
*
* Fonction d'affichage du produit sur la page
*
*/
function Produits(produit) {

}