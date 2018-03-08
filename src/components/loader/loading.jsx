import React , {Component } from 'react';
import { Spin  } from 'antd';
class Loading extends Component{
    render (){
        return(
            <div className="loading">
                    <div className="loading-box">
                        <Spin  size="large" tip={this.props.tip}/>
                    </div>
            </div>
        )
    }
}
export default Loading;