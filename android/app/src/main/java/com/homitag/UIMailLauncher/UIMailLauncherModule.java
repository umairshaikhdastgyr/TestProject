package com.homitag.UIMailLauncher;


import android.content.Intent;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;
import java.util.HashMap;

public class UIMailLauncherModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;
    private static final String REACT_MODULE = "UIMailLauncherModule";

    UIMailLauncherModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return REACT_MODULE;
    }

    @ReactMethod
    public void launchMailApp() {
        Intent intent = new Intent(Intent.ACTION_MAIN);
        intent.addCategory(Intent.CATEGORY_APP_EMAIL);
        getCurrentActivity().startActivity(intent);
    }
}
