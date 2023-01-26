const nextJest = require('next/jest')

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleDirectories: ['node_modules', '<rootDir>/'],
    moduleNameMapper: {
        // Handle module aliases (this will be automatically configured for you soon)
        '^@/components/(.*)$': '<rootDir>/components/$1',
        '^@/feature/(.*)$': '<rootDir>/feature/$1',
        '^@/config/(.*)$': '<rootDir>/config/$1',
        '^@/context/(.*)$': '<rootDir>/context/$1',
        '^@/layout/(.*)$': '<rootDir>/layout/$1',
        '^@/pages/(.*)$': '<rootDir>/pages/$1',
        '^@/helpers/(.*)$': '<rootDir>/helpers/$1',
    },
    testEnvironment: 'jest-environment-jsdom',
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
