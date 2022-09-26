/* eslint-disable prettier/prettier */
import Axios, {AxiosRequestConfig} from 'axios';
import {Toast} from 'native-base';
import {Alert} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
// import Geolocation from 'react-native-geolocation-service';
// import LocationEnabler from 'react-native-location-enabler';
// import Pusher from 'pusher-js/react-native';

// const pusher = new Pusher('ed2d29f7e3ed51c6d72f', {
//   cluster: 'us2',
// });

const dummyImage =
  'https://www.pngkit.com/png/full/799-7998601_profile-placeholder-person-icon.png';

const placeholder_image =
  'https://lunawood.com/wp-content/uploads/2018/02/placeholder-image.png';

const headers = {
  headers: {
    Accept: 'application/json',
  },
};

const BearerHeaders = (token: any, More: AxiosRequestConfig = {}) => {
  return {
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
      ...More,
    },
  };
};

const post = async (
  url: String,
  data: FormData | String,
  config: AxiosRequestConfig = headers,
) => {
  try {
    var res = await Axios.post(url, data, config);
    return res.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status >= 300 && error.response.status < 400) {
        Toast.show({
          title:
            'Oops! Looks like we have redirection error. Please wait and try again later.. ' +
            error.response.status,
        });
      }
      if (error.response.status >= 400 && error.response.status < 500) {
        Toast.show({
          title:
            'Oops! Looks like there is an error on your end. Please report this error in support menu.. ' +
            error.response.status,
        });
      }
      if (error.response.status >= 500 && error.response.status < 600) {
        Toast.show({
          title:
            'Oops! Looks like we have an error in our systems. Please wait and try again later.. ' +
            error.response.status,
        });
      }
    } else {
      Toast.show({
        title: error.message,
      });
    }
  }
};

const get = async (url: String, config: AxiosRequestConfig = headers) => {
  try {
    var res = await Axios.get(url, config);
    return res.data;
    // if (res.data.status == 'success') {
    //   return res.data.data;
    // } else {
    //   alert(res.data.msg);
    // }
  } catch (error) {
    if (error.response) {
      if (error.response.status >= 300 && error.response.status < 400) {
        Toast.show({
          title:
            'Oops! Looks like we have redirection error. Please wait and try again later.. ' +
            error.response.status,
        });
      }
      if (error.response.status >= 400 && error.response.status < 500) {
        Toast.show({
          title:
            'Oops! Looks like there is an error on your end. Please report this error in support menu.. ' +
            error.response.status,
        });
      }
      if (error.response.status >= 500 && error.response.status < 600) {
        Toast.show({
          title:
            'Oops! Looks like we have an error in our systems. Please wait and try again later.. ' +
            error.response.status,
        });
      }
    } else {
      Toast.show({
        title: error.message,
      });
    }
  }
};

// const getCurrentLocation = (callback: Function, errorCallback?: Function) => {
//   LocationEnabler.requestResolutionSettings({
//     priority: LocationEnabler.PRIORITIES.HIGH_ACCURACY, // optional: default BALANCED_POWER_ACCURACY
//     alwaysShow: true, // optional: default false
//     needBle: false, // optional: default false
//   });
//   Geolocation.getCurrentPosition(
//     position => {
//       callback(position);
//     },
//     error => {
//       if (errorCallback) errorCallback();

//       console.warn(error);
//       if (error.PERMISSION_DENIED == 1)
//         alert('Please enable permission or turn location services ON..');
//       else alert('Error while getting you location');
//     },
//     {
//       enableHighAccuracy: true,
//       forceRequestLocation: true,
//       showLocationDialog: true,
//       accuracy: {
//         android: 'high',
//         ios: 'best',
//       },
//     },
//   );
// };

const OpenImagePicker = (callback: Function, multiple = false, title = '') => {
  // const options = {
  //     title: 'Select Avatar',
  //     storageOptions: {
  //         skipBackup: true,
  //         path: "images"
  //     },
  // };
  // try {
  //     ImagePicker.showImagePicker(options, (response) => {
  //         console.warn(response)
  //         if (response.didCancel) {
  //             //console.log('User cancelled image picker');
  //         } else if (response.error) {
  //             // ShowSnack(response.error)
  //         } else if (response.customButton) {
  //             // console.log('User tapped custom button: ', response.customButton);
  //         } else {
  //             console.warn(response)
  //         }
  //     })

  // } catch (error) {
  //     ShowSnack("Error while uploading image")
  // }
  Alert.alert(
    'Options',
    'Select one option to continue',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Camera',
        style: 'default',
        onPress: async () => {
          try {
            var image = await ImagePicker.openCamera({
              multiple: false,
              width: 200,
              height: 200,
            });
            if (image || image.length > 0) {
              callback(image);
            } else {
              Toast.show({
                title: 'Image is not selected',
              });
            }
          } catch (error) {
            // console.warn(error);
            Toast.show({
              title: error.message,
            });
          }
        },
      },
      {
        text: 'Library',
        style: 'default',
        onPress: async () => {
          try {
            var image = await ImagePicker.openPicker({
              multiple: multiple,
              width: 200,
              height: 200,
            });
            if (image || image.length > 0) {
              callback(image);
            } else {
              Toast.show({
                title: 'Image is not selected',
              });
            }
          } catch (error) {
            console.warn('sa',JSON.stringify(error));
            Toast.show({
              title: error.message,
            });
          }
        },
      },
    ],
    {},
  );
};

const SentenceCase = (string: String) => {
  if (string.length <= 0) return string;
  var sentence = string.toLowerCase().split(' ');
  for (var i = 0; i < sentence.length; i++) {
    sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
  }
  return sentence;
};

const ApiRequest = {
  Post: post,
  Get: get,
};

export {
  dummyImage,
  ApiRequest,
  // url,
  // files_url,
  placeholder_image,
  BearerHeaders,
  SentenceCase,
  OpenImagePicker,
  // getCurrentLocation,
  // openTokApiKey,
  //pusher,
  // ConectyCubeCredentials,
  // users
};
