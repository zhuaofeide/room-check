import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import ReactPlayer from 'react-player';
import Audiotape from './audiotape';
import Remark from './remark';
import { DatePicker } from 'antd';
// import { Spin } from 'antd';
import Play from '../../src/images/speech.png';
import Playing from '../../src/images/play.png';
import Loading from './loader/loading';
import { recodeDetail } from '../redux/user.redux';
// import noDataimage from '../images/no-data.png';
import '../css/reset.css';
import '../css/record.css';
import 'antd/dist/antd.css';
@connect(
    state=>state.user,
    {recodeDetail}
)
class Record extends Component{
    constructor(props){
        super(props);
        this.state = {
            userName: '',
            title:'',
            deptId:window.localStorage.getItem("deptId"),
            userId:window.localStorage.getItem("userId"),
            remarkEntities:[],
            recordEntities:[],
            areaId:'',
            roomId:'',
            bedId:'',
            areaname:'',
            roomname:'',
            bedname:'',
            context:'',
            remarkId:'',
            recordId:'',
            saveType:'',
            recoder: '',
            source:'',
            playing: true,
            loop:false,
            progress:'',
            loading:false,
            url:[]
        }
    }
    goBack(){
        window.history.go(-1);
    }
    audioAll(e){
        e.stopPropagation();
        this.setState({
            recoder: 1,
            recoderText:'全局录音'
        });
        $('.home-mask').show();
        $('.audiotape-wrap').show();
        $('.audiotape-change').hide();
        $('.audiotape-save').show();
    }
    componentDidMount(){
       this.showMsg();
    }
    //显示备注和语音
    showMsg(){
        const that = this;
        let page = 1;
        let limit = 100;
        let status='1';
        const { deptId,userId }=this.state;
        //显示备注和录音
        $.ajax({
            url: `http://${ window.localStorage['url'] }/api/remark/checkingRecord`,
            method: 'POST',
            dataType: 'JSON',
            data:{
                deptId,
                userId,
                status
            },
            beforeSend(){
                that.setState({
                    loading:true
                })
            },
            success(res) {
                console.log(res);
                if(res.code===200||res.code===0){
                    that.setState({
                        remarkEntities:res.remarkEntities,
                        recordEntities:res.recordEntities
                    });

                }else {
                    console.log(res.msg)
                }
            },
            complete(){
                that.setState({
                    loading:false
                })
            },
            error(res) {
                console.log("error")
            },
        });
        //显示病科
        $.ajax({
            url: `http://${ window.localStorage['url'] }/api/area/list`,
            method: 'POST',
            dataType: 'JSON',
            data: {
                page,
                limit,
                deptId
            },
            success(res) {
                if (res.code === 200||res.code===0) {
                    that.setState({
                        title: res.page.list[0].deptName,
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
    //按时间筛选
    onChange(date, dateString) {
        console.log(dateString[0],dateString[1]);
        let startTime=dateString[0];
        let endTime=dateString[1];
        let status=1;
        const { userId }=this.state;
        const that=this;
        $.ajax({
            url: `http://${ window.localStorage['url'] }/api/remark/checkingRecord`,
            method: 'POST',
            dataType: 'JSON',
            data:{
                userId,
                status,
                startTime,
                endTime
            },
            success(res) {
                console.log(res);
                if(res.code===200||res.code===0){
                    that.setState({
                        remarkEntities:res.remarkEntities,
                        recordEntities:res.recordEntities
                    })
                }else {
                    console.log(res.msg)
                }
            },
            error(res) {
                console.log("error")
            },
        })
    }

    //获取备注病区，病房，病床名称
    showName(){
        const that=this;
        let id=this.state.remarkId;
        let status='1';
        $.ajax({
            url: `http://${ window.localStorage['url'] }/api/remark/query`,
            method: 'POST',
            dataType: 'JSON',
            data:{
                id,
                status
            },
            success(res) {
                if(res.code===200||res.code===0){
                    if(res.remark&&res.remark!==''){
                        that.setState({
                            areaname:res.remark[0].areaName,
                            roomname:res.remark[0].roomName,
                            bedname:res.remark[0].bedName
                        })
                    }
                }
            },
            error(res) {
                console.log("error")
            },
        })
    }
    //获取录音病区，病房，病床名称
    getName(){
        const that=this;
        let id=this.state.recordId;
        let status='1';
        $.ajax({
            url: `http://${ window.localStorage['url'] }/api/record/queryRecord`,
            method: 'POST',
            dataType: 'JSON',
            data:{
                id,
                status
            },
            success(res) {
                console.log(res)
                if(res.code===200||res.code===0){
                    if(res.recordEntities&&res.recordEntities!==''){
                        that.setState({
                            areaname:res.recordEntities[0].areaName,
                            roomname:res.recordEntities[0].roomName,
                            bedname:res.recordEntities[0].bedName
                        })
                    }else {
                        that.setState({
                            areaname:'全局录音',
                            roomname:'',
                            bedname:''
                        })
                    }
                }
            },
            error(res) {
                console.log("error")
            },
        })
    }
    //点击备注下的文字
    showRemark(con,id,item,url){
        console.log(item);
        this.setState({
            context:con,
            remarkId:id,
            saveType:'change',
            url:url
        },()=>{
            this.showName();
        });
        this.props.recodeDetail(item);
        $('.home-mask').show();
        $('.remark-wrap').show();
        $('.remark-show').show();
        $('.remark-change').show();
    }
    //点击录音下的文字
    showWords(con,id){
        this.setState({
            context:con,
            recordId:id,
            saveType:'changeRecord'
        },()=>{
            this.getName();
        });
        $('.home-mask').show();
        $('.remark-wrap').show();
        $('.remark-play').show();
        $('.remark-change').show();
        $('.remark-show').show();
    }
    // 播放录音
    players(item,e){
        console.log(e.target);
        e.stopPropagation();
        this.setState({
            playing:true,
            source:`http://52.80.184.16`+item
        });
        console.log(this.state.source);

    }
    //播放录音结束
    onEnded = () => {
        console.log('onEnded');
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
        // const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
        const { RangePicker } = DatePicker;
        const { playing,loop,source,progress } = this.state;
        const loading = this.state.loading;
        let dataRemark=this.state.remarkEntities;
        let dataSpeech=this.state.recordEntities;
        // console.log(dataSpeech.length);
        // console.log(dataRemark.length);
        // 备注
        let remarkAll=dataRemark.length?dataRemark.map((item,index)=>{
            return <div className="speech-card" key={index}>
                    <div className="record-card-msg">
                        <span>{item.createTime}</span>
                        <span>{item.areaName}</span>
                        <span>{item.roomName}</span>
                        <span>{item.bedName?item.bedName:'无'}</span>
                        {/*<span>{item.roomName}</span>*/}
                        {/*<span>{item.bedName}</span>*/}
                    </div>
                    <div className="speech-bar-tell"
                         onClick={this.showRemark.bind(this,item.context,item.id,item,item.images)}>
                        {item.images.length===0?<span>&nbsp;</span>:<span className="recode-img">
                            <img src={require("../images/image.png")} alt=""/>
                        </span>}
                        <span className="recode-text">{item.context}</span>

                    </div>
            </div>
        }):<div><p className="no-result">暂无匹配结果</p></div>;

        //录音
        let speechAll=dataSpeech.length?dataSpeech.map((item,index)=>{
            return <div className="speech-card" key={index}>
                <div className="record-card-msg">
                    <span>{item.createTime}</span>
                    <span>{item.areaName}</span>
                    <span>{item.roomName}</span>
                    <span>{item.bedName?item.bedName:'全局录音'}</span>
                </div>
                <div className="speech-bar">
                    <div className="speech-bar-pic" onClick={this.players.bind(this, item.address)} >
                        <img src={this.state.source==='http://52.80.184.16'+item.address ? Playing : Play} alt="" />
                    </div>
                    <div className="speech-bar-time">{this.state.source==='http://52.80.184.16'+item.address ? progress : null}</div>
                </div>
                <div className="speech-bar-tell" onClick={this.showWords.bind(this,item.context,item.id)}>
                    {item.context&&item.context!==''?item.context:'没有内容'}
                </div>
            </div>
        }):null;

        return(
            <div className="speech-wrap">
                <div className="speech-header">
                    <div className="speech-header-box">
                        <div className="speech-arrow">
                            <img src={require("../images/arrow.png")} alt="" onClick={this.goBack.bind(this)}/>
                        </div>
                        <div className="speech-tit">查房记录</div>
                    </div>
                    <div className="record-chose">
                        <div className="record-time">
                            <div className="record-time-tit">日期选择</div>
                            <div className="record-picker">
                                <RangePicker onChange={this.onChange.bind(this)} />
                            </div>
                        </div>
                        <div className="record-department">{this.state.title}</div>
                    </div>
                </div>
                <div className="speech-main">

                    {loading? <Loading tip="加载中..."/>:null}
                    {speechAll}
                    {remarkAll}
                    {/*{dataRemark?===0:remarkAll}*/}
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
                                remark={this.state.remarkId}
                                record={this.state.recordId}
                                saveType={this.state.saveType}
                                img={this.state.url}
                            />
                        </div>
                    </div>
                </div>
                {/*播放录音*/}
                <div className="audioPlay">
                <ReactPlayer
                    controls
                    ref={this.ref}
                    url={source}
                    playing={playing}
                    loop={loop}
                    onProgress={this.onProgress}
                    onDuration={this.onDuration}
                    onEnded={this.onEnded}
                />
                </div>
            </div>
        );
    }
}
export default Record;