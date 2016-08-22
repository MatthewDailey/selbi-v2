npm init

source ./installTestAndES6Deps.sh

echo "Create src dir..."
mkdir -p src
touch src/.gitkeep
echo "Adding src to .npmignore..."
echo "/src" > .npmignore
echo "Make sure /lib and /node_modules are in your .gitignore!"
echo ""
# see http://stackoverflow.com/questions/29738381/how-to-publish-a-module-written-in-es6-to-npm for details
echo "You should write code with ES6 in src but configure it to build in /lib. To do this make sure to include the prepublish npm script '\"prepublish\": \"node_modules/babel-cli/bin/babel.js src --out-dir lib\" under scripts in package.json."

source ./printIntellijSetupInstructions.sh
