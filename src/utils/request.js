
import { message } from 'antd';
import apimap from './api';
function parseJSON(response) {
  return response.json();
}


// 校验状态，
// res：整个obj作为参数校验，并返回 obj/false
export function checkStatus(res) {
  if(res.success) {
    return res;
  } else {
    return false;
  }
}

export default function request(api, options) {
  url = apimap[api];
  if(window.proxy) {
    if(!url.includes('http')) {
      url = `${window.proxy}${url}`;
    }
  } 
  let params = null;
  let method = 'get';
  let body = null;
  let postParams = null;

  try {
    params = options.params;
    body = options.body;
    postParams = options.postParams;
    method = options.method.toUpperCase();
  } catch (error) {
    console.error(new Error('请输入参数'));
  }

  let arr = ['DELETE', 'PUT'];
  let data = null;

  let obj = {
    method: method,
    url
  };

  if(postParams) {
    obj.data = postParams;
  } else {
    obj.params = body;
  }

  obj.headers = {
    'Content-type': 'application/json;charset=UTF-8',
    'userId': 1
  };
  return axios(obj)
    .then((json) => {
      let res = json.data;
        if(res.code == 301 || res.code == 500) {
          location.hash = '#/';
          return res;
        } else {
        return res;
      }
    });

}
