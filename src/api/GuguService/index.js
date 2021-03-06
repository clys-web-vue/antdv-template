// import Apier from 'nightnya-web-helpers/http/Apier';
// import {message} from "ant-design-vue";
// import Objs from 'nightnya-common-utils/Objs';
//
// const apier = new Apier({
//   baseURL: '/ipapi',
//   interceptors: {
//     reqBefore: [{
//       f: (req) => {
//         console.log(req)
//         return req;
//       }
//     }],
//     reqAfter: [],
//     resBefore: [{
//       r: (e) => {
//         let response = Objs.getPathVal(e, 'response');
//         let data = Objs.getPathVal(e, 'response?.data');
//         if (!config.resNoPromptStatus || !config.resNoPromptStatus.includes(response.status)) {
//           const msg = (response.status !== 500 && (data.msg || data.error || e.message)) || '服务器出错';
//           const status = response.status || '';
//           message.error(status + ":" + msg);
//         }
//         return Promise.reject(e);
//       }
//     }],
//     resAfter: []
//   }
// });

const apier = {
  post(url, data) {
    return new Promise(resolve => setTimeout(() => {
      resolve({
        userId: '123',
        nick: '咕咕咕-' + data.account,
        avatar: 'data:image/png;base64,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',
        permissions: ['1', '3'],
        ...data
      })
    }, 2000))
  }
}

import UserApi from './UserApi'

export default {
  UserApi: UserApi(apier),
}
