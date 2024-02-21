import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import PriceElement from '../../../PriceScreen/price-element';
const PriceTab = ({
  formData,
  errTotalPriceErr,
  setErrTotalPriceErr,
  setPackageProperties,
  setPackagePropertiesError,
}) => {
  const [resetWarningText, setResetWarningText] = useState('');

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <PriceElement
        resetWarningText={resetWarningText}
        setResetWarningText={setResetWarningText}
        formData={formData}
        errTotalPriceErr={errTotalPriceErr}
        setErrTotalPriceErr={setErrTotalPriceErr}
        setPackageProperties={setPackageProperties}
        setPackagePropertiesError={setPackagePropertiesError}
      />
    </ScrollView>
  );
};

export default PriceTab;
