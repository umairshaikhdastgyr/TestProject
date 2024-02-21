import React, { useEffect, useState } from "react";
import { Text, SafeAreaView, ScrollView, Share } from "react-native";
import ShareSheet from "#components/Share";
import { Utilities } from "#styles";
import { styles } from "./styles";
import { FooterAction } from "#components";
import { getFirebaseLink } from '#utils';

const InviteFriendScreen = ({ navigation, route }) => {
  const renderButton = () => {
    return (
      <FooterAction
        mainButtonProperties={{
          label: "Invite a Friend",
          onPress: () => setVisibleShare(true),
          mainButtonStyle: styles.mainButtonStyle
        }}
      />
    );
  };
  useEffect(() => {
    updateLink();
  }, []);
  const [visibleShare, setVisibleShare] = useState(false);
  const [shareOptions, setShareOptions] = useState({
    title: "Homitag app",
    message: "Invite you to download the app...",
    url: "http://www.homitag.com/comingSoon",
    subject: "Share Link",
    social: Share.Soc //  for email
  });


  const updateLink = async () => {
    const link = await getFirebaseLink(``);
    setShareOptions({
      title: "Homitag app",
      message: "Invite you to download the app ",
      url: link,
      subject: "Share Link",
      social: Share.Soc //  for email
    })
  }

 
  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Text style={styles.containerTitle}>Tell your friends!</Text>
          <Text style={styles.containerItemText}>
            Invite people to sell and buy using Homitag!
          </Text>
        </ScrollView>
        <ShareSheet
          visible={visibleShare}
          setVisibleShare={setVisibleShare}
          title="Invite a Friend"
          shareOptions={shareOptions}
        />
        {!visibleShare && renderButton()}
      </SafeAreaView>
      <SafeAreaView style={Utilities.safeAreaNotchHelper} />
    </>
  );
};

export default InviteFriendScreen;
