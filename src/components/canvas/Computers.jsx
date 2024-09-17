import React, { Suspense,useLayoutEffect, useEffect, useState, useRef } from "react";
import { Canvas , useFrame} from "@react-three/fiber";
import { OrbitControls, ScrollControls, Preload, useGLTF, useScroll } from "@react-three/drei";
import gsap from "gsap";

import CanvasLoader from "../Loader";
export const FLOOR_HEIGHT = 2.3;
export const NB_FLOORS = 5;
export const MOTION_CONSTANT = 10;
export var positionDlt = {
  y:-1,
  x:0,
  z:-12
}

const Computers = ({ isMobile }) => {
  const hasWindow = typeof window !== 'undefined';

  const computer = useGLTF("./earth/scene.gltf");
  const scroll = useScroll()
  const tl = useRef()
  const ref = useRef();
  ref.current = computer.scene;
  
  useEffect(() => {
    scroll.el.className="scrollbar-none"

  });

  useFrame(() => {
   tl.current = gsap.timeline();
   console.log("scroll",scroll);
   let heightLimit = ((window.innerHeight/1.5)/1000).toFixed(3);
   let yHeightLimit = (isMobile)?(heightLimit/2.68):(heightLimit/2.66);
   console.log("heightLimit",heightLimit);
   if(scroll.offset < heightLimit){
      let offsetDlt = scroll.offset;
      
      // VERTICAL ANIMATION
      if(scroll.offset < yHeightLimit){
        tl.current.to(
          ref.current.position,
          {
            duration: 2,
            y: -((offsetDlt * MOTION_CONSTANT)+positionDlt.y),
            z: (((offsetDlt*60)+positionDlt.z)),
          // x: (offsetDlt * (MOTION_CONSTANT+40)),
          },
          0
        );
    }

      // ROTATE ANIMATION
      tl.current.to(
        ref.current.rotation,
        {
          duration: 2,
          y: ((offsetDlt * 30)+positionDlt.y),
        },
        0
      );
   }
   
  },[]);

  return (
    <mesh className="scrollbar-none">
      <hemisphereLight intensity={1} groundColor='white' />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={1} />
      <primitive
        object={computer.scene}
        scale={isMobile ? 2 : 2}
        position={isMobile ? [0, -3, -2.2] : [0, positionDlt.y, positionDlt.z]}
        rotation={[0.01, 1.2, -0.0]}
      />
    </mesh>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    // Add a listener for changes to the screen size
    const mediaQuery = window.matchMedia("(max-width: 500px)");

    // Set the initial value of the `isMobile` state variable
    setIsMobile(mediaQuery.matches);

    // Define a callback function to handle changes to the media query
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    // Add the callback function as a listener for changes to the media query
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Remove the listener when the component is unmounted
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      frameloop='demand'
      shadows
      dpr={[1, 2]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <ScrollControls maxSpeed={1.5} pages={1} damping={0.25}>
   
          <Computers isMobile={isMobile} />
        </ScrollControls>
      </Suspense>

      <Preload all />
    </Canvas>
  );
};


export default ComputersCanvas;