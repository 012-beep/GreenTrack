from flask import Flask, request, jsonify
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import os

app = Flask(__name__)

# Load your trained model
model_path = os.path.join("models", "waste_classifier.h5")
model = tf.keras.models.load_model(model_path)

# Define waste categories (must match training)
class_labels = ["cardboard", "glass", "metal", "paper", "plastic", "trash"]

def predict_waste(img_path):
    # Load and preprocess image
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # Predict class
    preds = model.predict(img_array)
    return class_labels[np.argmax(preds)]

@app.route('/predict', methods=['POST'])
def predict():
    # Check if file exists in request
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Save temporary file
    filepath = os.path.join("temp.jpg")
    file.save(filepath)

    # Get prediction
    prediction = predict_waste(filepath)

    # Remove temp file
    os.remove(filepath)

    # Return JSON response
    return jsonify({"prediction": prediction})

if __name__ == "__main__":
	app.run(port=5001, debug=True)