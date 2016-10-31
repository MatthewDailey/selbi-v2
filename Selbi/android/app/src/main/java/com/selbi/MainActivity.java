package com.selbi;

import com.facebook.react.ReactActivity;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.joshblour.reactnativepermissions.ReactNativePermissionsPackage;
import com.evollu.react.fa.FIRAnalyticsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.github.xinthink.rnmk.ReactMaterialKitPackage;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Selbi";
    }
}
