
# DEPRECATED!!! react-native-image-reader

This package provides a native module for reading iOS images as base64. 

This package is deprecated and should not be used!!! Instead use react-native-fetch-blob for accessing images.


## Getting started
To install and use with a React Native project:

`$ npm install react-native-image-reader --save`

`$ rnpm link`


## Usage 

The module can be imported directly like a normal node package. 

The module exports 1 method `readImage()` which takes a local image asset url and returns a `Promise` which is fulfilled with the base64 representation of that image.

```javascript
import ImageReader from '@selbi/react-native-image-reader';


RNImageReader
    .readImage(localImageAssetUri)
    .then((imageBase64) => {
         // TODO: Your image handling logic.
     })
    .catch((error) => {
         // TODO: Your error handling logic.
     });
```
 

## Tricky implementation notes:

This module was instantiated using [react-native-create-library](https://github.com/frostney/react-native-create-library) to instantiate the project. The `windows` and `android` directories were deleted.

To properly `#import "RCTBridgeModule.h"` it was necessary to modify the Build Setting's header search paths. This is necssary so that once `rnpm link` adds the module to the React Native Project it can properly import the library files it needs. If you need to do this again, in XCode go to `Build Settings > Search Paths > Header Search Paths` and double click to edit. Then add the path: `$(SRCROOT)/../../../react-native/React/Base`.

Note that it is also necessary to implement the module as a header `<module name>.h` file as well as an implementation file `<module name>.m`.



## Manual installation

You should not need these instructions but they're here in case you want more info about what `rnpm link` will do once you install the package with node. 

#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-image-reader` and add `RNImageReader.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNImageReader.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<
 
