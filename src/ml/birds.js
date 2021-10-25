import * as tf from "@tensorflow/tfjs";
import classes from "../data/classes.json"

export const load_tfjs_model = async () => {
    const model = await tf.loadGraphModel("https://raw.githubusercontent.com/SharanSMenon/ml-models/master/animal_model/birds_tfjs/model.json");
    return model;
}

export const classify_image = async (model, image) => {
    // const processedImg = await processImage(image_data);
    let img = tf.browser.fromPixels(image);
    img = img.resizeBilinear([224, 224])
        .toFloat()
        .div(255.0)
        .expandDims(0)
    const preds = await model.predict(img)
    let predictions = tf.squeeze(preds)
    let top5 = tf.topk(predictions, 5).indices.dataSync()
    let top5_preds = []
    for (let i in top5) {
        top5_preds.push(classes[top5[i].toString()])
    }
    return top5_preds
}