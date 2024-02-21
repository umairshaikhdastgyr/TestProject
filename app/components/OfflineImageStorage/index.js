import AsyncStorage from "@react-native-async-storage/async-storage";

const fetchImageData = async (uri) => {
  try {
    const response = await fetch(uri);
    const imageBlob = await response.blob();
    return imageBlob;
  } catch (error) {
    console.log("Error fetching image:", error);
    return null;
  }
};

const isImageCached = async (key) => {
  try {
    const cachedImage = await AsyncStorage.getItem(key);
    return !!cachedImage;
  } catch (error) {
    console.log("Error checking cached image:", error);
    return false;
  }
};

// Save the image data into AsyncStorage
export const saveImageData = async (key, uri) => {
  const isCached = await isImageCached(key);
  if (!isCached) {
    const imageBlob = await fetchImageData(uri);
    if (imageBlob) {
      const base64Image = await imageBlobToBase64(imageBlob); // Convert the image blob to base64
      await AsyncStorage.setItem(key, base64Image);
    }
  }
};

// Convert image blob to base64 string
const imageBlobToBase64 = (imageBlob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(imageBlob);
  });

export const getImageDataFromStorage = async (key) => {
  try {
    const base64Image = await AsyncStorage.getItem(key);
    return base64Image;
  } catch (error) {
    console.log("Error retrieving image from AsyncStorage:", error);
    return null;
  }
};
function atob(input) {
  var keyStr =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var output = "";
  var chr1, chr2, chr3;
  var enc1, enc2, enc3, enc4;
  var i = 0;
  input = input?.replace(/[^A-Za-z0-9\+\/\=]/g, "");
  do {
    enc1 = keyStr.indexOf(input?.charAt(i++));
    enc2 = keyStr.indexOf(input?.charAt(i++));
    enc3 = keyStr.indexOf(input?.charAt(i++));
    enc4 = keyStr.indexOf(input?.charAt(i++));
    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;
    output = output + String.fromCharCode(chr1);
    if (enc3 !== 64) {
      output = output + String.fromCharCode(chr2);
    }
    if (enc4 !== 64) {
      output = output + String.fromCharCode(chr3);
    }
  } while (i < input?.length);
  return output;
}

// Function to convert base64 image string to Blob
export const base64ToImageBlob = (base64Image) => {
  const byteCharacters = atob(base64Image.split(",")[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: "image/jpeg" });
};
