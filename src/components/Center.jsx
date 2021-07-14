import React from 'react'
import './center.css';
import Star from '../assets/star.svg';
import { Avatar } from '@material-ui/core';
import firebase from 'firebase';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import {useState,useEffect,useRef} from 'react';
import firebaseConfig from '../firebase';
import Loader from "react-loader-spinner";
import { Button } from '@material-ui/core';
import { v4 as uuidv4 } from 'uuid';
import Sound from '../assets/twitter.mp3';
import { MessageSharp } from '@material-ui/icons';
import { LoopSharp } from '@material-ui/icons';
import { FavoriteSharp } from '@material-ui/icons';
import { ShareSharp } from '@material-ui/icons';
import axios from 'axios';
export default function Center() {
    const tweet = useRef();
    const image_url = useRef();
    const sound_ref = useRef();
    const [data,setData] = useState([])
    const [num,setNum] = useState(0)
    console.log(data)
    useEffect(()=>{
        setData([])
        axios('https://twitter-api23.herokuapp.com/').then((res)=>{
            console.log(res.data)
            setData(res.data)
        })
    },[num])
    return (
        <div className='center'>
            <audio src={Sound} ref={sound_ref} />
            <div id='top-center' className='center-spans'>
                <p>Home</p>
                <img src={Star} alt="" />
            </div>
            <div id="center-center">
                <div className='first'>
                    {
                        firebase.auth().currentUser!=null?
                        <Avatar src={firebase.auth().currentUser.photoURL}/>:
                        <Avatar/>
                    }
                    <input type="text" placeholder="What's Happening?" ref={tweet} />
                </div>
                <div className='second'>
            <input type="text" id='image-url' placeholder='Image URL (optional)' ref={image_url}/>
            <br />
            <button id='tweet-button' onClick={()=>{
                var name = uuidv4();
                if(tweet.current.value.length!=0){
                    axios(`https://twitter-api23.herokuapp.com/add-tweets?tweet=${tweet.current.value}&url=${image_url.current.value}&user-name=${firebase.auth().currentUser.displayName}&user-image=${firebase.auth().currentUser.photoURL}`)
                    .then(()=>{
                        setNum(num+1)
                    })
                    sound_ref.current.play();
                    tweet.current.value = ''
                    image_url.current.value = ''
                }
                
            }}>Tweet</button>
                </div>
            <hr />
            <div className='posts'>
                {
                    data.length!=0?
                    data.map((items)=>{
                        return(
                            <div className='tweet'>
                               <main>
                                   {
                                       items.user_image!=''?
                                       <Avatar src={items.user_image}/>:
                                       <Avatar/>
                                   }
                                   <div>
                                    <strong>{items.user_name}</strong> 
                                    <p>{items.tweet}</p>
                                   </div>
                                   <br />
                               </main>
                               {
                                   items.url!=null?
                                   <img src={items.url} alt="" id='image'/>
                                   :
                                   <></>
                               }
                                   <div className="icons">
                                       <MessageSharp/>
                                       <LoopSharp/>
                                       <FavoriteSharp/>
                                       <ShareSharp/>
                                   </div>
                           </div>
                       )
                   })
                   :
                   <Loader
                        type="ThreeDots"
                        color="#109cf3"
                        timeout={3000} //3 secs
                        className='loader'
                        />

                }
            </div>
            </div>
        </div>
    )
}
