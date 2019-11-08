module.exports = {
  transform: {
    ".(ts|tsx)": "babel-jest"
  },
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/config/jest/fileMock.js",
    "\\.(svg)$": "<rootDir>/config/jest/svgMock.js"
  },
  testRegex: "(\\.(spec))\\.(ts|tsx)$",
  moduleFileExtensions: ["ts", "tsx", "js", "json"],
  testPathIgnorePatterns: ["/node_modules/"],
  collectCoverageFrom: [
    "**/packages/**/*.{ts|tsx}",
    "!**/node_modules/**",
    "!**/cypress/**",
    "!**/lib/**",
    "!workspaces/account/src/react-app-env.d.ts",
    "!index.ts",
    "!**/.scaffolding/**"
  ],
  coverageDirectory: "docs/coverage"
};
