import Apier from '@/core/http/Apier';

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
    resBefore: [],
    resAfter: []
  }
});

export default apier;
