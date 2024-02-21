import { Colors, Metrics, Fonts } from '#themes';

export const flex = {
  directionRow: {
    flexDirection: 'row',
  },
  directionRowReverse: {
    flexDirection: 'row-reverse',
  },
  directionRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  grow1: {
    flex: 1,
  },
  justifyContentStart: {
    justifyContent: 'flex-start',
    paddingTop: 0,
    paddingBottom: 0,
  },
  justifyContentEnd: {
    justifyContent: 'flex-end',
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
  justifyContentSpace: {
    justifyContent: 'space-between',
  },
  alignItemStart: {
    alignItems: 'flex-start',
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
};

export const margins = {
  'mb-0': {
    marginBottom: 0,
  },
  'mb-1': {
    marginBottom: 4,
  },
  'mb-2': {
    marginBottom: 8,
  },
  'mb-3': {
    marginBottom: 16,
  },
  'mb-4': {
    marginBottom: 24,
  },
  'mb-5': {
    marginBottom: 32,
  },
  'mr-1': {
    marginRight: 4,
  },
  'mr-2': {
    marginRight: 8,
  },
  'mr-3': {
    marginRight: 16,
  },
  'mr-4': {
    marginRight: 24,
  },
  'mr-5': {
    marginRight: 32,
  },
  'ml-1': {
    marginLeft: 4,
  },
  'ml-2': {
    marginLeft: 8,
  },
  'ml-3': {
    marginLeft: 16,
  },
  'ml-4': {
    marginLeft: 24,
  },
  'ml-5': {
    marginLeft: 32,
  },
  'mt-1': {
    marginTop: 4,
  },
  'mt-2': {
    marginTop: 8,
  },
  'mt-3': {
    marginTop: 16,
  },
  'mt-4': {
    marginTop: 24,
  },
  'mt-5': {
    marginTop: 32,
  },
};

export const paddings = {
  'p-1': {
    padding: 4,
  },
  'p-2': {
    padding: 8,
  },
  'p-3': {
    padding: 16,
  },
  'p-4': {
    padding: 24,
  },
  'p-5': {
    padding: 32,
  },
  'px-1': {
    paddingHorizontal: 4,
  },
  'px-2': {
    paddingHorizontal: 8,
  },
  'px-3': {
    paddingHorizontal: 16,
  },
  'px-4': {
    paddingHorizontal: 24,
  },
  'px-5': {
    paddingHorizontal: 32,
  },
  'py-1': {
    paddingVertical: 4,
  },
  'py-2': {
    paddingVertical: 8,
  },
  'py-3': {
    paddingVertical: 16,
  },
  'py-4': {
    paddingVertical: 24,
  },
  'py-5': {
    paddingVertical: 32,
  },
  'pl-1': {
    paddingLeft: 4,
  },
  'pl-2': {
    paddingLeft: 8,
  },
  'pl-3': {
    paddingLeft: 16,
  },
  'pl-4': {
    paddingLeft: 24,
  },
  'pl-5': {
    paddingLeft: 32,
  },
  'pb-0': {
    paddingBottom: 0,
  },
  'pb-1': {
    paddingBottom: 4,
  },
  'pb-2': {
    paddingBottom: 8,
  },
  'pb-3': {
    paddingBottom: 16,
  },
  'pb-4': {
    paddingBottom: 24,
  },
  'pb-5': {
    paddingBottom: 32,
  },
  'pt-1': {
    paddingTop: 4,
  },
  'pt-2': {
    paddingTop: 8,
  },
  'pt-3': {
    paddingTop: 16,
  },
  'pt-4': {
    paddingTop: 24,
  },
  'pt-5': {
    paddingTop: 32,
  },
};

export const borders = {
  bl: {
    borderLeftWidth: 1,
    borderColor: Colors.lightGrey,
  },
  bb: {
    borderBottomWidth: 1,
    borderColor: Colors.lightGrey,
  },
};

export const backgrounds = {
  backGrey: {
    backgroundColor: Colors.backgroundGrey,
  },
};

export const shadows = {
  light: {
    shadowColor: 'black',
    shadowOffset: {
      width: 2,
      height: 5,
    },
    shadowOpacity: 0.06,
  },
};

export const style = {
  activityContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  activityContainer1: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  contentContainerStyle: {
    height: Metrics.screenHeight,
  },
  headerStyle: {
    headerTitleStyle: {
      ...Fonts.style.headerText,
      color: Colors.black,
      fontFamily: Fonts.family.semiBold,
    },
    headerStyle: {
      backgroundColor: 'white',
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowRadius: 3,
      shadowOpacity: 0.1,
      borderBottomWidth: 0,
    },
    headerTintColor: 'black',
    headerBackTitleStyle: {
      ...Fonts.style.homiBodyText,
    },
  },
};

export const text = {
  center: {
    textAlign: 'center',
  },
  left: {
    textAlign: 'left',
  },
  right: {
    textAlign: 'right',
  },
};

export const safeAreaNotchHelper = {
  flex: 0,
  backgroundColor: '#fff',
  position: 'relative',
  zIndex: 15,
};

export const safeAreaView = {
  flex: 1,
  backgroundColor: '#FCFCFC',
};
export const safeAreaViewWhite = {
  flex: 1,
  backgroundColor: 'white',
};

export const position = {
  relative: {
    position: 'relative',
  },
  absolute: {
    position: 'absolute',
  },
};
