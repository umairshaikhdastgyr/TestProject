import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import Config from '#config';

const { googleWebCliendId } = Config;

export const login = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    GoogleSignin.configure({
      webClientId: googleWebCliendId,
      scopes: ['email'],
      offlineAccess: true,
      forceConsentPrompt: true,
    });
    const userInfo = await GoogleSignin.signIn();
    const credential = auth.GoogleAuthProvider.credential(
      userInfo?.idToken,
      userInfo?.accessToken,
      );
      await auth().signInWithCredential(credential);
      const currentUser = await GoogleSignin.getCurrentUser();
      if (currentUser) {
      return { userInfo: currentUser };
    }
    return { userInfo };
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // operation (e.g. sign in) is in progress already
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      // play services not available or outdated
    } else if (error.code === statusCodes.SIGN_IN_REQUIRED) {
      // play services not available or outdated
    } else {
      // some other error happened
    }
    throw new Error(error);
  }
};
