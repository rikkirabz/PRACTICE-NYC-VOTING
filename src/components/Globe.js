import React, { Component } from 'react';
import saveWifi from '../util/helper.js';
import DisplayMap from './DisplayMap.js';


class Globe extends Component{
  constructor(props){
    super(props);
    this.state ={
      response: [],
      geoResponse: []
    }

  };

  handleClick(event){
    event.preventDefault();
    const url = {url: this.props.globe}
    console.log("url", url);
    saveWifi.getLocation(url)
    .then((json) => {
    console.log(url.url.name + " was saved to your favorites!")
    })
  }

  handleAllClick(event){
      event.preventDefault();
      saveWifi.getAll()
      .then((json) => {
      this.setState({
        response: json
      })

      this.calculateDistance();

      })
  }

  calculateDistance(){
    var geoArray = [];
    const results = this.state.response;

    results.map((res)=>{
      if(res.location){
        let long = res.location.coordinates[0];
        let lat = res.location.coordinates[1];
        const distance = this.Haversine(this.props.globe, lat, long);
        if(distance < .7){
          geoArray.push(res)
        }
        else{
          console.log("distance is not < 2", distance);
        }
      }
      else{
        console.log("location doesn't exist");
      }
      console.log("geoArray", geoArray);

    })

    this.setState({
      geoResponse: geoArray
    })
    console.log("$$$georesponse", this.state.geoResponse);
  }

  Haversine(globe, lat, long){
    const currentLat = globe.latitude;
    const currentLong = globe.longitude;
    const APILat = lat;
    const APILong = long;
    const radius = 3959;
    const distanceLat = this.calculateDegreesToRadius(Math.abs(APILat - currentLat));
    const distanceLong = this.calculateDegreesToRadius(Math.abs(APILong - currentLong));
    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");

    const a = Math.sin(distanceLat/2) * Math.sin(distanceLat/2) +
              Math.cos(this.calculateDegreesToRadius(APILat)) * Math.cos(this.calculateDegreesToRadius(currentLat)) *
              Math.sin(distanceLong/2) * Math.sin(distanceLong/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = radius * c;
    return d;

  }
  calculateDegreesToRadius(num){
    return num * (Math.PI/180);
  }

  render(){
    return(
      <div>
        <button className="favorite" onClick={this.handleAllClick.bind(this)}>2 All</button>
        <DisplayMap geo={this.state.geoResponse} />
      </div>
    )
  }
}

export default Globe
