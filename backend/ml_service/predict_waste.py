import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import os

# Load model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "waste_classifier.h5")
model = tf.keras.models.load_model(MODEL_PATH)

# Class labels (order should match your training classes)
CLASS_NAMES = ['cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash']

def predict_waste(img_path, threshold=0.5):
    # Predict waste class for a single image
    # Parameters:
    #     img_path (str): Path to the image.
    #     threshold (float): Minimum confidence required to assign class. Otherwise returns 'uncertain'.
    # Returns:
    #     tuple: (predicted_class, confidence)
    
    # Load and preprocess image
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0) / 255.0  # normalize

    # Predict
    predictions = model.predict(img_array)
    confidence = np.max(predictions)
    predicted_class = CLASS_NAMES[np.argmax(predictions)] if confidence >= threshold else "uncertain"
    
    return predicted_class, confidence

# Optional: allow script to run standalone
if __name__ == "_main_":
    test_image = r"C:\Users\user\OneDrive\Desktop\dataset-resized\plastic\image1.jpg"
    cls, conf = predict_waste(test_image)
    print(f"Predicted class: {cls} ({conf*100:.2f}%)")
