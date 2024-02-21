export const getShippingLabelParams = ({
  buyerDetail, sellerDetail, buyerAddress, returnAddress, provider, weight,
}) => {
  const buyerPhone =  "1234567890" || buyerDetail?.phonenumber?.replace(/[-|&;$%@"<>()+,]s/g, '').replace(/ /g, '').trim();
  const sellerPhone = "1234567890" || sellerDetail?.phonenumber?.replace(/[-|&;$%@"<>()+,]/g, '').replace(/ /g, '').trim();
  // buyerAddress;
  let params = {};
  switch (provider) {
    case 'ups':
      params = {
        service: {
          Code: '003',
          Description: 'UPS Ground',
        },
        buyer: {
          Name: `${buyerDetail.firstName} ${buyerDetail.lastName}`,
          AddressLine: buyerAddress.addressline1,
          AddressCity: buyerAddress.city,
          AddressState: buyerAddress.state,
          AddressZIP: buyerAddress.zipcode,
          AddressCountry: 'us',
          Phone: buyerPhone,
        },
        seller: {
          Name: `${returnAddress.name}`,
          AddressLine: returnAddress.address_line_1,
          AddressCity: returnAddress.city,
          AddressState: returnAddress.state,
          AddressZIP: returnAddress.zipcode,
          AddressCountry: 'us',
          Phone: sellerPhone,
        },
        package: {
          Description: 'Package description',
          PackagingCode: '02',
          PackagingDescription: 'Other Packaging',
          Length: '5',
          Width: '5',
          Height: '5',
          Weight: weight,
        },
      };


      break;
    case 'usps':

      params = {
        fromName: `${buyerDetail.firstName} ${buyerDetail.lastName}`,
        fromAddressA: buyerAddress.addressline1,
        fromAddressB: buyerAddress.addressline2,
        fromCity: buyerAddress.city,
        fromState: buyerAddress.state,
        fromZip: buyerAddress.zipcode,
        fromPhone: buyerPhone.substr(buyerPhone.length - 10),
        toName: `${returnAddress.name}`,
        toAddressA: returnAddress.address_line_1,
        toAddressB: returnAddress.address_line_2,
        toCity: returnAddress.city,
        toState: returnAddress.state,
        toZip: returnAddress.zipcode,
        toPhone: sellerPhone.substr(sellerPhone.length - 10),
        weightLbs: weight,
        widthInch: 1,
        lengthInch: 1,
        heightInch: 1,
        serviceType: 'Express',
        container: 'FLAT RATE ENVELOPE',
        type: 'PNG',
      };

      break;
    case 'fedex':
      params = {
        buyer: {
          PersonName: `${buyerDetail.firstName} ${buyerDetail.lastName}`,
          CompanyName: ' ',
          PhoneNumber: buyerPhone,
          EMailAddress: buyerDetail.email,
          AddressLine: buyerAddress.addressline1,
          AddressCity: buyerAddress.city,
          AddressState: buyerAddress.state,
          AddressZIP: buyerAddress.zipcode,
          AddressCountry: 'US',
        },
        seller: {
          PersonName: `${returnAddress.name}`,
          CompanyName: ' ',
          PhoneNumber: sellerPhone,
          EMailAddress: sellerDetail.email,
          AddressLine: returnAddress.address_line_1,
          AddressCity: returnAddress.city,
          AddressState: returnAddress.state,
          AddressZIP: returnAddress.zipcode,
          AddressCountry: 'US',
        },
        package: {
          Weight: weight,
          Length: '2',
          Width: '2',
          Height: '2',
          DropoffType: 'REGULAR_PICKUP',
          PackagingType: 'YOUR_PACKAGING',
          ServiceType: 'FEDEX_2_DAY',
        },
      };
      break;
    default:
      break;
  }
  return params;
};


export const getShippingLabelDetail = ({ shippingLabel, provider }) => {
  switch (provider) {
    case 'fedex': {
      const fedexData = shippingLabel?.data;
      return ({
        trackingNumber: fedexData?.trackingId,
        imageType: fedexData?.labelExtension,
        base64Data: fedexData?.labelImge,
      });
    }

    case 'ups': {
      const upsData = shippingLabel?.data;
      return ({
        trackingNumber: upsData?.trackingId,
        imageType: upsData?.labelExtension,
        base64Data: upsData?.labelImge,
      });
    }

    case 'usps': {
      const uspsData = shippingLabel?.data;
      return ({
        trackingNumber: uspsData?.trackingId,
        imageType: uspsData?.labelExtension,
        base64Data: uspsData?.labelImge,
      });
    }
    default:
      break;
  }
};
