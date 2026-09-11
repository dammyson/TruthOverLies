import {PermissionsAndroid, Platform} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';

async function ensureAndroidPhotoPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }

  if (Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

/** Opens the photo library and returns a local image URI for share backgrounds. */
export async function pickShareCustomPhoto(): Promise<string | null> {
  if (Platform.OS === 'android') {
    const permitted = await ensureAndroidPhotoPermission();
    if (!permitted) {
      return null;
    }
  }

  const result = await launchImageLibrary({
    mediaType: 'photo',
    selectionLimit: 1,
    quality: 1,
  });

  if (result.didCancel || result.errorCode === 'permission') {
    return null;
  }

  if (result.errorCode) {
    return null;
  }

  return result.assets?.[0]?.uri ?? null;
}
