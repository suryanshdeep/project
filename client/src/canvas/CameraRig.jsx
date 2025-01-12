import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';

import state from '../store';
const CameraRig = ({children}) => {
  const group = useRef();
  const snap = useSnapshot(state);//gets state of shirt
  useFrame((state,delta)=>{//delta:difference from the last frame that happened
    const isBreakpoint = window.innerWidth <= 1260;
    const isMobile = window.innerWidth <= 600;//easing of view in all display sizes

    // set the initial position of the model
    let targetPosition = [-0.4, 0, 2];

    if(snap.intro) {//position for the intro page
      if(isBreakpoint) targetPosition = [0, 0, 2];
      if(isMobile) targetPosition = [0, 0.2, 2.5];
    }
    else {//position for the customizable page
      if(isMobile) targetPosition = [0, 0, 2.5]
      else targetPosition = [0, 0, 2];
    }
    // set model camera position
    easing.damp3(state.camera.position, targetPosition, 0.25, delta)
    
  // set the model rotation smoothly
  easing.dampE(
      group.current.rotation,
      [state.pointer.y / 10, -state.pointer.x / 5, 0],//x,y,z coordinates
      0.25,//smoothTime
      delta
    )
    })
  return (
     <group ref={group}>{children}</group>
  )
}

export default CameraRig