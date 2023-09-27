module.exports = {
  testEnvironment: "node",
  moduleDirectories: ["node_modules", "src"],
  rootDir: "./",
  verbose: true,
  modulePaths: ["<rootDir>"],
  collectCoverage: false,
  collectCoverageFrom: ["./**"],
  coverageThreshold: {
    global: {
      lines: 90,
    },
  },
};
