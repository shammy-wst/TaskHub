module.exports = {
  "**/*.(ts|tsx)": () => "npm run test",
  "**/*.(ts|tsx|js)": (filenames) => [`eslint --fix ${filenames.join(" ")}`],
};
