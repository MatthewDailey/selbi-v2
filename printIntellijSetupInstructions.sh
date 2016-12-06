echo "Intellij Instruction:"
echo "- ESLint: install ESLint plugin and go to 'Languages & Frameworks > JavaScript > Code Quality Tools > ESLint' and check enabled."
echo "Do NOT enable 'Other Settings > ESLint'. This will only give you errors."
echo ""
echo "- ES6: Under 'Languages & Frameworks > Javascript' set the Javascript version to ECMAScript 6."
echo "- Flow: You may also prefer to use the Flow type checker instead of ES6. If so choose that in the drop-down instead of ECMAScript 6."
echo ""
echo "- run configuration: For any run configurations you'll need to add '--compilers js:babel-core/register' to compile ES6"

