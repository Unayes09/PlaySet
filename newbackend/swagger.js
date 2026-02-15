const spec = {
  openapi: '3.0.0',
  info: {
    title: 'Playset API',
    version: '1.0.0',
    description: 'API for Playset backend',
  },
  servers: [
    { url: process.env.SWAGGER_SERVER_URL || 'http://localhost:8000' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      Customer: {
        type: 'object',
        properties: {
          phone: { type: 'string' },
          name: { type: 'string' },
          address: { type: 'string' },
          additionalInfo: { type: 'string' },
          email: { type: 'string' },
          _id: { type: 'string' },
        },
        required: ['phone', 'name', 'address'],
      },
      Product: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          imageUrls: { type: 'array', items: { type: 'string' } },
          videoUrls: { type: 'array', items: { type: 'string' } },
          description: { type: 'string' },
          actualPrice: { type: 'number' },
          offerPrice: { type: 'number' },
          stock: { type: 'number' },
          _id: { type: 'string' },
        },
        required: ['name', 'actualPrice', 'stock'],
      },
      Order: {
        type: 'object',
        properties: {
          customer: { $ref: '#/components/schemas/Customer' },
          date: { type: 'string', format: 'date-time' },
          productIds: { type: 'array', items: { type: 'string' } },
          productNames: { type: 'array', items: { type: 'string' } },
          quantities: { type: 'array', items: { type: 'number' } },
          priceTotal: { type: 'number' },
          status: { type: 'string' },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        responses: { '200': { description: 'OK' } },
      },
    },
  },
};

export default spec;

