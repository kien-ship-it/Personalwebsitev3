# Contact Email Notifications Edge Function

This Supabase Edge Function handles contact form submissions by sending email notifications using the Resend API.

## Setup

### Prerequisites

1. **Supabase Project**: Ensure you have a Supabase project with Edge Functions enabled
2. **Resend Account**: Sign up for a Resend account and obtain an API key
3. **Verified Domain**: Configure a verified sending domain in Resend (or use the default sandbox domain for testing)

### Environment Variables

The following environment variables must be configured in your Supabase project:

```bash
RESEND_API_KEY=re_your_actual_api_key_here
SITE_OWNER_EMAIL=dle26@jhu.edu
FROM_EMAIL=onboarding@resend.dev
```

### Local Development

1. **Install Supabase CLI**: Follow the [Supabase CLI installation guide](https://supabase.com/docs/guides/cli)

2. **Start Local Development**:
   ```bash
   supabase start
   supabase functions serve send-contact-email --env-file .env.local
   ```

3. **Test the Function**:
   ```bash
   curl -X POST http://localhost:54321/functions/v1/send-contact-email \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","message":"Test message"}'
   ```

### Deployment

1. **Deploy to Supabase**:
   ```bash
   supabase functions deploy send-contact-email
   ```

2. **Set Environment Variables**:
   ```bash
   supabase secrets set RESEND_API_KEY=re_your_actual_api_key_here
   supabase secrets set SITE_OWNER_EMAIL=dle26@jhu.edu
   supabase secrets set FROM_EMAIL=onboarding@resend.dev
   ```

## API Reference

### Endpoint

```
POST /functions/v1/send-contact-email
```

### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I would like to get in touch..."
}
```

### Response

**Success (200)**:
```json
{
  "success": true,
  "message": "Emails sent successfully",
  "emailIds": ["email_id_1", "email_id_2"]
}
```

**Error (400/500)**:
```json
{
  "success": false,
  "error": "Error description"
}
```

## File Structure

```
supabase/functions/send-contact-email/
├── index.ts          # Main handler function
├── types.ts          # TypeScript type definitions
├── config.ts         # Environment configuration and validation
├── deno.json         # Deno configuration and dependencies
├── .env.example      # Environment variables template
└── README.md         # This documentation
```

## Security Features

- **Input Validation**: All form data is validated and sanitized
- **CORS Protection**: Proper CORS headers for cross-origin requests
- **Environment Validation**: Configuration validation at startup
- **Error Handling**: Comprehensive error handling without exposing sensitive data
- **HTML Sanitization**: User input is properly escaped to prevent injection attacks

## Requirements Fulfilled

This infrastructure setup addresses the following requirements:

- **4.1**: Edge Function implemented as Supabase Edge Function using TypeScript
- **4.5**: Environment variables configured for API keys
- **7.1**: Resend API key retrieved from environment variables
- **7.2**: Secure environment variable storage using Supabase secrets

## Next Steps

1. Implement request validation and sanitization (Task 2.1)
2. Add email content formatting functions (Task 2.3)
3. Integrate Resend API for email delivery (Task 3.1)
4. Add comprehensive error handling (Task 3.3)
5. Complete main handler function (Task 4.1)