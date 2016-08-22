
# react-native-image-reader

## Getting started

`$ npm install react-native-image-reader --save`

### Mostly automatic installation

`$ react-native link react-native-image-reader`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-image-reader` and add `RNImageReader.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNImageReader.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNImageReaderPackage;` to the imports at the top of the file
  - Add `new RNImageReaderPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-image-reader'
  	project(':react-native-image-reader').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-image-reader/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-image-reader')
  	```

#### Windows
[Read it! :D](https://github.com/ReactWindows/react-native)

1. In Visual Studio add the `RNImageReader.sln` in `node_modules/react-native-image-reader/windows/RNImageReader.sln` folder to their solution, reference from their app.
2. Open up your `MainPage.cs` app
  - Add `using Cl.Json.RNImageReader;` to the usings at the top of the file
  - Add `new RNImageReaderPackage()` to the `List<IReactPackage>` returned by the `Packages` method


## Usage
```javascript
import RNImageReader from 'react-native-image-reader';

// TODO: What do with the module?
RNImageReader;
```
  