import { useState, useEffect } from "react"
import logo from './logo.svg';
import { classify_image, load_tfjs_model } from "./ml/birds"
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import * as tf from "@tensorflow/tfjs";
import Header from "./components/header";
import { getDimsImg } from "./ml/image";
import PredictionList from "./components/PredictionList";

function App() {
  const [model, setModel] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [preds, setPreds] = useState([]);

  const predict = async (model, e) => {
    const files = e.target.files;
    if (files.length > 0) {
        const file = files[0];
        const fileOBJ = URL.createObjectURL(file)
        const {height, width} = await getDimsImg(fileOBJ);
        const predict_img = new Image(width, height);
        predict_img.src = fileOBJ;
        predict_img.onload = async () => {
            const predictions = await classify_image(model, predict_img);
            setPreds(predictions);
        }
    }
    return null
}

  useEffect(() => {
    tf.ready().then(async () => {
      const mdl = await load_tfjs_model();
      setModel(mdl)
      setDisabled(false)
    });
  }, [])

  return (
    <div className="container">
      <Header />
      <div className="input-group mb-3">
        <input type="file" accept="image/*" className="form-control" 
        id="file-uploader" disabled={disabled} onChange={(e) => {
          predict(model, e)
        }}/>
      </div>
      <PredictionList predictions={preds}/>
    </div>
  );
}

export default App;
