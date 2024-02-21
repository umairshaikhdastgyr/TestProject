import React from 'react';

import { StyleSheet, View } from 'react-native';
import { Button } from '#components';
import { paddings } from '#styles/utilities';

const Footer = ({
  handleSubmitForm,
  formType,
  formValues,
  details,
  handleDeleteForm,
}) => {
  let disabled = (formValues?.name?.length ?? 0) === 0;

  if (formType === 'edit') {
    if (
      details?.name === formValues.name &&
      details?.description === formValues.description
    ) {
      disabled = true;
    }
  }

  return (
    <View style={styles.container}>
      <Button
        label={formType === 'create' ? 'Create' : 'Save'}
        size="large"
        fullWidth
        onPress={handleSubmitForm}
        disabled={disabled}
      />
      {formType === 'edit' && (
        <Button
          label="Delete Album"
          size="large"
          theme="secondary"
          fullWidth
          onPress={handleDeleteForm}
          style={styles.deleteButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...paddings['px-3'],
    ...paddings['py-4'],
  },
  deleteButton: {
    marginTop: 20,
  },
});

export default Footer;
