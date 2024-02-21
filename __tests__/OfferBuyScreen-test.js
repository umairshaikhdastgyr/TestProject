import 'react-native'
import React from 'react';
import { Provider } from 'react-redux'
import OfferBuyScreen from '../app/screens/Buy/OfferBuyScreen'
import configureStore from 'redux-mock-store'
import renderer from 'react-test-renderer'

const mockStore = configureStore({
  order: {}
})

describe('Offer Buy Screen', () => {
  let store;
  let Component;
  const navigation = { 
    getParam: jest.fn(),
    navigate: jest.fn() 
  };

  beforeEach(() => {
      store = mockStore({})

      Component = renderer.create(
          <Provider store={store}>
              <OfferBuyScreen navigation={navigation} />
          </Provider>
      )
  })

  it('should render correctly', () => {
      expect(Component.toJSON()).toMatchSnapshot()
  })
})