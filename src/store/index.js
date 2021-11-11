import { createStore } from 'vuex';
import axios from 'axios';

const GetAuthorizationHeader = () => {
    const AppID = import.meta.env.VITE_TDX_APP_ID;
    const AppKey = import.meta.env.VITE_TDX_APP_KEY;

    const GMTString = new Date().toGMTString();
    const ShaObj = new jsSHA('SHA-1', 'TEXT');
    ShaObj.setHMACKey(AppKey, 'TEXT');
    ShaObj.update('x-date: ' + GMTString);
    const HMAC = ShaObj.getHMAC('B64');
    const Authorization = 'hmac username="' + AppID + '", algorithm="hmac-sha1", headers="x-date", signature="' + HMAC + '"';

    return {
        Authorization: Authorization,
        'X-Date': GMTString /*, 'Accept-Encoding': 'gzip' */
    }; // 如果要將js運行在伺服器，可額外加入 'Accept-Encoding': 'gzip'，要求壓縮以減少網路傳輸資料量
};

const mainAPI = axios.create({
    method: 'get',
    baseURL: 'https://ptx.transportdata.tw/MOTC/v2/Tourism/',
    headers: GetAuthorizationHeader()
});

export default createStore({
    state: {
        showResult: []
    },
    getters: {
        resultList (state) {
            const perPage = 8;
            const newList = [];
            state.showResult.forEach((item, i) => {
                if (i % perPage === 0) {
                    newList.push([]);
                }
                const page = parseInt(i / perPage);
                newList[page].push(item);
            });
            return newList;
        }
    },
    mutations: {
        setShowResult (state, result) {
            state.showResult = result;
        }
    },
    actions: {
        async getCities () {
            try {
                const { data } = await axios({
                    method: 'get',
                    url: 'https://gist.motc.gov.tw/gist_api/V3/Map/Basic/City'
                });
                return data;
            }
            catch (error) {
                console.error(error.message);
                return [];
            }
        },
        async getShowResult (context, { name, city = '' }) {
            try {
                const { data } = await mainAPI(`${name}/${city}?$top=30&$filter=Picture/PictureUrl1 ne null`);
                return data;
            }
            catch (error) {
                console.error(error.message);
                return [];
            }
        },
        setShowResultHandler ({ commit }, result) {
            commit('setShowResult', result);
        }
    }
});