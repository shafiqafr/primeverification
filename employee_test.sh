#!/bin/bash

echo "🔍 EMPLOYEE VERIFICATION UI TEST"
echo "=================================="

echo "1. Testing employee verification page with employee..."

# Test with an employee parameter to see the verification report
EMPLOYEE_PAGE=$(curl -s "http://localhost:3000/?employee=EMP001")

# Check if the page contains employee verification structure
if [[ $EMPLOYEE_PAGE == *"Employee Verification Report"* ]]; then
    echo "✅ Employee verification report structure found"
    
    # Check if Prime Steel Industries was removed from the top of the report
    if [[ $EMPLOYEE_PAGE == *"Employee Verification Report"* ]] && [[ $EMPLOYEE_PAGE != *"<h1 class=\"text-xl font-bold text-gray-900\">"* ]]; then
        echo "✅ Company name removed from report header"
    else
        echo "❌ Company name still present in report header"
    fi
    
    # Check for smaller text sizes
    if [[ $EMPLOYEE_PAGE == *"text-xs text-gray-500"* ]]; then
        echo "✅ Smaller text sizes implemented"
    else
        echo "❌ Smaller text sizes not found"
    fi
    
    # Check for Facebook-style verified badge
    if [[ $EMPLOYEE_PAGE == *"bg-blue-500 rounded-full"* ]] && [[ $EMPLOYEE_PAGE == *"w-3 h-3 text-white"* ]]; then
        echo "✅ Facebook-style verified badge found"
    else
        echo "❌ Facebook-style verified badge not found"
    fi
    
    # Check for right-side verified status
    if [[ $EMPLOYEE_PAGE == *"justify-end gap-2 mb-2"* ]]; then
        echo "✅ Verified status positioned on right side"
    else
        echo "❌ Verified status not positioned on right side"
    fi
    
else
    echo "❌ Employee verification report not found"
    echo "   This might mean EMP001 doesn't exist in the database"
fi

echo ""
echo "2. Testing company name changes..."

# Change company name
curl -s -X POST http://localhost:3000/api/public/settings \
    -H "Content-Type: application/json" \
    -d '{"settings":{"companyName":"Test Corporation"}}' > /dev/null

# Test main page (without employee) for company name change
MAIN_PAGE=$(curl -s http://localhost:3000/)
if [[ $MAIN_PAGE == *"Test Corporation"* ]]; then
    echo "✅ Company name change reflects in main page header"
else
    echo "❌ Company name change not reflecting in main page"
fi

# Test employee page with new company name
EMPLOYEE_PAGE_UPDATED=$(curl -s "http://localhost:3000/?employee=EMP001")
if [[ $EMPLOYEE_PAGE_UPDATED == *"Test Corporation"* ]]; then
    echo "✅ Company name change reflects in employee verification"
else
    echo "❌ Company name change not reflecting in employee verification"
fi

# Reset to original
curl -s -X POST http://localhost:3000/api/public/settings \
    -H "Content-Type: application/json" \
    -d '{"settings":{"companyName":"Prime Steel Industries"}}' > /dev/null

echo ""
echo "=================================="
echo "🎉 EMPLOYEE VERIFICATION TEST COMPLETE!"
echo "=================================="