import React from "react";
import { Colors } from "#themes";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

export const BuyNowLoader = () => {
  return (
    <SkeletonPlaceholder
      backgroundColor={Colors.inactiveShape}
      highlightColor={Colors.switchBackgoundInactive}
      borderRadius={4}
      speed={2000}
    >
      <SkeletonPlaceholder.Item
        flexDirection="row"
        alignItems="center"
        alignSelf="center"
        paddingVertical={18}
      >
        <SkeletonPlaceholder.Item
          paddingVertical={16}
          width={"90%"}
          height={50}
          borderRadius={8}
        />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export const QuantityLoader = () => {
  return (
    <SkeletonPlaceholder
      backgroundColor={Colors.background}
      highlightColor={Colors.switchBackgoundInactive}
      speed={2000}
      borderRadius={8}
    >
      <SkeletonPlaceholder.Item
        flexDirection="row"
        alignItems="center"
        alignSelf="flex-end"
        borderWidth={3}
        borderColor={Colors.switchBackgoundInactive}
      >
        <SkeletonPlaceholder.Item width={"45%"} height={30} />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export const DashBoardLoader = () => {
  return (
    <>
      <ProductLoader width={"50%"} />
      <ProductLoader width={"50%"} />
    </>
  );
};

export const SimilarAndNearByProductLoader = () => {
  return (
    <>
      <ProductLoader width={"45%"} />
      <ProductLoader width={"45%"} />
    </>
  );
};

export const ExplorePageLoader = () => {
  return (
    <>
      <ProductLoader
        width={"45%"}
        backgroundColor={Colors.switchBackgoundInactive}
        highlightColor={Colors.background}
        height={180}
      />
      <ProductLoader
        width={"45%"}
        backgroundColor={Colors.switchBackgoundInactive}
        highlightColor={Colors.background}
        height={180}
      />
      <ProductLoader
        width={"45%"}
        backgroundColor={Colors.switchBackgoundInactive}
        highlightColor={Colors.background}
        height={180}
      />
      <ProductLoader
        width={"45%"}
        backgroundColor={Colors.switchBackgoundInactive}
        highlightColor={Colors.background}
        height={180}
      />
    </>
  );
};

const ProductLoader = ({
  width,
  backgroundColor = Colors.background,
  highlightColor = Colors.switchBackgoundInactive,
  height = 150,
}) => {
  return (
    <SkeletonPlaceholder
      backgroundColor={backgroundColor}
      highlightColor={highlightColor}
      speed={2000}
      borderRadius={8}
    >
      <SkeletonPlaceholder.Item
        flexDirection="row"
        alignItems="center"
        alignSelf="center"
      >
        <SkeletonPlaceholder.Item
          width={width}
          height={height}
          marginRight={6}
          marginBottom={10}
        />
        <SkeletonPlaceholder.Item
          width={width}
          height={height}
          marginBottom={10}
        />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export const SoldAndPostedLoader = () => {
  return (
    <SkeletonPlaceholder
      backgroundColor={Colors.background}
      highlightColor={Colors.switchBackgoundInactive}
      speed={2000}
      borderRadius={8}
    >
      <SkeletonPlaceholder.Item
        flexDirection="row"
        alignItems="center"
        alignSelf="center"
      >
        <SkeletonPlaceholder.Item width={"95%"} height={100} />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};
