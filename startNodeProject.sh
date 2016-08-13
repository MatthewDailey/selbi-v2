npm init

npm install babel-core --save
npm install babel-preset-es2015 --save
npm install chai --save

npm install eslint --save-dev
npm install eslint-config-airbnb --save-dev
npm install eslint-plugin-import --save-dev
npm install eslint-plugin-jsx-a11y --save-dev
npm install eslint-plugin-react --save-dev

echo "Creating .eslintrc for project root..."
echo "{\n\t\"extends\": \"airbnb\",\n\t\"env\": {\n\t\t\"node\": true\n\t}\n}" > .eslintrc

mkdir -p tests

echo "Creating tests dir and tests/.eslintrc..."
echo "{\n\t\"env\": {\n\t\t\"mocha\": true\n\t}\n}" > tests/.eslintrc

echo "Done installing node deps and eslint.\n\n"
echo "Intellij Instruction:"
echo "- ESLint: install ESLint plugin and go to 'Languages & Frameworks > JavaScript > Code Quality Tools > ESLint' and check enabled."
echo "Do NOT enable 'Other Settings > ESLint'. This will only give you errors."
echo ""
echo "- ES6: Under 'Languages & Frameworks > Javascript' set the Javascript version to ECMAScript 6."  

