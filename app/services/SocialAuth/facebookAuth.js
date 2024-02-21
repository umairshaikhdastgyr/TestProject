import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
import auth from '@react-native-firebase/auth';

const getAccountInfo = accessData =>
  new Promise((resolve, reject) => {
    const infoRequest = new GraphRequest(
      '/me',
      {
        accessToken: accessData.accessToken,
        parameters: {
          fields: {
            string:
              'id, name, email, picture.type(large), first_name, last_name',
          },
        },
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        return resolve(result);
      },
    );
    new GraphRequestManager().addRequest(infoRequest).start();
  });

export const login = async () => {
  let result;
  await logout();
  try {
    result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      return { error: 'Login was cancelled.' };
    }

    const accessData = await AccessToken.getCurrentAccessToken();
    const facebookCredential = auth.FacebookAuthProvider.credential(accessData.accessToken);
    auth().signInWithCredential(facebookCredential);

    const info = await getAccountInfo(accessData);

    return { user: info };
  } catch (err) {
    throw new Error(err);
  }
};

export const logout = async () => {
  return LoginManager.logOut();
};
