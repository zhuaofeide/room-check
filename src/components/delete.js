import React, {Component} from 'react';
import $ from 'jquery';
import '../css/reset.css';
import '../css/chose.css';
import { message } from 'antd';
class Delete extends Component {
    // constructor(props) {
    //     super(props);
    // }

    closeChose() {
        $('.delete-wrap').hide();
        $('.home-mask').hide();
        $('.chose-wrap').hide();
    }

    confirmDel() {
        const that = this;
        let remarkId = that.props.remark;
        let recordId = that.props.record;
        let speechId = that.props.speech;
        let removeType = that.props.removeType;

        let id = null;
        let url = '';
        if (removeType === 'remark') {
            id = remarkId;
            url = 'remark/delete';
        } else if (removeType === 'speech') {
            id = speechId;
            url = 'record/delete';
        } else if (removeType === 'record') {
            id = recordId;
            url = 'record/delete';
        }
        $.ajax({
            url: `http://${ window.localStorage['url'] }/api/` + url,
            method: 'POST',
            dataType: 'JSON',
            data: {
                id
            },
            success(res) {
                if(res.code===200){
                    message.success('成功',1);
                    // that.props.getList();
                }else{
                    message.error(res.msg);
                }
            },
            error(res) {
                message.error('响应错误');
            },
        })
        that.closeChose()
    }

    render() {
        return (
            <div className="delete-wrap">
                <div className="delete-box">
                    <div className="remark-header">
                        <span>&nbsp;</span>
                        <div className="remark-close" onClick={this.closeChose.bind(this)}>
                            <img src={require("../images/close.png")} alt=""/>
                        </div>
                    </div>
                    <p className="delete-diss">您确认删除吗？</p>
                    <div className="chose-btn">
                        <span className="chose-span" onClick={this.confirmDel.bind(this)}>确认</span>
                        <span className="chose-span" onClick={this.closeChose.bind(this)}>取消</span>
                    </div>
                </div>

            </div>
        )
    }
}
export default Delete;