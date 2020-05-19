let sender;
const BASE = '/';
const ipService = {
  json: ({lang = 'zh-CN'} = {}) => sender.get(`${BASE}json`, {lang}),
};
export default (_sender) => {
  sender = _sender;
  return ipService;
}
