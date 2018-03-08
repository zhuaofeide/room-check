import React, { Component } from 'react';
import $ from 'jquery';
import '../css/reset.css';
import '../css/chose.css';
import { Select } from 'antd';
import { connect } from 'react-redux';
import { recodeList } from '../redux/user.redux';
import { message } from 'antd';
import 'antd/dist/antd.css';
const Option = Select.Option;
@connect(
    state=>state.user,
    {recodeList}
)
class Chose extends Component{

    constructor(props){
        super(props);
        this.state={
            deptId:window.localStorage.getItem("deptId"),
            userId:window.localStorage.getItem("userId"),
            rooms:[],
            beds:[],
            areaId:'',
            roomId:'',
            bedId:''
        }
    }
    closeChose(){
        $('.chose-wrap').hide();
        $('.home-mask').hide();
    }
    areaChange(value) {
        const that=this;
        let page = 1;
        let limit = 100;
        let areaId=value;
        console.log(value)
        $.ajax({
            url: `http://${ window.localStorage['url'] }/api/room/list`,
            method: 'POST',
            dataType: 'JSON',
            data: {
                page,
                limit,
                areaId
            },
            success(res) {
                console.log(res+'----------');
                that.setState({
                    areaId:areaId
                });
                if (res.code === 200||res.code===0) {
                    that.setState({
                        rooms:res.page.list,
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
    roomChange(value){
        const that = this;
        let page = 1;
        let limit = 10;
        let roomId=value;
        console.log(value)
        $.ajax({
            url: `http://${ window.localStorage['url'] }/api/bed/list`,
            method: 'POST',
            dataType: 'JSON',
            data:{
                page,
                limit,
                roomId
            },
            success(res) {
                that.setState({
                    roomId:roomId
                });
                if(res.code===200||res.code===0){
                    that.setState({
                        beds:res.page.list
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
    bedChange(value){
        let that = this;
        console.log(value)
        setTimeout(function () {
            that.setState({
                bedId:value
            });
        });
    }
    //确认
    confirBind(){
        const that = this;
        const { deptId,userId,areaId,roomId,bedId}=this.state;
        let id=this.props.speech;
        console.log(this.props);
        console.log(roomId);
        console.log(bedId);
        console.log(areaId);
        let status='1';
        if(!areaId){
            return message.warning('请选择病区');
        }
        if(!roomId){
            return message.warning('请选择房间');
        }
        if(!bedId){
            return message.warning('请选择床号');
        }
        $.ajax({
            url: `http://${ window.localStorage['url'] }/api/record/update`,
            method: 'POST',
            dataType: 'JSON',
            data:{
                deptId,
                userId,
                areaId,
                roomId,
                bedId,
                id,
                status
            },
            success(res) {
                that.setState({
                    // roomIds:roomId
                });
                if(res.code===200||res.code===0){
                    // that.props.recodeList(res);
                    message.success('成功',1);
                    that.props.getList();
                }else {
                    console.log(res.msg);
                    message.error('失败',2);
                }
            },
            error(res) {
                message.error('请求有误',2);
            },
        });
        this.closeChose();
    }
    render(){
        const areas=this.props.options;
        const { rooms,beds }=this.state;
        return(
            <div className="chose-wrap">
                <div className="chose-box">
                    <div className="remark-header">
                        <div className="remark-tit">请您选择床位</div>
                        <div className="remark-close" onClick={this.closeChose.bind(this)}>
                            <img src={require("../images/close.png")} alt=""/>
                        </div>
                    </div>
                    <div className="chose-list">
                        <div className="chose-part">
                            <p>病区</p>
                            <Select defaultValue="请选择"  onChange={this.areaChange.bind(this)}>
                                {
                                    areas && areas.length>0?
                                        areas.map((item, index)=>{
                                            return <Option value={item.id} key={index}>{item.areaName}</Option>
                                        }):''
                                }
                            </Select>

                        </div>
                        <div className="chose-part">
                            <p>病房</p>
                            <Select defaultValue="请选择"  onChange={this.roomChange.bind(this)}>
                                {
                                    rooms && rooms.length>0?
                                        rooms.map((item, index)=>{
                                            return <Option value={item.id} key={index}>{item.roomName}</Option>
                                        }):''
                                }
                            </Select>
                        </div>
                        <div className="chose-part">
                            <p>床号</p>
                            <Select defaultValue="请选择"  onChange={this.bedChange.bind(this)}>
                                {
                                    beds && beds.length>0?
                                        beds.map((item, index)=>{
                                            return <Option value={item.id} key={index}>{item.bedName}</Option>
                                        }):''
                                }
                            </Select>
                        </div>
                    </div>
                    <div className="chose-btn">
                        <span onClick={this.confirBind.bind(this)}>确认</span>
                        <span onClick={this.closeChose}>取消</span>
                    </div>
                </div>

            </div>
        )
    }
}
export default Chose;