// index.js - Simple Node.js application for Jenkins CI/CD

const fs = require('fs');
const path = require('path');

// Simple function to demonstrate the application
function greetUser(name = 'World') {
    return `Hello, ${name}! This is running from Jenkins CI/CD.`;
}

// Function to perform a simple calculation
function calculate(a, b, operation = 'add') {
    switch(operation) {
        case 'add':
            return a + b;
        case 'subtract':
            return a - b;
        case 'multiply':
            return a * b;
        case 'divide':
            return b !== 0 ? a / b : 'Cannot divide by zero';
        default:
            return 'Invalid operation';
    }
}

// Function to log build information
function logBuildInfo() {
    const buildInfo = {
        timestamp: new Date().toISOString(),
        nodeVersion: process.version,
        platform: process.platform,
        buildNumber: process.env.BUILD_NUMBER || 'local',
        jobName: process.env.JOB_NAME || 'local-job'
    };
    
    console.log('='.repeat(50));
    console.log('BUILD INFORMATION:');
    console.log('='.repeat(50));
    console.log(`Timestamp: ${buildInfo.timestamp}`);
    console.log(`Node Version: ${buildInfo.nodeVersion}`);
    console.log(`Platform: ${buildInfo.platform}`);
    console.log(`Build Number: ${buildInfo.buildNumber}`);
    console.log(`Job Name: ${buildInfo.jobName}`);
    console.log('='.repeat(50));
    
    return buildInfo;
}

// Function to run tests
function runTests() {
    console.log('\nRunning tests...');
    
    const tests = [
        {
            name: 'Greeting Test',
            test: () => greetUser('Jenkins') === 'Hello, Jenkins! This is running from Jenkins CI/CD.',
            expected: true
        },
        {
            name: 'Addition Test',
            test: () => calculate(5, 3, 'add') === 8,
            expected: true
        },
        {
            name: 'Division Test',
            test: () => calculate(10, 2, 'divide') === 5,
            expected: true
        },
        {
            name: 'Division by Zero Test',
            test: () => calculate(10, 0, 'divide') === 'Cannot divide by zero',
            expected: true
        }
    ];
    
    let passed = 0;
    let failed = 0;
    
    tests.forEach((test, index) => {
        try {
            const result = test.test();
            if (result === test.expected) {
                console.log(`✅ Test ${index + 1}: ${test.name} - PASSED`);
                passed++;
            } else {
                console.log(`❌ Test ${index + 1}: ${test.name} - FAILED`);
                failed++;
            }
        } catch (error) {
            console.log(`❌ Test ${index + 1}: ${test.name} - ERROR: ${error.message}`);
            failed++;
        }
    });
    
    console.log(`\nTest Results: ${passed} passed, ${failed} failed`);
    return failed === 0;
}

// Function to create a simple report
function createBuildReport(buildInfo, testsPassed) {
    const report = {
        ...buildInfo,
        testsPassed,
        status: testsPassed ? 'SUCCESS' : 'FAILED'
    };
    
    const reportPath = path.join(__dirname, 'build-report.json');
    
    try {
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`\nBuild report saved to: ${reportPath}`);
    } catch (error) {
        console.error(`Failed to save build report: ${error.message}`);
    }
    
    return report;
}

// Main execution function
function main() {
    try {
        console.log('Starting Jenkins Build Process...\n');
        
        // Log build information
        const buildInfo = logBuildInfo();
        
        // Display greeting
        console.log('\n' + greetUser('Jenkins User'));
        
        // Perform some calculations
        console.log('\nPerforming calculations:');
        console.log(`5 + 3 = ${calculate(5, 3, 'add')}`);
        console.log(`10 - 4 = ${calculate(10, 4, 'subtract')}`);
        console.log(`6 * 7 = ${calculate(6, 7, 'multiply')}`);
        console.log(`15 / 3 = ${calculate(15, 3, 'divide')}`);
        
        // Run tests
        const testsPassed = runTests();
        
        // Create build report
        const report = createBuildReport(buildInfo, testsPassed);
        
        // Final status
        console.log('\n' + '='.repeat(50));
        console.log(`BUILD STATUS: ${report.status}`);
        console.log('='.repeat(50));
        
        // Exit with appropriate code
        process.exit(testsPassed ? 0 : 1);
        
    } catch (error) {
        console.error(`Build failed with error: ${error.message}`);
        process.exit(1);
    }
}

// Run the application
if (require.main === module) {
    main();
}

// Export functions for testing
module.exports = {
    greetUser,
    calculate,
    logBuildInfo,
    runTests
};
