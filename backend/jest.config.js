module.exports = {
  testEnvironment: "node",
  restoreMocks: true,
  coveragePathIgnorePatterns: ["node_modules", "config", "public", "tests"],
  coverageReporters: ["text", "lcov", "clover", "html"],
};
