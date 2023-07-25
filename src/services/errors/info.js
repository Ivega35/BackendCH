export const generateErrorInfo = user => {
    return `
    Uno o mas properties están incompletos o son inválidos.
    Lista de propiedades obligatorias:
        - first_name: Must be a string. (${user.first_name})
        - last_name: Must be a string. (${user.last_name})
        - email: Must be a string. (${user.email})
        -age:  Must be a number. (${user.age})
    `
}

export const unauthorizedErrorInfo = `You haven't access permissions for this page `

export const addProductErrorInfo = product => {
    return `
    Uno o mas properties están incompletos o son inválidos.
    Lista de propiedades obligatorias:
        - title: Must be a string. (${product.title})
        - price: Must be a number. (${product.price})
        - description: Must be a string. (${product.description})
        -stock:  Must be a number. (${product.stock})
        -category: Must be "sneaker", "Accesory" or "sportwear" (${product.category})
        -thumbnail: Must be a string. (${product.thumbnail})
    `
}
export const notFoundModelErrorInfo= entity =>{
    return `entity "${entity}" not found in models`
}

