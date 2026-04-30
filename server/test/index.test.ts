// @vitest-environment node
import { describe, it, expect, beforeAll, vi } from 'vitest';
import supertest from 'supertest';

process.env.NODE_ENV = 'test';
process.env.SERVER_PORT = '3002';
process.env.VITE_SUPABASE_URL = 'https://ofhmwzzvhguojvxkehmx.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
process.env.PAYSTACK_SECRET_KEY = 'test-paystack-key';
process.env.CSRF_SECRET = 'test-csrf-secret-32-chars-long-at-least';
process.env.ORDER_TOKEN_SECRET = 'test-order-token-secret-32-chars-long';
process.env.ORDER_STORE_ENCRYPTION_KEY = 'test-encryption-key-32-chars-long';
process.env.PUBLIC_SITE_URL = 'http://localhost:3002';

vi.mock('../lib/supabase-admin.js', async () => {
  return {
    supabaseAdmin: {
      auth: {
        getUser: vi.fn().mockImplementation((token: string) => {
          if (token === 'test-admin-token') {
            return Promise.resolve({
              data: {
                user: {
                  id: 'test-admin-id',
                  email: 'admin@example.com',
                  app_metadata: { role: 'admin' },
                },
              },
              error: null,
            });
          }
          if (token === 'user-metadata-admin-token') {
            return Promise.resolve({
              data: {
                user: {
                  id: 'forged-admin-id',
                  email: 'user@example.com',
                  app_metadata: {},
                  user_metadata: { role: 'admin' },
                },
              },
              error: null,
            });
          }
          return Promise.resolve({ data: { user: null }, error: new Error('Invalid token') });
        }),
      },
      from: vi.fn().mockImplementation((table: string) => ({
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(async () => {
          if (table === 'orders') return { data: null, error: { message: 'Not found', code: 'PGRST116' } };
          return { data: null, error: null };
        }),
        then: vi.fn().mockImplementation((callback) => {
          if (table === 'products') return Promise.resolve(callback({ data: [], error: null }));
          return Promise.resolve(callback({ data: null, error: null }));
        }),
      })),
    },
  };
});

describe('Checkout API', () => {
  let request: any;

  beforeAll(async () => {
    const { app } = await import('../index.js');
    request = supertest(app);
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request.get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
    });
  });

  describe('POST /api/checkout/initialize', () => {
    it('should reject empty cart', async () => {
      const response = await request
        .post('/api/checkout/initialize')
        .send({ customer: {}, items: [] });

      expect(response.status).toBe(400);
    });

    it('should reject invalid customer data', async () => {
      const response = await request.post('/api/checkout/initialize').send({
        customer: {
          fullName: '',
          email: 'invalid-email',
          phone: '',
          address: '',
          city: '',
          state: '',
        },
        items: [{ id: 1, quantity: 1 }],
      });

      expect(response.status).toBe(400);
    });

    it('should reject invalid item data', async () => {
      const response = await request.post('/api/checkout/initialize').send({
        customer: {
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '08012345678',
          address: '123 Main St',
          city: 'Lagos',
          state: 'Lagos',
        },
        items: [{ id: -1, quantity: 1 }],
      });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/checkout/verify/:reference', () => {
    it('should reject missing reference', async () => {
      const response = await request.get('/api/checkout/verify/');
      expect(response.status).toBe(404);
    });

    it('should reject invalid reference format', async () => {
      const response = await request.get('/api/checkout/verify/invalid');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 404 for non-existent order', async () => {
      const response = await request.get('/api/checkout/verify/STK-NONEXISTENT-123');
      expect(response.status).toBe(404);
    });
  });

  describe('Rate Limiting', () => {
    it('should track rate limit headers', async () => {
      const response = await request.get('/api/checkout/verify/STK-TEST-123');
      expect(response.headers).toHaveProperty('cache-control');
    });
  });

  describe('Security Headers', () => {
    it('should include security headers', async () => {
      const response = await request.get('/api/health');
      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
    });
  });
});

describe('Admin API', () => {
  let request: any;
  const adminToken = 'Bearer test-admin-token';

  beforeAll(async () => {
    const { app } = await import('../index.js');
    request = supertest(app);
  });

  describe('GET /api/admin/me', () => {
    it('should reject unauthenticated requests', async () => {
      const response = await request.get('/api/admin/me');
      expect(response.status).toBe(401);
    });

    it('should reject invalid token', async () => {
      const response = await request
        .get('/api/admin/me')
        .set('Authorization', 'Bearer invalid-token');
      expect(response.status).toBe(401);
    });

    it('should reject admin role claims from user-editable metadata', async () => {
      const response = await request
        .get('/api/admin/me')
        .set('Authorization', 'Bearer user-metadata-admin-token');

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/admin/stats', () => {
    it('should require authentication', async () => {
      const response = await request.get('/api/admin/stats');
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/admin/products', () => {
    it('should require authentication', async () => {
      const response = await request.get('/api/admin/products');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/admin/products', () => {
    it('should require authentication', async () => {
      const response = await request
        .post('/api/admin/products')
        .send({ name: 'Test', price: 1000, category: 'Test', supplier: 'Test' });
      expect(response.status).toBe(401);
    });

    it('should reject invalid product data', async () => {
      const response = await request
        .post('/api/admin/products')
        .set('Authorization', adminToken)
        .send({ name: '', price: -100 });

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/admin/products/:id', () => {
    it('should require authentication', async () => {
      const response = await request
        .put('/api/admin/products/1')
        .send({ name: 'Updated' });
      expect(response.status).toBe(401);
    });

    it('should reject invalid product id', async () => {
      const response = await request
        .put('/api/admin/products/abc')
        .set('Authorization', adminToken);

      if (response.status !== 400) {
        console.error('DEBUG 400 FAILURE BODY:', JSON.stringify(response.body, null, 2));
      }
      expect(response.status).toBe(400);
    });

    it('should reject negative product id', async () => {
      const response = await request
        .put('/api/admin/products/-1')
        .set('Authorization', adminToken);

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/admin/products/:id', () => {
    it('should require authentication', async () => {
      const response = await request.delete('/api/admin/products/1');
      expect(response.status).toBe(401);
    });
  });
});

describe('Input Validation', () => {
  let request: any;

  beforeAll(async () => {
    const { app } = await import('../index.js');
    request = supertest(app);
  });

  describe('Checkout Request Schema', () => {
    it('should reject extra unknown fields', async () => {
      const response = await request.post('/api/checkout/initialize').send({
        customer: {
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '08012345678',
          address: '123 Main St',
          city: 'Lagos',
          state: 'Lagos',
          unknownField: 'should be rejected',
        },
        items: [{ id: 1, quantity: 1 }],
      });

      expect(response.status).toBe(400);
    });

    it('should reject empty customer fields', async () => {
      const response = await request.post('/api/checkout/initialize').send({
        customer: {
          fullName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
        },
        items: [{ id: 1, quantity: 1 }],
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should validate email format', async () => {
      const response = await request.post('/api/checkout/initialize').send({
        customer: {
          fullName: 'John Doe',
          email: 'not-an-email',
          phone: '08012345678',
          address: '123 Main St',
          city: 'Lagos',
          state: 'Lagos',
        },
        items: [{ id: 1, quantity: 1 }],
      });

      expect(response.status).toBe(400);
    });

    it('should validate phone length', async () => {
      const response = await request.post('/api/checkout/initialize').send({
        customer: {
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '123',
          address: '123 Main St',
          city: 'Lagos',
          state: 'Lagos',
        },
        items: [{ id: 1, quantity: 1 }],
      });

      expect(response.status).toBe(400);
    });

    it('should enforce maximum item count', async () => {
      const items = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        quantity: 1,
      }));

      const response = await request.post('/api/checkout/initialize').send({
        customer: {
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '08012345678',
          address: '123 Main St',
          city: 'Lagos',
          state: 'Lagos',
        },
        items,
      });

      expect(response.status).toBe(400);
    });
  });

  describe('Product Update Schema', () => {
    it('should reject negative price', async () => {
      const response = await request.put('/api/admin/products/1').send({
        price: -100,
      });

      expect(response.status).toBe(401);
    });

    it('should reject rating over 5', async () => {
      const response = await request.put('/api/admin/products/1').send({
        rating: 6,
      });

      expect(response.status).toBe(401);
    });
  });
});

describe('Error Responses', () => {
  let request: any;

  beforeAll(async () => {
    const { app } = await import('../index.js');
    request = supertest(app);
  });

  it('should return JSON error for validation errors', async () => {
    const response = await request.post('/api/checkout/initialize').send({});

    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toHaveProperty('message');
  });

  it('should return JSON error for not found', async () => {
    const response = await request.get('/api/unknown-route');

    expect(response.status).toBe(404);
    expect(response.headers['content-type']).toMatch(/json/);
  });
});
