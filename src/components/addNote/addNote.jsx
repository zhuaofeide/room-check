import React, {Component} from 'react';
import {Upload, Button, message} from 'antd';
import { connect } from 'react-redux'
import $ from 'jquery';
import {closeNote} from '../../redux/user.redux';
import Loading from './../loader/loading';
require('./note.less');
@connect(
    state=>state.user,
    {closeNote}
)
class Note extends Component {
    constructor(props) {
        super(props);
        console.log(this.props);
        this.state={
            status:1,
            id:this.props,
            fileList: [],
            textValue:'',
            loading:false
        }
    }
    //关闭遮罩
    closeNotes() {
        this.props.closeNote(this.props);
    }
    handleChange(event){
        // console.log(event.target.value);
        this.setState({textValue: event.target.value});
    }
    // 保存
    saveText(){
        // console.log(this.props);
        const that=this;
        let deptId=this.props.deptId;
        let userId=this.props.userId;
        let areaId=this.props.rooms.areaId;
        let roomId=this.props.beds.roomId;
        let bedId=this.props.beds.id;
        console.log(bedId)
        console.log(roomId)
        console.log(areaId)
        const { fileList,textValue } = this.state;
        let context = textValue;
        console.log(context);
        const data = new FormData();
            let url='remark/save';
            data.append('userId', userId);
            data.append('deptId', deptId);
            data.append('areaId', areaId);
            data.append('roomId', roomId);
            data.append('bedId', bedId);
            data.append('status', 1);
            fileList.forEach((file) => {
                data.append('imgFiles', file);
            });
        data.append('context', context);
        if($.trim(context)!==''){
            $.ajax({
                url: `http://${ window.localStorage['url'] }/api/`+url,
                method: 'POST',
                processData: false,
                contentType:false,
                data:data,
                success(res) {
                    if(res.code===200){
                        message.success('上传成功',1,that.closeNotes());
                    }
                    that.setState({
                        fileList: [],
                    });

                },
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
                error(res) {
                    message.error('上传失败');
                },
            })
        }else {
            console.log("失败")
        }
    }

    render() {
        // const { uploading } = this.state;
        console.log(this.props);
        const {loading}=this.state;
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
        return (
            <div className='add-content'>
                {loading?<Loading tip="请稍等..."/>:null}
                <div className="add-mask">
                <div className="remark-wrap-add">
                    <div className="remark-header">
                        <div className="remark-tit">备注</div>
                        <div className="remark-close" onClick={this.closeNotes.bind(this)}>
                            <img src={require("../../images/close.png")} alt=""/>
                        </div>
                    </div>
                    <div className="remark-main">
                        <div className="remark-detail">
                            <div>
                                <span>{this.props.rooms.areaName}</span>
                                <span>{this.props.rooms.roomName}</span>
                                <span>{this.props.beds.bedName}</span>
                            </div>
                            <div className="remark-shop">
                                <img src={require("../../images/play.png")} alt="" className="remark-play"/>
                                <img src={require("../../images/camera.png")} alt="" className="remark-cam"/>
                                <img src={require("../../images/change.png")} alt="" className="remark-change"/>
                            </div>
                        </div>
                        <div className="remark-text-add">
                            <div className="remark-img">
                                <Upload {...props}>
                                    <Button>上传</Button>
                                </Upload>
                            </div>
                            <textarea className="remark-textarea" placeholder="请键入备注..."
                                      onChange={this.handleChange.bind(this)} value={this.state.textValue}></textarea>
                        </div>
                        <div className="remark-add-box">
                            <span>&nbsp;</span>
                            <div className="remark-save-add" onClick={this.saveText.bind(this)}>保存</div>
                        </div>

                        {/*onClick={this.saveText.bind(this)}*/}
                        {/*<Button*/}
                        {/*type="primary"*/}
                        {/*onClick={this.handleUpload}*/}
                        {/*disabled={this.state.fileList.length === 0}*/}
                        {/*loading={uploading}*/}
                        {/*>*/}
                        {/*{uploading ? 'Uploading' : '保存' }*/}
                        {/*</Button>*/}
                        {/*<div className="remark-show-add">asdasdasd</div>*/}
                    </div>
                </div>
                </div>
            </div>
        )
    }
}
export default Note;