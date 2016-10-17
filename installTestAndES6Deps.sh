npm install chai --save
npm install dirty-chai --save

npm install babel-core --save
npm install babel-cli --save
npm install babel-preset-es2015 --save

npm install eslint --save-dev
npm install eslint-config-airbnb --save-dev
npm install eslint-plugin-import --save-dev
npm install eslint-plugin-jsx-a11y --save-dev
npm install eslint-plugin-react --save-dev

echo "Creating .eslintrc for project root..."
echo "{\n\t\"extends\": \"airbnb\",\n\t\"env\": {\n\t\t\"node\": true\n\t}\n}" > .eslintrc

# See http://jamesknelson.com/testing-in-es6-with-mocha-and-babel-6/ for details.
echo "Create .babelrc..."
echo "{\n\t\"presets\": [\"es2015\"]\n}" > .babelrc

echo "Creating tests dir and tests/.eslintrc..."
mkdir -p tests
echo "{\n\t\"env\": {\n\t\t\"mocha\": true\n\t}\n}" > tests/.eslintrc

echo "Done installing node deps and eslint.\n\n"
