import React, {Component} from 'react';
import axios from 'axios';
import $ from 'jquery';
import '../css/reset.css';
import '../css/speech.css';
import Audiotape from './audiotape';
import Chose from './chose';
import Delete from './delete';
import Remark from './remark';
import noDataimage from '../images/no-data.png';
import {connect} from 'react-redux';
import {recodeList} from '../redux/user.redux';
// import ReactAudioPlayer from 'react-audio-player';
import ReactPlayer from 'react-player';
import Play from '../../src/images/speech.png';
import Playing from '../../src/images/play.png';
@connect(
    state => state.user,
    {recodeList}
)
class Speech extends Component {
    constructor() {
        super();
        this.state = {
            deptId: window.localStorage.getItem("deptId"),
            userId: window.localStorage.getItem("userId"),
            speechList: [],
            speechId: '',
            removeType: '',
            options: '',
            context: '',
            saveType: '',
            areaname: '全局录音',
            roomname: '',
            bedname: '',
            recoder: "",
            source: '',
            playing: true,
            loop: false,
            progress: '',
            url: []
        }
    }

    toChose(id) {
        $('.home-mask').show();
        $('.delete-wrap').hide();
        $('.audiotape-wrap').hide();
        $('.chose-wrap').show();
        const that = this;
        let page = 1;
        let limit = 100;
        const {deptId} = this.state;
        $.ajax({
            url: `http://${window.localStorage['url']}/api/area/list`,
            method: 'POST',
            dataType: 'JSON',
            data: {
                page,
                limit,
                deptId
            },
            success(res) {
                that.setState({
                    speechId: id
                });
                if (res.code === 200 || res.code === 0) {
                    // let arr=[];
                    // for(let i=0;i<res.page.list.length;i++){
                    //     arr.push(res.page.list[i].areaName)
                    // }
                    // let obj = [];
                    // arr.map((item, index)=>{
                    //     let _obj = {};
                    //     _obj['value'] = arr[index];
                    //     obj[index] = _obj;
                    //     // Object.assign(obj, {index:item})
                    // })
                    that.setState({
                        options: res.page.list
                    })
                } else {
                    console.log("error")
                }
            },
            error(res) {
                console.log("error")
            },
        });
    }

    // 返回
    // goBack() {
    //     window.history.go(-1);
    // }
    back = () => {
        this.props.history.goBack(-1);
    };

    audioAll(e) {
        e.stopPropagation();
        this.setState({
            recoder: 1,
            recoderText: '全局录音'
        });
        $('.home-mask').show();
        $('.delete-wrap').hide();
        $('.chose-wrap').hide();
        $('.audiotape-wrap').show();
        $('.audiotape-change').hide();
        $('.audiotape-save').show();
    }

    componentDidMount() {
        axios.post(`http://${window.localStorage['url']}/api/record/queryRecord`, {userId: 2, status: 1})
            .then(res => {
                console.log(res)
            });
        this.getList()
    }
    componentWillUnmount(){
        //重写组件的setState方法，直接返回空
        this.setState = (state,callback)=>{
            return;
        };
    }
    //获取录音

    getList() {
        const that = this;
        console.log(this.state);
        const {userId} = this.state;
        let status = '2';
        $.ajax({
            url: `http://${window.localStorage['url']}/api/record/queryRecord`,
            method: 'POST',
            dataType: 'JSON',
            data: {
                // deptId,
                userId,
                status
            },
            success(res) {
                console.log(res);
                if (res.code === 200 || res.code === 0) {
                    // that.setState({
                    //     speechList: res.recordEntities
                    // });
                    that.props.recodeList(res.recordEntities);
                } else {
                    console.log(res.msg);
                }
            },
            error(res) {
                console.log("error")
            },
        })
    }

    getLists() {
        this.getList()
    }

    //删除语音
    deleteBar(type, id) {
        let that = this;
        setTimeout(function () {
            that.setState({
                speechId: id,
                removeType: type
            });
        });
        $('.home-mask').show();
        $('.chose-wrap').hide();
        $('.audiotape-wrap').hide();
        $('.delete-wrap').show();
    }

// 播放录音

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
        this.setState({source: null, playing: false})
    };
    //长度
    onDuration = (duration) => {
        console.log('onDuration', duration);
        console.log(typeof(duration.toFixed(0)));
        if (duration < 60) {
            return this.setState({progress: duration.toFixed(2) + `″`})
        }
        if (duration > 60) {
            let minute = Math.floor(duration) / 60;
            let seconds = duration.toString().replace(/\d+\.(\d*)/, "$1");
            return this.setState({progress: minute + `′` + seconds + `″`})
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
    //点击录音下的文字
    showWords(con, id) {
        this.setState({
            context: con,
            speechId: id,
            saveType: 'changeRecord'
        });
        $('.home-mask').show();
        $('.remark-wrap').show();
        $('.remark-play').show();
        $('.remark-change').show();
        $('.remark-show').show();
    }

    render() {
        const {playing, loop, source, progress} = this.state;
        // console.log(this.state.speechList.length);
        // console.log(this.props.list);
        // console.log(this.state.source);
        let dataSpeech = this.props.list;
        let speechAll = dataSpeech.length ? dataSpeech.map((item, index) => {
            return <div className="speech-card" key={index}>
                <div className="speech-card-msg">
                    <span>{item.createTime}</span>
                    <span className="speech-chose">
                        <img src={require("../images/chose.png")} alt="" onClick={this.toChose.bind(this, item.id)}/>
                    </span>
                    <span className="speech-delete">
                        <img src={require("../images/delete.png")} alt=""
                             onClick={this.deleteBar.bind(this, 'speech', item.id)}/>
                    </span>
                </div>
                <div className="speech-bar">
                    <div className="speech-bar-pic" onClick={this.players.bind(this, item.address, item)}>

                        <img src={this.state.source === 'http://52.80.184.16' + item.address ? Playing : Play} alt=""/>

                    </div>
                    <div
                        className="speech-bar-time">{this.state.source === 'http://52.80.184.16' + item.address ? progress : null}</div>
                </div>
                <div className="speech-bar-tell"
                     onClick={this.showWords.bind(this, item.context, item.id)}>{item.context}</div>
            </div>
        }) : <div className='noData'><img src={noDataimage} alt=""/></div>;
        return (
            <div className="speech-wrap">
                <div className="speech-header">
                    <div className="speech-arrow">
                        <img src={require("../images/arrow.png")} alt="" onClick={this.back.bind(this)}/>
                    </div>
                    <div className="speech-tit">语音日志</div>
                </div>
                <div className="speech-main">
                    {speechAll}

                    {/*<audio src="http://52.80.184.16/group1/M00/00/02/rB8LtFqeylKAM718AAtALE_RZHA703.wav" controls="controls" preload="auto">*/}
                    {/*您的浏览器不支持 audio 标签。*/}
                    {/*</audio>*/}

                    {/*<ReactPlayer url={this.state.source} playing/>*/}
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
                    {/*<span className="speech-chose">*/}
                    {/*<img src={require("../images/chose.png")} alt="" onClick={this.toChose.bind(this)}/>*/}
                    {/*</span>*/}
                    {/*<span className="speech-delete">*/}
                    {/*<img src={require("../images/delete.png")} alt="" onClick={this.deleteBar.bind(this)}/>*/}
                    {/*</span>*/}
                    {/*</div>*/}
                    {/*<div className="speech-bar">*/}
                    {/*<div className="speech-bar-pic">*/}
                    {/*<img src={require("../images/speech.png")} alt=""/>*/}
                    {/*</div>*/}
                    {/*<div className="speech-bar-time">1'12"</div>*/}
                    {/*</div>*/}
                    {/*<div className="speech-bar-tell" onClick={this.loadRemark.bind(this)}>原始文字是人类用来纪录特定事物、简化图像而成的书写符号。文字在发展早期都是图画形式的，有些是以形表意，有些是以形表音，其中有表意文字，与语音无甚关系，中国文字便是从此渐次演变而成。有些中文字可以从表面、部首、字旁看到一些联系旁通的字义。而这些特色是拼音文字所没有的。</div>*/}
                    {/*</div>*/}
                </div>
                {/*全局录音按钮*/}
                <div className="home-all" onClick={this.audioAll.bind(this)}>
                    <img src={require("../images/allmicro.png")} alt=""/>
                </div>
                {/*遮罩*/}
                <div className="home-mask">
                    <div className="home-middle">
                        <div className="home-audiotape">
                            {this.state.recoder ? <Audiotape msg={this.state}/> : null}
                            <Remark
                                areaname={this.state.areaname}
                                roomname={this.state.roomname}
                                bedname={this.state.bedname}
                                context={this.state.context}
                                record={this.state.speechId}
                                saveType={this.state.saveType}
                                img={this.state.url}
                            />
                            <Chose options={this.state.options} speech={this.state.speechId}
                                   getList={this.getList.bind(this)}/>
                            <Delete speech={this.state.speechId} removeType={this.state.removeType}
                                    getList={this.getList.bind(this)}/>
                        </div>
                    </div>
                </div>

                {/*播放录音*/}
                <div className="audioPlay">
                    <audio src={this.state.source} controls={true} autoPlay={true} id="music">
                        您的浏览器不支持 audio 标签。
                    </audio>
                    {/*<ReactPlayer*/}
                    {/*controls*/}
                    {/*ref={this.ref}*/}
                    {/*url={source}*/}
                    {/*playing={playing}*/}
                    {/*loop={loop}*/}
                    {/*onProgress={this.onProgress}*/}
                    {/*onDuration={this.onDuration}*/}
                    {/*onEnded={this.onEnded}*/}
                    {/*/>*/}
                </div>
            </div>
        )
    }
}
export default Speech;