import React, { useEffect } from 'react';
import { Text, View, FlatList, ScrollView, useWindowDimensions, SafeAreaView } from 'react-native';
import { styles } from './styles';
import { useSelector, useDispatch } from 'react-redux';
import { generalSelector } from '../../../modules/General/selectors';
import { getContent } from '../../../modules/General/actions';
import RenderHtml from 'react-native-render-html';
import { Utilities } from '#styles';
import { Colors } from '#themes';
import ScreenLoader from '#components/Loader/ScreenLoader';

const PrivacyPolicyScreen = ({navigation, route}) => {
  const dispatch = useDispatch();

  const { width, height } = useWindowDimensions()
  const { general } = useSelector(generalSelector);
  const { contentState, sendExpressionState } = general;

  useEffect(() => {
    // RNSplashScreen.hide();
    dispatch(
      getContent({ params: `?type=privacy_policy`, type: "terms" })
    );
  }, []);

  const source = {
    html: `${general?.contentState?.data?.content}`
  };

  return (
    <>
      <SafeAreaView style={styles.container}></SafeAreaView>
      {contentState.isFetching ? <ScreenLoader /> : <ScrollView>
        <View style={styles.contentContainer}>
          <RenderHtml
            contentWidth={width}
            source={source}
          />
        </View>
      </ScrollView>}
      <SafeAreaView style={Utilities.safeAreaNotchHelper} />
    </>
  )

  const renderItem = ({ item }) => (
    <View style={styles.contentContainer}>
      <Text style={styles.containerTitle}>{item.title}</Text>
      <Text style={styles.containerItemText}>{item.content}</Text>
    </View>
  );
  const Item = ({ item }) => (
    <View style={styles.contentContainer}>
      <Text style={[styles.containerTitle, { fontSize: 20 }]}>{item.title}</Text>
      <Text style={styles.containerItemText}>{item.content}</Text>
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={[{ data: {} }]}
        renderItem={(data) => (
          <>
            <Item item={{
              title: "LAST UPDATED: September 30, 2021", content: `
Protecting your private information is our priority. This Privacy Policy applies to Homitag, Inc., headquartered in Los Angeles, California, and governs data collection and usage. For the purpose of this Privacy Policy, unless otherwise noted, all references to Homitag, Inc. include www.homitag.com, Homitag Mobile App and Homitag. Homitag’s mobile app and website is a consumer-to-consumer and business-to-consumer marketplace service. By using Homitag’s mobile app and website, you consent to the data practices described in this statement.`}} />
            <Item item={{ title: "Changes to this Statement", content: `Homitag reserves the rights to change this Privacy Policy from time to time. We will notify you about significant changes in the way we treat personal information by sending a notice to the primary email address specified in your account, by placing prominent notice on our website, and/or by updating any privacy information. Your continued use of the website and` }} />
            <Item item={{
              title: "Collection of your Personal Information", content: `In order to better provide you with product and services offered, Homitag may collect personally identifiable information, such as your:
\u29BF Contact information, such as First and Last Name, Mailing Address, E-mail Address, and Phone Number
\u29BF Detailed personal information such as your date of birth or tax identification number
\u29BF If you purchase Homitag’s products and services, we collect billing and credit card information. This information is used to complete the purchase transaction.
Please keep in mind that if you directly disclose personally identifiable information or personally sensitive data through Homitag’s public communication channels, this information may be collected and used by others.

We do not collect any personal information about you unless you voluntarily provide it to us. However, you may be required to provide certain personal information to us when you elect to use certain product or services. These may include: (a) registering for an account; (b) entering a sweepstake or contest sponsored by us or one of our partners; (c) signing up for special offers from selected third parties; (d) sending us an email message; (e) submitting your credit card or other payment information when ordering and purchasing products and services. To wit, we will use your information for, but not limited to, communication with you in relation to services and/or products you have requested from us. We also may gather additional personal or non-personal information in the future.`}} />
            <Item item={{ title: "Use of your Personal Information", content: `Homitag may also use your personal identifiable information to inform you of other products or service available from Homitag and its affiliates.` }} />
            <Item item={{
              title: "Third Parties Sources", content: `Homitag does not sell, rent, or lease its customer lists to third parties.

Homitag may, from time to time, contact you on behalf of external business partners about a particular offer that may be of interest to you. In those cases, your unique personally identifiable information (e-mail, name, address, telephone number) is transferred to the third party. Homitag may share data with trusted partner to help perform statistical analysis, send you email or postal mail, provide customer support, or arrange for deliveries. All such third parties are prohibited from using your personal information except to provide these services to Homitag, and they are required to maintain the confidentiality of your information.

Homitag may disclose your personal information, without notice, if required to do so by law or in good faith belief that such action is necessary to: (a) confirm to the edicts of the law or comply with legal process served on Homitag or the site; (b) protect and defend the rights or property of Homitag; and/or (c) act under exigent circumstances to protect the personal safety of users of Homitag, or the public.

Homitag may obtain information about you from third parties such as identity verification services.
\u29BF Homitag may combine your usage data with information we collect from other companies such as Google Analytics to customize and improve your user experience. Google Analytics collects information regarding the use of other websites, apps and online resources ( For more information, please visit https://policies.google.com/privacy/partners.)
\u29BF You may choose to provide us with access to certain personal information stored by third parties such as social media sites (e.g., Facebook https://www.facebook.com/policy.php). The information we may receive varies by site and is controlled by that site. By associating an account managed by a third party with your Homitag account and authorizing Homitag to have access to this information, you agree that we may collect, store and use this information in accordance with this Privacy Policy.`}} />
            <Item item={{ title: "Tracking User Behavior", content: `Homitag may keep track of the websites and pages our users visit with Homitag, to determine what Homitag services are the most popular. This data is used to deliver customized content and advertising with Homitag to customers whose behavior indicates that they are interested in a particular subject area.` }} />
            <Item item={{ title: "Automatically Collected Information", content: `Information about your computer hardware and software may be automatically collected by Homitag. This information can include: your IP address, browser type, domain names, access times and referring website addresses. This information is used for the operation of the service, to maintain quality of the service, and to provide general statistics regarding use of the Homitag website.` }} />
            <Item item={{
              title: "Right to Deletion", content: `Subject to certain exceptions set out below, on receipt of a verifiable request from you we will:
\u29BF Delete your personal information from our records; and
\u29BF Direct any service providers to delete your personal information from our records.
Please note that we may not be able to comply with requests to delete your personal information if it is necessary to:
\u29BF Complete the transaction for which the personal information was collected, fulfill the terms of a written warranty or product recall conducted in accordance with federal law, provide a good or service requested by you, or reasonably anticipated within the context of our ongoing business relationship with you, or otherwise perform a contract between you and us;
\u29BF Detect security incidents, protect against malicious, deceptive, fraudulent, or illegal activity; or prosecute those responsible for that activity;
\u29BF Debug to identify and repair errors that impair existing intended functionality;
\u29BF Exercise free speech, ensure the right of another consumer to exercise his or her rights of free speech, or exercise another right provided for by law;
\u29BF Comply with the California Electronic Communication Privacy Act;
\u29BF Engage in public or peer-reviewed scientific, historical, or statistical research in the public interest that adheres to all other applicable ethics and privacy laws, when our deletion of the information is likely to render impossible or seriously impair the achievement of such research, provided we have obtained your informed consent;
\u29BF Enable solely internal uses that are reasonably aligned with your expectations based on your relationship with us;
\u29BF Comply with an existing legal obligation; or
\u29BF Otherwise use your personal information, internally, in a lawful manner that is compatible with the context in which you provided the information`}} />
            <Item item={{ title: "Children Under Eighteen", content: `Homitag does not knowingly collect personally identifiable information from children under the age of Eighteen. If you are under the age of Eighteen, you must ask your parent or guardian for permission to use Homitag’s mobile app and website.` }} />
            <Item item={{
              title: "E-mail Communication", content: `From time to time, Homitag may contact you via email for the purpose of providing announcement, promotional offers, alerts, confirmations, surveys, and/or other general communication. In order to improve our Services, we may receive a notification when you open an email from Homitag or click on a link therein.

If you would like to stop receiving marketing or promotional communications via email from Homitag, you ma opt out of such communications by clicking on the UNSUSCRIBE button.`}} />
            <Item item={{
              title: "Contact Information", content: `Homitag welcomes your questions or comments regarding this Statement of Privacy. If you have any questions or requests, please contact us within the mobile app or website or directly at info@homitag.com.

Effective as of September 23, 2021`}} />
          </>
        )}
        keyExtractor={(item, index) => `key-${index}`}
        showsVerticalScrollIndicator={false}
      />
      {/* <FlatList
        data={general.contentState.data}
        renderItem={data => renderItem(data)}
        keyExtractor={(item, index) => `key-${index}`}
        showsVerticalScrollIndicator={false}
      /> */}
    </SafeAreaView>
  );
};

export default PrivacyPolicyScreen;
