/**
 * Property-Based Tests for Contact Email Edge Function Input Validation
 * Feature: contact-email-notifications, Property 9: Request Validation Robustness
 * Validates: Requirements 4.2, 4.4, 6.3
 * 
 * For any request payload, the Edge Function should validate the structure 
 * and return appropriate HTTP status codes for different error conditions.
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Import the validation functions from the Edge Function
// Note: We'll need to extract these functions for testing
interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

// Mock the validation functions for testing
// In a real implementation, these would be extracted from the Edge Function
function validateContactFormData(data: unknown): ContactFormData {
    if (!data || typeof data !== 'object') {
        throw new Error('Request body must be a valid object');
    }

    const { name, email, message } = data as any;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        throw new Error('Name is required and must be a non-empty string');
    }

    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
        throw new Error('Valid email address is required');
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
        throw new Error('Message is required and must be a non-empty string');
    }

    // Validate field lengths
    if (name.length > 100) {
        throw new Error('Name must be 100 characters or less');
    }

    if (message.length > 5000) {
        throw new Error('Message must be 5000 characters or less');
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name.trim());
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedMessage = sanitizeInput(message.trim());

    return {
        name: sanitizedName,
        email: sanitizedEmail,
        message: sanitizedMessage
    };
}

function sanitizeInput(input: string): string {
    if (!input) return '';

    // Escape HTML special characters
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

function isValidEmail(email: string): boolean {
    // Basic format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return false;
    }

    // Check for consecutive dots (not allowed in RFC)
    if (email.includes('..')) {
        return false;
    }

    // Check for dots at the beginning or end of local part
    const [localPart, domain] = email.split('@');
    if (localPart.startsWith('.') || localPart.endsWith('.')) {
        return false;
    }

    // Check for dots at the beginning or end of domain
    if (domain.startsWith('.') || domain.endsWith('.')) {
        return false;
    }

    return true;
}

describe('Contact Email Edge Function Validation Property Tests', () => {
    /**
     * Property 9: Request Validation Robustness
     * For any invalid request payload, the validation function should throw 
     * an appropriate error with a descriptive message.
     */
    it('Property 9a: Invalid request objects are rejected', () => {
        // Generator for invalid request objects
        const invalidRequestArb = fc.oneof(
            fc.constant(null),
            fc.constant(undefined),
            fc.string(),
            fc.integer(),
            fc.boolean(),
            fc.array(fc.anything()),
            fc.constant({}) // empty object
        );

        fc.assert(
            fc.property(invalidRequestArb, (invalidRequest) => {
                try {
                    validateContactFormData(invalidRequest);
                    return false; // Should have thrown an error
                } catch (error) {
                    return error instanceof Error && error.message.length > 0;
                }
            }),
            { numRuns: 100 }
        );
    });

    /**
     * Property 9b: Missing required fields are rejected
     * For any object missing required fields (name, email, message),
     * validation should fail with appropriate error messages.
     */
    it('Property 9b: Missing required fields are rejected', () => {
        const incompleteDataArb = fc.record({
            name: fc.option(fc.string(), { nil: undefined }),
            email: fc.option(fc.string(), { nil: undefined }),
            message: fc.option(fc.string(), { nil: undefined })
        }).filter(data =>
            !data.name || !data.email || !data.message ||
            data.name.trim().length === 0 ||
            data.email.trim().length === 0 ||
            data.message.trim().length === 0
        );

        fc.assert(
            fc.property(incompleteDataArb, (incompleteData) => {
                try {
                    validateContactFormData(incompleteData);
                    return false; // Should have thrown an error
                } catch (error) {
                    return error instanceof Error &&
                        (error.message.includes('required') ||
                            error.message.includes('non-empty'));
                }
            }),
            { numRuns: 100 }
        );
    });

    /**
     * Property 9c: Invalid email formats are rejected
     * For any string that is not a valid email format,
     * validation should fail with appropriate error message.
     */
    it('Property 9c: Invalid email formats are rejected', () => {
        const invalidEmailArb = fc.oneof(
            fc.string().filter(s => !isValidEmail(s)),
            fc.constant(''),
            fc.constant('invalid'),
            fc.constant('test@'),
            fc.constant('@test.com'),
            fc.constant('test..test@example.com'),
            fc.constant('test@example'),
            fc.constant('test@.com')
        );

        fc.assert(
            fc.property(invalidEmailArb, (invalidEmail) => {
                const testData = {
                    name: 'Test Name',
                    email: invalidEmail,
                    message: 'Test message'
                };

                try {
                    validateContactFormData(testData);
                    return false; // Should have thrown an error
                } catch (error) {
                    return error instanceof Error &&
                        error.message.includes('Valid email address is required');
                }
            }),
            { numRuns: 100 }
        );
    });

    /**
     * Property 9d: Field length limits are enforced
     * For any input exceeding length limits (name > 100, message > 5000),
     * validation should fail with appropriate error message.
     */
    it('Property 9d: Field length limits are enforced', () => {
        const oversizedFieldsArb = fc.oneof(
            // Name too long
            fc.record({
                name: fc.string({ minLength: 101, maxLength: 200 }),
                email: fc.emailAddress(),
                message: fc.string({ minLength: 1, maxLength: 100 })
            }),
            // Message too long
            fc.record({
                name: fc.string({ minLength: 1, maxLength: 50 }),
                email: fc.emailAddress(),
                message: fc.string({ minLength: 5001, maxLength: 6000 })
            })
        );

        fc.assert(
            fc.property(oversizedFieldsArb, (oversizedData) => {
                try {
                    validateContactFormData(oversizedData);
                    return false; // Should have thrown an error
                } catch (error) {
                    return error instanceof Error &&
                        (error.message.includes('100 characters or less') ||
                            error.message.includes('5000 characters or less'));
                }
            }),
            { numRuns: 100 }
        );
    });

    /**
     * Property 9e: Valid data passes validation and is sanitized
     * For any valid contact form data, validation should succeed
     * and return sanitized data.
     */
    it('Property 9e: Valid data passes validation and is sanitized', () => {
        const validDataArb = fc.record({
            name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
            email: fc.emailAddress(),
            message: fc.string({ minLength: 1, maxLength: 5000 }).filter(s => s.trim().length > 0)
        });

        fc.assert(
            fc.property(validDataArb, (validData) => {
                try {
                    const result = validateContactFormData(validData);

                    // Should return valid ContactFormData
                    return result &&
                        typeof result.name === 'string' &&
                        typeof result.email === 'string' &&
                        typeof result.message === 'string' &&
                        result.name.length > 0 &&
                        result.email.length > 0 &&
                        result.message.length > 0 &&
                        // Email should be lowercase
                        result.email === result.email.toLowerCase() &&
                        // Data should be trimmed
                        result.name === result.name.trim() &&
                        result.message === result.message.trim();
                } catch (error) {
                    return false; // Valid data should not throw
                }
            }),
            { numRuns: 100 }
        );
    });

    /**
     * Property 9f: HTML injection is prevented through sanitization
     * For any input containing HTML special characters,
     * the sanitized output should have these characters escaped.
     */
    it('Property 9f: HTML injection is prevented through sanitization', () => {
        const htmlInjectionArb = fc.string().filter(s =>
            s.includes('<') || s.includes('>') || s.includes('&') ||
            s.includes('"') || s.includes("'") || s.includes('/')
        );

        fc.assert(
            fc.property(htmlInjectionArb, (htmlString) => {
                const sanitized = sanitizeInput(htmlString);

                // HTML special characters should be escaped
                return !sanitized.includes('<script') &&
                    !sanitized.includes('</script>') &&
                    !sanitized.includes('<img') &&
                    !sanitized.includes('javascript:') &&
                    // Check that dangerous characters are escaped
                    (htmlString.includes('<') ? sanitized.includes('&lt;') : true) &&
                    (htmlString.includes('>') ? sanitized.includes('&gt;') : true) &&
                    (htmlString.includes('&') ? sanitized.includes('&amp;') : true);
            }),
            { numRuns: 100 }
        );
    });

    /**
     * Property 9g: Whitespace-only fields are rejected
     * For any field containing only whitespace characters,
     * validation should fail appropriately.
     */
    it('Property 9g: Whitespace-only fields are rejected', () => {
        const whitespaceChars = [' ', '\t', '\n', '\r', '\f', '\v'];
        const whitespaceOnlyArb = fc.array(
            fc.constantFrom(...whitespaceChars),
            { minLength: 1, maxLength: 50 }
        ).map(chars => chars.join(''));

        const whitespaceDataArb = fc.oneof(
            // Whitespace-only name
            fc.record({
                name: whitespaceOnlyArb,
                email: fc.emailAddress(),
                message: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0)
            }),
            // Whitespace-only message
            fc.record({
                name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
                email: fc.emailAddress(),
                message: whitespaceOnlyArb
            })
        );

        fc.assert(
            fc.property(whitespaceDataArb, (whitespaceData) => {
                try {
                    validateContactFormData(whitespaceData);
                    return false; // Should have thrown an error
                } catch (error) {
                    return error instanceof Error &&
                        error.message.includes('non-empty string');
                }
            }),
            { numRuns: 100 }
        );
    });
});