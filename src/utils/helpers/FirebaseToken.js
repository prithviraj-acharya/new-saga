import {Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';

export const getDeviceToken = () => {
  return new Promise(async (resolve, reject) => {
    await messaging().deleteToken();
    if (Platform.OS === 'ios') {
      messaging()
        .requestPermission()
        .then(() => {
          messaging()
            .getAPNSToken()
            .then(value => {
              if (value) {
                resolve(value);
              } else {
                reject('Token could not be generated');
              }
            })
            .catch(() => {
              reject('Token could not be generated');
            });
        })
        .catch(error => {
          reject(error);
        });
    } else {
      messaging()
        .getToken()
        .then(value => {
          if (value) {
            resolve(value);
          } else {
            reject('Token could not be generated');
          }
        })
        .catch(error => {
          reject('Token could not be generated');
        });
    }
  });
};
