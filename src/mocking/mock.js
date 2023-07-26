import { fakerES as faker } from "@faker-js/faker"

export const generateProductsMock= () =>{
    return{
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        category: faker.commerce.productAdjective(),
        status: true,
        thumbnail: faker.image.urlPicsumPhotos(),
        code: faker.number.hex(),
        stock: faker.number.int()
    }
}

export const generateUserMock= () =>{
    return{
        _id: faker.database.mongodbObjectId(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        rol: 'user'
    }
}