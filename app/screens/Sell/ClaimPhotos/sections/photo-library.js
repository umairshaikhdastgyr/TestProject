import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Dimensions,
  Linking,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import ImageResizer from "@bam.tech/react-native-image-resizer";
import Feather from "react-native-vector-icons/Feather";
import RNFS from "react-native-fs";
import Header from "./header";
import { BodyText, Link } from "#components";
import SelectedPhoto from "../components/selected-photo";
import PhotoLibraryItem from "../components/photo-library-item";
import {
  addClaimPhotoToList,
  removeClaimPhotoFromList,
  removeReturnPhotoFromList,
} from "#modules/User/actions";
import { useActions } from "#utils";
import DraggableFlatList from "#components/DraggableList";
import Icons from "#assets/icons/bottom-navigation";
import { flex } from "#styles/utilities";
import { uploadClaimImage, removeClaimImage } from "#services/apiUsers";
import { selectUserData } from "#modules/User/selectors";

const { height } = Dimensions.get("window");

const PhotoLibrary = ({
  picsSelected,
  setPicSelected,
  setActiveTab,
  navigation,
  handleConfirmActionLocal,
  order,
  maxPhoto,
}) => {
  /* Selectors */

  /* Actions */
  const actions = useActions({ addClaimPhotoToList, removeClaimPhotoFromList });
  const { claimPhotosList } = useSelector(selectUserData());
  const dispatch = useDispatch();

  /* States */
  const [libraryPhotos, setLibraryPhotos] = useState([]);
  const [libraryPage_info, setLibraryPage_info] = useState({});

  const [existsError, setExistsError] = useState(false);

  /* Effects */
  useEffect(() => {
    CameraRoll.getPhotos({
      first: 50,
      assetType: "Photos",
    })
      .then((r) => {
        setLibraryPhotos([...libraryPhotos, ...r.edges]);
        setLibraryPage_info(r.page_info);
        setExistsError(false);
      })
      .catch((err) => {
        setExistsError(true);
      });
  }, []);

  /* Methods */
  const handleSelectPhoto = async (item) => {
    if (picsSelected.length >= maxPhoto) {
      return;
    }
    let imagePATH = null;
    let resizeImage = null;
    if (Platform.OS === "ios") {
      const regex = /:\/\/(.{36})\//i;
      const result = item.node.image.uri.match(regex);

      const photoPATH = `assets-library://asset/asset.JPG?id=${result[1]}&ext=JPG`;

      resizeImage = await ImageResizer.createResizedImage(
        photoPATH,
        720,
        1280,
        "JPEG",
        60
      );

      const dest = `${RNFS.TemporaryDirectoryPath}${Math.random()
        .toString(36)
        .substring(7)}.jpg`;

      imagePATH = await RNFS.copyAssetsFileIOS(
        photoPATH,
        dest,
        1000,
        1000,
        1.0,
        1.0,
        "contain"
      );
    } else if (Platform.OS === "android") {
      resizeImage = { uri: item.node.image.uri };

      imagePATH = item.node.image.uri;
    }
    const data = {
      ETag: item?.node?.image?.width + item?.node?.image?.height,
      Key: item?.node?.image?.filename,
      url: item?.node?.image?.uri,
    };
    setPicSelected(picsSelected.concat(data));
    const res = await uploadClaimImage(
      resizeImage.uri,
      order.buyerId,
      order.id
    );
    if (res.data) {
      dispatch(addClaimPhotoToList(res.data));
    }
    /*
    actions.addClaimPhotoToList({
      type: 'photo-gallery',
      image: item.node.image.uri,
    });
    */
  };

  const handleEndReached = (event) => {
    CameraRoll.getPhotos({
      first: 50,
      after: libraryPage_info.end_cursor,
      assetType: "Photos",
    })
      .then((r) => {
        setLibraryPhotos([...libraryPhotos, ...r.edges]);
        setLibraryPage_info(r.page_info);
      })
      .catch((err) => {
        // setExistsError(true);
      });
  };

  const goToSettings = () => {
    Linking.openSettings();
  };

  const removePic = async (key, ind) => {
    setPicSelected(picsSelected.filter((pic) => pic.Key !== key));
    const getKey = claimPhotosList[ind].Key;
    try {
      const res = await removeClaimImage(getKey);
      if (res.data) {
        actions.removeClaimPhotoFromList(getKey);
        dispatch(removeReturnPhotoFromList(getKey));
      }
    } catch (e) {}
  };

  const renderItem = ({ item, index, drag, isActive }) => {
    const newData = [...picsSelected];
    const currIndex = newData.findIndex((currentItem) => item === currentItem);

    return (
      <>
        <TouchableOpacity delayLongPress={300} onLongPress={drag}>
          <>
            <SelectedPhoto
              key={index}
              data={item}
              index={currIndex}
              isActive={isActive}
              removePic={removePic}
            />
          </>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      {existsError === true && (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 30,
          }}
        >
          <BodyText theme="inactive" align="center" onPress={goToSettings}>
            Photo library access was not granted. Please go to your{" "}
            <Link>phone settings</Link> and allow photo library access
          </BodyText>
        </View>
      )}
      {existsError === false && (
        <FlatList
          style={{ maxHeight: height * 0.6, marginBottom: 15 }}
          contentContainerStyle={styles.containerPhotoLibrary}
          numColumns={5}
          data={libraryPhotos}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          renderItem={({ item }, index) => (
            <PhotoLibraryItem
              picsSelected={picsSelected}
              key={index}
              photo={item}
              onPress={() => handleSelectPhoto(item)}
            />
          )}
        />
      )}
      <View style={styles.listContainer}>
        {picsSelected.length === 0 && (
          <BodyText
            size="medium"
            theme="inactive"
            style={styles.emptyText}
            align="center"
          >
            Images will appear as you take them and select them from your photo
            library
          </BodyText>
        )}
        <DraggableFlatList
          data={picsSelected}
          horizontal
          renderItem={renderItem}
          keyExtractor={(item, index) => `draggable-item-${index}`}
          onDragEnd={({ data, from, to }) => {
            setPicSelected(data);
          }}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View style={styles.takeBtnContainer}>
        <TouchableOpacity
          style={[
            styles.mainIcon,
            {
              height: 50,
              width: 50,
              borderColor: "#00BDAA",
              borderWidth: 3,
            },
          ]}
          onPress={() => setActiveTab("take-photo")}
        >
          <Image source={Icons.sellmain_active} style={styles.iconActive} />
        </TouchableOpacity>

        <View style={{ opacity: picsSelected?.length == 0 ? 0.5 : 1 }}>
          <TouchableOpacity
            disabled={picsSelected?.length == 0}
            onPress={handleConfirmActionLocal}
            style={[
              {
                height: 50,
                width: 50,
                borderRadius: 50,
                marginBottom: 16,
                backgroundColor: "#FFF",
                borderColor: "#00BDAA",
                borderWidth: 2,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <Feather
              name="check"
              size={28}
              color="#00BDAA"
              style={{ marginTop: 6 }}
            />
          </TouchableOpacity>
          <View
            style={{
              position: "absolute",
              bottom: -5,
              width: 50,
              flex: 1,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 12,
                fontFamily: "Montserrat-Regular",
              }}
            >
              DONE
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  containerPhotoLibrary: {
    flexGrow: 1,
  },
  listContainer: {
    height: 110,
    justifyContent: "center",
  },
  emptyText: {
    textAlign: "center",
    paddingHorizontal: 24,
    marginTop: 10,
  },
  takeBtnContainer: {
    ...flex.directionRow,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  iconActive: {
    width: 30,
    height: 26,
    tintColor: "#ffffff",
  },
  mainIcon: {
    backgroundColor: "#00BDAA",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
});

export default PhotoLibrary;
