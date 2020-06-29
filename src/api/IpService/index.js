import {Apier} from 'nightnya-web-helpers';
import {message} from "ant-design-vue";
import Objs from 'nightnya-common-utils/Objs';

const apier = new Apier({
  baseURL: '/ipapi',
  interceptors: {
    reqBefore: [{
      f: (req) => {
        console.log(req)
        return req;
      }
    }],
    reqAfter: [],
    resBefore: [{
      r: (e) => {
        let response = Objs.getPathVal(e, 'response');
        let data = Objs.getPathVal(e, 'response?.data');
        if (!config.resNoPromptStatus || !config.resNoPromptStatus.includes(response.status)) {
          const msg = (response.status !== 500 && (data.msg || data.error || e.message)) || '服务器出错';
          const status = response.status || '';
          message.error(status + ":" + msg);
        }
        return Promise.reject(e);
      }
    }],
    resAfter: []
  }
});
import GetApi from './GetApi'

export default {
  GetApi: GetApi(apier),
}
