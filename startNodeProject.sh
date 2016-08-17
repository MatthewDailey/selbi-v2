npm init

npm install babel-core --save
npm install babel-cli --save
npm install babel-preset-es2015 --save
npm install chai --save

npm install eslint --save-dev
npm install eslint-config-airbnb --save-dev
npm install eslint-plugin-import --save-dev
npm install eslint-plugin-jsx-a11y --save-dev
npm install eslint-plugin-react --save-dev

echo "Creating .eslintrc for project root..."
echo "{\n\t\"extends\": \"airbnb\",\n\t\"env\": {\n\t\t\"node\": true\n\t}\n}" > .eslintrc

echo "Create src dir..."
mkdir -p src
touch src/.gitkeep
echo "Adding src to .npmignore..."
echo "/src" > .npmignore
echo "Make sure /lib and /node_modules are in your .gitignore!"
echo ""
# see http://stackoverflow.com/questions/29738381/how-to-publish-a-module-written-in-es6-to-npm for details
echo "You should write code with ES6 in src but configure it to build in /lib. To do this make sure to include the prepublish npm script '\"prepublish\": \"node_modules/babel-cli/bin/babel.js src --out-dir lib\" under scripts in package.json."


echo "Creating tests dir and tests/.eslintrc..."
mkdir -p tests
echo "{\n\t\"env\": {\n\t\t\"mocha\": true\n\t}\n}" > tests/.eslintrc

# See http://jamesknelson.com/testing-in-es6-with-mocha-and-babel-6/ for details.
echo "Create .babelrc..."
echo "{\n\t\"presets\": [\"es2015\"]\n}" > .babelrc

echo "Done installing node deps and eslint.\n\n"
echo "Intellij Instruction:"
echo "- ESLint: install ESLint plugin and go to 'Languages & Frameworks > JavaScript > Code Quality Tools > ESLint' and check enabled."
echo "Do NOT enable 'Other Settings > ESLint'. This will only give you errors."
echo ""
echo "- ES6: Under 'Languages & Frameworks > Javascript' set the Javascript version to ECMAScript 6."  
echo ""
echo "- run configuration: For any run configurations you'll need to add '--compilers js:babel-core/register' to compile ES6"

