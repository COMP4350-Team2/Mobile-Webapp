module.exports = {
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
    transform: {
      "^.+\\.(ts|tsx)$": "babel-jest"
    },
    testEnvironment: "jsdom",
    moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
    transformIgnorePatterns: ["<rootDir>/node_modules/"],
    testMatch: [
      "<rootDir>/src/components/**/*.test.{js,jsx,ts,tsx}",
      "<rootDir>/src/components/**/*.spec.{js,jsx,ts,tsx}"
    ]
  };
  