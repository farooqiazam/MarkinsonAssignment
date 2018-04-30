import React,{Component} from 'react';
import UserData from './UserData';
export default class Main extends Component{
    constructor(){
        super();
        this.state = {
            users:[]
        }
    }
    componentWillMount(){
        fetch("http://profiler.markinson.com.au/api/Customer")
        .then(function(response){
            return response.json();
          })
          .then((users)=>{
            this.setState({
                users:users
            })
          });
    }
    render(){
        return(
            (this.state.users.length > 0)
            ? 
            <div >
                <span>Data has been fetched from the API</span>
                <UserData dataSet={this.state.users} />
            </div>
            :
            <img src="http://localhost:3000/images/Loading_icon.gif" />
        );
    }
}