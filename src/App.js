import React, {useEffect, useState }  from 'react';
import Map,{Marker,Popup} from 'react-map-gl';
import {Room} from "@material-ui/icons";
import "./app.css";
import axios from "axios"
import {format} from "timeago.js"
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  const myStorage = window.localStorage;
  const [currentUsername, setCurrentUsername] = useState(myStorage.getItem("user"));
  const[pins,setPins]=React.useState([])
  const [currentPlaceId,setCurrentPlaceId]=useState(null)
  const [newPlace,setNewPlace]=useState(null)
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [url, setUrl] = useState(null);
  const [tag, setTag] = useState(null);
  const [researcher, setResearcher] = useState(null);
  const [viewport, setViewport] = useState({
    latitude: 47.040182,
    longitude: 17.071727,
    zoom: 4,
  });
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

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
  
  const handleMarkerClick=(id,lat,long)=>{
    setCurrentPlaceId(id);

  }

  const handleAddClick = (e) => {
  if (e && e.lngLat) {
    const [long, lat] = e.lngLat.toArray();
    setNewPlace({
      lat,
      long,
    });
  }
};
const handleSubmit = async (e) => {
  e.preventDefault();
  const newPin = {
    username: currentUsername,
    title,
    desc,
    url,
    tag,
    researcher,
    lat: newPlace.lat,
    long: newPlace.long,
  };

  try {
    const res = await axios.post("/pins", newPin);
    setPins([...pins, res.data]);
    setNewPlace(null);
  } catch (err) {
    console.log(err);
  }
};
const handleLogout = () => {
  setCurrentUsername(null);
  myStorage.removeItem("user");
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
        <Room style={{ color: p.username===currentUsername?"tomato":"gold" ,cursor:"pointer"}} 
        onClick={()=>handleMarkerClick(p._id,p.lat,p.long)}
        />
      </Marker>
      {p._id===currentPlaceId&&
      <Popup 
      latitude={p.lat} 
      longitude={p.long}
      closeButton={true}
      closeOnClick={false}
      anchor="left"
      onClose={()=>setCurrentPlaceId(null)}
    >
        <div className="card">
          <label>ProjectName</label>
          <h4 className="place">{p.title}</h4>
          <label>Researcher</label>
          <p className='desc'>{p.researcher}</p>
          <label className='desc'>Description</label>
          <p className='desc'>{p.desc}</p>
          <label className='desc'>URL</label>
          <p className='desc'><a href="{p.url}" target="_blank">{p.url}</a></p>
          <label className='desc'>Tags</label>
          <p className='desc'>{p.tag}</p>
          <label className='desc'>Info</label>
          <span className='username'>Contributed by <b>{p.username}</b></span>

          <span className="date">{format(p.createdAt)} </span>
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
      onClose={()=>setNewPlace(null)}
    >
        <div>
          <form onSubmit={handleSubmit}>
            <label>ProjectTitle</label>
            <input
              placeholder="Enter a title"
              autoFocus
              onChange={(e) => setTitle(e.target.value)}
            />
            <label>Description</label>
            <textarea
              placeholder="Tell us something about this project."
              onChange={(e) => setDesc(e.target.value)}
            />
            <label>Researchers</label>
            <textarea
              placeholder="Tell us something about this project."
              onChange={(e) => setResearcher(e.target.value)}
            />
            <label>URL</label>
            <textarea
              placeholder="Please provide an url to the project homepage."
              onChange={(e) => setUrl(e.target.value)}
            />
            <label>Tags</label>
            <textarea
              placeholder="Tell us something about this project."
              onChange={(e) => setTag(e.target.value)}
            />
            
            <button type="submit" className="submitButton">
              Add Pin
            </button>
          </form>
        </div>
      </Popup>
  )}
    {currentUsername ? (
          <button className="button logout" onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>
              Log in
            </button>
            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            setCurrentUsername={setCurrentUsername}
            myStorage={myStorage}
          />
        )}
      
    


    </Map>
  
  );
  
}



export default App;
