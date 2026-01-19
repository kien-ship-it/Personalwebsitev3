import { EdgeFunctionConfig } from './types.ts';

/**
 * Validates and retrieves environment configuration for the Edge Function
 * @returns EdgeFunctionConfig object with validated environment variables
 * @throws Error if required environment variables are missing or invalid
 */
export function getConfig(): EdgeFunctionConfig {
    const config: EdgeFunctionConfig = {
        RESEND_API_KEY: Deno.env.get('RESEND_API_KEY') || '',
        SITE_OWNER_EMAIL: Deno.env.get('SITE_OWNER_EMAIL') || 'dle26@jhu.edu',
        FROM_EMAIL: Deno.env.get('FROM_EMAIL') || 'onboarding@resend.dev',
    };

    // Validate required environment variables
    const errors: string[] = [];

    if (!config.RESEND_API_KEY) {
        errors.push('RESEND_API_KEY is required');
    } else if (!config.RESEND_API_KEY.startsWith('re_')) {
        errors.push('RESEND_API_KEY must be a valid Resend API key (starts with "re_")');
    }

    if (!config.SITE_OWNER_EMAIL) {
        errors.push('SITE_OWNER_EMAIL is required');
    } else if (!isValidEmail(config.SITE_OWNER_EMAIL)) {
        errors.push('SITE_OWNER_EMAIL must be a valid email address');
    }

    if (!config.FROM_EMAIL) {
        errors.push('FROM_EMAIL is required');
    } else if (!isValidEmail(config.FROM_EMAIL)) {
        errors.push('FROM_EMAIL must be a valid email address');
    }

    if (errors.length > 0) {
        throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
    }

    return config;
}

/**
 * Basic email validation function
 * @param email Email address to validate
 * @returns true if email format is valid, false otherwise
 */
function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Logs configuration status without exposing sensitive values
 * @param config EdgeFunctionConfig object
 */
export function logConfigStatus(config: EdgeFunctionConfig): void {
    console.log('Edge Function Configuration Status:');
    console.log(`- RESEND_API_KEY: ${config.RESEND_API_KEY ? 'Set' : 'Missing'}`);
    console.log(`- SITE_OWNER_EMAIL: ${config.SITE_OWNER_EMAIL}`);
    console.log(`- FROM_EMAIL: ${config.FROM_EMAIL}`);
}