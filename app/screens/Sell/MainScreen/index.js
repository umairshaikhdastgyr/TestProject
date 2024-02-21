import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {StyleSheet, SafeAreaView, View, Text, BackHandler} from 'react-native';
import ConfirmationPopup from './ConfirmationPopup';
import {
  Button,
  BodyText,
  Link,
  StepsBar,
  FooterAction,
  SweetDialog,
  FullScreenLoader,
} from '#components';
import SelectedDraggblePhotos from './views/selected-draggble-photos';
import ListingType from './views/listing-type';
import {safeAreaView, safeAreaNotchHelper, flex} from '#styles/utilities';
import {Colors, Fonts} from '#themes';
import {useFocusEffect} from '@react-navigation/native';
import {selectSellData} from '#modules/Sell/selectors';
import {selectUserData} from '#modules/User/selectors';
import {
  getListingType,
  getPostsDraft,
  getPostsDraftNextPage,
  deletePost,
  syncServer,
  clearSell,
  savePostDetail,
  isPostImageUploaded,
  postImageUpload,
} from '#modules/Sell/actions';
import {useActions} from '#utils';
import CheckConnection from '#utils/connectivity';
import {MainAuthStackNavigation} from '../../../navigators/MainAuthStackNavigation';
import {getUserInfo} from '#modules/User/actions';

let refFormData;
let refPhotoList;
let refCopyFormData;
let refCopyPhotoList;

const MainScreen = ({navigation, route}) => {
  let network = CheckConnection();
  const dispatch = useDispatch();
  const [checkingServer, setCheckingServer] = useState(false);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [exitDialogData, setExitDialogData] = useState({
    code: 'draft_available',
    title: 'Save Draft',
    message: 'Want to save your post for later?',
    mainBtTitle: 'Save for Later',
    secondaryBtTitle: 'No Thanks',
  });
  /* Selectors */
  const {
    formData,
    photosList,
    draftsList,
    isFetchingServer,
    photosListInServer,
    copyPhotoList,
    copyFormData,
  } = useSelector(selectSellData());
  const {information: userInfo, paymentBankList} = useSelector(
    selectUserData(),
  );
  const [showNumberVerificationPopup, setShowVerificationNumberPopup] =
    useState(false);
  const [showNoBankAccount, setShowNoBankAccount] = useState(false);
  const [showUserDeactivatedPopup, setShowUserDeactivatedPopup] =
    useState(false);

  /* Actions */
  const actions = useActions({
    getListingType,
    getPostsDraft,
    getPostsDraftNextPage,
    deletePost,
    syncServer,
    clearSell,
  });

  useFocusEffect(
    useCallback(() => {
      if (userInfo && userInfo?.status == 'deactivated') {
        setShowUserDeactivatedPopup(true);
      } else if (userInfo && !userInfo?.phonenumbervalidated) {
        setShowVerificationNumberPopup(true);
      } else if (!paymentBankList?.data?.data?.length) {
        setShowNoBankAccount(true);
      }
      navigation.setParams({handleMainCloseClick});
    }, [navigation, userInfo]),
  );

  useFocusEffect(
    useCallback(() => {
      const handleBackButton = () => {
        handleMainCloseClick();
        return true;
      };
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackButton,
      );
      return () => subscription.remove();
    }, [navigation]),
  );
  const postType = route?.params?.postType ?? 'create';
  /* Effects */
  useEffect(() => {
    navigation.setParams({handleMainCloseClick});
    if (userInfo.id) {
      if (postType === 'create') {
        // actions.getListingType();
        actions.getPostsDraft({
          filters: {
            sellerId: userInfo.id,
            postStatus: 'Draft',
            page: 1,
            perPage: 20,
          },
        });
      }
    } else {
      if (network === true) {
        MainAuthStackNavigation(navigation);
      }
    }
    if (Object.entries(formData.listingType).length !== 0) {
      if (photosList.length === 0) {
        setEmptyImageAlert(true);
      } else {
        setEmptyImageAlert(false);
      }
    } else {
      setEmptyImageAlert(false);
    }
  }, [userInfo?.id]);

  const [emptyImageAlert, setEmptyImageAlert] = useState(false);

  useEffect(() => {
    if (Object.entries(formData.listingType).length !== 0) {
      if (photosList.length === 0) {
        setEmptyImageAlert(true);
      } else {
        setEmptyImageAlert(false);
      }
    } else {
      setEmptyImageAlert(false);
    }
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

  useEffect(() => {
    if (Object.entries(formData.listingType).length !== 0) {
      if (photosList.length === 0) {
        setEmptyImageAlert(true);
      } else {
        setEmptyImageAlert(false);
      }
    } else {
      setEmptyImageAlert(false);
    }
  }, [photosList]);

  useEffect(() => {
    if (isFetchingServer === false && checkingServer === true) {
      setCheckingServer(false);
      actions.clearSell();

      actions.getPostsDraft({
        filters: {
          sellerId: userInfo.id,
          postStatus: 'Draft',
          page: 1,
          perPage: 20,
        },
      });

      navigation.navigate('ExploreMain');
    }
  }, [isFetchingServer]);

  const isCurrentProductADraft = formData?.productStatus?.name === 'Draft';

  const handleMainCloseClick = () => {
    if (false) {
      // isCurrentProductADraft
      actions.syncServer({
        formData,
        photosList,
        userId: userInfo.id,
        photosListInServer,
      });
      actions.clearSell();
      navigation.navigate('ExploreMain');
    } else if (refFormData.listingType.id && refPhotoList.length > 0) {
      if (refCopyPhotoList || refCopyFormData) {
        if (checkDisableStatus()) {
          actions.clearSell();
          navigation.goBack();
        } else {
          setExitDialogData({
            code: 'draft_available',
            title: 'Save Draft',
            message: 'Want to save your post for later?',
            mainBtTitle: 'Save for Later',
            secondaryBtTitle: 'No Thanks',
          });
          setDialogVisible(true);
        }
        return;
      }
      // draft available
      setExitDialogData({
        code: 'draft_available',
        title: 'Save Draft',
        message: 'Want to save your post for later?',
        mainBtTitle: 'Save for Later',
        secondaryBtTitle: 'No Thanks',
      });
      setDialogVisible(true);
    } else {
      // draft not available
      dispatch(savePostDetail({}));
      dispatch(isPostImageUploaded(false));
      dispatch(postImageUpload([]));
      actions.clearSell();
      if (route?.params?.isDashboard) {
        navigation.navigate('Dashboard', {
          fromScreen: 'explore',
          showSellSection: true,
          isSellTab: true
        });
      } else {
        navigation.navigate('ExploreMain');
      }
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

    if (refFormData.listingType.name === 'Vehicle') {
      if (
        JSON.stringify(refFormData.customProperties) !==
        JSON.stringify(refCopyFormData.customProperties)
      ) {
        return false;
      }
    }

    if (refFormData.listingType.name !== 'Vehicle') {
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

  const navigateToNumberVerification = () => {
    navigation.navigate('EditPersonalInfo');
  };

  const navigateToBankAccount = () => {
    //navigation.navigate('EditPersonalInfo');
    navigation.navigate('PaymentBankTransfer', {
      createStripeAccount: true,
    });
  };

  const onModalTouchOutside = () => {
    setDialogVisible(false);
  };

  const onMainButtonPressed = () => {
    switch (exitDialogData.code) {
      case 'draft_available':
        setDialogVisible(false);
        setCheckingServer(true);
        actions.syncServer({
          formData,
          photosList,
          userId: userInfo.id,
          photosListInServer,
          lastScreen: route.name,
        });
        break;
      case 'draft_not_available':
        actions.clearSell();
        setDialogVisible(false);
        navigation.navigate('ExploreMain');
        break;
    }
  };

  const onSecondaryButtonPressed = () => {
    switch (exitDialogData.code) {
      case 'draft_available':
        actions.clearSell();
        setDialogVisible(false);
        navigation.navigate('ExploreMain');
        break;
      case 'draft_not_available':
        setDialogVisible(false);
        break;
    }
  };

  return (
    <>
      <SafeAreaView style={safeAreaView}>
        <StepsBar steps={0} step={1} />
        <View style={[flex.grow1, flex.justifyContentStart]}>
          <Button
            label="Add Photos"
            redAsterisk
            icon="camera"
            theme="secondary-rounded"
            style={styles.addPhotosButton}
            onPress={() => navigation.navigate('SellPhotos', {screen: 'sell'})}
            disabled={photosList?.length == 10}
          />

          {emptyImageAlert && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: -25,
              }}>
              <Text
                style={{color: Colors.red, fontFamily: 'Montserrat-Regular'}}>
                Please add at least one picture
              </Text>
            </View>
          )}

          <SelectedDraggblePhotos navigation={navigation} />
          <ListingType />
          <BodyText theme="inactive" style={styles.disclaimer} align="center">
            Own your own business and have a lot to sell?
          </BodyText>
          <BodyText
            theme="active"
            style={styles.disclaimer}
            align="center"
            onPress={() =>
              navigation.navigate('Supplier', {screen: 'SupplierScreen'})
            }>
            <Link>Learn More</Link> about becoming a supplier
          </BodyText>
        </View>
        {draftsList.length > 0 && (
          <FooterAction
            mainButtonProperties={{
              label: 'Next',
              subLabel: 'CATEGORY',
              disabled: photosList.length === 0,
              onPress: () =>
                navigation.navigate(
                  'SellCategory',
                  formData.listingType.name === 'Vehicle' && {
                    'category-type': 'Vehicle',
                  },
                ),
            }}
            secondaryButtonProperties={{
              label: 'Draft',
              disabled: false,
              onPress: () => {
                navigation.navigate('Drafts');
              },
            }}
          />
        )}
        {draftsList.length === 0 && (
          <FooterAction
            mainButtonProperties={{
              label: 'Next',
              subLabel: 'CATEGORY',
              disabled: photosList.length === 0,
              // disabled: photosList.length === 0 || !formData.listingType.id,
              onPress: () =>
                navigation.navigate('SellCategory', {
                  'category-type': formData.listingType.name === 'Vehicle' && {
                    'category-type': 'Vehicle',
                  },
                  isNormal: true,
                  isDashboard: route?.params?.isDashboard,
                }),
            }}
          />
        )}

        <SweetDialog
          title={exitDialogData.title}
          message={exitDialogData.message}
          type="two"
          mainBtTitle={exitDialogData.mainBtTitle}
          secondaryBtTitle={exitDialogData.secondaryBtTitle}
          dialogVisible={dialogVisible}
          onTouchOutside={onModalTouchOutside}
          onMainButtonPressed={onMainButtonPressed}
          onSecondaryButtonPressed={onSecondaryButtonPressed}
        />
        {showUserDeactivatedPopup && (
          <ConfirmationPopup
            isVisible={showUserDeactivatedPopup}
            title="Account Deactivated!"
            description="Your account is deactivated by Homitag. You can't create post at the moment. Please check your email for more details or reach out to Homitag support."
            onClose={() => {
              setShowUserDeactivatedPopup(false);
              navigation.navigate('ExploreMain');
            }}
            primaryButtonText="Back to explore"
            onPressPrimaryButton={() => {
              setShowUserDeactivatedPopup(false);
              navigation.navigate('ExploreMain');
            }}
          />
        )}
        {/* {showNoBankAccount && <ConfirmationPopup
          isVisible={showNoBankAccount}
          title="Complete Payment Setup"
          description="Please complete adding bank account to post item on platform. Bank account is needed to cashout amount when item is sold."
          onClose={() => {setShowNoBankAccount(false); navigation.navigate('ExploreMain');}}
          primaryButtonText="Add bank account"
          onPressSecondaryButton={() => {setShowNoBankAccount(false); navigation.navigate('ExploreMain');}}
          secondaryButtonText="Back to Explore"
          onPressPrimaryButton={() => {setShowNoBankAccount(false); navigateToBankAccount(); }}
        />} */}
        {showNumberVerificationPopup && (
          <ConfirmationPopup
            isVisible={showNumberVerificationPopup}
            title="Verification required!"
            description="Please verify your phone number to access this feature"
            onClose={() => {
              setShowVerificationNumberPopup(false);
              navigation.navigate('ExploreMain');
            }}
            primaryButtonText="Verify Phone Number"
            onPressSecondaryButton={() => {
              setShowVerificationNumberPopup(false);
              navigation.navigate('ExploreMain');
            }}
            secondaryButtonText="Back to Explore"
            onPressPrimaryButton={() => {
              setShowVerificationNumberPopup(false);
              navigateToNumberVerification();
            }}
          />
        )}
        <FullScreenLoader isVisible={isFetchingServer} />
      </SafeAreaView>
      <SafeAreaView style={safeAreaNotchHelper} />
    </>
  );
};

const styles = StyleSheet.create({
  addPhotosButton: {
    width: 250,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginVertical: 35,
  },
  disclaimer: {
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  headerText: {
    ...Fonts.style.headerText,
    color: Colors.black,
  },
  closeButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
});

export default MainScreen;
