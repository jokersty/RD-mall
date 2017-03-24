'use strict';

// const mock = {};
//
// require('fs').readdirSync(require('path').join(__dirname + '/mock'))
//   .forEach(function (file) {
//     Object.assign(mock, require('./mock/' + file));
//   });
//
// module.exports = mock;


module.exports = {
  '/images/*':'https://www.roam-tech.com/roammall/',
  // '/uc/services/datacard_bind': function (req, res) {
  //   res.json({
  //     error_no: 0,
  //     result: {
  //       iccid: '1234567890123456789'
  //     }
  //   });
  // },
  // '/uc/services/datacard_gets': function (req, res) {
  //   res.json({
  //     error_no: 0,
  //     result: {
  //       datacards: [{iccid: '1234567890123456789'},{iccid: '9876543219876543219'}]
  //     }
  //   });
  // },
  // '/uc/services/alltrafficvoice_get': function (req, res) {
  //   res.json({
  //       "error_no": 0,
  //       "result": {
  //         "servicepackages": [
  //           {
  //             areaname: '英国',
  //             effect_datetime: '2016-10-01 00:00:00',
  //             failure_datetime: '2016-11-12 23:59:59',
  //             iccid: '1234567890123456789',
  //             simid: '1234567890123456789'
  //           },
  //           {
  //             areaname: '美国',
  //             effect_datetime: '2016-11-13 00:00:00',
  //             failure_datetime: '2016-12-12 23:59:59',
  //             iccid: '1234567890123456789',
  //             simid: '1234567890123456789'
  //           }
  //         ],
  //         "voiceavailable": {
  //           "remaindertime": 30,
  //           "totaltime": 30,
  //           "usedtime": 0
  //         }
  //       }
  //     }
  //   )
  // },

  // '/uc/services/availevoucher_gets': function (req, res) {
  //   res.json({
  //     error_no: 0,
  //     result: {
  //       evouchers: [
  //         {
  //           id: 1234,
  //           evoucherid: 5678,
  //           userid: 1234,
  //           used_datetime: '2016-10-10 11:12:12',
  //           // orderid: 1234,
  //           image: '',
  //           name: '50元抵价劵',
  //           evoucher: {
  //             id: 21312,
  //             money: 20,
  //             min_amount: 50,
  //             max_amount: 100,
  //             effect_datetime: '2016-10-10 11:12:12',
  //             failure_datetime: '2016-10-10 11:12:12',
  //             background: '',
  //             repeat: false,
  //             prdevouchers: [{
  //               id: 1232,
  //               evoucherid: 123,
  //               productid: 123
  //             }]
  //           }
  //         },
  //         {
  //           id: 2390,
  //           evoucherid: 5678,
  //           userid: 1234,
  //           used_datetime: '2016-10-10 11:12:12',
  //           // orderid: 1234,
  //           image: '',
  //           name: '满500减80',
  //           evoucher: {
  //             id: 21312,
  //             money: 20,
  //             min_amount: 50,
  //             max_amount: 100,
  //             effect_datetime: '2016-10-10 11:12:12',
  //             failure_datetime: '2016-10-10 11:12:12',
  //             background: '',
  //             repeat: false,
  //             prdevouchers: [{
  //               id: 1232,
  //               evoucherid: 123,
  //               productid: 123
  //             }]
  //           }
  //         }
  //       ]
  //     }
  //   })
  // },
  // '/uc/services/evoucher_discount': function (req, res){
  //   res.json({
  //     error_no:0,
  //     result:{
  //       order:{
  //         payable_amount: 1,
  //       },
  //       myevoucher: {
  //         id: 1234,
  //         evoucherid: 5678,
  //         userid: 1234,
  //         used_datetime: '2016-10-10 11:12:12',
  //         name: '50元抵价劵',
  //         evoucher: {
  //           id: 21312,
  //           name: '50元抵价劵',
  //           money: 20,
  //           effect_datetime: '2016-10-10 11:12:12',
  //           failure_datetime: '2016-10-10 11:12:12',
  //         }
  //       },
  //     }
  //   })
  // },
  '/uc/*': 'https://www.roam-tech.com/',
}
