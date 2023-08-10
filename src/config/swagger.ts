import swaggerJSdoc, { Options } from 'swagger-jsdoc';

const options: Options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "LogRocket Express API with Swagger",
            version: "0.1.0",
            description:
                "This is a simple CRUD API application made with Express and documented with Swagger",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "LogRocket",
                url: "https://logrocket.com",
                email: "info@email.com",
            },
        },
        paths: {
            "/todos/{todoId}/tasks": {
                get: {
                    description: "Get tasks for todolist",
                    "parameters": [
                        {
                            "name": "todoId",
                            "required": true,
                            "type": "string",
                            "in": "path",
                        }, {
                            "name": "userId",
                            "required": true,
                            "type": "string",
                            "in": "query"
                        }

                    ],
                    responses: {
                        "200": {
                            description: "test 200",
                        }
                    }
                }
            }
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
    },
    apis: ["../routes/*.ts"],
};

export const swaggerConfig = swaggerJSdoc(options);