package com.selbi;

import android.app.Application;

import com.RNFetchBlob.RNFetchBlobPackage;
import com.evollu.react.fa.FIRAnalyticsPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.github.xinthink.rnmk.ReactMaterialKitPackage;
import com.joshblour.reactnativepermissions.ReactNativePermissionsPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.microsoft.codepush.react.CodePush;

import java.util.Arrays;
import java.util.List;

import cl.json.RNSharePackage;

public class MainApplication extends Application implements ReactApplication {

    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

    protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        FacebookSdk.sdkInitialize(getApplicationContext());
        // If you want to use AppEventsLogger to log events.
        AppEventsLogger.activateApp(this);
    }

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        protected boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new FBSDKPackage(mCallbackManager),
                    new RNFetchBlobPackage(),
                    new FIRMessagingPackage(),
                    new FIRAnalyticsPackage(),
                    new RCTCameraPackage(),
                    new RNSharePackage(),
                    new ReactMaterialKitPackage(),
                    new ReactNativePermissionsPackage(),
                    new CodePush(null, MainApplication.this, BuildConfig.DEBUG)
            );
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }
}
