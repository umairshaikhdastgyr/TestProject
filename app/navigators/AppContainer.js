import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthLoadingScreen, IntroScreen, MainScreen} from '../screens';
import {
  SignInScreen,
  MainAuthScreen,
  SignupScreen,
  ProfileSetupScreen,
  VerificationScreen,
  VerificationPhoneScreen,
  PrivacyScreen,
  ForgotPasswordScreen,
  ForgotVerificationScreen,
  ResetPasswordScreen,
} from '#screens/Auth/index.js';
import {
  AboutUsScreen,
  AccountSettingScreen,
  AddPaymentConfirmScreen,
  AddPaymentScreen,
  CodeVerificationScreen,
  ConfirmBankTransferScreen,
  ConfirmPayPalScreen,
  DashboardScreen,
  EditPersonalInfoScreen,
  EditProfileScreen,
  EditProfileSettingsScreen,
  FeedbackConfirmation,
  FollowerDetailScreen,
  FollowersScreen,
  FollowingScreen,
  HelpBuying,
  HelpFeedback,
  IDVerificationScreen,
  InviteFriend,
  LeaveBuyerReviewScreen,
  LeaveReviewScreen,
  MyOrders,
  NewMessageConfirmationScreen,
  NewMessageContactUsScreen,
  NewMessageContactUsSecondScreen,
  NotificationSettingsScreen,
  PasswordSettingScreen,
  PayPalLoginScreen,
  PaymentBankTransferScreen,
  PaymentCardScreen,
  PaymentManagementScreen,
  PersonalInfoEmailVerificationScreen,
  PersonalInfoEmailVerifyCodeScreen,
  PersonalInfoPhoneVerificationScreen,
  PersonalInfoPhoneVerifyCodeScreen,
  PrivacyPolicy,
  ProductDetailScreen,
  ReportScreen,
  ReviewDetailScreen,
  ReviewScreen,
  SendFeedback,
  SocialMediaScreen,
  TermsAndConditionScreen,
  TransactionHistory,
  TransferOutScreen,
  VerifyAccountScreen,
  VerifyUserId,
} from '#screens/Profile';
import {
  AddFilterScreen,
  AddProductReviewScreen,
  CancelExchangeScreen,
  DeliverySelectorScreen,
  FilterScreen,
  FilterSearchLocationScreen,
  LeaveProductReviewScreen,
  LocationMapScreen,
  OfferBuyScreen,
  OrderReceiptScreen,
  OrderStatusScreen,
  PaymentConfirmationScreen,
  PaymentScreen,
  ProductPicturesFullScreen,
  ProductReviewsScreen,
  ReceiptScreen,
  ShippingInfoScreen,
  SupplierCatalogScreen,
  SupplierProfileScreen,
} from '#screens/Explore';
import {
  AddressFormScreen,
  CategoryScreen,
  ClaimPhotos,
  ClaimScreen,
  DeliveryMethodsScreen,
  DraftsScreen,
  EditLabelScreen,
  EditorScreen,
  PartailRefundAmoundScreen,
  PhotoFullScreen,
  PhotosScreen,
  PostDetailsScreen,
  PreviewScreen,
  PriceScreen,
  ReturnAcceptScreen,
  ReturnConfirmationScreen,
  ReturnDeclineScreen,
  ReturnInstructionScreen,
  ReturnOptionsScreen,
  ReturnPhotos,
  ReturnRefundScreen,
  ReturnRequestScreen,
  ReturnScreen,
  SelectCarrierScreen,
  SupplierPerkScreen,
  SupplierScreen,
  VehicleDetailsScreen,
  PostDetails_PostTitleScreen,
  PostDetails_PostDescriptionScreen,
  PostDetails_PostLocationScreen,
  VehicleDetails_MainDetailsToAddScreen,
  VehicleDetails_AdditionalDetailsToAddScreen,
  SupplierSetScreen,
  ClaimOptionScreen,
  ClaimDisputeScreen,
  PackingTipsScreen,
  LabelGeneratorScreen,
  ShippingLabelScreen,
  ShipIndLabelScreen,
  PackingSlipScreen,
  TrackItemScreen,
  DropOffScreen,
} from '#screens/Sell';
import {Text, Platform} from 'react-native';
import RightArrowButton from './components/right-arrow';
import RightButton from './components/right-button';
import {ChatScreen} from '#screens/Chat';
import AppTabNavigator from './AppTabNavigator.js';
import {Utilities} from '#styles';
import {MainScreen as NotificationScreen} from '#screens/Notification';
import {AddAddressScreen, MarkAsSold, MeetupScreen} from '#screens/Buy';
import {
  MainScreen as IdeaMainScreen,
  AlbumDetailScreen,
  CreateAlbumIdeasScreen,
  MoveListingScreen,
} from '#screens/Ideas';
import ViewOrderDetails from '#screens/Sell/ViewOrderDetails';
import CloseButton from './components/close-button';
import EditButton from './components/edit-button';
import ContactUsScreen from '#screens/Profile/ContactUs/MainScreen';
import {Colors} from '#themes';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

const Stack = createNativeStackNavigator();
const AppContainer = () => {
  return (
    <Stack.Navigator
      initialRouteName="AuthLoading"
      screenOptions={{
        // ...TransitionPresets.SlideFromRightIOS,
        animation: 'slide_from_right',
        headerShown: false,
        ...Utilities.style.headerStyle,
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
      <Stack.Screen name="App" component={MainScreen} />
      <Stack.Screen name="Intro" component={IntroScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="MainAuth" component={MainAuthScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="Verification" component={VerificationScreen} />
      <Stack.Screen
        name="VerificationPhone"
        component={VerificationPhoneScreen}
      />
      <Stack.Screen
        name="TermsAndConditionScreen"
        component={TermsAndConditionScreen}
        options={{
          headerShown: true,
          title: 'Terms of Use',
        }}
      />
      <Stack.Screen
        name="HelpFeedback"
        component={HelpFeedback}
        options={{
          title: 'Help and Feedback',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="SendFeedback"
        component={SendFeedback}
        options={{
          title: 'Send Feedback',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="HelpBuying"
        component={HelpBuying}
        options={{
          title: 'Help Buying',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="FeedbackConfirmation"
        component={FeedbackConfirmation}
        options={{
          title: 'Feedback Confirmation',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Privacy"
        component={PrivacyScreen}
        options={{
          headerShown: true,
          title: 'Privacy Policy',
        }}
      />
      <Stack.Screen
        name="ForgotVerification"
        component={ForgotVerificationScreen}
      />
      <Stack.Screen name="AppAuth" component={AppTabNavigator} />

      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="SupplierProfile" component={SupplierProfileScreen} />
      <Stack.Screen name="SupplierCatalog" component={SupplierCatalogScreen} />
      <Stack.Screen name="ProductReviews" component={ProductReviewsScreen} />
      <Stack.Screen
        name="ProductPicturesFull"
        component={ProductPicturesFullScreen}
      />
      <Stack.Screen
        name="AddProductReview"
        component={AddProductReviewScreen}
      />
      <Stack.Screen
        name="LeaveProductReview"
        component={LeaveProductReviewScreen}
      />
      <Stack.Screen
        name="LocationMap"
        component={LocationMapScreen}
        options={{
          headerShown: true,
          title: 'Location',
        }}
      />
      <Stack.Screen
        name="Filter"
        component={FilterScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Filter',
          headerLeft: () => (
            <RightArrowButton onPress={() => navigation.goBack()} />
          ),
          headerRight: () => (
            <RightButton
              label="Reset"
              onPress={() => {
                route.params.handleResetClick();
              }}
            />
          ),
        })}
      />
      <Stack.Screen
        name="FilterSearchLocation"
        component={FilterSearchLocationScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Edit Location',
          headerLeft: () => (
            <RightArrowButton onPress={() => navigation.goBack()} />
          ),
        })}
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PaymentConfirmationScreen"
        component={PaymentConfirmationScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Confirmation',
          headerLeft: () => (
            <RightArrowButton onPress={() => navigation.goBack()} />
          ),
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
          headerRight: () => <Text />,
        })}
      />
      <Stack.Screen
        name="ShippingInfo"
        component={ShippingInfoScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Shipping Info',
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
          headerRight: () => <Text />,
          headerLeft: () => (
            <RightArrowButton onPress={() => navigation.goBack()} />
          ),
        })}
      />
      <Stack.Screen
        name="AddAddress"
        component={AddAddressScreen}
        options={({navigation, route}) => {
          const editable = route.params?.editable ?? false;
          return {
            headerShown: true,
            title: editable ? 'Edit an address' : 'Add an address',
            headerTitleStyle: {
              textAlign: 'center',
              color: '#000000',
              fontFamily: 'Montserrat-SemiBold',
              fontSize: 16,
            },
          };
        }}
      />
      <Stack.Screen
        name="AddFilter"
        component={AddFilterScreen}
        options={{
          headerShown: true,
          title: 'Add Filter',
        }}
      />
      <Stack.Screen
        name="BuyNowScreen"
        component={OfferBuyScreen}
        options={{
          headerShown: true,
          title: 'Buy Now',
        }}
      />
      <Stack.Screen
        name="DeliverySelector"
        component={DeliverySelectorScreen}
        options={{
          headerShown: true,
          title: 'Delivery Method',
        }}
      />
      <Stack.Screen
        name="MakeOfferScreen"
        component={OfferBuyScreen}
        options={({navigation, route}) => {
          const title = route.params?.title ?? 'Make Offer';
          return {
            headerShown: true,
            title,
            headerRight: () => <Text />,
            headerTitleStyle: {
              textAlign: 'center',
              color: '#000000',
              fontFamily: 'Montserrat-SemiBold',
              fontSize: 16,
            },
          };
        }}
      />
      <Stack.Screen
        name="PaymentScreen"
        component={PaymentScreen}
        options={({navigation, route}) => {
          return {
            headerShown: true,
            title: 'Payment Method',
            headerTitleStyle: {
              textAlign: 'center',
              color: '#000000',
              fontFamily: 'Montserrat-SemiBold',
              fontSize: 16,
            },
            headerLeft: () => (
              <RightArrowButton onPress={() => navigation.goBack()} />
            ),
            headerRight: () => <Text />,
          };
        }}
      />
      <Stack.Screen
        name="PaymentCreateScreen"
        component={PaymentCardScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Add Payment Method',
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
          headerRight: () => <Text />,
          headerLeft: () => (
            <RightArrowButton onPress={() => navigation.goBack()} />
          ),
        })}
      />
      <Stack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={{
          headerShown: true,
          title: 'Notifications',
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
          headerRight: () => <Text />,
        }}
      />
      <Stack.Screen
        name="Review"
        component={ReviewScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: route.params?.name ?? '',
        })}
      />
      <Stack.Screen
        name="FollowerDetail"
        component={FollowerDetailScreen}
        options={{
          headerShown: true,
          title: '',
        }}
      />
      <Stack.Screen
        name="Followers"
        component={FollowersScreen}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Following"
        component={FollowingScreen}
        options={{
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="OrderStatus"
        component={OrderStatusScreen}
        options={{
          headerShown: true,
          title: 'Order Status',
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
        }}
      />
      <Stack.Screen
        name="OrderStatusReturn"
        component={OrderStatusScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Order Detail',
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
          headerRight: () => (
            <CloseButton
              navigation={navigation}
              onPress={() => navigation.goBack()}
            />
          ),
          headerLeft: () => <Text />,
        })}
      />
      <Stack.Screen
        name="Return"
        component={ReturnScreen}
        options={{
          headerShown: true,
          title: 'Return Item',
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
          headerRight: () => <Text />,
        }}
      />
      <Stack.Screen
        name="ReturnPhotos"
        component={ReturnPhotos}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Claim"
        component={ClaimScreen}
        options={{
          headerShown: true,
          title: 'File Claim',
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
          headerRight: () => <Text />,
        }}
      />
      <Stack.Screen
        name="ClaimPhotos"
        component={ClaimPhotos}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Receipt"
        component={ReceiptScreen}
        options={{
          headerShown: true,
          title: 'Receipt',
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
          headerRight: () => <Text />,
        }}
      />
      <Stack.Screen
        name="ReportScreen"
        component={ReportScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: route.params?.type || '',
          headerRight: () => (
            <CloseButton
              navigation={navigation}
              onPress={() => navigation.goBack()}
            />
          ),
          headerLeft: () => <Text />,
        })}
      />
      <Stack.Screen
        name="CancelExchange"
        component={CancelExchangeScreen}
        options={({navigation, route}) => {
          const title = route.params?.title ?? 'Cancel Exchange';
          return {
            headerShown: true,
            title,
            headerRight: () => <Text />,
            headerTitleStyle: {
              textAlign: 'center',
              color: '#000000',
              fontFamily: 'Montserrat-SemiBold',
              fontSize: 16,
            },
          };
        }}
      />
      <Stack.Screen
        name="ReviewDetail"
        component={ReviewDetailScreen}
        options={{
          headerShown: true,
          title: "Review's",
        }}
      />

      <Stack.Screen
        name="IdeasMain2"
        component={IdeaMainScreen}
        options={({navigation, route}) => {
          const name = route?.params?.name ?? null;
          return {
            headerShown: true,
            title: name || 'My ideas Board',
          };
        }}
      />
      <Stack.Screen
        name="AlbumDetail2"
        component={AlbumDetailScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: route.params?.name || '',
        })}
      />
      <Stack.Screen
        name="ReturnAccept"
        component={ReturnAcceptScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Return Label',
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
          headerLeft: () => (
            <RightArrowButton onPress={() => navigation.goBack()} />
          ),
          headerRight: () => (
            <CloseButton onPress={() => route?.params?.handleCloseAction()} />
          ),
        })}
      />
      <Stack.Screen
        name="ReturnRefund"
        component={ReturnRefundScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Issue Refund',
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
          headerLeft: () => <Text />,
          headerRight: () => (
            <CloseButton onPress={() => navigation.goBack()} />
          ),
        })}
      />
      <Stack.Screen
        name="ReturnDecline"
        component={ReturnDeclineScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Decline Return',
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
          headerRight: () => (
            <CloseButton onPress={() => navigation.goBack()} />
          ),
        })}
      />
      <Stack.Screen
        name="ReturnOption"
        component={ReturnOptionsScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Return Options',
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
          headerRight: () => (
            <CloseButton onPress={() => route?.params?.handleCloseAction()} />
          ),
        })}
      />
      <Stack.Screen
        name="SellerReturnRequest"
        component={ReturnRequestScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Return Request',
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
          headerLeft: () => <Text />,
          headerRight: () => (
            <CloseButton onPress={() => navigation.goBack()} />
          ),
        })}
      />
      <Stack.Screen
        name="EditLabel"
        component={EditLabelScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Edit Label',
          headerRight: () => (
            <CloseButton
              navigation={navigation}
              onPress={() => navigation.goBack()}
            />
          ),
          headerLeft: () => <Text />,
        })}
      />
      <Stack.Screen
        name="SelectCarrier"
        component={SelectCarrierScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Select Carrier',
          headerRight: () => (
            <CloseButton onPress={() => navigation.goBack()} />
          ),
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
        })}
      />
      <Stack.Screen
        name="ReturnInstruction"
        component={ReturnInstructionScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Return Instructions',
          headerRight: () => (
            <CloseButton onPress={() => route?.params?.handleCloseAction()} />
          ),
        })}
      />
      <Stack.Screen
        name="AddressForm"
        component={AddressFormScreen}
        options={({navigation, route}) => {
          const editable = route?.params?.editable ?? false;
          return {
            headerShown: true,
            title: editable ? 'Edit Address' : 'Add an Address',
            headerTitleStyle: {
              textAlign: 'center',
              color: '#000000',
              fontFamily: 'Montserrat-SemiBold',
              fontSize: 16,
            },
            headerLeft: () => <Text />,
            headerRight: () => (
              <CloseButton onPress={() => navigation.goBack()} />
            ),
          };
        }}
      />
      <Stack.Screen
        name="ReturnConfirmation"
        component={ReturnConfirmationScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Confirmation',
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
          headerRight: () => (
            <CloseButton onPress={() => route?.params?.handleCloseAction()} />
          ),
        })}
      />
      <Stack.Screen
        name="PartailRefundAmount"
        component={PartailRefundAmoundScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Issue Refund',
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
          headerRight: () => (
            <CloseButton
              onPress={() => {
                navigation.goBack();
              }}
            />
          ),
          headerLeft: () => <Text />,
        })}
      />
      <Stack.Screen
        name="AlbumDetail"
        component={AlbumDetailScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: route?.params?.name || '',
          headerRight: () =>
            route.params?.tab !== 'related' ? (
              <EditButton
                navigation={navigation}
                to="CreateAlbumIdeas"
                params={{
                  ideasAlbumId: route?.params?.ideasAlbumId,
                  type: 'edit',
                }}
              />
            ) : null,
        })}
      />
      <Stack.Screen
        name="CreateAlbumIdeas"
        component={CreateAlbumIdeasScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: route.params?.type === 'create' ? 'New Album' : 'Edit Album',
        })}
      />
      <Stack.Screen
        name="MoveListing"
        component={MoveListingScreen}
        options={{
          headerShown: true,
          title: 'Move Listing',
        }}
      />
      <Stack.Screen name="SellPhotos" component={PhotosScreen} />
      <Stack.Screen
        name="PhotoFullScreen"
        component={PhotoFullScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SellCategory"
        component={CategoryScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Category',
          headerRight: () => (
            <CloseButton onPress={() => route?.params?.handleCloseClick()} />
          ),
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
        })}
      />
      <Stack.Screen
        name="PostDetails"
        component={PostDetailsScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Post Details',
          headerLeft: () => <Text />,
          headerRight: () => (
            <CloseButton
              onPress={() => route?.params?.handleClosePostDetailsClick()}
            />
          ),
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
        })}
      />
      <Stack.Screen
        name="SellPrice"
        component={PriceScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Price',
          headerRight: () => (
            <CloseButton
              onPress={() => route?.params?.handleClosePriceClick()}
            />
          ),
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
        })}
      />
      <Stack.Screen
        name="VehicleDetails"
        component={VehicleDetailsScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Vehicle Details',
          headerRight: () => (
            <CloseButton
              onPress={() => route?.params?.handleVehicleCloseClick()}
            />
          ),
        })}
      />
      <Stack.Screen
        name="DeliveryMethod"
        component={DeliveryMethodsScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Delivery Method',
          headerRight: () => (
            <CloseButton
              onPress={() => route?.params?.handleCloseDeliveryClick()}
            />
          ),
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
        })}
      />
      <Stack.Screen
        name="PostPreview"
        component={PreviewScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Post Preview',
          headerRight: () => (
            <CloseButton
              onPress={() => route?.params?.handleClosePreviewClick()}
            />
          ),
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
        })}
      />
      <Stack.Screen
        name="PostEditor"
        component={EditorScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Edit Post',
          headerRight: () => (
            <CloseButton
              onPress={() => route?.params?.handleCloseEditorClick()}
            />
          ),
        })}
      />
      <Stack.Screen
        name="Drafts"
        component={DraftsScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'My Drafts',
          headerLeft: () => <Text />,
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: '500',
            fontFamily: 'Montserrat',
            fontStyle: 'normal',
            color: Colors.black,
          },
          headerRight: () => (
            <CloseButton
              onPress={() => route?.params?.handleCloseDraftsClick()}
            />
          ),
        })}
      />
      <Stack.Screen
        name="Supplier"
        component={SupplierScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Become a Supplier',
          headerLeft: () => <Text />,
          headerTitleStyle: {
            marginLeft: Platform.OS === 'ios' ? 0 : 50,
            textAlign: 'center',
            fontWeight: '600',
            fontFamily: 'Montserrat',
            fontStyle: 'normal',
            color: '#313334',
          },
          headerRight: () => (
            <CloseButton
              onPress={() => {
                if (route?.params?.from) {
                  navigation.navigate(route?.params?.from);
                } else {
                  navigation.navigate('SellMain');
                }
              }}
            />
          ),
        })}
      />

      <Stack.Screen
        name="SupplierPerks"
        component={SupplierPerkScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Become a Supplier',
          headerTitleStyle: {
            marginLeft: Platform.OS === 'ios' ? 0 : 50,
            textAlign: 'center',
            fontWeight: '600',
            fontFamily: 'Montserrat',
            fontStyle: 'normal',
            color: '#313334',
          },
          headerLeft: () => <Text />,
          headerRight: () => (
            <CloseButton
              onPress={() => {
                navigation.goBack();
              }}
            />
          ),
        })}
      />
      <Stack.Screen
        name="SupplierSet"
        component={SupplierSetScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Become a Supplier',
          headerTitleStyle: {
            marginLeft: Platform.OS === 'ios' ? 0 : 50,
            textAlign: 'center',
            fontWeight: '600',
            fontSize: 18,
            fontFamily: 'Montserrat',
            fontStyle: 'normal',
            color: '#313334',
          },
          headerLeft: () => <Text />,
          headerRight: () => (
            <CloseButton
              onPress={async () => {
                if (navigation.canGoBack()) {
                  navigation.navigate('ProfileMain');
                } else {
                  navigation.navigate('SellMain');
                }
              }}
            />
          ),
        })}
      />
      <Stack.Screen
        name="PostDetails_PostTitle"
        component={PostDetails_PostTitleScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Post Details',
          headerLeft: () => <Text />,
          headerRight: () => (
            <CloseButton onPress={() => navigation.goBack()} />
          ),
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
        })}
      />
      <Stack.Screen
        name="PostDetails_PostDescription"
        component={PostDetails_PostDescriptionScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Post Details',
          headerLeft: () => <Text />,
          headerRight: () => (
            <CloseButton onPress={() => navigation.goBack()} />
          ),
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
        })}
      />
      <Stack.Screen
        name="PostDetails_PostLocation"
        component={PostDetails_PostLocationScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Location',
          headerLeft: () => <Text />,
          headerRight: () => (
            <CloseButton onPress={() => navigation.goBack()} />
          ),
        })}
      />
      <Stack.Screen
        name="VehicleDetails_MainDetailsToAdd"
        component={VehicleDetails_MainDetailsToAddScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Vehicle Details',
          headerLeft: () => <Text />,
          headerRight: () => (
            <CloseButton onPress={() => navigation.goBack()} />
          ),
        })}
      />
      <Stack.Screen
        name="VehicleDetails_AdditionalDetailsToAdd"
        component={VehicleDetails_AdditionalDetailsToAddScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Additional Details',
          headerLeft: () => <Text />,
          headerRight: () => (
            <CloseButton onPress={() => navigation.goBack()} />
          ),
        })}
      />
      <Stack.Screen
        name="Meetup"
        component={MeetupScreen}
        options={{
          title: 'Meetup',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="OrderReceipt"
        component={OrderReceiptScreen}
        options={{
          headerShown: true,
          title: 'Receipt',
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
          headerRight: () => <Text />,
        }}
      />
      <Stack.Screen
        name="ClaimOptionScreen"
        component={ClaimOptionScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Claim Request',
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
          headerLeft: () => <Text />,
          headerRight: () => (
            <CloseButton onPress={() => navigation.goBack()} />
          ),
        })}
      />
      <Stack.Screen
        name="ClaimDisputeScreen"
        component={ClaimDisputeScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Claim Request',
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
          headerLeft: () => <Text />,
          headerRight: () => (
            <CloseButton onPress={() => navigation.goBack()} />
          ),
        })}
      />
      <Stack.Screen
        name="PackingTips"
        component={PackingTipsScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Packing Tips',
          headerLeft: () => <Text />,
          headerRight: () => (
            <CloseButton onPress={() => route?.params?.handleCloseAction()} />
          ),
        })}
      />
      <Stack.Screen
        name="LabelGenerator"
        component={LabelGeneratorScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Shipping Info',
          headerRight: () => <Text />,
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
        })}
      />
      <Stack.Screen
        name="ShippingLabel"
        component={ShippingLabelScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Sipping Label',
          headerRight: () => (
            <CloseButton onPress={() => route?.params?.handleCloseAction()} />
          ),
        })}
      />
      <Stack.Screen
        name="ShipIndLabel"
        component={ShipIndLabelScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Sipping Label',
          headerRight: () => (
            <CloseButton onPress={() => route?.params?.handleCloseAction()} />
          ),
        })}
      />
      <Stack.Screen
        name="PackingSlip"
        component={PackingSlipScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Packing Slip',
          headerRight: () => (
            <CloseButton onPress={() => route?.params?.handleCloseAction()} />
          ),
        })}
      />
      <Stack.Screen
        name="TrackItem"
        component={TrackItemScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: route?.params?.title,
        })}
      />
      <Stack.Screen
        name="DropOff"
        component={DropOffScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Drop Off Instructions',
          headerRight: () => (
            <CloseButton onPress={() => route?.params?.handleCloseAction()} />
          ),
        })}
      />
      <Stack.Screen
        name="ViewOrderDetails"
        component={ViewOrderDetails}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Order Detail',
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
          headerRight: () => (
            <CloseButton onPress={() => navigation.goBack()} />
          ),
          headerLeft: () => <Text />,
        })}
      />

      <Stack.Screen
        name="AccountSetting"
        component={AccountSettingScreen}
        options={{
          title: 'Account Settings',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="NotificationSettings"
        component={NotificationSettingsScreen}
        options={{
          title: 'Notification Settings',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="PasswordSetting"
        component={PasswordSettingScreen}
        options={{
          title: 'Change Password',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={({navigation, route}) => ({
          headerLeft: () => (
            <RightArrowButton
              onPress={() => {
                if (route?.params?.isSellTab) {
                  navigation.navigate('ProfileMain');
                } else {
                  navigation.goBack();
                }
              }}
            />
          ),
          headerShown: true,
          title: 'Dashboard',
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
        })}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          title: 'Edit Profile',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="EditProfileSettings"
        component={EditProfileSettingsScreen}
        options={{
          title: 'Profile Settings',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="EditPersonalInfo"
        component={EditPersonalInfoScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Personal Information',
          headerLeft: () => (
            <RightArrowButton onPress={() => navigation.goBack()} />
          ),
        })}
      />
      <Stack.Screen
        name="PersonalInfoEmailVerification"
        component={PersonalInfoEmailVerificationScreen}
        options={{
          title: 'Email Verification',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="PersonalInfoEmailVerifyCode"
        component={PersonalInfoEmailVerifyCodeScreen}
        options={{
          title: 'Email Verification',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="PersonalInfoPhoneVerification"
        component={PersonalInfoPhoneVerificationScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Phone Verification',
          headerLeft: () => (
            <RightArrowButton onPress={() => navigation.goBack()} />
          ),
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
          headerRight: () => <Text />,
        })}
      />
      <Stack.Screen
        name="PersonalInfoPhoneVerifyCode"
        component={PersonalInfoPhoneVerifyCodeScreen}
        options={{
          headerShown: true,
          title: 'Phone Verification',
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
          headerRight: () => <Text />,
        }}
      />
      <Stack.Screen
        name="VerifyAccount"
        component={VerifyAccountScreen}
        options={{
          title: 'Verify Account',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="SocialMedia"
        component={SocialMediaScreen}
        options={{
          title: 'Social Media',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="IDVerification"
        component={IDVerificationScreen}
        options={{
          title: 'ID Verification',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="CodeVerification"
        component={CodeVerificationScreen}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="LeaveReview"
        component={LeaveReviewScreen}
        options={{
          title: 'Leave a Review',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="LeaveBuyerReview"
        component={LeaveBuyerReviewScreen}
        options={{
          title: 'Leave a Review',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="PaymentManagement"
        component={PaymentManagementScreen}
        options={{
          headerShown: true,
          title: 'Payment Management',
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
          headerRight: () => <Text />,
        }}
      />
      <Stack.Screen
        name="AddPayment"
        component={AddPaymentScreen}
        options={{
          headerShown: true,
          title: 'Add Payment Method',
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
          headerRight: () => <Text />,
        }}
      />
      <Stack.Screen
        name="PaymentCard"
        component={PaymentCardScreen}
        options={{
          headerShown: true,
          title: 'Add Credit/Debit Card',
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
          headerRight: () => <Text />,
        }}
      />
      <Stack.Screen
        name="PaymentBankTransfer"
        component={PaymentBankTransferScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ConfirmBankTransfer"
        component={ConfirmBankTransferScreen}
        options={{
          title: 'Bank Transfer',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="PayPalLogin"
        component={PayPalLoginScreen}
        options={{
          title: 'PayPal',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="ConfirmPayPal"
        component={ConfirmPayPalScreen}
        options={{
          title: 'PayPal',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="TransferOut"
        component={TransferOutScreen}
        options={{
          headerShown: true,
          title: 'Cash Out',
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
          headerRight: () => <Text />,
        }}
      />
      <Stack.Screen name="VerifyUserId" component={VerifyUserId} />
      <Stack.Screen
        name="TransactionHistory"
        component={TransactionHistory}
        options={{
          headerShown: true,
          headerTitle: 'Transactions',
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
          headerRight: () => <Text />,
        }}
      />
      <Stack.Screen
        name="InviteFriend"
        component={InviteFriend}
        options={{
          title: 'Invite a Friend',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{
          title: 'Privacy Policy',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="ContactUs"
        component={ContactUsScreen}
        options={{
          title: 'Contact Us',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="NewMessageContactUsScreen"
        component={NewMessageContactUsScreen}
        options={{
          title: 'New Message',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="NewMessageContactUsSecondScreen"
        component={NewMessageContactUsSecondScreen}
        options={{
          title: 'New Message',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="NewMessageConfirmationScreen"
        component={NewMessageConfirmationScreen}
        options={{
          headerShown: true,
          title: 'New Message',
          headerLeft: () => <Text />,
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
        }}
      />
      <Stack.Screen
        name="MyOrders"
        component={MyOrders}
        options={{
          title: 'My Orders',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="AboutUsScreen"
        component={AboutUsScreen}
        options={{
          title: 'About Us',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="MarkAsSold"
        component={MarkAsSold}
        options={{
          title: 'Mark as Sold',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="PostPreviewProfile"
        component={PreviewScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Post Preview',
          headerRight: () => (
            <CloseButton
              onPress={() => route?.params?.handleClosePreviewClick()}
            />
          ),
        })}
      />
      <Stack.Screen
        name="PostEditorProfile"
        component={EditorScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Edit Post',
          headerShown: true,
          headerRight: () => (
            <CloseButton
              onPress={() => route?.params?.handleCloseEditorClick()}
            />
          ),
        })}
      />
      <Stack.Screen
        name="SellPhotosProfile"
        component={PhotosScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PF_PostDetails_PostTitle"
        component={PostDetails_PostTitleScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Post Details',
          headerLeft: () => <Text />,
          headerRight: () => (
            <CloseButton onPress={() => navigation.goBack()} />
          ),
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
        })}
      />
      <Stack.Screen
        name="PF_PostDetails_PostDescription"
        component={PostDetails_PostDescriptionScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Post Details',
          headerLeft: () => <Text />,
          headerRight: () => (
            <CloseButton onPress={() => navigation.goBack()} />
          ),
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
        })}
      />
      <Stack.Screen
        name="PF_PostDetails_PostLocation"
        component={PostDetails_PostLocationScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Location',
          headerLeft: () => <Text />,
          headerRight: () => (
            <CloseButton onPress={() => navigation.goBack()} />
          ),
        })}
      />
      <Stack.Screen
        name="PF_VehicleDetails_MainDetailsToAdd"
        component={VehicleDetails_MainDetailsToAddScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Vehicle Details',
          headerLeft: () => <Text />,
          headerRight: () => (
            <CloseButton onPress={() => navigation.goBack()} />
          ),
        })}
      />
      <Stack.Screen
        name="PF_VehicleDetails_AdditionalDetailsToAdd"
        component={VehicleDetails_AdditionalDetailsToAddScreen}
        options={({navigation, route}) => ({
          headerShown: true,
          title: 'Additional Details',
          headerLeft: () => <Text />,
          headerRight: () => (
            <CloseButton onPress={() => navigation.goBack()} />
          ),
        })}
      />
      <Stack.Screen
        name="AddPaymentConfirm"
        component={AddPaymentConfirmScreen}
        options={{
          headerShown: true,
          title: 'Add Credit/Debit Card',
          headerStyle: {
            elevation: 0,
          },
          headerTitleStyle: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 16,
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default AppContainer;
