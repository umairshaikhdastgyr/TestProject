import 'react-native'
import React from 'react';
import PaymentConfirmationScreen from '../app/screens/Buy/PaymentConfirmationScreen';

import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(<PaymentConfirmationScreen />).toJSON();
  expect(tree).toMatchSnapshot();
});