import React from 'react';
import {Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import {login} from '../../redux/user.redux';
@connect(
    state=>state.user,
    {login}
)
class AuthRouter extends  React.Component{
    constructor(props){
        super(props);
        // console.log(window.localStorage.getItem("userId"))
    }
    componentDidMount(){
        // console.log(this.props)
        // console.log(window.localStorage.getItem("userId"))
    }
    render(){
        const userId=window.localStorage.getItem("userId");
        return (
            <div>
                {userId? <Redirect  to='/home'/>:<Redirect  to='/login'/>}
            </div>
        )
    }
}
export default AuthRouter;