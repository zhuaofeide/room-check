import React, { Component } from 'react';
import $ from 'jquery';
import 'antd/dist/antd.css';
import '../css/reset.css';
import '../css/remark.css';
import Loading from './loader/loading';
import { Upload, Button,  message } from 'antd';

class Remark extends Component{
    constructor(props){
        super(props);
        this.state={
            deptId:window.localStorage.getItem("deptId"),
            userId:window.localStorage.getItem("userId"),
            fileList: [],
            areaName:'',
            roomName:'',
            bedName:'',
            context:'',
            imgUrl:[],
            viewSrc:'',
            loading:false
        }
    }

    // 保存
    saveText(){
        this.closeRemark();
        const that=this;
        const { deptId,userId }=this.state;
        let areaId=this.props.area;
        let roomId=this.props.room;
        let bedId=this.props.rebed;
        let remarkId=this.props.remark;
        let recordId=this.props.record;
        let saveType=this.props.saveType;
        let context=$('.remark-textarea').val();

        const { fileList } = this.state;
        const data = new FormData();
        let url='';
        if(saveType==='change'){
            url='remark/update';
            data.append('id', remarkId);
        }else if(saveType==='changeRecord'){
            url='record/update';
            data.append('id', recordId);
        }else {
            url='remark/save';
            data.append('userId', userId);
            data.append('deptId', deptId);
            data.append('areaId', areaId);
            data.append('roomId', roomId);
            data.append('bedId', bedId);
            data.append('status', 1);
            fileList.forEach((file) => {
                data.append('imgFiles', file);
            });
        }
        data.append('context', context);
        if($.trim(context)!==''){
            $.ajax({
                url: `http://${ window.localStorage['url'] }/api/`+url,
                method: 'POST',
                processData: false,
                contentType:false,
                data:data,
                beforeSend(){
                    that.setState({
                        loading:true
                    })
                },
                complete(){
                    that.setState({
                        loading:false
                    })
                },
                success(res) {
                    that.setState({
                        fileList: [],
                    });
                    message.success('上传成功',1);
                },
                error(res) {
                    message.error('上传失败');
                },
            })
        }else {
            message.error("请求有误")
        }
    }
    closeRemark(){
        $('.remark-wrap').hide();
        $('.home-mask').hide();
        $('.remark-text').hide();
        $('.remark-textarea').hide();
        $('.remark-show').hide();
        $('.remark-save').hide();
        $('.remark-play').hide();
        $('.remark-change').hide();
    }
    componentWillReceiveProps(nextProps){
        console.log(nextProps);
        this.setState({
            areaName:nextProps.areaname,
            roomName:nextProps.roomname,
            bedName:nextProps.bedname,
            context:nextProps.context,
            imgUrl:nextProps.img
        })
    }
    componentDidMount(){
        $('.remark-save').click(function () {
            $('.remark-wrap').hide();
            $('.home-mask').hide();
        });
    }
    // 修改文字
    changeWords(){
        $('.remark-change').hide();
        $('.remark-show').hide();
        $('.remark-text').show();
        $('.remark-textarea').show();
        $('.remark-textarea').val(this.state.context);
        $('.remark-save').show();
    }
    // 预览
    viewImg(item){
        console.log(item)
        this.setState({
            viewSrc:item
        })
    }
    closeView(){
        this.setState({
            viewSrc:null
        })
    }
    render(){
        // console.log(this.state.imgUrl);
        // const { uploading } = this.state;
        const src=this.state.imgUrl;
        const {loading}=this.state;
        // console.log(src.length===0);
        const props = {
            action: `http://${ window.localStorage['url'] }/api/remark/save`,
            onRemove: (file) => {
                this.setState(({ fileList }) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileList }) => ({
                    fileList: [...fileList, file],
                }));
                return false;
            },
            fileList: this.state.fileList,
            multiple:true
        };
        return(
            <div className="remark-wrap">
                {loading?<Loading tip="请稍等..."/>:null}
                <div className="remark-box">
                <div className="remark-header">
                    <div className="remark-tit">备注</div>
                    <div className="remark-close">
                        <img src={require("../images/close.png")} alt="" onClick={this.closeRemark.bind(this)}/>
                    </div>
                </div>
                <div className="remark-main">
                    <div className="remark-detail">
                        <div>
                            <span>{this.state.areaName}</span>
                            <span>{this.state.roomName}</span>
                            <span>{this.state.bedName}</span>
                        </div>
                        <div className="remark-shop">
                            <img src={require("../images/play.png")} alt="" className="remark-play"/>
                            <img src={require("../images/camera.png")} alt="" className="remark-cam"/>
                            <img src={require("../images/change.png")} alt="" className="remark-change" onClick={this.changeWords.bind(this)}/>
                        </div>
                    </div>
                    <div className="remark-text">
                        <div className="remark-img">
                            <Upload {...props}>
                                <Button>上传</Button>
                            </Upload>
                        </div>
                        <textarea className="remark-textarea" placeholder="请键入备注..." maxLength={200}></textarea>
                    </div>
                    <div className="remark-savebox">
                        <span>&nbsp;</span>
                        <div className="remark-save" onClick={this.saveText.bind(this)}>保存</div>
                    </div>

                    {/*<Button*/}
                        {/*type="primary"*/}
                        {/*onClick={this.handleUpload}*/}
                        {/*disabled={this.state.fileList.length === 0}*/}
                        {/*loading={uploading}*/}
                    {/*>*/}
                        {/*{uploading ? 'Uploading' : '保存' }*/}
                    {/*</Button>*/}
                    <div className="remark-show">
                        <span>{this.state.context}</span>
                        {/*{src.length===0?null:<img src={`http://52.80.184.16`+this.state.imgUrl[0].url} alt="" onClick={this.viewImg.bind(this,`http://52.80.184.16`+this.state.imgUrl[0].url)} className="recodeImg"/>}*/}

                        {src.length===0?null:src.map((item, index) => {
                            return <img key={index} src={`http://52.80.184.16`+item.url} alt="" onClick={this.viewImg.bind(this,`http://52.80.184.16`+item.url)} className="recodeImg"/>
                        })}
                        {/*<img src={`http://52.80.184.16`+this.state.imgUrl[0].url} alt="" className="recodeImg"/>*/}
                    </div>
                </div>
                </div>
                {this.state.viewSrc?<div className="viewImg">
                    <div className="viewWrapper">
                        <div className="viewBox">
                            <img src={this.state.viewSrc} alt=""/>
                        </div>
                        <div className="viewAction">
                            <span>&nbsp;</span>
                            <Button type="primary" onClick={this.closeView.bind(this)}>确定</Button>
                        </div>
                    </div>
                </div>:null}
            </div>
        )
    }
}
export default Remark;
