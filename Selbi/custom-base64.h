#import "RCTBridgeModule.h"
#import <AssetsLibrary/AssetsLibrary.h>
#import <UIKit/UIKit.h>
@interface ReadImageData : NSObject <RCTBridgeModule>
@end

@implementation ReadImageData

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(readImage:(NSString *)input
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{

  // Create NSURL from uri
  NSURL *url = [[NSURL alloc] initWithString:input];

  // Create an ALAssetsLibrary instance. This provides access to the
  // videos and photos that are under the control of the Photos application.
  ALAssetsLibrary *library = [[ALAssetsLibrary alloc] init];

  // Using the ALAssetsLibrary instance and our NSURL object open the image.
  [library assetForURL:url resultBlock:^(ALAsset *asset) {

    // Create an ALAssetRepresentation object using our asset
    // and turn it into a bitmap using the CGImageRef opaque type.
    ALAssetRepresentation* fullImageRep = [asset defaultRepresentation];
    CGImageRef imageRef = [fullImageRep fullResolutionImage];
    // Create UIImageJPEGRepresentation from CGImageRef
    NSData *imageData = UIImageJPEGRepresentation([UIImage imageWithCGImage:imageRef], 0.5);

    // Convert to base64 encoded string
    NSString *base64Encoded = [imageData base64EncodedStringWithOptions:0];

    resolve(@[base64Encoded]);
  } failureBlock:^(NSError *error) {
    reject(@"image_read_fail", @"Unable to read base64 image.", error);
  }];



}
@end
