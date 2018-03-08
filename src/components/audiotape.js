import React, {Component} from 'react';
import { message } from 'antd';
import $ from 'jquery';
import '../css/reset.css'
import '../css/audiotape.css';
import animations from 'jparticles';
import Recorder from './recorder';

let audio_context;
let recorder;
// let golablRecoder = 'http://'+localStorage.getItem("url")+ '/api/record/saveGlobalRecord';
//
// let bedRecoder = 'http://'+localStorage.getItem("url") + '/api/record/saveSingleRecord';

class Audiotape extends Component {
    constructor(props) {
        super(props);
        // console.log(this.props)
        this.state = {
            isClickable: true,
            areas: '',
            rooms: '',
            beds: '',
            text: "点击录音",
            _active: 1
        }
    }

    componentDidMount() {
        new animations.wave('#audiotape-wave', {
            num: 3,
            // 不填充
            fill: false,
            // 绘制边框，即线条
            line: true,
            // 三条线依次的颜色
            lineColor: ['#E5E5E5', '#58A5FF', '#E5E5E5'],
            // 三条线依次的宽度
            lineWidth: [.5, .9, .5],
            // 三条线依次距左的偏移值
            offsetLeft: [1, 2, 0],
            // 三条线都向上偏移容器高度的 0.75 倍
            offsetTop: .5,
            // 三条线依次的波峰高度
            crestHeight: [8, 18, 14],
            // 三条线都只有两个波峰（波纹）
            rippleNum: 1,
            speed: .1
        });
        this.init();
    }

    init() {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
            window.URL = window.URL || window.webkitURL;
            audio_context = new AudioContext();
        } catch (e) {
            message.error('No web audio support in this browser!');
        }
        navigator.getUserMedia({audio: true}, this.startUserMedia, function (e) {

        });
    }

    startUserMedia(stream) {
        let input = audio_context.createMediaStreamSource(stream);
        recorder = new Recorder(input);
    }

    startRecording() {
        recorder && recorder.record();
    }

// 结束录音
    stopRecording() {
        // console.log("stop recording.........");
        recorder && recorder.stop();
        this.audioUpload();
        recorder.clear();
    }

    // 全局录音
    audioUpload(url, id) {
        // console.log(url);
        recorder && recorder.exportWAV(function (blob, type) {
            let data = new FormData();
            data.append('file', blob);
            data.append('userId', id);
            // console.log(data);
            $.ajax({
                type: 'POST',
                url: url,
                cache: false,
                processData: false,         //需要正确设置此项
                contentType: false,
                enctype: 'multipart/form-data',    //需要正确设置此项
                data: data,
                success(res) {
                    console.log(res);
                    if(res.code===200){
                        message.success('录音成功',1);
                    }else{
                        message.error(res.msg);
                    }
                    recorder.clear();
                },
                error(res) {
                    message.error('响应错误');
                    // console.log('error');
                    recorder.clear();
                }
            });
        });
    }

    // 局部录音
    audioUpload2(url, id, bedsId, roomIds, areaIds, deptId, userId) {
        // console.log(url);
        recorder && recorder.exportWAV(function (blob, type) {
            let data = new FormData();
            data.append('file', blob);
            data.append('userId', userId);
            data.append('deptId', deptId);
            data.append('areaId', areaIds);
            data.append('roomId', roomIds);
            data.append('bedId', bedsId);
            data.append('userId', id);

            // console.log(data);
            $.ajax({
                type: 'POST',
                url: url,
                cache: false,
                processData: false,         //需要正确设置此项
                contentType: false,
                enctype: 'multipart/form-data',    //需要正确设置此项
                data: data,
                success(res) {
                    console.log(res);
                    if(res.code===200){
                        message.success('录音成功',1);
                    }else{
                        message.error(res.msg);
                    }
                    recorder.clear();
                },
                error(res) {
                    message.error('响应错误');
                    console.log('error');
                    recorder.clear();
                }
            });
        });
    }

    // 关闭录音层
    closeAudio(stat) {
        // 局部上传录音
        if (this.props.msg.bedsId) {
            if (this.state.text === '正在录音...') {
                console.log("stop recording.........");

                recorder && recorder.stop();

                let url = 'http://' + localStorage.getItem("url") + '/api/record/saveSingleRecord';

                let bedsId = this.props.msg.bedsId;

                let roomIds = this.props.msg.roomIds;

                let areaIds = this.props.msg.areaIds;

                let deptId = this.props.msg.deptId;

                let userId = localStorage.getItem("userId");

                this.audioUpload2(url, bedsId, roomIds, areaIds, deptId, userId);
                recorder.clear();
                this.setState({
                    text: '录音结束',
                    _active: 1
                })
            }
            $('.audiotape-wrap').hide();
            $('.home-mask').hide();
            return;
        }
        // 全局上传录音
        if (this.state.text === '正在录音...') {

            console.log("stop recording.........");

            recorder && recorder.stop();

            let url = 'http://' + localStorage.getItem("url") + '/api/record/saveGlobalRecord';

            this.audioUpload(url);

            recorder.clear();
            this.setState({
                text: '录音结束',
                _active: 1
            })
        }
        $('.audiotape-wrap').hide();
        $('.home-mask').hide();
    }

    // 开始录音
    myRecoder() {
        console.log(localStorage.getItem("url"));
        let golablRecoder = 'http://' + localStorage.getItem("url") + '/api/record/saveGlobalRecord';
        // console.log(golablRecoder);
        recorder && recorder.record();
        this.setState({
            text: '正在录音...',
            _active: 0
        });
        // 局部上传录音
        if (this.props.msg.bedsId) {
            console.log(this.props.msg.bedsId);
            if (this.state.text === '正在录音...') {

                console.log("stop recording.........");

                recorder && recorder.stop();

                let url = 'http://' + localStorage.getItem("url") + '/api/record/saveSingleRecord';

                console.log(url);

                let id = this.props.msg.userId;

                let bedsId = this.props.msg.bedsId;

                let roomIds = this.props.msg.roomIds;

                let areaIds = this.props.msg.areaIds;

                let deptId = this.props.msg.deptId;

                let userId = localStorage.getItem("userId");

                this.audioUpload2(url, id, bedsId, roomIds, areaIds, deptId, userId);
                recorder.clear();
                this.setState({
                    text: '录音结束',
                    _active: 1
                })
            }
            return
        }
        // 全局上传录音
        if (this.state.text === '正在录音...') {
            console.log("stop recording.........")
            recorder && recorder.stop();
            let url = golablRecoder;
            let id = this.props.msg.userId;
            // console.log(id);
            this.audioUpload(url, id);
            recorder.clear();
            this.setState({
                text: '录音结束',
                _active: 1
            })
        }
    }

    render() {
        // console.log(this.props.msg.status);

        const area = this.props.msg.areas;
        const room = this.props.msg.rooms;
        const bed = this.props.msg.beds;
        const text = this.state.text;
        const active = this.state._active;
        const recoderTexts = this.props.msg.recoderText;
        // console.log(recoderTexts);
        return (
            <div className="audiotape-wrap">
                <div className="audiotape-close">
                    <span>&nbsp;</span>
                    <img src={require("../images/close.png")} alt=""
                         onClick={this.closeAudio.bind(this, this.props.msg)}/>
                </div>
                <div className="audiotape-micro">
                    {/* 点击录音 */}
                    <div className={active ? "audiotape-micro-ico" : 'audiotape-micro-ico2'}
                         onClick={this.myRecoder.bind(this)}>
                        <div>
                            {/*recorder*/}
                            {/* <button onClick={this.startRecording.bind(this)}>开始录音</button>
                             <br/>

                             <button onClick={this.stopRecording.bind(this)}>停止录音</button> */}
                        </div>
                    </div>
                </div>
                <div className="audiotape-text">
                    <p className="audiotape-state">{text}</p>
                    {this.props.msg.status? <p className="audiotape-detail ">{area} {room} {bed}床</p> : null}
                    {/* <p className="audiotape-detail audiotape-change">{area}  {room}  {bed}病床</p> */}
                    <p className="audiotape-prompt ">{recoderTexts}</p>
                    {/*<p className="audiotape-save">录音完毕后，录音将会保存到录音缓存内</p>*/}
                    <div id="audiotape-wave"></div>
                </div>

            </div>
        )
    }
}

export default Audiotape;