import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const customerSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Full name is required.').max(120),
    email: z.string().trim().email('Enter a valid email address.').max(254),
    phone: z.string().trim().min(7, 'Phone number is required.').max(24),
    address: z.string().trim().min(5, 'Delivery address is required.').max(240),
    city: z.string().trim().min(2, 'City is required.').max(80),
    state: z.string().trim().min(2, 'State is required.').max(80),
    notes: z.string().trim().max(500).optional().default(''),
  })
  .strict();

const checkoutItemSchema = z
  .object({
    id: z.number().int().positive(),
    quantity: z.number().int().min(1).max(20),
  })
  .strict();

const checkoutRequestSchema = z
  .object({
    customer: customerSchema,
    items: z.array(checkoutItemSchema).min(1).max(20),
    captchaToken: z.string().trim().max(4096).optional(),
  })
  .strict();

describe('Checkout Form Validation', () => {
  describe('Customer Validation', () => {
    const validCustomer = {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '08012345678',
      address: '123 Main Street',
      city: 'Lagos',
      state: 'Lagos',
      notes: 'Leave at gate',
    };

    it('should validate valid customer data', () => {
      const result = customerSchema.safeParse(validCustomer);
      expect(result.success).toBe(true);
    });

    it('should reject empty full name', () => {
      const result = customerSchema.safeParse({ ...validCustomer, fullName: '' });
      expect(result.success).toBe(false);
    });

    it('should reject short full name', () => {
      const result = customerSchema.safeParse({ ...validCustomer, fullName: 'A' });
      expect(result.success).toBe(false);
    });

    it('should reject invalid email', () => {
      const result = customerSchema.safeParse({ ...validCustomer, email: 'invalid' });
      expect(result.success).toBe(false);
    });

    it('should reject empty email', () => {
      const result = customerSchema.safeParse({ ...validCustomer, email: '' });
      expect(result.success).toBe(false);
    });

    it('should reject short phone number', () => {
      const result = customerSchema.safeParse({ ...validCustomer, phone: '123' });
      expect(result.success).toBe(false);
    });

    it('should reject long phone number', () => {
      const result = customerSchema.safeParse({ ...validCustomer, phone: '1234567890123456789012345' });
      expect(result.success).toBe(false);
    });

    it('should reject empty address', () => {
      const result = customerSchema.safeParse({ ...validCustomer, address: '' });
      expect(result.success).toBe(false);
    });

    it('should reject short address', () => {
      const result = customerSchema.safeParse({ ...validCustomer, address: '123' });
      expect(result.success).toBe(false);
    });

    it('should reject empty city', () => {
      const result = customerSchema.safeParse({ ...validCustomer, city: '' });
      expect(result.success).toBe(false);
    });

    it('should reject empty state', () => {
      const result = customerSchema.safeParse({ ...validCustomer, state: '' });
      expect(result.success).toBe(false);
    });

    it('should accept optional notes', () => {
      const withoutNotes = { ...validCustomer };
      delete (withoutNotes as Record<string, unknown>).notes;
      const result = customerSchema.safeParse(withoutNotes);
      expect(result.success).toBe(true);
    });

    it('should reject notes that are too long', () => {
      const result = customerSchema.safeParse({
        ...validCustomer,
        notes: 'a'.repeat(501),
      });
      expect(result.success).toBe(false);
    });

    it('should accept valid Nigerian phone numbers', () => {
      const phones = ['08012345678', '+2348012345678', '2348012345678'];
      for (const phone of phones) {
        const result = customerSchema.safeParse({ ...validCustomer, phone });
        expect(result.success).toBe(true);
      }
    });
  });

  describe('Checkout Items Validation', () => {
    it('should validate valid items', () => {
      const items = [
        { id: 1, quantity: 2 },
        { id: 2, quantity: 1 },
      ];
      const result = z.array(checkoutItemSchema).safeParse(items);
      expect(result.success).toBe(true);
    });

    it('should reject negative id', () => {
      const items = [{ id: -1, quantity: 1 }];
      const result = z.array(checkoutItemSchema).safeParse(items);
      expect(result.success).toBe(false);
    });

    it('should reject zero id', () => {
      const items = [{ id: 0, quantity: 1 }];
      const result = z.array(checkoutItemSchema).safeParse(items);
      expect(result.success).toBe(false);
    });

    it('should reject zero quantity', () => {
      const items = [{ id: 1, quantity: 0 }];
      const result = z.array(checkoutItemSchema).safeParse(items);
      expect(result.success).toBe(false);
    });

    it('should reject negative quantity', () => {
      const items = [{ id: 1, quantity: -1 }];
      const result = z.array(checkoutItemSchema).safeParse(items);
      expect(result.success).toBe(false);
    });

    it('should reject quantity over 20', () => {
      const items = [{ id: 1, quantity: 21 }];
      const result = z.array(checkoutItemSchema).safeParse(items);
      expect(result.success).toBe(false);
    });
  });

  describe('Full Checkout Request', () => {
    it('should validate complete checkout request', () => {
      const request = {
        customer: {
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '08012345678',
          address: '123 Main Street',
          city: 'Lagos',
          state: 'Lagos',
        },
        items: [
          { id: 1, quantity: 2 },
          { id: 2, quantity: 1 },
        ],
      };

      const result = checkoutRequestSchema.safeParse(request);
      expect(result.success).toBe(true);
    });

    it('should reject checkout without customer', () => {
      const request = {
        items: [{ id: 1, quantity: 2 }],
      };

      const result = checkoutRequestSchema.safeParse(request);
      expect(result.success).toBe(false);
    });

    it('should accept optional captcha token', () => {
      const request = {
        customer: {
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '08012345678',
          address: '123 Main Street',
          city: 'Lagos',
          state: 'Lagos',
        },
        items: [{ id: 1, quantity: 2 }],
        captchaToken: 'test-token',
      };

      const result = checkoutRequestSchema.safeParse(request);
      expect(result.success).toBe(true);
    });
  });
});

describe('Phone Number Normalization', () => {
  const normalizePhoneNumber = (phoneNumber: string) => {
    const compactPhoneNumber = phoneNumber.replace(/[^\d+]/g, '');
    if (compactPhoneNumber.startsWith('+')) return compactPhoneNumber;
    if (compactPhoneNumber.startsWith('234')) return `+${compactPhoneNumber}`;
    if (compactPhoneNumber.startsWith('0') && compactPhoneNumber.length === 11) {
      return `+234${compactPhoneNumber.slice(1)}`;
    }
    return compactPhoneNumber;
  };

  it('should normalize 0-prefixed numbers', () => {
    expect(normalizePhoneNumber('08012345678')).toBe('+2348012345678');
  });

  it('should normalize 234-prefixed numbers', () => {
    expect(normalizePhoneNumber('2348012345678')).toBe('+2348012345678');
  });

  it('should keep already prefixed numbers', () => {
    expect(normalizePhoneNumber('+2348012345678')).toBe('+2348012345678');
  });
});

describe('Notification Status', () => {
  type NotificationStatus = 'pending' | 'processing' | 'sent' | 'failed' | 'not_configured';

  const describeChannel = (label: string, status: NotificationStatus) => {
    switch (status) {
      case 'sent': return `${label} sent`;
      case 'processing': return `${label} is being prepared`;
      case 'failed': return `${label} needs a retry`;
      case 'not_configured': return `${label} is waiting for setup`;
      default: return `${label} queued`;
    }
  };

  it('should describe sent status', () => {
    expect(describeChannel('Email', 'sent')).toBe('Email sent');
  });

  it('should describe processing status', () => {
    expect(describeChannel('SMS', 'processing')).toBe('SMS is being prepared');
  });

  it('should describe failed status', () => {
    expect(describeChannel('Email', 'failed')).toBe('Email needs a retry');
  });

  it('should describe pending status', () => {
    expect(describeChannel('SMS', 'pending')).toBe('SMS queued');
  });
});