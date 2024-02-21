import React from "react";

import RowItem from "./RowItem";
import { currencyFormatter } from "#utils";

export const renderSellerCalculations = (orderData) => {
  const isProductShipped = orderData?.shippedAt !== null;
  const isFreeShipping = orderData?.deliveryMethod?.freeOption || false;

  return (
    <>
      <RowItem
        leftLabel="Purchase Price"
        rightLabel={`${currencyFormatter.format(
          orderData?.calculationValues?.[
            isProductShipped ? "shippedInfo" : "unshippedInfo"
          ]?.purchasePrice
        )}`}
      />
      <RowItem
        leftLabel={
          !isFreeShipping ? "Buyer paid shipping" : "Seller paid shipping"
        }
        rightLabel={`${currencyFormatter.format(
          orderData?.calculationValues?.[
            isProductShipped ? "shippedInfo" : "unshippedInfo"
          ]?.shippingFee
        )}`}
      />
      {orderData?.cancelStatus !== "cancelled" ||
      orderData?.order_status !== "pending" ? (
        <RowItem
          leftLabel="Processing Fee"
          rightLabel={`${currencyFormatter.format(
            orderData?.calculationValues?.[
              isProductShipped ? "shippedInfo" : "unshippedInfo"
            ]?.processingFee
          )}`}
        />
      ) : null}
      {orderData?.calculationValues?.[
        isProductShipped ? "shippedInfo" : "unshippedInfo"
      ]?.salesTax &&
      (orderData?.cancelStatus !== "cancelled" ||
        orderData?.order_status !== "pending") ? (
        <RowItem
          leftLabel="Sales Tax"
          rightLabel={`${currencyFormatter.format(
            orderData?.calculationValues?.[
              isProductShipped ? "shippedInfo" : "unshippedInfo"
            ]?.salesTax
          )}`}
        />
      ) : null}
      {orderData?.cancelStatus !== "cancelled" ||
      orderData?.order_status !== "pending" ? (
        <RowItem
          leftLabel="Service Fee"
          rightLabel={`${currencyFormatter.format(
            orderData?.calculationValues?.[
              isProductShipped ? "shippedInfo" : "unshippedInfo"
            ]?.serviceFee
          )}`}
        />
      ) : null}
      {orderData?.calculationValues?.[
        isProductShipped ? "shippedInfo" : "unshippedInfo"
      ]?.totalRefunded &&
      (orderData?.cancelStatus !== "cancelled" ||
        orderData?.order_status !== "pending") ? (
        <RowItem
          leftLabel="Total refunded"
          txtType={"bold"}
          textColor={"red"}
          rightLabel={`-${currencyFormatter.format(
            orderData?.calculationValues?.[
              isProductShipped ? "shippedInfo" : "unshippedInfo"
            ]?.totalRefunded
          )}`}
        />
      ) : null}
      <RowItem
        txtType="bold"
        leftLabel="Total you earn"
        rightLabel={
          orderData?.cancelStatus !== "cancelled" ||
          orderData?.order_status !== "pending"
            ? `${currencyFormatter.format(
                orderData?.calculationValues?.[
                  isProductShipped ? "shippedInfo" : "unshippedInfo"
                ]?.totalEarned
              )}`
            : `${currencyFormatter.format(0.0)}`
        }
      />
    </>
  );
};

export const renderBuyerCalculations = (orderData) => {
  const isProductShipped = orderData?.shippedAt !== null;
  const OrderCancelled = orderData?.order_status == "cancelled";
  const totalPaidBuyer =
    orderData?.calculationValues?.[
      isProductShipped ? "shippedInfo" : "unshippedInfo"
    ]?.totalPaid;
  const totalRefundedBuyer =
    orderData?.calculationValues?.[
      isProductShipped ? "shippedInfo" : "unshippedInfo"
    ]?.totalRefunded;
  let showProcessingFee = false;
  if (totalRefundedBuyer != totalPaidBuyer && OrderCancelled) {
    showProcessingFee = true;
  }

  return (
    <>
      {orderData?.quantity > 1 ? (
        <RowItem
          leftLabel={`Item Price (${currencyFormatter.format(
            orderData?.calculationValues?.[
              isProductShipped ? "shippedInfo" : "unshippedInfo"
            ]?.itemPrice
          )} x ${orderData?.quantity} QTY)`}
          rightLabel={`${currencyFormatter.format(
            orderData?.calculationValues?.[
              isProductShipped ? "shippedInfo" : "unshippedInfo"
            ]?.itemPrice * orderData?.quantity
          )}`}
        />
      ) : (
        <RowItem
          leftLabel="Item Price"
          rightLabel={`${currencyFormatter.format(
            orderData?.calculationValues?.[
              isProductShipped ? "shippedInfo" : "unshippedInfo"
            ]?.itemPrice
          )}`}
        />
      )}
      <RowItem
        leftLabel="Shipping"
        rightLabel={`${
          orderData?.deliveryMethod?.freeOption
            ? "FREE"
            : currencyFormatter.format(
                orderData?.calculationValues?.[
                  isProductShipped ? "shippedInfo" : "unshippedInfo"
                ]?.shippingFee
              )
        }`}
      />
      {orderData?.calculationValues?.unshippedInfo?.salesTax &&
      (orderData?.cancelStatus !== "cancelled" ||
        orderData?.order_status !== "pending") ? (
        <RowItem
          leftLabel="Sales Tax"
          rightLabel={`${currencyFormatter.format(
            orderData?.calculationValues?.unshippedInfo?.salesTax
          )}`}
        />
      ) : orderData?.calculationValues?.unshippedInfo?.salesTax &&
        orderData?.cancelStatus === "cancelled" &&
        orderData?.order_status === "pending" ? (
        <RowItem
          leftLabel="Sales Tax"
          rightLabel={`${currencyFormatter.format(
            orderData?.calculationValues?.unshippedInfo?.salesTax
          )}`}
        />
      ) : orderData?.calculationValues.shippedInfo.salesTax &&
        (orderData?.cancelStatus !== "cancelled" ||
          orderData?.order_status !== "pending") ? (
        <RowItem
          leftLabel="Sales Tax"
          rightLabel={`${currencyFormatter.format(
            orderData?.calculationValues?.shippedInfo?.salesTax
          )}`}
        />
      ) : orderData?.calculationValues.shippedInfo.salesTax &&
        orderData?.cancelStatus === "cancelled" &&
        orderData?.order_status === "pending" ? (
        <RowItem
          leftLabel="Sales Tax"
          rightLabel={`${currencyFormatter.format(
            orderData?.calculationValues?.shippedInfo?.salesTax
          )}`}
        />
      ) : null}
      <RowItem
        leftLabel="Total you paid"
        txtType={"bold"}
        rightLabel={
          orderData?.cancelStatus !== "cancelled" ||
          orderData?.order_status !== "pending"
            ? `${currencyFormatter.format(
                orderData?.calculationValues?.[
                  isProductShipped ? "shippedInfo" : "unshippedInfo"
                ]?.totalPaid
              )}`
            : `${currencyFormatter.format(0.0)}`
        }
      />
      {showProcessingFee &&
      (orderData?.cancelStatus !== "cancelled" ||
        orderData?.order_status !== "pending") ? (
        <RowItem
          leftLabel="Processing Fee"
          rightLabel={`${currencyFormatter.format(
            orderData?.calculationValues?.[
              isProductShipped ? "shippedInfo" : "unshippedInfo"
            ]?.processingFee
          )}`}
        />
      ) : null}
      {orderData?.calculationValues?.[
        isProductShipped ? "shippedInfo" : "unshippedInfo"
      ]?.totalRefunded &&
      (orderData?.cancelStatus !== "cancelled" ||
        orderData?.order_status !== "pending") ? (
        <RowItem
          leftLabel="Total refunded"
          txtType={"bold"}
          textColor={"red"}
          rightLabel={`${currencyFormatter.format(
            orderData?.calculationValues?.[
              isProductShipped ? "shippedInfo" : "unshippedInfo"
            ]?.totalRefunded
          )}`}
        />
      ) : null}
    </>
  );
};
