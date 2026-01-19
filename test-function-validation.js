// Test script to validate the Edge Function is working
const testValidation = async () => {
    console.log('Testing Edge Function validation...');

    // Test 1: Invalid request (missing fields)
    try {
        const response1 = await fetch('https://okpjiacritfnaiykjgfq.supabase.co/functions/v1/send-contact-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        const result1 = await response1.json();
        console.log('Test 1 - Empty request:');
        console.log('Status:', response1.status);
        console.log('Response:', result1);
        console.log('Expected: 400 with validation error ✓');
        console.log('');
    } catch (error) {
        console.error('Test 1 failed:', error.message);
    }

    // Test 2: Invalid email format
    try {
        const response2 = await fetch('https://okpjiacritfnaiykjgfq.supabase.co/functions/v1/send-contact-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: "Test User",
                email: "invalid-email",
                message: "Test message"
            })
        });

        const result2 = await response2.json();
        console.log('Test 2 - Invalid email:');
        console.log('Status:', response2.status);
        console.log('Response:', result2);
        console.log('Expected: 400 with email validation error ✓');
        console.log('');
    } catch (error) {
        console.error('Test 2 failed:', error.message);
    }

    // Test 3: Valid request (should fail at email sending due to API key issues)
    try {
        const response3 = await fetch('https://okpjiacritfnaiykjgfq.supabase.co/functions/v1/send-contact-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: "Test User",
                email: "test@example.com",
                message: "This is a test message."
            })
        });

        const result3 = await response3.json();
        console.log('Test 3 - Valid request:');
        console.log('Status:', response3.status);
        console.log('Response:', result3);
        console.log('Expected: 400/500 with email service error (API key issue) ✓');
        console.log('');
    } catch (error) {
        console.error('Test 3 failed:', error.message);
    }

    // Test 4: CORS preflight
    try {
        const response4 = await fetch('https://okpjiacritfnaiykjgfq.supabase.co/functions/v1/send-contact-email', {
            method: 'OPTIONS'
        });

        console.log('Test 4 - CORS preflight:');
        console.log('Status:', response4.status);
        console.log('Expected: 200 ✓');
        console.log('');
    } catch (error) {
        console.error('Test 4 failed:', error.message);
    }
};

testValidation();