import swaggerJsDoc, { OAS3Definition, OAS3Options } from 'swagger-jsdoc';

const definition: OAS3Definition = {
    openapi: '3.0.0',
    info: {
        title: 'Auth Sever API',
        version: '0.0.1',
    },
};

const options: OAS3Options = {
    apis: ['./routes/*.route.ts'],
    definition: definition,
};

const openApiSpecification = swaggerJsDoc(options);

export default openApiSpecification;
