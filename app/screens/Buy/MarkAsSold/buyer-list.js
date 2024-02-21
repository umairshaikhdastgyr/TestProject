import Accordion from 'react-native-collapsible/Accordion';
import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import styles from './styles';
import { Icon } from '#components';

const BuyerList = ({
  buyerList,
  setSelectedOrderId,
  buyerName,
  setBuyerName,
}) => {
  const [accordianItem, setAccordianItem] = useState([
    { title: 'Select a buyer', content: buyerList },
  ]);

  useEffect(() => {
    setAccordianItem([{ title: 'Select a buyer', content: buyerList }]);
  }, [buyerList]);
  const [activeSections, setActiveSections] = useState([]);

  const PaymentListHeader = (section, index, isActive) => (
    <View style={styles.listHeader}>
      <Text
        style={[
          styles.headerText,
          {
            fontWeight:
              accordianItem[0].title === 'Select a buyer' ? '400' : '500',
          },
        ]}
      >
        {section.title}
      </Text>
      <Icon
        icon={isActive ? 'chevron-up' : 'chevron-right'}
        style={styles.arrowIcon}
      />
    </View>
  );

  const onPressContent = ({ fullName, orderId }) => {
    setSelectedOrderId(orderId);
    setAccordianItem([{ title: fullName, content: accordianItem[0].content }]);
    setActiveSections([]);
    setBuyerName(fullName);
  };

  const PaymentListContent = (section, index) => (
    <>
      <TouchableOpacity
        style={styles.subListContainer}
        onPress={() =>
          onPressContent({ fullName: 'Someone outside homitag', orderId: 'NA' })
        }
      >
        {buyerName === 'Someone outside homitag' && (
          <View style={styles.checkIcon}>
            <Icon icon="check-green" />
          </View>
        )}
        <Text
          style={[
            styles.subListText,
            buyerName === 'Someone outside homitag'
              ? styles.subListTextSelected
              : '',
          ]}
        >
          Someone outside homitag
        </Text>
      </TouchableOpacity>
      {section.content.map((item, i) => {
        const { receiver, orderId } = item;
        const fullName = `${receiver.firstName} ${receiver.lastName}`;

        return (
          <TouchableOpacity
            key={`key-${i}`}
            style={styles.subListContainer}
            onPress={() => onPressContent({ fullName, orderId })}
          >
            {buyerName === fullName && (
              <View style={styles.checkIcon}>
                <Icon icon="check-green" />
              </View>
            )}
            <Text
              style={[
                styles.subListText,
                buyerName === fullName ? styles.subListTextSelected : '',
              ]}
            >
              {fullName}
            </Text>
          </TouchableOpacity>
        );
      })}
    </>
  );
  return (
    <>
      <Accordion
        sections={accordianItem}
        activeSections={activeSections}
        renderHeader={PaymentListHeader}
        renderContent={PaymentListContent}
        onChange={setActiveSections}
        touchableComponent={TouchableOpacity}
        sectionContainerStyle={styles.sectionContainerStyle}
      />
    </>
  );
};

export default BuyerList;
