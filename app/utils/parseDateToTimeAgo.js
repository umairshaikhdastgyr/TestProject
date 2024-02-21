import moment from 'moment';

export default (date) => {
  const dateToMoment = moment(date);
  let timeAgo = moment().diff(dateToMoment, 'hours');
  let timeMode = 'H';
  if (timeAgo > 24) {
    timeAgo = moment().diff(dateToMoment, 'days');
    timeMode = 'D';
  }
  return `${timeAgo}${timeMode}`;
};


export const getTimeAgo = (date) => {
  const dateNow = new Date();
  const notDate = new Date(date);
  const dateNow1 = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate());
  const notDate2 = new Date(notDate.getFullYear(), notDate.getMonth(), notDate.getDate());
  if (dateNow1.toDateString() === notDate2.toDateString()) {
    const dateTime = moment(date).format('hh:mm a');
    return dateTime;
  }
  const dateToMoment = moment(notDate2);
  const dayDiff = moment().diff(dateToMoment, 'days');
  if (dayDiff <= 7) { return `${dayDiff} days ago`; }
  if (dayDiff > 7 && dayDiff <= 15) { return '7 days ago'; }
  if (dayDiff > 15 && dayDiff <= 30) { return '15 days ago'; }
  if (dayDiff > 30 && dayDiff <= 60) { return '1 month ago'; }
  if (dayDiff > 60 && dayDiff <= 90) { return '2 months ago'; }
  if (dayDiff > 90 && dayDiff <= 365) { return '3 months ago'; }
  if (dayDiff > 365 && dayDiff <= 730) { return '1 year ago'; }
  if (dayDiff > 730) { return '2 years ago'; }
};

export const PICKER_OPTIONS = {
  width: 800,
  height: 512,
  mediaType: 'photo',
  cropperCircleOverlay: false,
  sortOrder: 'none',
  compressImageQuality: 0.8,
  includeExif: true,
  cropping: true,
  cropperStatusBarColor: '#ffffff',
  cropperToolbarColor: '#ffffff',
  cropperActiveWidgetColor: '#ffffff',
  freeStyleCropEnabled: true,
};