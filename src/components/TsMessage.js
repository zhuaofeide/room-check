import React from 'react';
import '../css/TsMessage.scss';
// import { message } from 'antd';
import 'antd/dist/antd.css';
class TsMessage extends React.Component {
    constructor(){
        super();
        this.state={
            messageState: true
        }
    }
    componentWillMount(){
        this.changeState();
    }

    changeState(){
        const { showTime } = this.props;
        let ac_time = showTime || 3000;
        const that = this;
        setTimeout(()=>{that.setState({messageState:false})},ac_time)
    }
    render(){
        const { content, messageStyle, icon } = this.props;
        return <div>
            {
                this.state.messageState?<div style={{top:150}} className={ messageStyle }>
                    <span className="content">
                         <img src={process.env.PUBLIC_URL+`/img/icon/${icon}.png`} alt=""/>
                         <span>{ content }</span>
                    </span>
                </div>:''
            }
        </div>
    }
}
export default TsMessage;