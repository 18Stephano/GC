#!/usr/bin/env node

/**
 * DIAGNOSTIC: Test ElevenLabs API Connection
 */

const ELEVEN_LABS_API_KEY = 'sk_9b0722f8318df9e86d7cf402192d3870bcf9c2ba9ca2d4c4';
const ELEVEN_LABS_VOICE_ID = '21m00Tcm4TlvDq8ikWAM';

console.log('=== ELEVENLABS API DIAGNOSTIC ===\n');

console.log('STEP 1: Configuration Check');
console.log('  API Key (first 10 chars):', ELEVEN_LABS_API_KEY.substring(0, 10) + '...');
console.log('  API Key format:', ELEVEN_LABS_API_KEY.startsWith('sk_') ? '✅ Correct (starts with sk_)' : '❌ Invalid format');
console.log('  Voice ID:', ELEVEN_LABS_VOICE_ID);
console.log('');

console.log('STEP 2: Testing API Call');
console.log('  Endpoint: https://api.elevenlabs.io/v1/text-to-speech/' + ELEVEN_LABS_VOICE_ID);
console.log('  Test text: "oft"');
console.log('');

async function testAPI() {
    try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_LABS_VOICE_ID}`, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': ELEVEN_LABS_API_KEY
            },
            body: JSON.stringify({
                text: 'oft',
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                    speed: 0.75
                }
            })
        });

        console.log('STEP 3: Response Status');
        console.log('  HTTP Status:', response.status, response.statusText);
        console.log('  Status OK?', response.ok ? '✅ Yes' : '❌ No');
        console.log('');

        if (!response.ok) {
            const errorText = await response.text();
            console.log('ERROR RESPONSE:');
            console.log(errorText);
            console.log('');

            // Parse common errors
            if (response.status === 401) {
                console.log('❌ ERROR: Invalid API key (401 Unauthorized)');
            } else if (response.status === 429) {
                console.log('❌ ERROR: Rate limit exceeded (429 Too Many Requests)');
            } else if (response.status === 403) {
                console.log('❌ ERROR: Access forbidden (403)');
            }
            return;
        }

        // Check response
        const contentType = response.headers.get('content-type');
        console.log('STEP 4: Response Details');
        console.log('  Content-Type:', contentType);
        console.log('  Audio returned?', contentType && contentType.includes('audio') ? '✅ Yes' : '❌ No');

        const blob = await response.blob();
        console.log('  Audio size:', blob.size, 'bytes');
        console.log('');

        if (blob.size > 0) {
            console.log('✅ SUCCESS: API is working correctly!');
        } else {
            console.log('❌ ERROR: API returned empty audio');
        }

    } catch (error) {
        console.log('STEP 3: Network Error');
        console.log('❌ ERROR:', error.message);
        console.log('');
        console.log('Common causes:');
        console.log('  - No internet connection');
        console.log('  - CORS blocking (if testing from browser)');
        console.log('  - ElevenLabs API is down');
    }
}

testAPI();
