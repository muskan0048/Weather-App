import Axios from 'axios';
import React from 'react';
import './Home.css'
import SearchIcon from '@material-ui/icons/Search';
import getCountryName from '../utils/isoToCountry';
import getDayOfWeek from '../utils/dayNumToDay';
import stringDate from '../utils/monthFromNum';
import image from '../../images/mountain.jpg'
import nightBack from '../../images/night-back.jpg'
import rainBack from '../../images/rain-back.jpg'
import cloudBack from '../../images/cloud-back.jpeg'

import { Redirect } from 'react-router-dom';

var background = [image, nightBack, rainBack, cloudBack]


class Home extends React.Component {

    state = {
        cityEntered: false,
        city: 'Mumbai',
        alldaysList: [],
        alldaysmaps: [],
        submitButton: true,
        responseCity: '',
        responseCountry: '',
        openDay : false,
        selectDayName:'',
        selectData:'',


    }

    handleCityChange = (e) => {
        this.setState({ city: e.target.value })
        if (e.target.value.length > 2)
            this.setState({ submitButton: false })
    }

    submitButton = (e) => {
        if (e !== undefined)
            e.preventDefault()
            if(this.props.location.state!=null){
                this.setState({city : this.props.location.state.city})
            }
        Axios.get('https://api.openweathermap.org/data/2.5/forecast?q=' + this.state.city + '&appid=2948e31bbb0623853a16496b2b36f3b9')
            .then(res => {
                this.setState({
                    alldaysList: res.data.list,
                    city: '',
                    responseCity: res.data.city.name,
                    responseCountry: getCountryName(res.data.city.country)
                })
                this.mapDataDayWise(this.state.alldaysList)
            }).catch(err => {
                console.log(err)
            })
    }


    componentDidMount() {
        if(this.props.location.state!=null){
            this.setState({city : this.props.location.state.city})
        }
        this.submitButton();
        this.changeBackground(0);
    }

    changeBackground = (i) =>{
        document.body.style.backgroundImage = "url('" + background[i] + "')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundRepeat = "no-repeat";
    } 


    groupBy = (collection, property) => {
        var i = 0, val, index,
            values = [], result = [];
        for (; i < collection.length; i++) {
            val = collection[i][property];
            index = values.indexOf(val);
            if (index > -1)
                result[index].push(collection[i]);
            else {
                values.push(val);
                result.push([collection[i]]);
            }
        }
        return result;
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    mapDataDayWise = (list) => {
        list.forEach((item) => {
            item.day_text = new Date(item.dt_txt).getDay()
        })
        var obj = this.groupBy(list, "day_text");
        this.setState({ alldaysmaps: obj })

    }


    render() {
        return (<div>
             {this.state.openDay && 
      <Redirect to={{
            pathname: '/'+this.state.selectDayName,
            state: { selectData: this.state.selectData, c :this.state.responseCity, city: this.state.responseCity+", "+this.state.responseCountry }
        }}/>}
            <div className="col-md-6 offset-md-3" style={{ marginTop: "2%" }}>
                <form onSubmit={this.submitButton}>
                    <div className="input-group">
                        <input type="text" className="form-control"
                            value={this.state.city}
                            placeholder="Search"
                            onChange={this.handleCityChange} />&nbsp;
                        <div className="input-group-btn">
                            <button className="btn btn-primary" type="submit" disabled={this.state.submitButton}>
                                Find &nbsp;<SearchIcon />
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            {this.state.alldaysmaps.length > 0 && this.state.alldaysmaps.map((day, index) => {
                let iconCode = day[0].weather[0].icon;
                let iconurl = "http://openweathermap.org/img/w/" + iconCode + ".png";
                if (index === 0) {
                    if(day[0].weather[0].main==='Clouds' || day[0].weather[0].main==='Snow'){
                        this.changeBackground(3)
                    }else if(day[0].weather[0].main==='Rain' || 
                        day[0].weather[0].main==='Thunderstorm' || day[0].weather[0].main==='Drizzle'){
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
                                    <div className="col-md-3">
                                        <h1>{getDayOfWeek(day[0].day_text)}</h1>
                                        <h5>{stringDate(day[0].dt_txt)}</h5>
                                    </div>
                                    <div className="col-md-3">
                                        <h1 className="display-1"><strong>{parseInt(day[0].main.temp - 273)}&#8451;</strong></h1>
                                        <h5>{this.state.responseCity + ", " + this.state.responseCountry}</h5>
                                    </div>
                                </div>
                                <div className="row">
                                    <h4 style={{ float: "center" }}>
                                        <img src={iconurl} alt={getDayOfWeek(day[0].day_text)} />
                                    &nbsp; {this.capitalizeFirstLetter(day[0].weather[0].description)}</h4>
                                </div>
                            </div>
                        </div>
                        <div className="container" style={{ color: "#fff" }}>
                            <div className="row">
                                <div className="col-sm-12 col-md-6 details-back h5">
                                    <div className="row detail-row">
                                        <div className="col-4 col-sm-4 col-md-4">
                                            {parseInt(day[0].main.temp_max - 273)}&#8451;<br />Max
                                         </div>
                                        <div className="col-4 col-sm-4 col-md-4">
                                            {day[0].wind.speed + " mps"}<br />Wind
                                         </div>
                                         <div className="col-4 col-sm-4 col-md-4">
                                         {parseInt(day[0].visibility/1000) + " km"}<br />Visibility
                                        </div>
                                    </div>
                                    <div className="row detail-row" style={{ paddingTop: "5%" }}>
                                        <div className="col-4 col-sm-4 col-md-4">
                                            {parseInt(day[0].main.temp_min - 273)}&#8451;<br />Min
                                </div>
                                        <div className="col-4 col-sm-4 col-md-4">
                                            {day[0].clouds.all + "%"}<br />Cloudy
                                </div>
                                <div className="col-4 col-sm-4 col-md-4">
                                            {parseInt(day[0].main.feels_like - 273)}&#8451;<br />Feels Like
                                         </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }else{return null}
            })
            }
            <div className="container" style={{ marginTop: "5%", marginBottom: "10%", color: "#fff" }}>
                <h3>Forecast:</h3>
                <div className="row">
                    {this.state.alldaysmaps.length > 0 && this.state.alldaysmaps.map((day, index) => {
                        let iconCode = day[0].weather[0].icon;
                        let iconurl = "http://openweathermap.org/img/w/" + iconCode + ".png";
                        return <div className="col-md-2 col-4 details-det" key={index} 
                        onClick={()=>{this.setState({selectData : day, openDay: true,selectDayName: getDayOfWeek(day[0].day_text)})}}>
                            <h5>{getDayOfWeek(day[0].day_text)}</h5>
                            <img src={iconurl} alt="n" /><br />
                            {parseInt(day[0].main.temp_max - 273)}&#8451;
                </div>

                    })}
                </div>
            </div>
        </div>)
    }
}

export default Home;