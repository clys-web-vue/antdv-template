let sender;
const BASE = '/';
const ipService = {
  login: ({account, password} = {}) => sender.post(`${BASE}login`, {account, password}),
  logout: () => sender.post(`${BASE}logout`, {}),
  reg: ({account, password} = {}) => sender.post(`${BASE}reg`, {account, password}),
  info: () => sender.post(`${BASE}info`, {}),
};
export default (_sender) => {
  sender = _sender;
  return ipService;
}
