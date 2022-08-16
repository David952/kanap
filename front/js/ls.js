/**
 * On vérifie que la clé existe dans le localStorage
 * @param {String} key
 * @return {Boolean}
 */
 function localStorageHas(key) {
    const item = localStorage.getItem(key);
    return ( item !== null );
}

/**
 * On enregistre les valeurs dans le localStorage
 * @param {String} key
 * @param {any} value
 */
function localStorageSave(key, value) {
    if (value === undefined) throw new Error("Can't store undefined value");

    if (typeof(value) === 'object') {
        value = JSON.stringify(value);
    }

    localStorage.setItem(key, value);
    console.log('Object has been added to LS!')
}

/**
 * On récupère un objet du localStorage.
 * @param {String} key
 * @return {Object}
 */
function localStorageGet(key) {
    const product = localStorage.getItem(key);

    if (!product) return;
    if ( product[0] === '{' || product[0] === '[' ) return JSON.parse(product);

    return product;
}

/**
 * On exporte les fonctions
 */
export {localStorageHas, localStorageSave, localStorageGet}