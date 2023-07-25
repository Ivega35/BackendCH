import EErros from "../services/errors/enums.js";

export default (error, req, res, next) => {
    console.log(error.cause)

    switch (error.code) {
        case EErros.INVALID_TYPES_ERROR:
            res.status(406).send({ status: 'error', error: error.name })
            break;
        case EErros.ROUTING_ERROR:
            res.status(404).send({ status: 'error', error: error.name })
            break;
        case EErros.DATABASES_ERROR:
            res.status(405).send({ status: 'error', error: error.name })
            break;
        case EErros.UNAUTHORIZED_ERROR:
            res.status(401).send({ status: 'error', error: error.name })
            break;
        default:
            res.send({ status: 'error', error: 'Unhandled error' })
            break;
    }
}