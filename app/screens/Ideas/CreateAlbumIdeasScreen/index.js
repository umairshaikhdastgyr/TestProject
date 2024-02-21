import React, { useState } from "react";
import { useSelector } from "react-redux";

import { SafeAreaView, KeyboardAvoidingView } from "react-native";
import Footer from "./components/footer";
import Form from "./views/form";

import { safeAreaView, safeAreaNotchHelper } from "#styles/utilities";

import { selectUserData } from "#modules/User/selectors";
import { selectIdeasData } from "#modules/Ideas/selectors";
import {
  createAlbumIdea,
  updateAlbumIdea,
  deleteAlbumIdea,
} from "#modules/Ideas/actions";
import { useActions } from "#utils";

const CreateAlbumIdeasScreen = ({ navigation, route }) => {
  /* Selectors */
  const { information: userInfo } = useSelector(selectUserData());
  const {
    albumDetails: { details },
  } = useSelector(selectIdeasData());

  const formType = route?.params?.type;

  /* States */
  const [errorBag, setErrorBag] = useState([]);
  const [formValues, setFormValues] = useState({
    name: formType === "edit" ? details?.name ?? "" : "",
    description: formType === "edit" ? details?.description ?? "" : "",
    isPrivate: formType === "edit" ? details?.isPrivate ?? "" : "",
  });

  /* Actions */
  const actions = useActions({
    createAlbumIdea,
    updateAlbumIdea,
    deleteAlbumIdea,
  });

  /* Methods */
  const setFormValue = (value) =>
    setFormValues({
      ...formValues,
      ...value,
    });

  const verifyForm = () => {
    let isValid = true;
    const errorBagToSet = [];
    if (!formValues.name) {
      isValid = false;
      errorBagToSet.push("name");
    }
    setErrorBag(errorBagToSet);
    return isValid;
  };

  const handleSubmitForm = async () => {
    if (verifyForm()) {
      if (formType === "create") {
        await actions.createAlbumIdea({
          userId: userInfo.id,
          ...formValues,
        });
        navigation.goBack();
      } else if (formType === "edit") {
        await actions.updateAlbumIdea({
          ideasAlbumId: route?.params?.ideasAlbumId,
          params: formValues,
        });
        navigation.goBack();
      }
    }
  };

  const handleDeleteForm = async () => {
    await actions.deleteAlbumIdea({
      ideasAlbumId: route?.params?.ideasAlbumId,
    });
    navigation.navigate("IdeasMain");
  };

  return (
    <>
      <SafeAreaView style={safeAreaNotchHelper} />
      <SafeAreaView style={safeAreaView}>
        {/* <Header navigation={navigation} formType={formType} /> */}
        <Form
          formValues={formValues}
          setFormValue={setFormValue}
          errorBag={errorBag}
        />
        <Footer
          formValues={formValues}
          details={details}
          handleSubmitForm={handleSubmitForm}
          formType={formType}
          handleDeleteForm={handleDeleteForm}
        />
      </SafeAreaView>
      <SafeAreaView style={safeAreaNotchHelper} />
    </>
  );
};

export default CreateAlbumIdeasScreen;
