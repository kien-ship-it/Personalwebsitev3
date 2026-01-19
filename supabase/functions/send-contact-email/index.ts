import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Type definitions for the contact form data
interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

interface EdgeFunctionConfig {
    RESEND_API_KEY: string;
    SITE_OWNER_EMAIL: string;
    FROM_EMAIL: string;
}

// Email content interfaces
interface EmailContent {
    from: string;
    to: string[];
    subject: string;
    html: string;
    tags?: EmailTag[];
}

interface EmailTag {
    name: string;
    value: string;
}

// Resend API interfaces
interface ResendEmailRequest {
    from: string;
    to: string[];
    subject: string;
    html: string;
    tags?: EmailTag[];
}

interface ResendBatchRequest {
    emails: ResendEmailRequest[];
}

interface ResendEmailResponse {
    id: string;
    from: string;
    to: string[];
    created_at: string;
}

interface ResendBatchResponse {
    data: ResendEmailResponse[];
}

interface ResendErrorResponse {
    message: string;
    name: string;
}

// Custom error class for Resend API errors
class ResendAPIError extends Error {
    public readonly statusCode: number;
    public readonly resendError: ResendErrorResponse;

    constructor(message: string, statusCode: number, resendError: ResendErrorResponse) {
        super(message);
        this.name = 'ResendAPIError';
        this.statusCode = statusCode;
        this.resendError = resendError;
    }
}

// CORS headers for frontend integration
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Main handler function
Deno.serve(async (req: Request): Promise<Response> => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            status: 200,
            headers: corsHeaders
        });
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return createErrorResponse('Method not allowed', 405);
    }

    try {
        // Validate environment configuration
        const config = validateEnvironmentConfig();

        // Parse and validate request body
        const contactData = await validateContactData(req);

        // Format email content
        const notificationEmail = formatNotificationEmail(contactData, config);
        const confirmationEmail = formatConfirmationEmail(contactData, config);

        // Send notification email using Resend API
        const emailIds = await sendEmailsBatch([notificationEmail, confirmationEmail], config);

        return createSuccessResponse('Email sent successfully', emailIds);

    } catch (error) {
        console.error('Edge Function error:', error);

        // Handle Resend API errors specifically
        if (error instanceof ResendAPIError) {
            // Log the specific Resend API error details with context
            console.error('Resend API Error Details:', {
                message: error.message,
                statusCode: error.statusCode,
                resendError: error.resendError,
                timestamp: new Date().toISOString(),
                requestMethod: req.method,
                userAgent: req.headers.get('user-agent') || 'unknown'
            });

            // Map Resend API status codes to appropriate HTTP responses
            let responseStatus: number;
            let responseMessage: string;

            switch (error.statusCode) {
                case 400:
                    responseStatus = 400;
                    responseMessage = 'Invalid email data provided';
                    break;
                case 401:
                    responseStatus = 503;
                    responseMessage = 'Email service authentication failed';
                    break;
                case 403:
                    responseStatus = 503;
                    responseMessage = 'Email service access denied';
                    break;
                case 422:
                    responseStatus = 400;
                    responseMessage = 'Email content validation failed';
                    break;
                case 429:
                    responseStatus = 429;
                    responseMessage = 'Email service rate limit exceeded. Please try again later';
                    break;
                case 500:
                case 502:
                case 503:
                case 504:
                    responseStatus = 503;
                    responseMessage = 'Email service temporarily unavailable. Please try again later';
                    break;
                default:
                    responseStatus = 500;
                    responseMessage = 'Email delivery failed due to service error';
            }

            return createErrorResponse(responseMessage, responseStatus);
        }

        // Handle validation errors
        if (error instanceof Error && error.message.includes('required')) {
            console.error('Validation error:', {
                message: error.message,
                timestamp: new Date().toISOString(),
                requestMethod: req.method
            });
            return createErrorResponse(error.message, 400);
        }

        // Handle environment configuration errors
        if (error instanceof Error && error.message.includes('environment variable')) {
            console.error('Configuration error:', {
                message: error.message,
                timestamp: new Date().toISOString()
            });
            return createErrorResponse('Service configuration error', 503);
        }

        // Handle JSON parsing errors
        if (error instanceof Error && error.message.includes('JSON')) {
            console.error('Request parsing error:', {
                message: error.message,
                timestamp: new Date().toISOString(),
                requestMethod: req.method,
                contentType: req.headers.get('content-type') || 'unknown'
            });
            return createErrorResponse('Invalid request format', 400);
        }

        // Handle all other errors
        console.error('Unexpected error:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString(),
            requestMethod: req.method,
            userAgent: req.headers.get('user-agent') || 'unknown'
        });

        return createErrorResponse('An unexpected error occurred', 500);
    }
});

// Validate environment configuration
function validateEnvironmentConfig(): EdgeFunctionConfig {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const SITE_OWNER_EMAIL = Deno.env.get('SITE_OWNER_EMAIL');
    const FROM_EMAIL = Deno.env.get('FROM_EMAIL');

    if (!RESEND_API_KEY) {
        throw new Error('RESEND_API_KEY environment variable is required');
    }

    // Log the actual email configuration for debugging
    console.log('Email configuration:', {
        FROM_EMAIL: FROM_EMAIL,
        SITE_OWNER_EMAIL: SITE_OWNER_EMAIL,
        hasFROM_EMAIL: !!FROM_EMAIL,
        hasSITE_OWNER_EMAIL: !!SITE_OWNER_EMAIL,
        RESEND_API_KEY_PREFIX: RESEND_API_KEY.substring(0, 8) + '...'
    });

    // Use environment variables if they exist, otherwise use defaults
    const config = {
        RESEND_API_KEY,
        SITE_OWNER_EMAIL: SITE_OWNER_EMAIL || 'dle26@jh.edu',
        FROM_EMAIL: FROM_EMAIL || 'noreply@kienle.work'
    };

    console.log('Final configuration:', {
        FROM_EMAIL: config.FROM_EMAIL,
        SITE_OWNER_EMAIL: config.SITE_OWNER_EMAIL
    });

    return config;
}

// Validate and parse contact form data
async function validateContactData(req: Request): Promise<ContactFormData> {
    let body: any;

    try {
        body = await req.json();
    } catch {
        throw new Error('Invalid JSON in request body');
    }

    if (!body || typeof body !== 'object') {
        throw new Error('Request body must be a valid object');
    }

    const { name, email, message } = body;

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

    // Sanitize inputs to prevent HTML injection while preserving formatting
    const sanitizedName = sanitizeInput(name.trim());
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedMessage = sanitizeInput(message.trim());

    return {
        name: sanitizedName,
        email: sanitizedEmail,
        message: sanitizedMessage
    };
}

// Send emails using Resend batch API
async function sendEmailsBatch(emails: EmailContent[], config: EdgeFunctionConfig): Promise<string[]> {
    const resendEmails: ResendEmailRequest[] = emails.map(email => ({
        from: email.from,
        to: email.to,
        subject: email.subject,
        html: email.html,
        tags: email.tags
    }));

    const batchRequest: ResendBatchRequest = {
        emails: resendEmails
    };

    try {
        console.log(`Attempting to send ${emails.length} emails via Resend batch API`);
        
        // Log the actual email data being sent (without sensitive content)
        emails.forEach((email, index) => {
            console.log(`Email ${index + 1}:`, {
                from: email.from,
                to: email.to,
                subject: email.subject,
                hasHtml: !!email.html,
                tags: email.tags
            });
        });

        const response = await fetch('https://api.resend.com/emails/batch', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(resendEmails)
        });

        if (!response.ok) {
            let errorData: ResendErrorResponse;

            try {
                errorData = await response.json() as ResendErrorResponse;
            } catch {
                // If we can't parse the error response, create a generic one
                errorData = {
                    message: `HTTP ${response.status}: ${response.statusText}`,
                    name: 'HTTPError'
                };
            }

            console.error('Resend API returned error:', {
                status: response.status,
                statusText: response.statusText,
                errorData,
                emailCount: emails.length
            });

            throw new ResendAPIError(
                `Resend API error: ${errorData.message}`,
                response.status,
                errorData
            );
        }

        const result = await response.json() as ResendBatchResponse;

        // Validate the response structure
        if (!result.data || !Array.isArray(result.data)) {
            console.error('Invalid response structure from Resend API:', result);
            throw new ResendAPIError(
                'Invalid response structure from email service',
                500,
                { message: 'Invalid response format', name: 'ResponseError' }
            );
        }

        // Check if we got the expected number of email responses
        if (result.data.length !== emails.length) {
            console.warn(`Expected ${emails.length} email responses, got ${result.data.length}`);
        }

        // Log successful email send with details
        console.log(`Successfully sent email:`, {
            id: result.data[0].id,
            to: result.data[0].to,
            created_at: result.data[0].created_at
        });

        return result.data.map(email => email.id);

    } catch (error) {
        if (error instanceof ResendAPIError) {
            throw error;
        }

        // Handle network or other errors
        console.error('Email sending failed due to network/system error:', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            emailCount: emails.length,
            timestamp: new Date().toISOString()
        });

        throw new ResendAPIError(
            'Failed to send emails due to network error',
            500,
            { message: error instanceof Error ? error.message : 'Unknown error', name: 'NetworkError' }
        );
    }
}

// Send emails individually as fallback for batch failures
async function sendEmailsIndividually(emails: EmailContent[]): Promise<string[]> {
    const emailIds: string[] = [];
    const errors: Array<{ email: EmailContent; error: Error; emailType: string; recipient: string }> = [];

    console.log(`Attempting to send ${emails.length} emails individually as fallback`);

    for (let i = 0; i < emails.length; i++) {
        const email = emails[i];
        const emailType = email.tags?.find(tag => tag.name === 'type')?.value || 'unknown';

        try {
            console.log(`Sending individual email ${i + 1}/${emails.length} (${emailType}) to ${email.to}`);

            const config = validateEnvironmentConfig();
            const ids = await sendEmailsBatch([email], config);
            emailIds.push(...ids);

            console.log(`Successfully sent individual email ${i + 1}/${emails.length}: ${ids[0]}`);
        } catch (error) {
            const errorDetails = {
                email,
                error: error instanceof Error ? error : new Error('Unknown error'),
                index: i,
                emailType,
                recipient: email.to[0]
            };

            console.error(`Failed to send individual email ${i + 1}/${emails.length} (${emailType}):`, {
                recipient: email.to[0],
                error: errorDetails.error.message,
                timestamp: new Date().toISOString()
            });

            errors.push(errorDetails);
        }
    }

    // Log summary of individual send attempts
    console.log(`Individual send summary: ${emailIds.length}/${emails.length} emails sent successfully`);

    if (errors.length > 0) {
        console.error(`Failed individual emails:`, errors.map(e => ({
            type: e.emailType,
            recipient: e.recipient,
            error: e.error.message
        })));
    }

    // If some emails succeeded, return partial success
    if (emailIds.length > 0) {
        console.log(`Partial success: ${emailIds.length}/${emails.length} emails sent`);
        return emailIds;
    }

    // If all emails failed, throw the first error with context
    if (errors.length > 0) {
        const firstError = errors[0].error;
        throw new Error(`All individual email sends failed. First error: ${firstError.message}`);
    }

    throw new Error('No emails were sent and no errors were recorded');
}

// Sanitize input to prevent HTML injection while preserving line breaks
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

// Create standardized error responses
function createErrorResponse(message: string, status: number = 400): Response {
    return new Response(
        JSON.stringify({
            success: false,
            error: message
        }),
        {
            status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
    );
}

// Create standardized success responses
function createSuccessResponse(message: string, emailIds?: string[]): Response {
    return new Response(
        JSON.stringify({
            success: true,
            message,
            emailIds
        }),
        {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
    );
}

// Format notification email for site owner
function formatNotificationEmail(data: ContactFormData, config: EdgeFunctionConfig): EmailContent {
    const subject = `New Contact Form Submission from ${data.name}`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            border-bottom: 2px solid #007bff;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #007bff;
            margin: 0;
            font-size: 24px;
        }
        .field {
            margin-bottom: 20px;
        }
        .field-label {
            font-weight: bold;
            color: #555;
            margin-bottom: 5px;
            display: block;
        }
        .field-value {
            background-color: #f8f9fa;
            padding: 12px;
            border-radius: 4px;
            border-left: 4px solid #007bff;
            word-wrap: break-word;
        }
        .message-content {
            white-space: pre-wrap;
            font-family: inherit;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 14px;
            color: #666;
        }
        .timestamp {
            color: #888;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Contact Form Submission</h1>
            <div class="timestamp">Received: ${new Date().toLocaleString()}</div>
        </div>
        
        <div class="field">
            <span class="field-label">From:</span>
            <div class="field-value">${data.name}</div>
        </div>
        
        <div class="field">
            <span class="field-label">Email:</span>
            <div class="field-value">
                <a href="mailto:${data.email}" style="color: #007bff; text-decoration: none;">
                    ${data.email}
                </a>
            </div>
        </div>
        
        <div class="field">
            <span class="field-label">Message:</span>
            <div class="field-value">
                <div class="message-content">${data.message}</div>
            </div>
        </div>
        
        <div class="footer">
            <p>This message was sent through the contact form on your website.</p>
            <p>You can reply directly to this email to respond to ${data.name}.</p>
        </div>
    </div>
</body>
</html>`;

    return {
        from: config.FROM_EMAIL,
        to: [config.SITE_OWNER_EMAIL],
        subject,
        html,
        tags: [
            { name: 'category', value: 'contact_form' },
            { name: 'type', value: 'notification' }
        ]
    };
}

// Format confirmation email for user
function formatConfirmationEmail(data: ContactFormData, config: EdgeFunctionConfig): EmailContent {
    const subject = "Thank you for reaching out - Kien Le";

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank you for contacting me</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            border-bottom: 2px solid #007bff;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #007bff;
            margin: 0;
            font-size: 24px;
        }
        .message-content {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 4px;
            border-left: 4px solid #007bff;
            white-space: pre-wrap;
            margin: 20px 0;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 14px;
            color: #666;
        }
        .signature {
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Thank you for reaching out!</h1>
        </div>
        
        <p>Hi ${data.name},</p>
        
        <p>Thank you for contacting me through my website. I've received your message and will get back to you as soon as possible.</p>
        
        <p>Here's a copy of your message for your records:</p>
        
        <div class="message-content">${data.message}</div>
        
        <div class="signature">
            <p>Best regards,<br>
            Kien Le</p>
        </div>
        
        <div class="footer">
            <p>This is an automated confirmation. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>`;

    return {
        from: config.FROM_EMAIL,
        to: [data.email],
        subject,
        html,
        tags: [
            { name: 'category', value: 'contact_form' },
            { name: 'type', value: 'confirmation' }
        ]
    };
}

// Simple email validation with RFC compliance
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