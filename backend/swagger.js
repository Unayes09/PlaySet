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
          status: { type: 'string', enum: ['ordered', 'ready_to_deliver', 'delivered'] },
          _id: { type: 'string' },
        },
        required: ['customer', 'priceTotal'],
      },
      Error: {
        type: 'object',
        properties: { error: { type: 'string' } },
      },
      AuthToken: {
        type: 'object',
        properties: { token: { type: 'string' } },
      },
      ProductCreateRequest: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          imageUrls: { type: 'array', items: { type: 'string' } },
          videoUrls: { type: 'array', items: { type: 'string' } },
          description: { type: 'string' },
          actualPrice: { type: 'number' },
          offerPrice: { type: 'number' },
          stock: { type: 'number' },
        },
        required: ['name', 'actualPrice', 'stock'],
      },
      ProductUpdateRequest: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          imageUrls: { type: 'array', items: { type: 'string' } },
          videoUrls: { type: 'array', items: { type: 'string' } },
          description: { type: 'string' },
          actualPrice: { type: 'number' },
          offerPrice: { type: 'number' },
          stock: { type: 'number' },
        },
      },
      OrderCreateRequest: {
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
        required: ['customer', 'priceTotal'],
      },
      OrderUpdateRequest: {
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
      AdminRegisterRequest: {
        type: 'object',
        properties: { username: { type: 'string' }, password: { type: 'string' } },
        required: ['username', 'password'],
      },
      AdminLoginRequest: {
        type: 'object',
        properties: { username: { type: 'string' }, password: { type: 'string' } },
        required: ['username', 'password'],
      },
      DeleteResponse: {
        type: 'object',
        properties: { success: { type: 'boolean' } },
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
    '/api/admin/register': {
      post: {
        summary: 'Register admin (one-time)',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/AdminRegisterRequest' } } } },
        responses: {
          '201': { description: 'Created' },
          '403': { description: 'Admin already registered', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/admin/login': {
      post: {
        summary: 'Login admin',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/AdminLoginRequest' } } } },
        responses: {
          '200': { description: 'Token', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthToken' } } } },
          '401': { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/products': {
      get: {
        summary: 'List products',
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Product' } } } } } },
      },
      post: {
        summary: 'Create product',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductCreateRequest' } } } },
        responses: { '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } } } },
      },
    },
    '/api/products/{id}': {
      put: {
        summary: 'Update product',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductUpdateRequest' } } } },
        responses: { '200': { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } } }, '404': { description: 'Not found' } },
      },
      delete: {
        summary: 'Delete product',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Deleted', content: { 'application/json': { schema: { $ref: '#/components/schemas/DeleteResponse' } } } }, '404': { description: 'Not found' } },
      },
    },
    '/api/customers': {
      get: {
        summary: 'List customers (paginated)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'page', in: 'query', schema: { type: 'integer', minimum: 1 }, required: false }],
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    totalPages: { type: 'integer' },
                    totalCustomers: { type: 'integer' },
                    customers: { type: 'array', items: { $ref: '#/components/schemas/Customer' } },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/customers/by-phone/{phone}': {
      get: {
        summary: 'Get customer by phone',
        parameters: [{ name: 'phone', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Customer' } } } },
          '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/orders': {
      post: {
        summary: 'Create order',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/OrderCreateRequest' } } } },
        responses: { '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } } } },
      },
    },
    '/api/orders/{id}': {
      put: {
        summary: 'Update order',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/OrderUpdateRequest' } } } },
        responses: { '200': { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } } }, '404': { description: 'Not found' } },
      },
      delete: {
        summary: 'Delete order',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Deleted', content: { 'application/json': { schema: { $ref: '#/components/schemas/DeleteResponse' } } } }, '404': { description: 'Not found' } },
      },
    },
  },
};

module.exports = spec;
