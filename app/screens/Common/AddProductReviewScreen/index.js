import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
  Platform,
  Text,
} from 'react-native';
import Header from './components/header';
import Footer from './components/footer';
import { paddings, flex, margins } from '#styles/utilities';
import { useDispatch, useSelector } from 'react-redux';
import {
  addProductReview,
  clearAddProductReview,
} from '#modules/ProductReview/actions';
import StarRating from 'react-native-star-rating';
import { Label, SweetAlert, InputText } from '#components';
import { Fonts } from '#themes';
import { selectUserData } from '#modules/User/selectors';
import { selectReviewsData } from '#modules/ProductReview/selectors';

const initialAlert = {
  title: '',
  message: '',
  type: '',
  visible: false,
};

const { height, width } = Dimensions.get('window');

const AddProductReviewScreen = ({ navigation, route }) => {
  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewResultAlert, setReviewResultAlert] = useState(initialAlert);

  const dispatch = useDispatch();
  const productId = route?.params?.productId;

  const { information: userInfo } = useSelector(selectUserData());
  const { addProductReviewResult } = useSelector(selectReviewsData());

  const handleAddReview = () => {
    dispatch(
      addProductReview(
        productId,
        userInfo.id,
        rating,
        reviewTitle,
        reviewComment,
      ),
    );
  };

  const handleGoBack = () => {
    dispatch(clearAddProductReview());
    navigation.goBack();
  };

  useEffect(() => {
    if (addProductReviewResult.failure) {
      setReviewResultAlert({
        title: 'Add Review Unsuccessful',
        message: addProductReviewResult.failure.content.message,
        type: 'error',
        visible: true,
      });
    }
    if (addProductReviewResult.data) {
      setReviewResultAlert({
        title: 'Add Review Successful',
        message: '',
        type: 'success',
        visible: true,
      });
    }
  }, [addProductReviewResult]);

  const handleAlertTouch = () => {
    setReviewResultAlert(initialAlert);
    if (reviewResultAlert.type === 'success') {
      handleGoBack();
    }
  };

  return (
    <View style={[flex.justifyContentSpace, flex.grow1]}>
      <Header handleGoBack={handleGoBack} />

      <ScrollView style={[paddings['p-4'], flex.grow1]}>
        <KeyboardAvoidingView
          style={{ flex: 1, minHeight: height - 150 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={[paddings['p-5'], styles.ratingContainer]}>
            <Label bold size="medium" style={styles.title}>
              Tap to Rate
            </Label>
            <StarRating
              starSize={28}
              emptyStar="star"
              emptyStarColor="#DADADA"
              rating={rating}
              fullStarColor="#00BDAA"
              selectedStar={starValue => setRating(starValue)}
              containerStyle={[styles.ratingTapContainer]}
            />
          </View>

          <InputText
            fullWidth
            placeholder="Add title here"
            multiline
            numberOfLines={2}
            maxLength={40}
            onChangeText={text => setReviewTitle(text)}
            value={reviewTitle}
          />
          <View
            style={[flex.directionRow, flex.justifyContentEnd, paddings['p-2']]}
          >
            <Label>{`${reviewTitle.length}/40`}</Label>
          </View>

          <InputText
            fullWidth
            placeholder="Add a comment here"
            multiline
            maxLength={1500}
            numberOfLines={12}
            onChangeText={text => setReviewComment(text)}
            value={reviewComment}
            textAlign="center"
            multilineTextVerticalAlign="center"
          />
          <View
            style={[flex.directionRow, flex.justifyContentEnd, paddings['p-2']]}
          >
            <Label>{`${reviewComment.length}/1500`}</Label>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
      <Footer
        handleSubmit={handleAddReview}
        isFetching={addProductReviewResult.isFetching}
      />
      <SweetAlert
        title={reviewResultAlert.title}
        message={reviewResultAlert.message}
        type={reviewResultAlert.type}
        dialogVisible={reviewResultAlert.visible}
        onTouchOutside={handleAlertTouch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  ratingContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 1,
    ...margins['mb-3'],
  },
  ratingTapContainer: {},
  label: {
    textAlign: 'center',
  },
  title: {
    fontSize: 15,
    textAlign: 'center',
    ...margins['mb-3'],
  },
  inputTextContainer: {
    borderBottomWidth: 1,
    borderColor: '#DADADA',
    alignItems: 'center',
    ...margins['mb-3'],
  },
  inputText: {
    fontFamily: Fonts.family.regular,
    fontSize: Fonts.size.medium,
    color: '#969696',
    borderBottomWidth: 1,
    borderColor: '#DADADA',
    textAlign: 'center',
  },
  comment: {
    textAlignVertical: 'center',
    justifyContent: 'center',
  },
});

export default AddProductReviewScreen;
