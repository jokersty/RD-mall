import loginInfo from './loginInfo';
import request from './request';

export default function (url, option = {}, cache) {
  return loginInfo().then(data=> {
    option.data = {...option.data, ...data};
    return request(url, option, cache);
  });
}
