import { Button } from '#components';
import { selectUserData } from '#modules/User/selectors';
import { Fonts } from '#themes';
import { cancelClaim } from '#modules/Orders/actions';
import { useActions } from '#utils';
import React from 'react';
import { View, Modal, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

const ClaimCancelPopup = ({ isVisible, onHide, orderData, orderId, setLoader }) => {
  const { information: userInfo } = useSelector(selectUserData());

  const actions = useActions({
    cancelClaim,
  });

  return (
    <Modal
      animationType="fade"
      visible={isVisible}
      onRequestClose={onHide}
      transparent
    >
      <View
        style={{
          backgroundColor: '#00000080',
          flex: 1,
          padding: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            backgroundColor: '#ffffff',
            width: '90%',
            borderRadius: 5,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#eeeeee',
              paddingHorizontal: 20,
            }}
          >
            <Text style={{ fontFamily: Fonts.family.semiBold, fontSize: 18 }}>
              Cancel Claim
            </Text>
            <Ionicons onPress={onHide} name="close" size={25} color="#969696" />
          </View>
          <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
            <Text
              style={{
                fontFamily: Fonts.family.regular,
                fontSize: 14,
                marginBottom: 30,
                marginTop: 30,
              }}
            >
              Are you sure you want to cancel?
            </Text>
            <Button
              label={'Yes'}
              subLabel={''}
              size="large"
              fullWidth={true}
              disabled={false}
              onPress={async () => {
                setLoader(true);
                await actions.cancelClaim({
                  claimId: orderData?.ClaimRequests?.[0]?.id,
                  orderId,
                  params: {
                    origin: 'buyer',
                    nextStatus: 'cancelled',
                    settledInFavorOf: 'seller',
                    fundedBy: 'buyer',
                    userOrigin: userInfo.id,
                    comment: '',
                    destination: 'seller',
                  },
                });
                onHide();
              }}
              style={{ width: '100%', marginBottom: 15 }}
            />
            <Button
              label={'No'}
              subLabel={''}
              size="large"
              fullWidth={true}
              disabled={false}
              onPress={onHide}
              theme="secondary"
              style={{ width: '100%', marginBottom: 10 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ClaimCancelPopup;
