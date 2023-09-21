module.exports = {
  testEnvironment: "node",
  restoreMocks: true,
  coveragePathIgnorePatterns: ["node_modules", "config", "public", "tests"],
  reporters: ["default", ["jest-junit", { outputName: "report.xml" }]],
};
