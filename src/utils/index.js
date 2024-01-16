import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import { updateOrientation } from "../redux/slices/OrientationSlice";

const { Dimensions } = require("react-native");

export const Orientation = Object.seal({
    Landscape: 'landscape',
    Portrait: 'portrait',  
})

const orientationUpdate = (dispatch) => {
    const { width, height } = Dimensions.get('window');
    const newOrientation = width > height ? Orientation.Landscape : Orientation.Portrait;
    dispatch(updateOrientation(newOrientation));
};

export const mountOrientationListener = (dispatch) => {
    orientationUpdate(dispatch);
    Dimensions.addEventListener('change', ()=>orientationUpdate(dispatch));
};
