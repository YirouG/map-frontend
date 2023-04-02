import React, {useEffect, useState }  from 'react';
import Map,{Marker,Popup} from 'react-map-gl';
import {Room} from "@material-ui/icons";
import "./app.css";
import axios from "axios"
import {format} from "timeago.js"

function App() {
  const currentUser="jane"
  const[pins,setPins]=React.useState([])
  const [currentPlaceId,setCurrentPlaceId]=useState(null)
  const [newPlace,setNewPlace]=useState(null)

  React.useEffect(()=>{
    const getPins=async()=>{
      try{
        const res=await axios.get("/pins");
        setPins(res.data);
      }catch(err){
        console.log(err)
      }
    };
    getPins();
  },[]);
  
  const handleMarkerClick=(id)=>{
    setCurrentPlaceId(id)

  }

  const handleAddClick = (e) => {
  if (e && e.lngLat) {
    const [long, lat] = e.lngLat;
    setNewPlace({
      lat,
      long,
    });
  }
};
  return (
    <Map
      mapboxAccessToken={process.env.REACT_APP_MAPBOX}
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 2
      }}
    
      style={{width: "100vw", height: "100vh"}}
      mapStyle="mapbox://styles/yiroug/clfyj1jpr000701quf1iddei8"
      onDblClick={handleAddClick}
    >
    {pins.map(p=>(
      <React.Fragment key={p._id}>
        <Marker latitude={p.lat} longitude={p.long} >
        <Room style={{ color: p.username===currentUser?"tomato":"gold" ,cursor:"pointer"}} 
        onClick={()=>handleMarkerClick(p._id)}
        />
      </Marker>
      {p._id===currentPlaceId&&
      <Popup 
      latitude={p.lat} 
      longitude={p.long}
      anchor="left"
      onClose={()=>setCurrentPlaceId(null)}
    >
        <div className="card">
          <label>ProjectName</label>
          <h4 className="place">{p.title}</h4>
          <label>Researcher</label>
          <label className='desc'>Description</label>
          <p className='desc'>{p.desc}</p>
          <label>URL</label>
          <label>Tags</label>
          <label>Info</label>
          <span className='username'>Contributed by <b>{p.username}</b></span>

          <span className="date">{format(p.createdAt)} ago</span>
        </div>
      </Popup>
      }

      
        </React.Fragment>
    ))}
    {newPlace&&(
      <Popup 
      latitude={newPlace.lat} 
      longitude={newPlace.long}
      anchor="left"
      onClose={()=>setCurrentPlaceId(null)}
    >
      Hello
    </Popup>)}
    </Map>
  );
}

export default App;
