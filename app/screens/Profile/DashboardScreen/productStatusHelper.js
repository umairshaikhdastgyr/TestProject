const { ORDER_STATUS } = require("#utils/enums");

function capitalizeFirstLetter(str) {
  return str[0].toUpperCase() + str.slice(1);
}

export const productStatusHelper = (status, isSeller, item) => {
  switch (status) {
    case ORDER_STATUS.ACCEPTED:
      return isSeller ? "INACTIVE (SOLD OUT)" : "BUYING";
    case ORDER_STATUS.DELIVERED:
      return isSeller ? "DELIVERED" : "DELIVERED";
    case ORDER_STATUS.CREATED:
      return isSeller ? "INACTIVE (SOLD OUT)" : "BUYING";
    case ORDER_STATUS.AWAITING_SHIPPING:
      return isSeller ? "SHIP NOW" : "AWAITING SHIPPING";
    case ORDER_STATUS.RETURN_REQUESTED:
      return isSeller ? "RETURN REQUESTED" : "RETURN REQUESTED";
    case ORDER_STATUS.RETURN_CLOSED:
      return isSeller ? "RETURN CLOSED" : "RETURN CLOSED";
    case ORDER_STATUS.RETURN_DENIED:
      return isSeller ? "RETURN DENIED" : "RETURN DENIED";
    case ORDER_STATUS.RETURN_ACCEPTED:
      return isSeller ? "RETURN ACCEPTED" : "RETURN ACCEPTED";
    case ORDER_STATUS.RETURN_COMPLETED:
      return isSeller ? "RETURN COMPLETE" : "RETURN COMPLETE";
    case ORDER_STATUS.RETURN_SHIPPED:
      return isSeller ? "RETURN SHIPPED" : "RETURN SHIPPED";
    case ORDER_STATUS.CANCELLED:
      return isSeller ? "CANCELLED" : "CANCELLED";
    case ORDER_STATUS.CANCELLATION_REQUESTED:
      return isSeller ? "CANCELLATION REQUESTED" : "CANCELLATION REQUESTED";
    case "bought":
      return isSeller ? "SHIP NOW" : "BOUGHT";
    case "buying":
      if (isSeller) {
        if (item?.orderInfo?.cancelStatus === "cancelled") {
          return "CANCELLED";
        } else if (
          item?.orderInfo?.orderStatus === "pending" &&
          item?.orderInfo?.cancelStatus === null
        ) {
          return "PENDING";
        } else {
          return "INACTIVE (SOLD OUT)";
        }
      } else {
        if (
          item?.orderInfo?.orderStatus === "pending" &&
          item?.orderInfo?.cancelStatus === "cancelled"
        ) {
          return "PENDING (CANCELLED)";
        }
        return "PENDING";
      }
    case "draft":
      return isSeller ? "DRAFT" : "DRAFT";
    case "cancellation_cancelled":
      return isSeller ? "CANCELLED" : "CANCELLED";
    case "cancellation_denied":
      return isSeller ? "CANCELLATION DENIED" : "CANCELLATION DENIED";
    case "shipped":
      return isSeller ? "SHIPPED" : "SHIPPED";
    case "active":
      return isSeller ? "ACTIVE" : "";
    case "soldout":
      return isSeller ? "INACTIVE (SOLD OUT)" : "";
    case "refunded":
      return isSeller ? "REFUNDED" : "REFUNDED";
    case "homitag_funded_claim":
      return isSeller ? "HOMITAG FUNDED CLAIM" : "HOMITAG FUNDED CLAIM";
    case "seller_funded_claim":
      return isSeller ? "YOU FUNDED CLAIM" : "SELLER FUNDED CLAIM";
    case "claim_accepted":
      return isSeller ? "CLAIM GRANTED" : "CLAIM GRANTED";
    case "claim_denied":
      return isSeller ? "CLAIM DENIED" : "CLAIM DENIED";
    case "claim_disputed":
      return isSeller ? "CLAIM DISPUTED" : "CLAIM DISPUTED";
    case "claim_closed":
      return isSeller ? "CLAIM CLOSED" : "CLAIM CLOSED";
    case "claim_filed":
      return isSeller ? "CLAIM FILED" : "CLAIM FILED";
    case "inactive":
      return isSeller ? "INACTIVE" : "INACTIVE";
    case "deactivated":
      return isSeller ? "INACTIVE" : "INACTIVE";
    case "partial_refund":
      return isSeller ? "PARTIAL REFUND" : "PARTIAL REFUND";
    case "full_refund":
      return isSeller ? "FULLY REFUNDED" : "FULLY REFUNDED";
    case "buyer_funded_claim":
      return isSeller ? "BUYER FUNDED CLAIM" : "YOU FUNDED CLAIM";
    case "partial_shipped":
      return isSeller ? "PARTIALLY SHIPPED" : "PARTIALLY SHIPPED";
    case "return_cancelled":
      return isSeller ? "RETURN CANCELLED" : "RETURN CANCELLED";
    default:
      if (status.includes("PARTIAL")) {
        return status;
      }
      return capitalizeFirstLetter(status);
  }
};
