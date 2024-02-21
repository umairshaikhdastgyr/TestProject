export const defaultVehicleDeliveryMethod = () => {
  let deliveryMethod = {};
  deliveryMethod.id = 'b74eb94a-4fd2-44ae-9828-4ddab1368d5e';
  deliveryMethod.name = 'In-Person Pickup';
  deliveryMethod.code = 'pickup';
  deliveryMethod.DeliveryMethodPerPost = {};
  deliveryMethod.DeliveryMethodPerPost.customProperties = {};
  deliveryMethod.DeliveryMethodPerPost.customProperties = {
    pickupLocation: {},
  };
  deliveryMethod.DeliveryMethodPerPost.customProperties.PaymentMethods = [];
  deliveryMethod.DeliveryMethodPerPost.customProperties.PaymentMethods.push({
    id: 'a8f5edba-b97a-4c10-9a10-4b7bb7a2921b',
    name: 'Pay in person',
    code: 'payinperson',
  });
  deliveryMethod.PaymentMethods = [];
  deliveryMethod.PaymentMethods.push({
    id: 'a8f5edba-b97a-4c10-9a10-4b7bb7a2921b',
    name: 'Pay in person',
    code: 'payinperson',
  });

  return deliveryMethod;
};
