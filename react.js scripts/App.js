
import React,{useRef,useState} from 'react';
import {useEffect} from 'react';
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import {drawHand} from "./utilities";

import * as fp from 'fingerpose';


//import logo from './logo.svg';
import './App.css';


var right_click = 0;


function App() {
  
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
 

  const runHandpose = async () =>{
    const net = await handpose.load();
    //console.log('handpose model loaded');

    setInterval(() => {
      detect(net);
    }, 100);
  };

  const detect = async(net) =>{
    if(typeof webcamRef.current != "undefined" &&
      webcamRef.current != null &&
      webcamRef.current.video.readyState === 4){
        const video = webcamRef.current.video;
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;

        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;


        const hand = await net.estimateHands(video);
        


        if(hand.length > 0){
          const GE = new fp.GestureEstimator([
            fp.Gestures.VictoryGesture
          ])

          const gesture = await GE.estimate(hand[0].landmarks,7.5)
          console.log(gesture);
          if(gesture.gestures.length >0){
              right_click = 1;
          }
          else{
            right_click = 0;
          }


        }
        else{
          right_click = 0;
        }
        //console.log(hand);

        const ctx = canvasRef.current.getContext("2d");
        ctx.translate(640, 0);
        ctx.scale(-1, 1);
        drawHand(hand,ctx,right_click);
        
      }
  }

  runHandpose();

  return (
    <div className="App">
      <header className="App-header">
       <Webcam
       mirrored={true}
       ref={webcamRef}
       style={{
         position:"absolute",
         marginLeft:"auto",
         marginRight:"auto",
         left:0,
         right:0,
         textAlign:"center",
         zindex:9,
         width:640,
         height:482
       }}
       />
       <canvas ref={canvasRef}
       style={{
         position:"absolute",
         marginLeft:"auto",
         marginRight:"auto",
         left:0,
         right:0,
         textAlign:"center",
         zindex:9,
         width:640,
         height:482
       }}
       />
      </header>
    </div>
  );
}


export default App;
