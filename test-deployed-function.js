// Test script for the deployed Edge Function
const testContactForm = async () => {
    const testData = {
        name: "Test User",
        email: "test@example.com",
        message: "This is a test message from the deployed Edge Function."
    };

    try {
        console.log('Testing deployed Edge Function...');

        // Get the function URL from Supabase
        const response = await fetch('https://okpjiacritfnaiykjgfq.supabase.co/functions/v1/send-contact-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz'
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