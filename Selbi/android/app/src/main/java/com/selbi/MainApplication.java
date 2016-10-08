package com.selbi;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import cl.json.RNSharePackage;
import com.microsoft.codepush.react.CodePush;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ReactNativeConfigPackage(),
            new RCTCameraPackage(),
            new RNSharePackage(),
            new CodePush(null, this, BuildConfig.DEBUG)
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}
