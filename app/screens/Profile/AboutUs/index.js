import React, { useEffect } from 'react';
import {
  Text, View, FlatList, SafeAreaView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { styles } from './styles';
import { generalSelector } from '../../../modules/General/selectors';
import { getContent } from '../../../modules/General/actions';
import { Utilities } from '#styles';

const AboutUsScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const { general } = useSelector(generalSelector);

  useEffect(() => {
    dispatch(
      getContent({
        params: '?status=published&location=about',
        type: 'about',
      }),
    );
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.contentContainer}>
      <Text style={styles.containerTitle}>{item.title}</Text>
      <Text style={styles.containerItemText}>{item.content}</Text>
    </View>
  );
  const Item = ({ item }) => (
    <View style={styles.contentContainer}>
      <Text style={[styles.containerTitle,{fontSize: 20}]}>{item.title}</Text>
      <Text style={styles.containerItemText}>{item.content}</Text>
    </View>
  );

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.aboutContainer}>
          <Text style={styles.itemText}>WE ARE</Text>
          <Text style={styles.titleText}>HOMITAG</Text>
        </View>
        <FlatList
          data={[{ data: {} }]}
          renderItem={(data) => (
            <>
                <Item item={{title: "Our Mission",content:"Buying & Selling Made Simpler, Easier and Faster."}} />
        <Item item={{title: "Who we are",content:`HomiTag is an emerging player in the eCommerce industry that aims to provide a compelling shopping experience for buyers while opening doors for individuals and professional sellers who want to scale their business online. We want to make buying and selling simpler, easier, and faster.

We provide convenience for both buyers and sellers by connecting them through our vast marketplace. As a buyer, you can explore, discover, and shop for items you love and need in just a few simple clicks. The best part? You can get your orders conveniently delivered right to your doorstep.

For sellers who want to bring their business online, we are here to provide you with robust technology to help you manage your listings and earnings all in one seamless platform. Explore ways to sell now at Homitag!`}} />
        <Item item={{title: "Our Values",content:`We commit and we deliver. Honesty, integrity, safety, and satisfaction of customers are the core values of Homitag. And this is the reason why we have emerged as one of the most trustworthy platforms out there. We have created an open marketplace that connects individuals, entrepreneurs and businesses of all sizes to in-market audiences having a strong purchase intent.`}} />
       </>
          )}
          keyExtractor={(item, index) => `key-${index}`}
          showsVerticalScrollIndicator={false}
        />
        {/* <FlatList
          data={general.contentState.data}
          renderItem={(data) => renderItem(data)}
          keyExtractor={(item, index) => `key-${index}`}
          showsVerticalScrollIndicator={false}
        /> */}
        <View>

        </View>
      </SafeAreaView>
      <SafeAreaView style={Utilities.safeAreaNotchHelper} />
    </>
  );
};

export default AboutUsScreen;
