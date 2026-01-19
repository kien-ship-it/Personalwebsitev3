# Send Contact Email Edge Function

This Supabase Edge Function handles contact form submissions by sending email notifications using the Resend API.

## Functionality

- Receives contact form data (name, email, message) via POST request
- Validates input data and sanitizes content
- Sends notification email to site owner (dle26@jhu.edu)
- Returns appropriate success/error responses

**Note:** Due to Resend API limitations with the test domain, only the site owner receives email notifications. User confirmation emails are not sent.

## Environment Variables

The following environment variables must be configured:

- `RESEND_API_KEY`: API key for Resend email service
- `SITE_OWNER_EMAIL`: Email address to receive notifications (default: dle26@jhu.edu)
- `FROM_EMAIL`: Sender email address (default: onboarding@resend.dev)

## API Endpoint

**POST** `/functions/v1/send-contact-email`

### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I would like to get in touch..."
}
```

### Response

**Success (200):**
```json
{
  "success": true,
  "message": "Emails sent successfully",
  "emailIds": ["email_id_1", "email_id_2"]
}
```

**Error (400/500):**
```json
{
  "success": false,
  "error": "Error description"
}
```

## Local Development

To test locally:

1. Start Supabase local development: `supabase start`
2. Deploy function: `supabase functions deploy send-contact-email`
3. Test with curl or your frontend application

## Deployment

Deploy to production Supabase project:

```bash
supabase functions deploy send-contact-email --project-ref your-project-ref
```

Make sure to set the environment variables in your Supabase dashboard under Settings > Edge Functions.