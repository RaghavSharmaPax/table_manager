module.exports = {
  preset: "ts-jest",
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|less)$": "<rootDir>/src/tests/styleMock.ts",
  },
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    url: "http://localhost:4000",
  },
};
