import React, { useState, useEffect } from "react";
import { View, Image } from "react-native";
import { getSupplierDataApi } from "#services/apiCatalog";
import { Heading, BodyText } from "../../../components";
import styles from "./styles";

const ProductDetail = ({ screenDetails, userProductDetail }) => {
  const [supplier, setSupplier] = useState({});

  useEffect(() => {
    const fetchUserInfo = async () => {
      const supplierInfoData = await getSupplierDataApi({
        userId: screenDetails?.userId,
      });

      if (supplierInfoData?.result?.success != false) {
        setSupplier(supplierInfoData);
      }
    };

    fetchUserInfo();
  }, [screenDetails.userId]);
  return (
    <View style={styles.topContainer}>
      <View style={styles.imgsContainer}>
        <View style={styles.imgContainer}>
          <Image
            style={styles.imgElement}
            source={{
              uri:
                screenDetails?.Product.ProductImages &&
                screenDetails?.Product.ProductImages[0]?.urlImage,
            }}
            resizeMode="cover"
          />
        </View>
      </View>
      <View style={styles.textsContainer}>
        <Heading type="h6" numberLines={1}>
          {screenDetails?.Product?.title}
        </Heading>
        <BodyText
          theme="medium"
          numberOfLines={1}
          style={[styles.titleTextProduct]}
        >
          {screenDetails?.customProperties?.origin == "suppliers"
            ? `${supplier?.storefront?.name ?? ""}`
            : screenDetails?.sellerName}
        </BodyText>
      </View>
    </View>
  );
};

export default ProductDetail;
