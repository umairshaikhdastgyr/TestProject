import fonts from '#themes/fonts';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  dash_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  shippingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 15,
    marginHorizontal: 20,
  },
  orderStatusContainer: {
    marginHorizontal: 20,
  },
  calculationContainer: {
    marginTop: 25,
  },
  orderStatusText: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  deniedModalHeaderContainer:{
    elevation: 3,
    backgroundColor: "#ffffff",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 15,
    flexDirection: "row",
  },
  deniedModalHeaderText:{ fontFamily: fonts.family.semiBold, fontSize: 16 },
  denyReasonContainer:{
    backgroundColor: "#F5F5F5",
    padding: 10,
    paddingVertical: 15,
  },
  denyReasonText:{
    fontFamily: fonts.family.regular,
    fontSize: 14,
    textAlign: "center",
  },
  denyReasonTextSeller:{
    fontFamily: fonts.family.semiBold,
    fontSize: 15,
    textAlign: "left",
    marginVertical: 20,
    marginLeft: 20,
  },
  denyReasonBox:{
    backgroundColor: "#F5F5F5",
    padding: 10,
    paddingVertical: 15,
  },
  denyReasonValue:{
    fontFamily: fonts.family.regular,
    fontSize: 14,
    paddingBottom: 8,
    marginHorizontal: 27.5,
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#DADADA",
  }
});
