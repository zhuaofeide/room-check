// import axios from 'axios';
// import $ from 'jquery';
// import {getRedirectPath} from '../util'
// axios.defaults.baseURL = `http://${ window.localStorage['url'] }`;
const LOGIN_SUCESS = 'LOGIN_SUCESS';
const LOGIN = 'LOGIN';
const ERROR_MSG = 'ERROR_MSG';
const CLOSE_NOTE='CLOSE_NOTE';
const ADD_SUCESS='ADD_SUCESS';
const LOGIN_OUT='LOGIN_OUT';
const RECODE='RECODE';
const BEDRECODER='BEDRECODER';
const ROOMRECODER='ROOMRECODER';
const RECODEDETAIL='RECODEDETAIL';
const initState={
	redirectTo:'',
	isAuth:false,
	msg:'',
	user:'',
	type:'',
    roomId:'',
    bedId:'',
    areaId:'',
    list:[],
    rooms:[],
    beds:[],
    recode:[]
};
// reducer
export function user(state=initState, action){
    // console.log(state);
    // console.log(action);
	switch(action.type){
        case LOGIN_SUCESS:
            return {...state, msg:'已经登陆',isAuth:true,...action.payload};
		case LOGIN:
			return {...state, msg:'',isAuth:true,...action.payload};
        case LOGIN_OUT:
            return {...state, msg:'退出',isAuth:false,...action.payload};
        case ADD_SUCESS:
            return {...state, msg:'',isAuth:true,...action.payload};
		case ERROR_MSG:
			return {...state, isAuth:false, msg:action.msg};
        case CLOSE_NOTE:
            return {...state, bedId:''};
        case RECODE:
            return {...state,msg:'语音日志列表', list:action.payload};
        case ROOMRECODER:
            return {...state,msg:'房间详情', rooms:action.payload};
        case BEDRECODER:
            return {...state,msg:'床位详情', beds:action.payload};
        case RECODEDETAIL:
            return {...state,msg:'备注详情', recode:action.payload};
		default:
			return state
	}
} 

export function login(data) {
    return {type:LOGIN,payload: data}
}

export function logout(data) {
    return {type:LOGIN_OUT,payload: data}
}

export function addNote(data) {
    return {type:ADD_SUCESS,payload: data}
}

export function closeNote(data) {
    return {type:CLOSE_NOTE,payload: data}
}
//语音日志

export function recodeList(data) {
    return {type:RECODE,payload: data}
}
export function roomRecode(data) {
    return {type:ROOMRECODER,payload: data}
}
export function bedRecode(data) {
    return {type:BEDRECODER,payload: data}
}
export function recodeDetail(data) {
    return {type:RECODEDETAIL,payload: data}
}
