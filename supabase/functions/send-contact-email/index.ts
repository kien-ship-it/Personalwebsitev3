import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { getConfig, logConfigStatus } from './config.ts';
import { EmailResponse } from './types.ts';

// Validate configuration at startup
let config;
try {
    config = getConfig();
    logConfigStatus(config);
    console.log('Edge Function configuration validated successfully');
} catch (error) {
    console.error('Configuration validation failed:', error.message);
    // Continue execution but log the error - this will be handled per request
}

// Main handler function for contact email notifications
Deno.serve(async (req: Request) => {
    // CORS headers for preflight requests
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        });
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return new Response(
            JSON.stringify({ success: false, error: 'Method not allowed' }),
            {
                status: 405,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    }

    try {
        // Validate configuration for each request
        if (!config) {
            config = getConfig();
        }

        // TODO: Implement request validation and email sending logic
        // This is a placeholder implementation for the infrastructure setup

        const response: EmailResponse = {
            success: true,
            message: 'Edge Function infrastructure is set up and ready'
        };

        return new Response(
            JSON.stringify(response),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    } catch (error) {
        console.error('Error in send-contact-email function:', error);

        const response: EmailResponse = {
            success: false,
            error: error.message || 'Internal server error'
        };

        return new Response(
            JSON.stringify(response),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    }
});