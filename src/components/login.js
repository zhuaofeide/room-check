import React, { Component } from 'react';
import $ from "jquery";
import { connect } from 'react-redux';
import { Spin, message,Input } from 'antd';
import '../css/reset.css';
import '../css/login.css';
import TsMessage from './TsMessage';
import Footer from './footer/footer';
import {login} from '../redux/user.redux';
@connect(
    state=>state.user,
    {login}
)
class Login extends Component {
    constructor(props){
        super(props);
        console.log(this.props);
        this.state = {
            userName:window.localStorage.getItem("mobile"),
            userPassword:'',
            helpSay:"",
            ip:window.localStorage.getItem("url"),
            settingState: false,
            warnTip: false,
            messageState: false,
            rememberState: false,
            loading: false,
            _active:false
        }
    }
    //监听input中的数据
    changeUsername(e){
        let uname = e.target.value;
        this.setState({
            userName: uname
        });
    }
    changePassword(e){
        let upwd = e.target.value;
        this.setState({
            userPassword: upwd
        })
    }
    handleClick( userName, userPassword ) {
        const { history } = this.props;
        const that = this;
        // const { oUser, oPswd, oRemember } = this.refs;
        // console.log(userPassword)
        if(!userName){
            message.warning('请输入账户名');
            return
        }
        if(!userPassword){
            message.warning('请输入密码');
            return
        }
        $.ajax({
            url: `http://${ window.localStorage['url'] }/api/login`,
            method: 'POST',
            dataType: 'JSON',
            data:{
                mobile:userName,
                password:userPassword
            },
           beforeSend(){
            //    console.log(that.state)
            that.setState({
                loading: true,
                _active:true
            })
           },
           complete(){
            that.setState({
                loading: false,
                _active:false
            })
           },
            success(res) {
                // console.log(res);
                if(res.code===500){
                    message.error(res.msg);
                }else if(res.code===200||res.code===0){
                    window.localStorage.setItem("username",res.user.username);
                    window.localStorage.setItem("password",res.user.password);
                    window.localStorage.setItem("mobile",res.user.mobile);
                    window.localStorage.setItem("deptId",res.user.deptId);
                    window.localStorage.setItem("creatTime",res.user.creatTime);
                    window.localStorage.setItem("userId",res.user.userId);
                    window.localStorage.setItem("token",res.token);
                    history.push(`/home`);
                    that.props.login();
                    // this.props.history.push('/home')
                }else {
                    message.error(res.msg,2);
                }
            },
            error(res) {
                message.error('请求有误',2);
            },
    });
    }
    componentDidMount(){
        this.getCookies();
    }
    changeSetState(){
        this.setState({
            settingState: true,
            warnTip: false
        })
    }
    closeForm(){
        this.setState({
            settingState: false
        })
    }
    // 修改ip
    changeIP(e){
        this.setState({ip:e.target.value})
        this.s_ip = e.target.value
    }
    // 保存ip
    settingIP(){
        console.log(this.state.ip)
        if(!this.s_ip&&!this.state.ip){
            this.setState({
                warnTip: true
            });
            return false
        }
        if(this.s_ip){
            window.localStorage.url = this.s_ip;
            this.setState({
                settingState: false,
                warnTip: false
            });
        }

        if(this.state.ip){
            window.localStorage.url = this.state.ip;
            this.setState({
                settingState: false,
                warnTip: false
            });
        }
    }
    //将获取到的cookie填入表单
    getCookies(){
        const { oUser, oPswd } = this.refs;
        if(this.getCookie('users') && this.getCookie('pass')){
            oUser.value = this.getCookie('users');
            oPswd.value = this.getCookie('pass');
            this.setState({
                rememberState: true
            })
        }
    }
    changeCheckbox(){
        const { rememberState } = this.state;
        this.setState({
            rememberState: !this.state.rememberState
        });
        if(rememberState){
            this.delCookie('users');
            this.delCookie('pass' );
        }
    }
    setCookie(name,value,day){
        var date = new Date();
        date.setDate(date.getDate() + day);
        document.cookie = name + '=' + value + ';expires='+ date;
    }
    getCookie(name){
        var reg = RegExp(name+'=([^;]+)');
        var arr = document.cookie.match(reg);
        if(arr){
            return arr[1];
        }else{
            return '';
        }
    }
    delCookie(name){
        this.setCookie(name,null,-1);
    }
    render() {
        const { settingState, warnTip, messageState } = this.state;
        
        return (
            <div className="login-bg">
                <div  className={this.state._active ? "loading-exp" : "loading-exp2"}>
                    <Spin spinning={this.state.loading} tip="登入中..."/>
                </div>
                {messageState?<TsMessage  content="账号或密码错误" messageStyle="messageStyle" showTime={4000} icon="warning"/>:''}
                
                <div className="login-mb">
                    <p className="login-tit">清影科技-智慧医疗领跑者</p>
                    <div className="login-con">
                        <div className="login-con-form">
                            <input type="text" className="login-no" placeholder="User" value={this.state.userName} maxLength='30' ref="oUser"
                                   onChange={this.changeUsername.bind(this)}/>
                            <input type="password" className="login-pass" placeholder="Password" value={this.state.userPassword} maxLength='30' ref="oPswd"
                                   onChange={this.changePassword.bind(this)}/>
                            {/*<div className="remember_box">*/}
                                {/*<span onClick={ this.changeCheckbox.bind(this)} ref="oRemember">*/}
                                    {/*{*/}
                                        {/*rememberState?*/}
                                            {/*<img src={require("../images/pass_on.png")} className="checkBox_on"/>:*/}
                                            {/*<img src={require("../images/pass-off.png")} className="checkBox_on"/>*/}
                                    {/*}*/}
                                {/*</span>*/}
                                {/*<span style={{color: '#fff',fontSize: 14, marginLeft: 15}}>记住密码</span>*/}
                            {/*</div>*/}
                            <button className="login-btn"
                                    onClick={this.handleClick.bind(this,this.state.userName,this.state.userPassword)}>LOGIN
                            </button>
                        </div>
                    </div>
                    <Footer/>
                </div>
                {
                    settingState?
                        <div className="ipForm">
                            <img src={require("../images/close_form.png")} alt="" className="closeIcon" onClick={ this.closeForm.bind(this) }/>
                            <div className="inputStyle">
                                <div>
                                    <label>IP</label>
                                    <Input placeholder="" maxLength='30' value={this.state.ip}  onChange={ this.changeIP.bind(this) }/>
                                    {/* <input type="text" maxlength='5'  onChange={ this.changeIP.bind(this) } /> */}
                                    </div>
                            </div>
                            {
                                warnTip?<p className="warnTip">请输入完整的IP地址</p> : ''
                            }
                            <button onClick={ this.settingIP.bind(this) }>保存</button>
                        </div>:<div className="settingIp" onClick={ this.changeSetState.bind(this) }>
                            <img src={require("../images/ip.png")} alt=""/>
                        </div>
                }
            </div>
        )
    }
}

export default Login;
