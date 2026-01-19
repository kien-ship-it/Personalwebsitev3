// Test script for the local Edge Function
const testContactForm = async () => {
    const testData = {
        name: "Test User",
        email: "test@example.com",
        message: "This is a test message from the local Edge Function."
    };

    try {
        console.log('Testing local Edge Function...');

        // Test local function
        const response = await fetch('http://127.0.0.1:54321/functions/v1/send-contact-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });

        const result = await response.json();

        console.log('Response Status:', response.status);
        console.log('Response Body:', result);

        if (response.ok) {
            console.log('✅ Edge Function test successful!');
            console.log('Email IDs:', result.emailIds);
        } else {
            console.log('❌ Edge Function test failed');
            console.log('Error:', result.error);
        }

    } catch (error) {
        console.error('❌ Test failed with error:', error.message);
    }
};

testContactForm();