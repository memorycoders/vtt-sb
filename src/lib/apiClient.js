// @flow
import axios from 'axios';
import { normalize } from 'normalizr';
import qs from 'qs';
import { type StoreT } from 'store';
import config from '../../config';
import { requestLogout } from '../components/Auth/auth.actions';
import { KEY_ERROR } from '../Constants';
const { host, protocol, route } = config.clientConfig.api;
const { auth } = config.clientConfig;
const ipInfoEP = 'https://ipinfo.io/';
const redirectFortnox = 'fortNox/autoLogin';
const apiGeSessionIdFortnox = 'fortNox/redirect';

export const API_URL = route ? `${protocol}://${host}` : `${protocol}://${host}`;
const AUTH_URL = `${auth.protocol}://${auth.host}`;
const UPLOAD_URL = `${protocol}://${host}`;
type QueryT = {
  token?: string,
  enterpriseID?: string,
};
type RequestT = {
  schema?: {},
  data?: {},
  query?: QueryT,
  resource: string,
};
type MethodT = 'get' | 'put' | 'post' | 'delete';
type DataT = {
  error?: string,
};
type ResponseT = {
  data: DataT,
};
type EndPointT = (resource: string, data: {}, options?: {}) => ResponseT;
type APIT = {
  get: EndPointT,
  post: EndPointT,
  put: EndPointT,
  delete: EndPointT,
};
type ClientMethodT = (RequestT) => DataT;

class API {
  store: StoreT;
  axios: APIT;
  auth: APIT;
  uploadEndpoint: APIT;
  sign: EndPointT;
  get: ClientMethodT;
  post: ClientMethodT;
  put: ClientMethodT;
  delete: ClientMethodT;

  constructor() {
    const configHeader = {
      'X-Gravitee-Api-Key': 'd5c9a59e-c9a1-4093-9fe0-cdc6957150ef',
      // 'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      Accept: '*/*',
      // 'Cache-Control': 'no-cache',
    };
    this.axios = axios.create({
      baseURL: API_URL,
      headers: this.store?.getState()?.auth?.token && {
        Authorization: this.store?.getState()?.auth?.token,
      },
      // headers: configHeader,
    });
    this.uploadEndpoint = axios.create({
      baseURL: UPLOAD_URL,
      headers: this.store?.getState()?.auth?.token && {
        Authorization: this.store?.getState()?.auth?.token,
      },
      // headers: configHeader,
    });
    this.auth = axios.create({
      baseURL: AUTH_URL,
      headers: this.store?.getState()?.auth?.token && {
        Authorization: this.store?.getState()?.auth?.token,
      },
      // headers: configHeader,
    });

    this.post = this.createMethod('post', this.axios);
    this.get = this.createMethod('get', this.axios);
    this.delete = this.createMethod('post', this.axios);
    this.put = this.createMethod('post', this.axios);
  }

  setStore(store: StoreT) {
    this.store = store;
    this.axios = axios.create({
      baseURL: API_URL,
      headers: store?.getState()?.auth?.token
        ? {
            Authorization: store?.getState()?.auth?.token,
          }
        : {},
    });
    // this.axios.interceptors.request.use(
    //   function(config) {
    //     // Do something before request is sent
    //     if (store?.getState()?.auth?.token) {
    //       config.headers.Authorization = store?.getState()?.auth?.token;
    //     }
    //     return config;
    //   },
    //   function(error) {
    //     // Do something with request error
    //     return Promise.reject(error);
    //   }
    // );
  }

  // For After Login Request
  createMethod(method: MethodT, api: APIT) {
    return async ({ resource, data = {}, query = {}, schema, options = {} }: RequestT) => {
      try {
        const auth = this.store.getState().auth;

        const optionsWrap = {
          // headers: {},
          ...options,
          headers: {
            Authorization: auth.token,
          },
        };
        const queryParams = {
          ...query,
        };

        if (resource) {
          if (
            resource === ipInfoEP ||
            resource?.includes(redirectFortnox) ||
            resource?.includes(apiGeSessionIdFortnox) ||
            resource?.includes('reloadCaptchaImg') ||
            resource?.includes('captchaImg')
          ) {
            // If endpoint doesn't need authen token -> come here
            if (auth.token) {
              queryParams.token = auth.token;
              queryParams.enterpriseID = auth.enterpriseID;
            }
            const queryString = qs.stringify(queryParams);

            const response = await api[method](`${resource}?${queryString}`, data, optionsWrap);

            const result = response.data;

            if (result.error) {
              console.log('------vao day 1');
              throw new Error(result.error);
            }
            if (schema) {
              return normalize(result, schema);
            }

            return result;
          } else if (auth.token) {
            queryParams.token = auth.token;
            queryParams.enterpriseID = auth.enterpriseID;
            const queryString = qs.stringify(queryParams);
            let response;

            // try {
            //   api.interceptors.request.use(
            //     function(config) {
            //       // Do something before request is sent
            //       if (this.store?.getState()?.auth?.token) {
            //         config.headers.Authorization = this.store?.getState()?.auth?.token;
            //       }
            //       return config;
            //     },
            //     function(error) {
            //       // Do something with request error
            //       return Promise.reject(error);
            //     }
            //   );
            // } catch(e) {
            //   console.log('EORORRROOROR:', e)
            // }

            // if (method === 'delete') {
            //   response = await api[method](`${resource}?${queryString}`, optionsWrap);
            // } else {
            //   response = await api[method](`${resource}?${queryString}`, data, optionsWrap);
            // }
            if (method === 'delete') {
              response = await api.post(`${resource}?${queryString}`, {
                ...optionsWrap,
                headers: {
                  Authorization: auth.token,
                },
              });
            } else if (method === 'get') {
              response = await api.get(`${resource}?${queryString}`, {
                ...optionsWrap,
                headers: {
                  Authorization: auth.token,
                },
              });
            } else if (method === 'post') {
              response = await api.post(`${resource}?${queryString}`, data, {
                ...optionsWrap,
                headers: {
                  Authorization: auth.token,
                },
              });
            } else if (method === 'put') {
              response = await api.post(`${resource}?${queryString}`, data, {
                ...optionsWrap,
                headers: {
                  Authorization: auth.token,
                },
              });
            }
            const result = response.data;
            if (result.error) {
              throw new Error(result.error);
            }
            if (schema) {
              return normalize(result, schema);
            }

            return result;
          }
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errorMessage === 'TOKEN_EXPIRED_OR_DOESNT_EXIST'
        ) {
          this.store.dispatch(requestLogout(true));
        }
        if (error?.response?.data?.errorMessage === 'STRIPE_ERROR') {
          throw error?.response?.data;
        }
        if (error.response && error.response.data && KEY_ERROR[error.response.data.errorMessage]) {
          // TODO: Translate API Errors
          throw new Error(error.response.data.errorMessage);
        }

        // return Promise.reject(error);
        // throw error;
      }
    };
  }

  forgotNewPass = async (data: {}, query: {}) => {
    try {
      const queryString = qs.stringify(query);
      const response = await this.axios.post(
        `enterprise-v3.0/user/requestForgotPasswordNew?${queryString}`,
        data,
        query
      );
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.errorMessage);
      }
      throw error;
    }
  };

  existedEmail = async (query: {}) => {
    try {
      const queryString = qs.stringify(query);
      const response = await this.axios.get(`enterprise-v3.0/user/checkExisting?${queryString}`, query);
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.errorMessage);
      }
      throw error;
    }
  };

  register = async (data: {}, query: {}, schema: {}) => {
    try {
      const queryString = qs.stringify(query);
      const response = await this.axios.post(`enterprise-v3.0/company/requestSetupNew?${queryString}`, data, query);

      if (response.data.error) {
        throw new Error(response.data.error);
      }
      if (schema) {
        return normalize(response.data, schema);
      }
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.errorMessage);
      }
      throw error;
    }
  };

  login = async (data: {}, query: {}, schema: {}) => {
    try {
      const queryString = qs.stringify(query);
      const response = await this.axios.post(`enterprise-v3.0/user/loginWithCaptcha?${queryString}`, data, query);
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      if (schema) {
        return normalize(response.data, schema);
      }
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.errorMessage);
      }
      throw error;
    }
  };

  logout = async () => {
    try {
      const response = await this.axios.post('enterprise-v3.0/user/logout');
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.errorMessage);
      }
      throw error;
    }
  };

  download = (props) => {
    const auth = this.store.getState().auth;

    const { startDate, endDate, periodType, userId, reportType, isUnit } = props;
    return fetch(
      `${API_URL}/report-v3.0/export/singleReport/excel/${reportType}?startDate=${startDate}&endDate=${endDate}&periodType=${periodType}&token=${
        auth.token
      }&enterpriseID=${auth.enterpriseID}&react=true${
        isUnit ? `&unitId=${userId}` : userId ? `&userId=${userId}` : ''
      }`,
      {
        responseType: 'blob',
        headers: {
          Accept: 'application/xls',
        },
      }
    ).then((response) => {
      return response.blob();
    });
  };
}

const api = new API();

export default api;
