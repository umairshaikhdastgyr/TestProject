import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { SafeAreaView, BackHandler, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { FooterAction, StepsBar, SweetDialog } from "#components";

import VehicleList from "./vehicle-list";
import { safeAreaViewWhite, safeAreaNotchHelper } from "#styles/utilities";
import { selectSellData } from "#modules/Sell/selectors";
import { selectUserData } from "#modules/User/selectors";
import {
  setFormValue,
  clearSell,
  syncServer,
  getPostsDraft,
} from "#modules/Sell/actions";
import { useActions } from "#utils";
import usePrevious from "#utils/usePrevious";
import { HeaderBackButton } from "@react-navigation/elements";
import { Colors, Fonts } from "#themes";
let refFormData;
let refPhotoList;
let refCopyFormData;
let refCopyPhotoList;
const VehicleDetailsScreen = ({ navigation, route }) => {
  const categoryType = route.params["category-type"];

  const {
    formData,
    photosList,
    isFetchingServer,
    photosListInServer,
    copyFormData,
    copyPhotoList,
  } = useSelector(selectSellData());

  useEffect(() => {
    refFormData = formData;
  }, [formData]);
  useEffect(() => {
    refPhotoList = photosList;
  }, [photosList]);
  useEffect(() => {
    refCopyPhotoList = copyPhotoList;
  }, [copyPhotoList]);
  useEffect(() => {
    refCopyFormData = copyFormData;
  }, [copyFormData]);
  const prevFormData = usePrevious(formData);
  const [warningText, setWarningText] = useState("");
  const [modelChangeError, setModelChangeError] = useState(null);

  const handleVehicleCloseClick = () => {
    if (refCopyPhotoList || refCopyFormData) {
      if (checkDisableStatus()) {
        actions.clearSell();
        navigation.goBack();
      } else {
        setDialogVisible(true);
      }
    } else {
      setDialogVisible(true);
    }
  };
  const checkDisableStatus = () => {
    if (
      refPhotoList.length > 0 &&
      JSON.stringify(refPhotoList) !== JSON.stringify(refCopyPhotoList)
    ) {
      return false;
    }

    if (
      JSON.stringify(refFormData.listingType) !==
      JSON.stringify(refCopyFormData.listingType)
    ) {
      return false;
    }

    if (
      JSON.stringify(refFormData.subCategory) !==
      JSON.stringify(refCopyFormData.subCategory)
    ) {
      return false;
    }

    if (refFormData.postTitle !== refCopyFormData.postTitle) {
      return false;
    }

    if (refFormData.postDescription !== refCopyFormData.postDescription) {
      return false;
    }

    if (
      JSON.stringify(refFormData.location) !==
      JSON.stringify(refCopyFormData.location)
    ) {
      return false;
    }

    if (refFormData.price !== refCopyFormData.price) {
      return false;
    }

    if (refFormData.isNegotiable !== refCopyFormData.isNegotiable) {
      return false;
    }

    if (
      refCopyFormData.condition &&
      refFormData.condition &&
      refFormData.condition.length > 0 &&
      refFormData?.condition[0] !== refCopyFormData?.condition[0]
    ) {
      return false;
    }

    if (JSON.stringify(refPhotoList) !== JSON.stringify(refCopyPhotoList)) {
      return false;
    }

    if (JSON.stringify(refFormData) !== JSON.stringify(refCopyFormData)) {
      //return false;
    }

    if (refFormData.listingType.name === "Vehicle") {
      if (
        JSON.stringify(refFormData.customProperties) !==
        JSON.stringify(refCopyFormData.customProperties)
      ) {
        return false;
      }
    }

    if (refFormData.listingType.name !== "Vehicle") {
      if (
        JSON.stringify(refFormData.deliveryMethodsSelected) !==
        JSON.stringify(refCopyFormData.deliveryMethodsSelected)
      ) {
        //Left validate valid item

        return false;
      }
    }
    return true;
  };
  useEffect(() => {
    if (
      prevFormData &&
      prevFormData.customProperties &&
      prevFormData.customProperties.model &&
      prevFormData.customProperties.model.name &&
      prevFormData.customProperties.make &&
      prevFormData.customProperties.make.name
    ) {
      if (
        formData &&
        formData.customProperties &&
        formData.customProperties.make &&
        formData.customProperties.make.name &&
        formData.customProperties.make.name !==
          prevFormData.customProperties.make.name
      ) {
        let tempData = formData;
        tempData.customProperties.model = {};
        setFormValue(tempData);
        setModelChangeError(true);
        setWarningText(
          `Model "${prevFormData.customProperties.model.name}" does not exist in Make "${formData.customProperties.make.name}".`
        );
      } else {
        setModelChangeError(false);
        setWarningText("");
      }
    }
    if (
      formData &&
      formData.customProperties &&
      formData.customProperties.model &&
      !formData.customProperties.model.name
    ) {
      setModelChangeError(true);
    } else {
      setWarningText("");
    }
  }, [formData]);

  useFocusEffect(() => {
    const handleBackButton = () => {
      navigation.navigate(
        "PostDetails",
        formData.listingType.name === "Vehicle" && {
          "category-type": "Vehicle",
        }
      );
      return true;
    };
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButton
    );
    return () => subscription.remove();
  }, []);

  const { information: userInfo } = useSelector(selectUserData());

  const actions = useActions({
    clearSell,
    syncServer,
    getPostsDraft,
    setFormValue,
  });

  const [checkingServer, setCheckingServer] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      navigation.setParams({ handleVehicleCloseClick });
      navigation.setParams({ categoryType: formData.listingType.name });
    }, [])
  );

  useEffect(() => {
    if (isFetchingServer === false && checkingServer === true) {
      setCheckingServer(false);
      actions.clearSell();

      actions.getPostsDraft({
        filters: {
          sellerId: userInfo.id,
          postStatus: "Draft",
          page: 1,
          perPage: 20,
        },
      });

      navigation.navigate("ExploreMain");
    }
  }, [isFetchingServer]);

  // const handleVehicleCloseClick = () => {
  //   setDialogVisible(true);
  // };

  const onModalTouchOutside = () => {
    setDialogVisible(false);
  };

  const onMainButtonPressed = () => {
    setDialogVisible(false);
    setCheckingServer(true);
    actions.syncServer({
      formData,
      photosList,
      draft: true,
      userId: userInfo.id,
      photosListInServer,
      lastScreen: route.name,
    });
  };

  const onSecondaryButtonPressed = () => {
    actions.clearSell();
    setDialogVisible(false);
    navigation.navigate("ExploreMain");
  };

  const vehicleListingTypeRequirementsComplete = () => {
    if (
      formData?.listingType?.name === "Vehicle" &&
      formData?.subCategory?.name === "Cars"
    ) {
      if (
        formData?.customProperties?.make?.name &&
        formData?.customProperties?.model?.name &&
        formData?.customProperties?.year?.name
      ) {
        return true;
      }
    }

    if (
      formData?.listingType?.name === "Vehicle" &&
      formData?.subCategory?.name !== "Cars"
    ) {
      if (formData?.customProperties?.year?.name) {
        return true;
      }
    }

    // Bypass this check if the type is Goods
    if (formData?.listingType?.name === "Goods") {
      return true;
    }

    return false;
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: headerLeft,
    });
  }, [navigation]);

  const headerLeft = () => (
    <HeaderBackButton
      onPress={() => {
        navigation.navigate(
          "PostDetails",
          formData.listingType.name === "Vehicle" && {
            "category-type": "Vehicle",
          }
        );
      }}
      tintColor={"#969696"}
    />
  );

  return (
    <>
      <SafeAreaView style={safeAreaViewWhite}>
        <StepsBar steps={5} step={3} />
        {warningText !== "" && (
          <Text
            style={{
              color: Colors.alert,
              ...Fonts.style.homiTagText,
              textAlign: "center",
              marginTop: 20,
            }}
          >
            {warningText}
          </Text>
        )}

        <VehicleList navigation={navigation} formData={formData} />

        <FooterAction
          mainButtonProperties={{
            label: "Next",
            subLabel: "PRICE",
            disabled: vehicleListingTypeRequirementsComplete() === false,
            onPress: () =>
              navigation.navigate("SellPrice", {
                "category-type": categoryType,
              }),
          }}
        />
      </SafeAreaView>
      <SweetDialog
        title="Save Draft"
        message="Want to save your post for later?"
        type="two"
        mainBtTitle="Save for Later"
        secondaryBtTitle="No Thanks"
        dialogVisible={dialogVisible}
        onTouchOutside={onModalTouchOutside}
        onMainButtonPressed={onMainButtonPressed}
        onSecondaryButtonPressed={onSecondaryButtonPressed}
      />
      <SafeAreaView style={safeAreaNotchHelper} />
    </>
  );
};

export default VehicleDetailsScreen;
