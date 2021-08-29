

window.addEventListener('keydown', onKeyDown, true);
window.addEventListener('keyup', onKeyUp, true);
                               
var key_down = 0;  
var hold = 0;


function onKeyDown(evt) {                           
    key_down = 1;     
}

function onKeyUp(evt) {
    key_down = 0;
}

const fingerJoints = {
    thumb: [0, 1, 2, 3, 4],
    indexFinger: [0, 5, 6, 7, 8],
    middleFinger: [0, 9, 10, 11, 12],
    ringFinger: [0, 13, 14, 15, 16],
    pinky: [0, 17, 18, 19, 20],
  };


export const drawHand = (predictions,ctx,right_click) =>{
    if(predictions.length>0){
      //console.log(predictions);
        predictions.forEach(prediction => {
          const landmarks = prediction.landmarks;
          const center_x = landmarks[0][0];
            const center_y = landmarks[0][1];
            var x1 = landmarks[4][0];
            var y1 = landmarks[4][1];
            var x2 = landmarks[8][0];
            var y2 = landmarks[8][1];

            var a = Math.pow(x2-x1,2);
            var b = Math.pow(y2-y1,2);
            
            if(true){
              var distance = Math.sqrt(a+b);
              var left_click = 0;
              if(hold == 0 && distance <= 40){
                left_click = 1;
                hold = 1;
                setTimeout(reset, 2000);
              }
              else{
                left_click = 0;
              }
              
              if(hold == 0 && right_click == 1 ){
                fetch('/data/'+center_x*3+"/"+center_y*3+"/"+left_click+"/"+right_click)
                .then(response => response.json());
                hold = 1;
                setTimeout(reset, 2000);
              }
              else{
                fetch('/data/'+center_x*3+"/"+center_y*3+"/"+left_click+"/"+0)
                .then(response => response.json());
              }
            }
          
          
            
            for (let j = 0; j < Object.keys(fingerJoints).length; j++) {
                let finger = Object.keys(fingerJoints)[j];
                //  Loop through pairs of joints
                for (let k = 0; k < fingerJoints[finger].length - 1; k++) {
                  // Get pairs of joints
                  const firstJointIndex = fingerJoints[finger][k];
                  const secondJointIndex = fingerJoints[finger][k + 1];
        
                  // Draw path
                  ctx.beginPath();
                  ctx.moveTo(
                    landmarks[firstJointIndex][0],
                    landmarks[firstJointIndex][1]
                  );
                  ctx.lineTo(
                    landmarks[secondJointIndex][0],
                    landmarks[secondJointIndex][1]
                  );
                  ctx.strokeStyle = "grey";
                  ctx.lineWidth = 2;
                  ctx.stroke();
                }
              }


            for(let i = 0; i<landmarks.length;i++){
                const x = landmarks[i][0];

                const y = landmarks[i][1];

                ctx.beginPath();
                ctx.arc(x,y,5,0,3*Math.PI);

                ctx.fillStyle = "grey";
                ctx.fill();
            }
        });
    }
}
function reset() {
  hold = 0;
}