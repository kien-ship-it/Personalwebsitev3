/**
 * Property-Based Tests for Chat API Input Validation
 * Feature: ai-chat-feature, Property 5: Input Validation - Empty Messages
 * Validates: Requirements 3.7, 6.1
 * 
 * For any string composed entirely of whitespace characters (including empty string),
 * the Chat_API SHALL reject the request with a 400 status code.
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateMessage, sanitizeInput } from '../chat';

describe('Chat API Input Validation Property Tests', () => {
    /**
     * Property 5: Input Validation - Empty Messages
     * For any string composed entirely of whitespace characters (including empty string),
     * the validateMessage function SHALL return null (indicating rejection).
     */
    it('Property 5: Empty and whitespace-only messages are rejected', () => {
        // Generator for whitespace-only strings using array of whitespace chars joined
        const whitespaceChars = [' ', '\t', '\n', '\r', '\f', '\v'];
        const whitespaceOnlyArb = fc.array(
            fc.constantFrom(...whitespaceChars),
            { minLength: 0, maxLength: 100 }
        ).map(chars => chars.join(''));

        fc.assert(
            fc.property(whitespaceOnlyArb, (whitespaceString) => {
                const result = validateMessage(whitespaceString);
                // All whitespace-only strings (including empty) should be rejected
                return result === null;
            }),
            { numRuns: 100 }
        );
    });

    /**
     * Property 5b: Non-whitespace messages are accepted
     * For any string containing at least one non-whitespace character,
     * the validateMessage function SHALL return a non-null trimmed string.
     */
    it('Property 5b: Non-empty messages with content are accepted', () => {
        // Generator for strings with at least one non-whitespace character
        const nonEmptyContentArb = fc.tuple(
            fc.string({ minLength: 0, maxLength: 50 }), // optional leading whitespace
            fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0), // non-whitespace content
            fc.string({ minLength: 0, maxLength: 50 }) // optional trailing whitespace
        ).map(([leading, content, trailing]) => leading + content + trailing);

        fc.assert(
            fc.property(nonEmptyContentArb, (message) => {
                const result = validateMessage(message);
                // Messages with content should be accepted and trimmed
                return result !== null && result.length > 0;
            }),
            { numRuns: 100 }
        );
    });

    /**
     * Property 5c: Non-string inputs are rejected
     * For any non-string input, validateMessage SHALL return null.
     */
    it('Property 5c: Non-string inputs are rejected', () => {
        const nonStringArb = fc.oneof(
            fc.constant(null),
            fc.constant(undefined),
            fc.integer(),
            fc.double(),
            fc.boolean(),
            fc.array(fc.anything()),
            fc.object()
        );

        fc.assert(
            fc.property(nonStringArb, (input) => {
                const result = validateMessage(input);
                return result === null;
            }),
            { numRuns: 100 }
        );
    });

    /**
     * Property 5d: Validated messages are trimmed
     * For any valid message, the result should be trimmed (no leading/trailing whitespace).
     */
    it('Property 5d: Validated messages are trimmed', () => {
        const whitespaceChars = [' ', '\t'];
        const leadingWhitespaceArb = fc.array(fc.constantFrom(...whitespaceChars), { minLength: 0, maxLength: 10 }).map(c => c.join(''));
        const trailingWhitespaceArb = fc.array(fc.constantFrom(...whitespaceChars), { minLength: 0, maxLength: 10 }).map(c => c.join(''));

        const messageWithWhitespaceArb = fc.tuple(
            leadingWhitespaceArb,
            fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
            trailingWhitespaceArb
        ).map(([leading, content, trailing]) => leading + content + trailing);

        fc.assert(
            fc.property(messageWithWhitespaceArb, (message) => {
                const result = validateMessage(message);
                if (result === null) return true; // Skip if rejected
                // Result should have no leading/trailing whitespace
                return result === result.trim();
            }),
            { numRuns: 100 }
        );
    });

    /**
     * Sanitization property: Control characters are removed
     */
    it('Sanitization: Control characters are removed from input', () => {
        // Generator for strings with control characters
        const stringWithControlCharsArb = fc.string({ minLength: 1, maxLength: 200 });

        fc.assert(
            fc.property(stringWithControlCharsArb, (input) => {
                const sanitized = sanitizeInput(input);
                // Control characters (except newline, tab, carriage return) should be removed
                const hasControlChars = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(sanitized);
                return !hasControlChars;
            }),
            { numRuns: 100 }
        );
    });

    /**
     * Sanitization property: Input length is bounded
     */
    it('Sanitization: Input length is bounded to 2000 characters', () => {
        const longStringArb = fc.string({ minLength: 1, maxLength: 5000 });

        fc.assert(
            fc.property(longStringArb, (input) => {
                const sanitized = sanitizeInput(input);
                return sanitized.length <= 2000;
            }),
            { numRuns: 100 }
        );
    });
});
