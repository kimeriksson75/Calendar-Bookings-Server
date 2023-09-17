module.exports = {
    testEnvironment: 'node',
    moduleDirectories: ["node_modules", "src"],
    rootDir: "./",
    verbose: true,
    modulePaths: [
      "<rootDir>"
  ],
  collectCoverage: true,
  collectCoverageFrom: ["./**"],
  coverageThreshold: {
    global: {
      lines: 90
    }
  }
}