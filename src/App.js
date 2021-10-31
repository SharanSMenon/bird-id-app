import { useState, useEffect } from "react"
import { classify_image, load_tfjs_model } from "./ml/birds"
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import * as tf from "@tensorflow/tfjs";
import Header from "./components/header";
import { getDimsImg } from "./ml/image";
import PredictionList from "./components/PredictionList";
import { checkIfPositionSet, getPosition } from "./utils/utils";
import { Spinner } from "react-bootstrap";

function App() {
  const [model, setModel] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [preds, setPreds] = useState([]);
  const [imageSrc, setImageSrc] = useState(null);
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);

  const predict = async (model, e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setLoading(true);
      const file = files[0];
      const fileOBJ = URL.createObjectURL(file)
      const { height, width } = await getDimsImg(fileOBJ);
      const predict_img = new Image(width, height);
      predict_img.src = fileOBJ;
      setImageSrc(fileOBJ);
      setLoading(false);
      predict_img.onload = async () => {
        const predictions = await classify_image(model, predict_img);
        setPreds(predictions);
      }
    }
    return null
  }

  const createPosition = async () => {
    let position = null;
    if (checkIfPositionSet()) {
      const pos = checkIfPositionSet();
      position = JSON.parse(pos);
    } else {
      try {
        const pos = await getPosition();
        position = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude
        }
        localStorage.setItem("position", JSON.stringify(position))
      } catch (error) {
        console.log("Set geolocation")
      }
    }
    setPosition(position);
    setDisabled(false);
  }

  useEffect(() => {
    tf.ready().then(async () => {
      const mdl = await load_tfjs_model();
      setModel(mdl);
    });
    if ("geolocation" in navigator) {
      console.log("available")
      createPosition();
    } else {
      console.log("not available");
    }
  }, [])

  return (
    <div className="container">
      <Header />
      <div className="input-group mb-3">
        <input type="file" accept="image/*" className="form-control"
          id="file-uploader" disabled={disabled} onChange={(e) => {
            predict(model, e)
          }} />
      </div>
      {loading && (
        <div className="d-flex justify-content-center" height="500px">
          <Spinner animation="grow" className="align-self-center" role="status" />
        </div>
      )}
      {(preds.length > 0 && !loading) && (
        <div className="row">
          <div className="col-md-6">
            <img src={imageSrc} className="img-thumbnail img-flush" height="250" alt="Your bird" />
          </div>
          <div className="col-sm">
            <PredictionList predictions={preds} position={position}/>
          </div>
        </div>
      )
      }
    </div>
  );
}

export default App;
