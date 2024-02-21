export const getLabelData = (labelData) => {
  const hasDataKey = labelData?.data;
  if (hasDataKey) {
    return {
      carrier:
        labelData?.data[0]?.carrier === ""
          ? labelData?.data[0]?.otherCarrier
          : labelData?.data[0]?.carrier,
      trackingId: labelData?.data[0]?.trackingId,
    };
  }
  return {
    carrier:
      (labelData[0]?.carrier === ""
        ? labelData[0]?.otherCarrier
        : labelData[0]?.carrier) || "-",
    trackingId: labelData[0]?.tracking || `- ${labelData[0]?.trackingId}`,
  };
};

export const getReturnLabelData = (labelData) => {
  const isReturnLabel = labelData?.filter((item) => item?.isReturnLabel);
  if (isReturnLabel?.length > 0) {
    return isReturnLabel;
  } else {
    const isReturnLabel = labelData?.filter(
      (item) => item?.isReturnLabel == null
    );
    return isReturnLabel;
  }
};
