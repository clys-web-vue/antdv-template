import axios from 'axios';
import Objs from 'nightnya-common-utils/Objs'
import {message} from "ant-design-vue";

const privateKey = Symbol();

export default class Apier {
  static REQUEST_TYPE_CONFIG = {
    'delete': {post: false}, 'get': {post: false}, 'head': {post: false}, 'options': {post: false},
    'post': {post: true}, 'put': {post: true}, 'patch': {post: true}
  };

  static DEFAULT_CONFIG = JSON.stringify({
    headers: {
      'If-Modified-Since': 0,
      'Cache-Control': 'no-cache'
    }
  });

  [privateKey] = {
    instance: null,
    config: null,
    reqHandleHeaderFn(req) {
      const config = this.config || {};
      if (!config.headerFn) return;
      config.headerFn(req.headers, req);
    },
    reqHandleDataFn(req) {
      const config = this.config || {};
      if (!config.dataFn) return;

      let data, dType, pType;
      if (req.params) {
        const paramsType = typeof req.params;
        if (paramsType === "string") {
          try {
            data = JSON.parse(req.params);
            pType = 'string';
          } catch (e) {
            console.error(e);
          }
        } else if (paramsType === "object" && req.params.constructor === Object) {
          data = req.params;
          pType = 'object';
        }
        if (data) {
          dType = 'params';
        }
      }
      if (!data && req.data) {
        const dataType = typeof req.data;
        if (dataType === "string") {
          try {
            data = JSON.parse(req.data);
            pType = 'string';
          } catch (e) {
            console.error(e);
          }
        } else if (dataType === "object" && req.data.constructor === Object) {
          pType = 'object';
          data = req.data;
        }
        if (data) {
          dType = 'data';
        }
      }
      if (data) {
        config.dataFn(data, req);
        if (pType === 'string') data = JSON.stringify(data);
        if (dType === 'params') req.params = data;
        else if (dType === 'data') req.data = data;
      }


    },
    bindInterceptors() {
      const config = this.config || {};
      const interceptors = config.interceptors || {};

      if (interceptors.reqAfter) interceptors.reqAfter.reverse().forEach(r => this.instance.interceptors.request.use(r.f, r.r));
      if (interceptors.resBefore) interceptors.resBefore.forEach(r => this.instance.interceptors.response.use(r.f, r.r));

      this.instance.interceptors.request.use((req) => {
        this.reqHandleHeaderFn(req);
        this.reqHandleDataFn(req);
        return req;
      }, (error) => Promise.reject(error));
      this.instance.interceptors.response.use(
        (res) => ((res || {}).data || {}),
        (e) => {
          // console.error(e);
          // console.dir(e);
          const response = (e.response || {});
          const data = response.data || {};
          if (!config.resNoPromptStatus || !config.resNoPromptStatus.includes(response.status)) {
            const msg = (response.status !== 500 && (data.msg || data.error || e.message)) || '服务器出错';
            const status = response.status || '';
            message.error(status + ":" + msg);
          }
          return Promise.reject({data, e});
        });

      if (interceptors.reqBefore) interceptors.reqBefore.reverse().forEach(r => this.instance.interceptors.request.use(r.f, r.r));
      if (interceptors.resAfter) interceptors.resAfter.forEach(r => this.instance.interceptors.response.use(r.f, r.r));

    }
  };


  constructor({
                baseURL = '/api',
                resNoPromptStatus = [],
                timeout = 30000,
                headers = {},
                headerFn,
                dataFn,
                interceptors = {},
              } = {}) {
    const config = Objs.merge(JSON.parse(Apier.DEFAULT_CONFIG), {
      baseURL, timeout, headers
    });
    const privates = this[privateKey];
    privates.instance = axios.create(config);
    if (typeof headerFn !== "function") headerFn = null;
    if (typeof dataFn !== "function") dataFn = null;
    privates.config = {
      headerFn,
      dataFn,
      interceptors,
      resNoPromptStatus
    };
    privates.bindInterceptors();
  }


  send = (url, data, method = 'get') => this[privateKey].instance.request({
    url,
    method,
    [(Apier.REQUEST_TYPE_CONFIG[method.toString().toLowerCase()] || {post: false}).post ? 'data' : 'params']: data,
    responseType: 'json',
  });
  get = (url, data) => this.send(url, data);
  delete = (url, data) => this.send(url, data, 'delete');
  head = (url, data) => this.send(url, data, 'head');
  options = (url, data) => this.send(url, data, 'options');
  post = (url, data) => this.send(url, data, 'post');
  put = (url, data) => this.send(url, data, 'put');
  patch = (url, data) => this.send(url, data, 'patch');
}

