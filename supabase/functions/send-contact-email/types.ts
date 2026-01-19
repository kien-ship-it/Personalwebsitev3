// Type definitions for contact email notifications Edge Function

export interface ContactFormData {
    name: string;        // User's full name (required, 1-100 chars)
    email: string;       // User's email address (required, valid email format)
    message: string;     // User's message (required, 1-5000 chars)
}

export interface EmailResponse {
    success: boolean;
    message: string;
    emailIds?: string[];
    error?: string;
}

export interface EmailContent {
    from: string;        // Sender email address
    to: string[];        // Recipient email addresses
    subject: string;     // Email subject line
    html: string;        // HTML email content
    tags?: EmailTag[];   // Optional tags for tracking
}

export interface EmailTag {
    name: string;        // Tag name (e.g., "category")
    value: string;       // Tag value (e.g., "contact_form")
}

export interface EdgeFunctionConfig {
    RESEND_API_KEY: string;      // Resend API authentication key
    SITE_OWNER_EMAIL: string;    // Destination for notifications (dle26@jhu.edu)
    FROM_EMAIL: string;          // Verified sender email address
}

export interface ValidationError {
    field: string;
    message: string;
}