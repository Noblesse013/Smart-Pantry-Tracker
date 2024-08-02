import React, { useState, useRef } from "react";
import { Camera } from "react-camera-pro";
import {
  Button
} from "@mui/material";
import { DvrOutlined } from "@mui/icons-material";

const CameraComponent = () => {
  const camera = useRef(null);
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [image, setImage] = useState(null);

  return (
    <div>
      <Camera ref={camera} numberOfCamerasCallback={setNumberOfCameras} />
      <img src={image} alt='Image preview' />
      <Button
      variant="outlined"
      onClick={() => {
        const photo = camera.current.takePhoto();
        setImage(photo);
    }}
    ><div>Take a photo</div></Button>
    <Button
        hidden={numberOfCameras <= 1}
        onClick={() => {
          camera.current.switchCamera();
        }}
      />
      </div>
  )
  }

export default CameraComponent;