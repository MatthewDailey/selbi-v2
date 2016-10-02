/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import "RCTLinkingManager.h"

#import "RCTBundleURLProvider.h"
#import "RCTRootView.h"

#import "RNFIRMessaging.h"
#import "Firebase.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"Selbi"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  UIUserNotificationType allNotificationTypes =
  (UIUserNotificationTypeSound | UIUserNotificationTypeAlert | UIUserNotificationTypeBadge);
  UIUserNotificationSettings *settings =
  [UIUserNotificationSettings settingsForTypes:allNotificationTypes categories:nil];
  [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
  [[UIApplication sharedApplication] registerForRemoteNotifications];
  
  // Set deepLinkURLScheme to the custom URL scheme you defined in your
  // Xcode project.
  [FIROptions defaultOptions].deepLinkURLScheme = @"io.selbi.app";
  
  [FIRApp configure];

  return YES;
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication
         annotation:(id)annotation {
  
  FIRDynamicLink *dynamicLink = [[FIRDynamicLinks dynamicLinks] dynamicLinkFromCustomSchemeURL:url];
  
  if (dynamicLink) {
    // Handle the deep link. For example, show the deep-linked content or
    // apply a promotional offer to the user's account.
    return [RCTLinkingManager application:application openURL:dynamicLink.url
                        sourceApplication:sourceApplication annotation:annotation];
  }
  
  return NO;
}

- (BOOL)application:(UIApplication *)app
            openURL:(NSURL *)url
            options:(NSDictionary<NSString *, id> *)options {
  return [self application:app openURL:url sourceApplication:nil annotation:@{}];
}

// Only if your app is using [Universal Links](https://developer.apple.com/library/prerelease/ios/documentation/General/Conceptual/AppSearch/UniversalLinks.html).
- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity
 restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler
{
  return [RCTLinkingManager application:application
                   continueUserActivity:userActivity
                     restorationHandler:restorationHandler];
}


- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)notification fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))handler
{
     [[NSNotificationCenter defaultCenter] postNotificationName:FCMNotificationReceived object:self userInfo:notification];
     handler(UIBackgroundFetchResultNewData);
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
  application.applicationIconBadgeNumber = 0;
}

@end
