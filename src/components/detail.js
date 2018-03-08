import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import ReactPlayer from 'react-player';
import Play from '../../src/images/speech.png';
import Playing from '../../src/images/play.png';
import Note from '../components/addNote/addNote'
import '../css/reset.css';
import '../css/detail.css';
import {addNote} from '../redux/user.redux';
import { Spin } from 'antd';
@connect(
    state=>state.user,
    {addNote}
)
class Detail extends Component{
    constructor(props){
        super(props);

        this.state={
            remarks:[],
            records:[],
            deptId:window.localStorage.getItem("deptId"),
            userId:window.localStorage.getItem("userId"),
            source:'',
            playing: true,
            loop:false,
            progress:'',
            note:'',
            roomId:'',
            bedId:'',
            areaId:'',
            areaName:'',
            bedName:'',
            roomName:'',
            loader:true
        }
    }
    goBack(){
        window.history.go(-1);
    }
    toSpeech(){
        const { history } = this.props;
        history.push(`/speech`);
    }
    audioTape(e){
        e.stopPropagation();
        $('.home-mask').show();
        $('.audiotape-wrap').show();
        $('.audiotape-save').hide();
        $('.audiotape-change').show();
    }
    audioAll(e){
        e.stopPropagation();
        $('.home-mask').show();
        $('.audiotape-wrap').show();
        $('.audiotape-change').hide();
        $('.audiotape-save').show();
    }

    componentDidMount(){
        console.log(this.props)
        // tab切换
        $('.detail-tab>span').click(function () {
            let index = $(this).index();
            $('.detail-show>div').eq(index).show().siblings('div').hide();
            $(this).addClass('detail-tab-click').siblings('span').removeClass('detail-tab-click');
        });
        $('.speech-bar-tell').click(function () {
            let words=$(this).html();
            $('.remark-show').text(words);
            $('.remark-textarea').hide();
            $('.remark-save').hide();
            $('.remark-text').hide();
            $('.home-mask').show();
            $('.remark-wrap').show();
            $('.remark-change').show();
            $('.remark-show').show();
        });
    }
    componentWillReceiveProps(nextProps){

        console.log(nextProps)
        const that=this;
        let page=1;
        let limit=5;
        const { deptId,userId }=this.state;
        let areaId=nextProps.area;
        let roomId=nextProps.room;
        let bedId=nextProps.bed;
        let status='1';
        //备注详情
        $.ajax({
            url: `http://${ window.localStorage['url'] }/api/remark/listquery`,
            method: 'POST',
            dataType: 'JSON',
            data:{
                page,
                limit,
                deptId,
                areaId,
                roomId,
                bedId,
                userId,
                status,
                loading:false
            },
            beforeSend(){
                that.setState({
                    loader:true
                })
            },
            complete(){
                that.setState({
                    loader:false
                })
            },
            success(res) {
                console.log(res);
                if(res.code===200&&res.remarkList){
                    if(res.remarkList.length>0){
                        that.setState({
                            remarks:res.remarkList,
                            roomId:res.remarkList[0].roomId,
                            bedId:res.remarkList[0].bedId,
                            areaId:res.remarkList[0].areaId,
                            areaName:res.remarkList[0].areaName,
                            bedName:res.remarkList[0].bedName,
                            roomName:res.remarkList[0].roomName
                        })
                    }else {
                        that.setState({
                            remarks:[]
                        })
                    }
                }else {
                }
            },
            error(res) {
                console.log("error")
            },
        });
        //录音详情
        $.ajax({
            url: `http://${ window.localStorage['url'] }/api/record/queryRecord`,
            method: 'POST',
            dataType: 'JSON',
            data:{
                page,
                limit,
                deptId,
                areaId,
                roomId,
                bedId,
                userId,
                status
            },
            success(res) {
                if(res.code===200&&res.recordEntities){
                    if(res.recordEntities.length>0){
                        that.setState({
                            records:res.recordEntities
                        })
                    }else {
                        that.setState({
                            records:[]
                        })
                    }
                }else {
                    console.log("失败")
                }
            },
            beforeSend(){
                that.setState({
                    loader:true
                })
            },
            complete(){
                that.setState({
                    loader:false
                })
            },
            error(res) {
                console.log("error")
            },
        })
    }
    getRecode(){

    }
    //添加备注
    // addNote(){
    //     console.log(this.state)
    //    this.setState({
    //        note:this.state.bedId
    //    })
    // }
    handleLogin(){
        console.log(this.state);
        this.props.addNote(this.state);
    }
// 播放录音
//     players(flie){
//         console.log(flie);
//         this.setState({
//             playing:true,
//             source:'http://52.80.184.16'+flie
//         });
//         console.log(this.state.source);
//
//     }
    players(flie, item) {
        console.log(flie);
        console.log(item);
        let that =this;
        let audio = document.getElementById('music');
        audio.oncanplay = console.log("Can start playing video");
        // audio.ended;
        that.setState({
            playing: true,
            source: 'http://52.80.184.16' + flie
        });
        if (audio !== null) {
            //检测播放是否已暂停.audio.paused 在播放器播放时返回false.
            if (audio.paused) {
                console.log('播放');
                audio.play();       // 这个就是播放
            } else {
                audio.pause();// 这个就是暂停
                // audio.load();
                // that.setState({
                //     // playing: true,
                //     source: ''
                // });
                console.log('重播')
            }
            // audio.addEventListener('ended', function () {
            //
            // }, false);
        }
        //下载完后
        audio.oncanplay = function () {
            console.log(audio.duration);
            let duration=audio.duration;
            if (duration < 60) {
                return that.setState({progress: duration.toFixed(2) + `″`})
            }
            if (duration > 60) {
                let minute = Math.floor(duration) / 60;
                let seconds = duration.toString().replace(/\d+\.(\d*)/, "$1");
                return that.setState({progress: minute + `′` + seconds + `″`})
            }
        };
        //播放中
        audio.ontimeupdate = function () {
            // console.log(audio.duration);
        };
        // 播完
        audio.onended=function () {
            console.log('结束')
            that.setState({
                // playing: true,
                source: ''
            });
        }
        // audio.play();
    }
    //播放录音结束
    onEnded = () => {
        console.log('onEnded')
        this.setState({ source: null, playing: false })
    };
    //长度
    onDuration = (duration) => {
        console.log('onDuration', duration);
        console.log(typeof(duration.toFixed(0)));
        if(duration<60){
            return this.setState({ progress:duration.toFixed(2)+`″`})
        }
        if(duration>60){
            let minute=Math.floor(duration)/60;
            let seconds=duration.toString().replace(/\d+\.(\d*)/,"$1");
            return this.setState({ progress:minute+`′`+seconds+`″`})
        }
    };
    // 进度
    onProgress = state => {
        console.log('onProgress', state);
        // this.setState({ progress: state.loadedSeconds });
        // We only want to update time slider if we are not currently seeking
        if (!this.state.seeking) {
            this.setState(state)
        }
    };
    render(){
        // console.log(this.props);
        const { playing,loop,source,progress } = this.state;
        // const note=this.state.note;
        let dataRemark=this.state.remarks;
        let dataRecord=this.state.records;
        //录音
        let recordAll=dataRecord.length?dataRecord.map((item,index)=>{
            return <div className="speech-card" key={index}>
                <div className="speech-card-msg">
                    <span>{item.createTime}</span>
                    <span className="speech-delete" onClick={this.props.removeRecord.bind(this,'record',item.id)}>
                        <img src={require("../images/delete.png")} alt=""/>
                    </span>
                </div>
                <div className="speech-bar">
                    <div className="speech-bar-pic" onClick={this.players.bind(this, item.address)}>
                        <img src={this.state.source==='http://52.80.184.16'+item.address ? Playing : Play} alt="" />
                    </div>
                    <div className="speech-bar-time">{this.state.source==='http://52.80.184.16'+item.address ? progress : null}</div>
                </div>
                <div className="speech-bar-tell" onClick={this.props.showWords.bind(this,'changeRecord',item.context,item.id)}>{item.context}</div>
            </div>
        }):<div className="detail-nospeech">当前没有录音</div>;
        //备注
        let remarkAll=dataRemark.length?dataRemark.map((item,index)=>{
            return <div className="speech-card" key={index}>
                <div className="speech-card-msg">
                    <span>{item.createTime}</span>
                    <span className="speech-delete" onClick={this.props.removeRemark.bind(this,'remark',item.id)}>
                        <img src={require("../images/delete.png")} alt="" />
                    </span>
                </div>

                <div className="detail-text">
                    <div className="detail-note-bar" onClick={this.props.showRemark.bind(this,'change',item.context,item.id,item,item.images)}>{item.context}</div>
                    {item.images.length===0?<span>&nbsp;</span>:<div className="detail-have">
                        <img src={require("../images/image.png")} alt=""/>
                    </div>}
                </div>


            </div>
        }):<div className="detail-nospeech">当前没有备注</div>;
        return(
            <div className="detail-right">
                <div className="detail-box">

                <div className="detail-tab">
                    <span className="detail-tab-click">录音</span>
                    <span>备注</span>
                </div>
                <div className="detail-show">
                    {/*录音*/}
                    <div className="detail-main">
                        {this.state.loader?<div className="recode-loader"><Spin /></div>:null}
                        {recordAll}
                        {/*<div className="speech-card">*/}
                            {/*<div className="speech-card-msg">*/}
                                {/*<span>2017-12-08 18:00</span>*/}
                                {/*<span className="speech-again">重新上传</span>*/}
                                {/*<span className="speech-delete">*/}
                                    {/*<img src={require("../images/delete.png")} alt=""/>*/}
                                {/*</span>*/}
                            {/*</div>*/}
                            {/*<div className="speech-bar">*/}
                                {/*<div className="speech-bar-pic">*/}
                                    {/*<img src={require("../images/speech.png")} alt=""/>*/}
                                {/*</div>*/}
                                {/*<div className="speech-bar-time">1'12"</div>*/}
                            {/*</div>*/}
                            {/*<div className="speech-bar-tell">语音未转换</div>*/}
                        {/*</div>*/}
                        {/*<div className="speech-card">*/}
                            {/*<div className="speech-card-msg">*/}
                                {/*<span>2017-12-08 18:00</span>*/}
                                {/*<span className="speech-delete">*/}
                                            {/*<img src={require("../images/delete.png")} alt=""/>*/}
                                        {/*</span>*/}
                            {/*</div>*/}
                            {/*<div className="speech-bar">*/}
                                {/*<div className="speech-bar-pic">*/}
                                    {/*<img src={require("../images/speech.png")} alt=""/>*/}
                                {/*</div>*/}
                                {/*<div className="speech-bar-time">1'12"</div>*/}
                            {/*</div>*/}
                            {/*<div className="speech-bar-tell">111原始文字是人类用来纪录特定事物、简化图像而成的书写符号。文字在发展早期都是图画形式的，有些是以形表意，有些是以形表音，其中有表意文字，与语音无甚关</div>*/}
                        {/*</div>*/}
                    </div>
                    {/*备注*/}
                    <div className="detail-note">
                        {this.state.loader?<div className="recode-loader"><Spin /></div>:null}
                        {remarkAll}
                        {/*<div className="speech-card">*/}
                            {/*<div className="speech-card-msg">*/}
                                {/*<span>2017-12-08 18:00</span>*/}
                                {/*<span className="speech-again">重新上传</span>*/}
                                {/*<span className="speech-delete">*/}
                                            {/*<img src={require("../images/delete.png")} alt=""/>*/}
                                        {/*</span>*/}
                            {/*</div>*/}
                            {/*<div className="detail-note-bar" onClick={this.loadRemark.bind(this)}>原始文字是人类用来纪录特定事物、简化图像而成的书写符号。文字在发展早期都是图画形式的，有些是以形表意，有些是以形表音，其中有表意文字，与语音无甚关系</div>*/}
                        {/*</div>*/}
                        {/*<div className="speech-card">*/}
                            {/*<div className="speech-card-msg">*/}
                                {/*<span>2017-12-08 18:00</span>*/}
                                {/*<span className="speech-delete">*/}
                                    {/*<img src={require("../images/delete.png")} alt=""/>*/}
                                {/*</span>*/}
                            {/*</div>*/}
                            {/*<div className="detail-text">*/}
                                {/*<div className="detail-note-bar">222222222原始文字是人类用来纪录特定事物、简化图像而成的书写符号。文字在发展早期都是图画形式的，有些是以形表意，有些是以形表音，其中有表意文字，与语音无甚关系</div>*/}
                                {/*<div className="detail-have">*/}
                                    {/*<img src={require("../images/image.png")} alt=""/>*/}
                                {/*</div>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                        <div className="detail-add" onClick={this.handleLogin.bind(this)}>
                            <img src={require("../images/add.png")} alt=""/>
                        </div>
                    </div>
                </div>
                </div>
                <div className="audioPlay">
                    <audio src={this.state.source} controls={true} autoPlay={true} id="music">
                        您的浏览器不支持 audio 标签。
                    </audio>
                    {/*<ReactPlayer*/}
                        {/*url={source}*/}
                        {/*playing={playing}*/}
                        {/*loop={loop}*/}
                        {/*onProgress={this.onProgress}*/}
                        {/*onDuration={this.onDuration}*/}
                        {/*onEnded={this.onEnded}*/}
                    {/*/>*/}
                    {/*<audio*/}
                        {/*src={source}*/}
                    {/*>*/}
                        {/*您的浏览器不支持 audio 标签。*/}
                    {/*</audio>*/}
                </div>
                {this.props.bedId?<Note checked={this.props} />:null}
            </div>
        )
    }
}
export default Detail;