import moment from 'moment';

export const parseDeliveryMethods =  ({ postDetail, latLng }) => {
  const { DeliveryMethods, estimatedDateFrom, estimatedDateTo } = postDetail;

  const deliveryOptionsParsed = [];

  const shippingDeliveries = DeliveryMethods?.filter(
    delivery => delivery.code !== 'pickup',
  );
  if (shippingDeliveries?.length > 0) {
    // const { estimatedDateFrom, estimatedDateTo } = estimateTime || {};
    const threeDaysParsed = () =>
      estimatedDateFrom != undefined
        ? moment(estimatedDateFrom).format('MM/DD')
        : moment()
            .add(3, 'days')
            .format('MM/DD');
    const fiveDaysParsed = () =>
      estimatedDateTo != undefined
        ? moment(estimatedDateTo).format('MM/DD')
        : moment()
            .add(5, 'days')
            .format('MM/DD');

    const monthThredays = () =>
      estimatedDateFrom != undefined
        ? moment(estimatedDateFrom).format('MMM')
        : moment()
            .add(3, 'days')
            .format('MMM');

    const monthFiveDays = () =>
      estimatedDateTo != undefined
        ? moment(estimatedDateTo).format('MMM')
        : moment()
            .add(5, 'days')
            .format('MMM');

    const dayDateThredays = () =>
      estimatedDateFrom != undefined
        ? moment(estimatedDateFrom).format('DD')
        : moment()
            .add(3, 'days')
            .format('DD');

    const dayDateFiveDays = () =>
      estimatedDateTo != undefined
        ? moment(estimatedDateTo).format('DD')
        : moment()
            .add(5, 'days')
            .format('DD');

    let soldByFormat = '';

    if (monthThredays() === monthFiveDays()) {
      soldByFormat = `${monthThredays()} ${dayDateThredays()}-${dayDateFiveDays()}`;
    } else {
      soldByFormat = `${threeDaysParsed()}-${fiveDaysParsed()}`;
    }

    let free = false;
    let shipCost = '';

    shippingDeliveries?.every(option => {
      if (
        option?.DeliveryMethodPerPost?.customProperties &&
        option?.DeliveryMethodPerPost?.customProperties?.freeOption &&
        option?.DeliveryMethodPerPost?.customProperties?.freeOption?.valueSelected || 
        option?.DeliveryMethodPerPost?.customProperties &&
        option?.DeliveryMethodPerPost?.customProperties?.freeshipping
      ) {
        free = true;
        return false;
      }
      if (
        option?.DeliveryMethodPerPost?.customProperties &&
        option?.DeliveryMethodPerPost?.customProperties?.shippingCost
      ) {
        shipCost = `$${
          option?.DeliveryMethodPerPost?.customProperties?.shippingCost
            ? parseFloat(
                option?.DeliveryMethodPerPost?.customProperties?.shippingCost,
              ).toFixed(2)
            : '0.00'
        }`;
      } else {
        if (
          option?.DeliveryMethodPerPost?.customProperties &&
          option?.DeliveryMethodPerPost?.customProperties?.optionsAvailable
        ) {
          const seletedOption = option?.DeliveryMethodPerPost?.customProperties?.optionsAvailable?.find(
            item => item.selected === true,
          );
          const selectedProvider = seletedOption?.providers?.find(
            item => item.selected === true,
          );
          shipCost = `$${
            selectedProvider
              ? parseFloat(selectedProvider.cost).toFixed(2)
              : '0.00'
          }`;
        }
      }
      return true;
    });

    deliveryOptionsParsed?.push({
      icon: 'shipping',
      label: `SHIPPING (EST ${threeDaysParsed()} - ${fiveDaysParsed()})`,
      complementLabel: free ? 'FREE' : shipCost,
      supplierEstimatedDeliveryLabel: `${soldByFormat}`,
      supplierShippingLabel: free ? 'Free Shipping' : `+ ${shipCost} Shipping`,
    });
  }

  return deliveryOptionsParsed;
};

export const handleGotoChatScreen = ({
  navigation,
  sellerDetails,
  postDetail,
  isFromSupplierProfile,
}) => {
  const item = {};
  item.id = null;
  if (sellerDetails?.firstName) {
    item.title = `${sellerDetails?.firstName} ${sellerDetails?.lastName}`;
  }
  item.message = '';
  item.sellerId = postDetail?.userId
    ? postDetail?.userId
    : sellerDetails?.id
    ? sellerDetails?.id
    : sellerDetails?.userId;
  item.sellerFirstName = sellerDetails?.firstName;
  item.sellerLastName = sellerDetails?.lastName;
  item.urlImage = sellerDetails?.profilepictureurl;
  item.receiver = {};
  item.receiver.userId = sellerDetails?.id
    ? sellerDetails?.id
    : sellerDetails?.userId;
  item.receiver.firstName = sellerDetails?.firstName;
  item.receiver.lastName = sellerDetails?.lastName;
  item.receiver.pictureUrl = sellerDetails?.profilepictureurl;
  item.datetime = null;
  item.badgeCount = 0;
  item.post = {};
  item.post.id = postDetail?.id;
  item.post.title = postDetail?.Product?.title || postDetail?.productInfo?.title;
  item.post.urlImage =
    postDetail?.Product?.ProductImages?.[0]?.urlImage ||
    postDetail?.productInfo?.ProductImages?.[0]?.urlImage;

  navigation.navigate('ChatScreen', {
    item,
    conversationId: postDetail?.conversationId,
    screenDetails: postDetail,
    isFromSupplierProfile,
  });
};
