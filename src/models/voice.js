// import {
//   getAllTrafficVoice
// } from '../services';
//
// import {Toast} from 'antd-mobile';
//
// import storage from '../utils/storage';
//
// import effect from './effect';
//
// export default {
//
//   namespace: 'voice',
//
//   state: {
//     loading: false,
//     servicepackages: storage.getItem('voice.servicepackages') || [],
//     voiceavailable: storage.getItem('voice.voiceavailable') || {}
//   },
//
//   subscriptions: {
//     setup({dispatch, history}) {
//       history.listen(location => {
//         if (location.pathname === '/my-card') {
//           const servicepackages = storage.getItem('voice.servicepackages');
//           const voiceavailable = storage.getItem('voice.voiceavailable');
//           if (!servicepackages || !voiceavailable) {
//             dispatch({
//               type: 'gets'
//             });
//           }
//         }
//       });
//     }
//   },
//
//   effects: {
//     gets: effect(getAllTrafficVoice, 'getsSuccess'),
//   },
//
//   reducers: {
//     loading(state){
//       return {...state, loading: true};
//     },
//     failed(state, action){
//       return {...state, loading: false, err: action.err};
//     },
//     getsSuccess(state, action){
//       console.log(action);
//       const {servicepackages, voiceavailable} = action.result;
//       if (servicepackages) {
//         storage.setItem('voice.servicepackages', servicepackages, 3 * 60000);
//       }
//       if (voiceavailable) {
//         storage.setItem('voice.voiceavailable', voiceavailable, 3 * 60000);
//       }
//       return {...state, servicepackages, voiceavailable, loading: false};
//     }
//   },
// }
//
//
//
