'use strict';

var React = require('react');
var PropTypes = require('prop-types');
import { sha1 } from 'react-native-sha1';

var {
    View,
} = require('react-native');

function renderCanvas(canvas) {

}
function ValidateVinNumber(apikey, secretkey, id, vin, callback){
    let controlsum = undefined;
    var apiURL = '';
    sha1(`${vin}|${id}|${apikey}|${secretkey}`).then(async hash => {
        controlsum = hash.substr(0, 10);
        apiURL = `${apikey}/${controlsum}/decode/info/${vin}`;
        fetch(`https://api.vindecoder.eu/3.1/${apiURL}.json`)
          .then(res => res.text())
          .then(text => callback(JSON.parse(text)))
      });
};
module.exports = ValidateVinNumber;
