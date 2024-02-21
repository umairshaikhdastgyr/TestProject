import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Dimensions,
  Linking,
  TouchableOpacity,
  Platform,
  Image,
  PermissionsAndroid,
} from "react-native";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import ImageResizer from "@bam.tech/react-native-image-resizer";
import Feather from "react-native-vector-icons/Feather";
import RNFS from "react-native-fs";
import Header from "./header";
import { BodyText, Link } from "#components";
import PhotoLibraryItem from "../components/photo-library-item";
import { addPhotoToList, removePhotoFromList } from "#modules/Sell/actions";
import { useActions } from "#utils";
import Icons from "#assets/icons/bottom-navigation";
import { flex } from "#styles/utilities";
import HomitagDraggableFlatList from "../components/draggable-flatlist";
import { useRoute } from "@react-navigation/native";

const { height } = Dimensions.get("window");

const PhotoLibrary = ({
  picsSelected,
  setPicSelected,
  setActiveTab,
  navigation,
  handleConfirmActionLocal,
  maxPhoto,
}) => {
  const route = useRoute();
  /* Selectors */

  /* Actions */
  const actions = useActions({ addPhotoToList, removePhotoFromList });

  const screen = route?.params?.screen ?? null;
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
        setLibraryPhotos((prevState) => [...prevState, ...r.edges]);
        setLibraryPage_info(r.page_info);
        setExistsError(false);
      })
      .catch((_err) => {
        console.log(_err);
        setExistsError(true);
      });
  }, []);

  /* Methods */
  const handleSelectPhoto = async (item) => {
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
    } else if (Platform.OS === "android") {
      resizeImage = { uri: item.node.image.uri };
    }

    const photoBase64 = await RNFS.readFile(resizeImage?.uri, "base64");

    if (screen === "return") {
      const returnLabelImage = `data:image/jpeg;base64,${photoBase64}`;
      setPicSelected([
        {
          type: "selected-photo",
          image: returnLabelImage,
          uri: resizeImage?.uri,
          ext: "jpeg",
        },
      ]);
    } else {
      if (picsSelected.length >= maxPhoto) {
        return;
      }

      setPicSelected([
        ...picsSelected,
        ...[
          {
            type: "taken-photo",
            image: photoBase64,
            uri: resizeImage?.uri,
            ext: "jpeg",
          },
        ],
      ]);
    }
    /*
    actions.addPhotoToList({
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
        console.log({ err });
      });
  };

  const goToSettings = () => {
    Linking.openSettings();
  };

  const removePic = (index) => {
    const deleteItem = picsSelected[index];
    const filteredItems = picsSelected
      .slice(0, index)
      .concat(picsSelected.slice(index + 1, picsSelected.length));
    setPicSelected(filteredItems);
    if (deleteItem?.savIndex || deleteItem?.savIndex === 0) {
      actions.removePhotoFromList({ index: deleteItem?.savIndex });
    }
  };

  return (
    <View style={styles.container}>
      <Header
        navigation={navigation}
        handleConfirmActionLocal={handleConfirmActionLocal}
      />
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
          keyExtractor={(item, index) => item + index}
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
        {/* <DraggableFlatList
          data={picsSelected}
          horizontal
          renderItem={renderItem}
          keyExtractor={(item, index) => `draggable-item-${index}`}
          onDragEnd={({ data, from, to }) => {
            setPicSelected(data);
          }}
          showsHorizontalScrollIndicator={false}
        /> */}

        <HomitagDraggableFlatList
          data={picsSelected}
          navigation={navigation}
          removePic={removePic}
          setPicSelected={setPicSelected}
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
    marginLeft: 15,
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
