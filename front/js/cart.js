/*
*
* Récupération de tous les produits de l'API
*
*/
fetch("http://localhost:3000/api/products/")
    // Retour du résultat en JSON.
    .then((result) => result.json())
    // On nomme le résulat apiProducts.
    .then((apiProducts) => {
        // On affiche ce qui a été récupéré sous forme tableau dans la console.
        console.table(apiProducts);
        //

    })
    // Une erreur est survenue si détecté
    .catch((error) => {
        console.log(error);
    });