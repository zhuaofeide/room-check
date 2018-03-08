import React, { Component } from 'react';
import $ from 'jquery';
import Audiotape from './audiotape';
import Remark from './remark';
import Detail from './detail';
import {Modal } from 'antd';
import Delete from "./delete";
import Loading from './loader/loading';
// import Recorder from './recorder';
import noDataimage from '../images/no-data.png';
import { connect } from 'react-redux';
import { logout,bedRecode,roomRecode,recodeDetail } from '../redux/user.redux';
import '../css/reset.css';
import '../css/home.css';
import '../css/detail.css';
// axios.defaults.baseURL = 'https://api.douban.com';
// const mapStatetoProps=(state)=>{
//     return {num: state}
// }
// const actionCreators = {login}

// Home = connect(mapStatetoProps, actionCreators)(Home);
@connect(
	state=>state.user,
	{logout,bedRecode,roomRecode,recodeDetail}
)

// let recorder;
// let audio_context;
class Home extends Component {
    constructor() {
        super();
        this.state = {
            userName: '',
            title: '',
            deptId: window.localStorage.getItem("deptId"),
            userId: window.localStorage.getItem("userId"),
            areaIds: '',
            roomIds: '',
            bedIds: '',
            list: [],
            room: [],
            bed: [],
            areaName: '',
            remarkId: '',
            recordId: '',
            removeType: '',
            areaname: '',
            roomname: '',
            bedname: '',
            context: '',
            saveType: '',
            loading: false,
            visible: false,
            modal2Visible: false,
            recoder: '',
            areas: '',
            rooms: '',
            beds: '',
            bedsId:"",
            recoderText:"",
            confirmLoading: false,
            url:[],
            status:''
        }
    }
    toSpeech() {
        console.log(this.state);
        const { history } = this.props;
        history.push(`/speech`);
    }
    toRecord() {
        this.props.history.push(`/record`);
    }
    logIt(){
            localStorage.removeItem('userId');
           this.props.logout();
    }
    logOuts() {
        let that=this;
        const confirm = Modal.confirm;
        confirm({
            title: '退出账号',
            content: '确定要退出该账号么',
            className: "vertical-center-modal",
            confirmLoading:that.state.confirmLoading,
            onOk() {
                return   that.logIt();
            },
            onCancel() { },
        });
    }
    // 下拉菜单
    dropDownMenu() {
        if ($('.home-meun').css('display') === 'none') {
            $('.home-meun').show();
            $('.home-allow').css({ 'transform': 'rotate(180deg)', 'transition': 'all 0.5s' });
        } else {
            $('.home-meun').hide();
            $('.home-allow').css({ 'transform': 'rotate(0deg)', 'transition': 'all 0.5s' });
        }
    }

    componentDidMount() {
        let username = window.localStorage.getItem("username");
        this.setState({
            userName: username,
        });
        this.addarea();
    }
    componentWillUnmount(){
        //重写组件的setState方法，直接返回空
        this.setState = (state,callback)=>{
            return;
        };
    }
    //左侧病区列表
    addarea() {
        const that = this;
        let page = 1;
        let limit = 100;
        const { deptId } = this.state;
        $.ajax({
            url: `http://${window.localStorage['url']}/api/area/list`,
            method: 'POST',
            dataType: 'JSON',
            data: {
                page,
                limit,
                deptId
            },
            beforeSend(){
                that.setState({
                    loading:true
                })
            },
            success(res) {
                console.log(res);
                if (res.code === 200 || res.code === 0) {
                    that.setState({
                        title: res.page.list[0].deptName,
                        list: res.page.list,
                    })
                    // that.state.list.length<0?that.setState({loading:false}):'';
                    // 折叠面板
                    $('.home-every>li>p').click(function () {
                        if ($(this).siblings('ul').css('display') === 'block') {
                            $(this).siblings('ul').slideUp(300);
                        } else {
                            $(this).siblings('ul').delay(200).slideDown(300).parent('li').siblings('li').children('ul').slideUp(300);
                            $(this).css({
                                'borderLeft': '4px solid #58A5FF',
                                'background-color': 'rgba(82,91,99,0.04)',
                                'color': '#58A5FF'
                            })
                                .parent('li').siblings('li').children('p').css({
                                    'borderLeft': '',
                                    'background-color': '',
                                    'color': ''
                                });
                            $('.home-every>li>ul>li').click(function () {
                                $(this).css('color', '#58A5FF').siblings('li').css('color', '');
                                $(this).parent().parent('li').siblings('li').children('ul').children('li').css('color', '');
                            })
                        }
                    })
                } else {
                    console.log("error")
                }
            },
            complete(){
                that.setState({
                    loading:false
                })
            },
            error(res) {
                that.setState({
                    loading:false
                })
                console.log("error")
            },
        });
    }
    //病区
    addRooms(id, area,item) {
        const that = this;

        // console.log(that.props.state.areaName)
        that.setState({
            areas:area
        });
        let page = 1;
        let limit = 100;
        let areaId = id;
        $.ajax({
            url: `http://${window.localStorage['url']}/api/room/list`,
            method: 'POST',
            dataType: 'JSON',
            data: {
                page,
                limit,
                areaId
            },
            success(res) {
                console.log(res);
                that.setState({
                    areaIds: areaId,
                });
                if (res.code === 200 || res.code === 0) {
                    that.setState({
                        room: res.page.list
                    });
                    if (res.page && res.page !== '' && res.page.list && res.page.list.length !== 0) {
                        that.setState({
                            areaName: res.page.list[0].areaName
                        })

                    }
                } else {
                    console.log(res.msg)
                }
            },
            error(res) {
                console.log("error")
            },
        })
    }
    //病房数据列表
    addSickbed(id, roomName,item) {
        const that = this;
        console.log(item);
        that.props.roomRecode(item);
        let page = 1;
        let limit = 100;
        let roomId = id;
        // console.log(roomName)
        that.setState({
            rooms:roomName
        });
        $.ajax({
            url: `http://${window.localStorage['url']}/api/bed/list`,
            method: 'POST',
            dataType: 'JSON',
            data: {
                page,
                limit,
                roomId
            },
            success(res) {
                console.log(res)
                that.setState({
                    roomIds: roomId
                })
                if (res.code === 200 || res.code === 0) {
                    that.setState({
                        bed: res.page.list
                    })
                } else {
                    console.log(res.msg)
                }
            },
            error(res) {
                console.log("error")
            },
        })
    }
    // 病床详情
    toDetail(id,item) {
        let that = this;
        setTimeout(function () {
            that.setState({
                bedIds: id
            });
        });
        that.props.bedRecode(item);
        $('.home-header').hide();
        $('.home-right').hide();
        $('.detail-header').show();
        $('.detail-middle').show();
        $('.detail-right').show();
        $(".home-left").attr("class", "detail-left");
    }
    //录音和备注
    tapeBars(id,item) {
        console.log(item);
        let that = this;
        setTimeout(function () {
            that.setState({
                bedIds: id
            });
            that.props.bedRecode(item);
        });
    }
    //局部录音
    audioTape(item, id, e) {
        // this.setState({
        //     recoder: 1,
        //     status:0,
        //     recoderText:'录音完毕，保存到当前病房中'
        // });
        e.stopPropagation();
        // console.log(this.state.areas);
        // console.log(this.state.rooms);
        console.log(id);
        this.setState({
            recoder: 1,
            status:1,
            recoderText:'录音完毕，保存到当前病房中',
            beds:item,
            bedsId:id,
        });
        $('.home-mask').show();
        $('.audiotape-wrap').show();
        $('.audiotape-save').hide();
        $('.audiotape-change').show();
    }
    // 全局录音
    audioAll(e) {
        console.log(this.state);
        console.log('全局录音');
        this.setState({
            recoder: 1,
            status:0,
            recoderText:'录音完毕，保存到语音日志中'
        });
        e.stopPropagation();
        $('.home-mask').show();
        $('.audiotape-wrap').show();
        $('.audiotape-change').hide();
        $('.audiotape-save').show();
    }

    loadRemark(id,item) {
        // e.stopPropagation();
        // console.log(item);
        let that = this;
        setTimeout(function () {
            that.setState({
                bedIds: id
            });
            that.showName();
        });
        that.props.bedRecode(item);
        $('.remark-textarea').val('');
        $('.remark-textarea').show();
        $('.home-mask').show();
        $('.remark-wrap').show();
        $('.remark-save').show();
        $('.remark-text').show();
    }
    //获取病区，病房，病床名称
    showName() {
        const that = this;
        const { deptId, userId } = this.state;
        let areaId = this.state.areaIds;
        let roomId = this.state.roomIds;
        let bedId = this.state.bedIds;
        let status = '1';
        $.ajax({
            url: `http://${window.localStorage['url']}/api/remark/listquery`,
            method: 'POST',
            dataType: 'JSON',
            data: {
                deptId,
                userId,
                areaId,
                roomId,
                bedId,
                status,
                RecoderText:'全局录音'
            },
            success(res) {
                console.log(res);
                if (res.code === 200 || res.code === 0) {
                    if (res.remarkList.length && res.remarkList.length !== 0) {
                        that.setState({
                            areaname: res.remarkList[0].areaName,
                            roomname: res.remarkList[0].roomName,
                            bedname: res.remarkList[0].bedName
                        })
                    }
                }
            },
            error(res) {
                console.log("error")
            },
        })
    }
    // 返回home页
    backHome() {
        $('.detail-middle').hide();
        $('.detail-right').hide();
        $('.detail-header').hide();
        $('.home-header').show();
        $('.home-right').show();
        $(".detail-left").attr("class", "home-left");
    }
    // 删除备注
    removeRemark(type, id) {
        let that = this;
        setTimeout(function () {
            that.setState({
                remarkId: id,
                removeType: type
            });
        });
        $('.audiotape-wrap').hide();
        $('.remark-wrap').hide();
        $('.home-mask').show();
        $('.delete-wrap').show();
    }
    // 删除语音
    removeRecord(type, id) {
        let that = this;
        setTimeout(function () {
            that.setState({
                recordId: id,
                removeType: type
            });
        });
        $('.audiotape-wrap').hide();
        $('.remark-wrap').hide();
        $('.home-mask').show();
        $('.delete-wrap').show();
    }
    //点击录音下的文字
    showWords(sort, con, id) {
        this.showName();
        this.setState({
            saveType: sort,
            context: con,
            recordId: id
        });
        $('.home-mask').show();
        $('.remark-wrap').show();
        $('.remark-play').show();
        $('.remark-change').show();
        $('.remark-show').show();
    }
    //点击备注下的文字
    showRemark(sort, con, id,item,url) {
        console.log(item);
        console.log(url);
        this.showName();
        this.setState({
            saveType: sort,
            context: con,
            remarkId: id,
            url:url
        });
        this.props.recodeDetail(item);
        $('.home-mask').show();
        $('.remark-wrap').show();
        $('.remark-show').show();
        $('.remark-change').show();
    }


    render() {
        const { userName, title, loading } = this.state;
        let dataRoom = this.state.room;
        let dataList = this.state.list;
        let dataBed = this.state.bed;
        // 病房
        let roomAll = dataRoom.length ? dataRoom.map((item, index) => {
            return <li key={index} onClick={this.addSickbed.bind(this, item.id, item.roomName,item)}>{item.roomName}</li>
        }) : <li >暂无病房</li>;

        // 病区
        let listAll = dataList.length ? dataList.map((item, index) => {
            return <li key={index}>
                <p onClick={this.addRooms.bind(this, item.id, item.areaName,item)}>{item.areaName}</p>
                <ul className='roomlist'>
                    {roomAll}
                </ul>
            </li>
        }) : <li><p>暂无数据</p></li>;

        // 病床
        let bedAll = dataBed.length ? dataBed.map((item, index) => {
            return <div className="home-card" key={index} onClick={this.toDetail.bind(this, item.id,item)}>
                <p className="home-card-tit">{item.bedName}</p>
                <p className="home-last">8小时前进行录音</p>
                <div className="home-operate">
                    <img src={require('../images/write.png')} alt="备注" onClick={this.loadRemark.bind(this,item.id,item)} />
                    <img src={require('../images/microphone.png')} alt="录音" onClick={this.audioTape.bind(this, item.bedName,item.id)} />
                </div>
            </div>
        }) : <div className='noData'><img src={noDataimage} alt="" /></div>;

        // 病床详情页
        let detail_bedAll = dataBed.length ? dataBed.map((item, index) => {
            return <div className="detail-card" key={index} onClick={this.tapeBars.bind(this, item.id,item)}>
                <p className="home-card-tit">{item.bedName}</p>
                <p className="home-last">8小时前进行录音</p>
                <div className="home-operate">
                    <img src={require('../images/write.png')} alt="备注" onClick={this.loadRemark.bind(this, item.id,item)} />
                    <img src={require('../images/microphone.png')} alt="录音" onClick={this.audioTape.bind(this,item.bedName,item.id)} />
                </div>
            </div>
        }) : <div className="detail-nothing">此病房还没有病床</div>;

        return (

            <div className="Home">
                {loading?<Loading tip="加载中..."/>:null}
                {/* 退出提示 */}

                <div className="home-wrap">
                    {/*home header*/}
                    <div className="home-header">
                        <div className="home-tit">清影医疗-查房系统 </div>
                        <div className="home-admin">
                            <div className="home-daily" onClick={this.toSpeech.bind(this)}>
                                <span>&nbsp;</span>
                                <span className="home-daily-image" >语音日志</span>
                                <span>&nbsp;</span>
                            </div>
                            <div className="home-avatar">
                                <b>&nbsp;</b>
                                <img src={require("../images/few.jpg")} alt="头像" className="home-portrait" />
                                <b>&nbsp;</b>
                            </div>

                            <div className="home-name" onClick={this.dropDownMenu}>
                                <span>&nbsp;</span>
                                <div className="home-name-right">
                                    <span className="home-username">{userName}</span>
                                    <span className="home-allow"></span>
                                </div>
                                <span>&nbsp;</span>
                                <ul className="home-meun">
                                    <li onClick={this.toRecord.bind(this)}>查房记录</li>
                                    <li onClick={this.logOuts.bind(this)}
                                    >注销</li>
                                </ul>
                            </div>

                        </div>
                    </div>
                    {/*详情 header*/}
                    <div className="detail-header">
                        <div className="detail-header-box">
                        <div className="speech-arrow">
                            <img src={require("../images/arrow.png")} alt="" onClick={this.backHome.bind(this)} />
                        </div>
                        <div className="detail-bed">病床详情</div>
                        <div className="detail-daily" onClick={this.toSpeech.bind(this)}>语音日志</div>
                        </div>
                    </div>
                    {/*main*/}
                    <div className="home-main">
                        {/*折叠面板*/}
                        <div className="home-left">
                            <div className="home-department">{title}</div>
                            <ul className="home-every">
                                {/*{loading?<Spin indicator={antIcon} />:{listAll}}*/}
                                {listAll}
                            </ul>
                        </div>
                        {/*病床*/}
                        <div className="home-right">
                            {bedAll}

                        </div>

                        {/*详情页病床*/}
                        <div className="detail-middle">
                            {detail_bedAll}
                        </div>
                        {/*详情*/}
                        <Detail
                            beds={this.props}
                            area={this.state.areaIds}
                            room={this.state.roomIds}
                            bed={this.state.bedIds}
                            removeRemark={this.removeRemark.bind(this)}
                            removeRecord={this.removeRecord.bind(this)}
                            showWords={this.showWords.bind(this)}
                            showRemark={this.showRemark.bind(this)}
                        />

                    </div>
                </div>

                {/*全局录音按钮*/}
                <div className="home-all" onClick={this.audioAll.bind(this)}>
                    <img src={require("../images/allmicro.png")} alt="" />
                </div>

                {/*遮罩*/}
                <div className="home-mask">
                    <div className="home-middle">
                        <div className="home-audiotape">
                            {this.state.recoder ? <Audiotape msg={this.state} /> : null}

                            <Remark
                                msg={this.props}
                                area={this.state.areaIds}
                                room={this.state.roomIds}
                                rebed={this.state.bedIds}
                                areaname={this.state.areaname}
                                roomname={this.state.roomname}
                                bedname={this.state.bedname}
                                context={this.state.context}
                                saveType={this.state.saveType}
                                remark={this.state.remarkId}
                                record={this.state.recordId}
                                img={this.state.url}
                            />
                            <Delete
                                remark={this.state.remarkId}
                                record={this.state.recordId}
                                removeType={this.state.removeType} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Home;