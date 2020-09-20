import React, { Fragment } from 'react';
import './Day.css'
import getDayOfWeek from '../utils/dayNumToDay';
import stringDate from '../utils/monthFromNum';
import { Redirect } from 'react-router-dom';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import image from '../../images/mountain.jpg'
import nightBack from '../../images/night-back.jpg'
import rainBack from '../../images/rain-back.jpg'
import cloudBack from '../../images/cloud-back.jpeg'

var background = [image, nightBack, rainBack, cloudBack]


class Day extends React.Component {

    
    state = {
        dayData: this.props.location.state.selectData,
        goback : false,
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    componentDidMount() {
        this.changeBackground(0)
    }

    changeBackground = (i) => {
        document.body.style.backgroundImage = "url('" + background[i] + "')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundRepeat = "no-repeat";
    } 

    render() {
        
        return(
            <Fragment>
                {this.state.goback && <Redirect to={{
            pathname: '/',
            state:{city : this.props.location.state.c} }}/>}

<h3 onClick={()=>this.setState({goback:true})}><ArrowBackIosIcon style={{color:"#fff", fontSize: 60, paddingTop: 23, paddingLeft:23}}/></h3>
                {this.state.dayData.length>0 && this.state.dayData.map((item, index)=>{
                    let iconCode = item.weather[0].icon;
                    let iconurl = "http://openweathermap.org/img/w/" + iconCode + ".png";
                    if(index===0){
                        if(item.weather[0].main==='Clouds' || item.weather[0].main==='Snow'){
                            this.changeBackground(3)
                        }else if(item.weather[0].main==='Rain' || 
                        item.weather[0].main==='Thunderstorm' || item.weather[0].main==='Drizzle'){
                            this.changeBackground(2)
                        }else{
                            var d = new Date();
                            var n = d.getHours();
                            if(n>5 && n<=18){
                                this.changeBackground(0)
                            }else{
                                this.changeBackground(1)
                            }
                        }
                        return <div key={index}>
                        <div className="container-fluid">
                            <div className="col-md-6 offset-md-6" style={{ marginTop: "5%", color: "#fff" }}>
                                <div className="row">
                                    <div className="col-md-4">
                                        <h1>{getDayOfWeek(item.day_text)}</h1>
                                        <h5>{stringDate(item.dt_txt)}</h5>
                                    </div>
                                    <div className="col-md-2" >
                                        <h1 className="display-1"><strong>{parseInt(item.main.temp - 273)}&#8451;</strong></h1>
                                        <h5>{this.props.location.state.city}</h5>
                                    </div>
                                </div>
                                <div className="row">
                                    <h4 style={{ float: "center" }}>
                                        <img src={iconurl} alt={getDayOfWeek(item.day_text)} />
                                    &nbsp; {this.capitalizeFirstLetter(item.weather[0].description)}</h4>
                                </div>
                            </div>
                        </div>
                        <div className="container" style={{ color: "#fff" }}>
                            <div className="row">
                                <div className="col-sm-12 col-md-6 details-back h5">
                                    <div className="row detail-row">
                                        <div className="col-4 col-sm-4 col-md-4">
                                            {parseInt(item.main.temp_max - 273)}&#8451;<br />Max
                                         </div>
                                        <div className="col-4 col-sm-4 col-md-4">
                                            {item.wind.speed + " mps"}<br />Wind
                                         </div>
                                         <div className="col-4 col-sm-4 col-md-4">
                                         {parseInt(item.visibility/1000) + " km"}<br />Visibility
                                        </div>
                                    </div>
                                    <div className="row detail-row" style={{ paddingTop: "5%" }}>
                                        <div className="col-4 col-sm-4 col-md-4">
                                            {parseInt(item.main.temp_min - 273)}&#8451;<br />Min
                                </div>
                                        <div className="col-4 col-sm-4 col-md-4">
                                            {item.clouds.all + "%"}<br />Cloudy
                                </div>
                                <div className="col-4 col-sm-4 col-md-4">
                                            {parseInt(item.main.feels_like - 273)}&#8451;<br />Feels Like
                                         </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    }
                    else{
                        return null;
                    }

                })}
                <div className="container" style={{ marginTop: "5%", marginBottom: "10%", color: "#fff" }}>
                <h3>Forecast:</h3>
                <div className="row">
                    {this.state.dayData.length > 0 && this.state.dayData.map((day, index) => {
                        let iconCode = day.weather[0].icon;
                        let iconurl = "http://openweathermap.org/img/w/" + iconCode + ".png";
                        return <div className="col-md-2 col-4 details-det" key={index}>
                            {new Date(day.dt_txt).toLocaleTimeString().slice(0,5)}
                            <br/>
                         <img src={iconurl} alt="n" /><br/>
                          {parseInt(day.main.temp - 273)}&#8451;
                          <br/>
                          {this.capitalizeFirstLetter(day.weather[0].description)}
                </div>

                    })}
                </div>
            </div>
            </Fragment>
        )
    }
}

export default Day;