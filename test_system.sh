#!/bin/bash

echo "Testing Employee Verification System"
echo "=================================="

# Test 1: Check if main page loads
echo "1. Testing main page load..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/)
if [ "$RESPONSE" = "200" ]; then
    echo "✅ Main page loads successfully"
else
    echo "❌ Main page failed to load (HTTP $RESPONSE)"
fi

# Test 2: Test public settings API
echo ""
echo "2. Testing public settings API..."
SETTINGS=$(curl -s http://localhost:3000/api/public/settings)
if [[ $SETTINGS == *"companyName"* ]]; then
    echo "✅ Public settings API working"
    echo "   Current settings: $SETTINGS"
else
    echo "❌ Public settings API not working"
fi

# Test 3: Test updating settings
echo ""
echo "3. Testing settings update..."
UPDATE_RESPONSE=$(curl -s -X POST http://localhost:3000/api/public/settings \
    -H "Content-Type: application/json" \
    -d '{"settings":{"companyName":"Test Company Inc"}}')
if [[ $UPDATE_RESPONSE == *"successfully"* ]]; then
    echo "✅ Settings update working"
    
    # Verify the update
    UPDATED_SETTINGS=$(curl -s http://localhost:3000/api/public/settings)
    if [[ $UPDATED_SETTINGS == *"Test Company Inc"* ]]; then
        echo "✅ Settings persist correctly"
    else
        echo "❌ Settings not persisting"
    fi
else
    echo "❌ Settings update failed: $UPDATE_RESPONSE"
fi

# Test 4: Test with logo
echo ""
echo "4. Testing logo upload..."
LOGO_TEST=$(curl -s -X POST http://localhost:3000/api/public/settings \
    -H "Content-Type: application/json" \
    -d '{"settings":{"companyName":"Prime Steel Industries","companyLogo":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="}}')
if [[ $LOGO_TEST == *"companyLogo"* ]]; then
    echo "✅ Logo upload working"
else
    echo "❌ Logo upload failed: $LOGO_TEST"
fi

# Reset to original settings
echo ""
echo "5. Resetting to original settings..."
curl -s -X POST http://localhost:3000/api/public/settings \
    -H "Content-Type: application/json" \
    -d '{"settings":{"companyName":"Prime Steel Industries"}}' > /dev/null

echo ""
echo "=================================="
echo "Testing complete!"