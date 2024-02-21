import React from "react";
import { USER_TYPES } from "#utils/enums";
import SellerOrderCreated from "../OrderStatusScreen/components/SellerComponents/OrderCreated";
import BuyerOrderAccepted from "../OrderStatusScreen/components/BuyerComponents/OrderAccepted";

const ViewOrderDetails = ({ navigation, route }) => {
  const type = route?.params?.type;
  const orderData = route?.params?.orderData;
  const onViewReceipt = route?.params?.onViewReceipt;
  const storeName = route?.params?.storeName;

  const isUserSeller = type === USER_TYPES.SELLER;

  if (isUserSeller) {
    return (
      <SellerOrderCreated
        onViewReceipt={onViewReceipt}
        orderData={orderData}
        isViewOrderDetails
        storeName={storeName}
      />
    );
  }
  return (
    <BuyerOrderAccepted
      onViewReceipt={onViewReceipt}
      orderData={orderData}
      isViewOrderDetails
      storeName={storeName}
    />
  );
};

export default ViewOrderDetails;
