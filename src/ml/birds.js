import * as tf from "@tensorflow/tfjs";
import classes from "../data/classes.json"
import birdClasses from "../data/inat_bird_data.json"
import modelClasses from "../data/model_classes.json"

const MODEL_URL = "https://raw.githubusercontent.com/SharanSMenon/ml-models/master/animal_model/birds_1486_tfjs/model.json";
const IMAGE_SIZE = 299;

export const load_tfjs_model = async () => {
    const model = await tf.loadLayersModel(MODEL_URL);
    return model;
}

export const classify_image = async (model, image) => {
    // const processedImg = await processImage(image_data);
    let img = tf.browser.fromPixels(image);
    img = img.resizeBilinear([IMAGE_SIZE, IMAGE_SIZE])
        .toFloat()
        .div(255.0)
        .expandDims(0)
    const preds = await model.predict(img)
    let predictions = tf.squeeze(preds)
    let top5 = tf.topk(predictions, 5).indices.dataSync()
    let top5_preds = []
    let top5_classes = []
    for (let i in top5) {
        top5_preds.push(modelClasses[top5[i].toString()])
    }
    for (let j in top5_preds) {
        top5_classes.push(modelClasses["name"].findIndex(top5_preds[j]))
    }
    return top5_preds
}