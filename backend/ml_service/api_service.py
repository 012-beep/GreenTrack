from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import os
import io
from PIL import Image
import base64

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# Load your trained model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "waste_classifier.h5")

try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print(f"Model loaded successfully from {MODEL_PATH}")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Define waste categories (must match your training)
CLASS_NAMES = ['cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash']

# Map model classes to application waste types
MODEL_TO_APP_MAPPING = {
    'cardboard': 'paper',
    'glass': 'glass', 
    'metal': 'metal',
    'paper': 'paper',
    'plastic': 'plastic',
    'trash': 'general'
}

def preprocess_image(img_data):
    """Preprocess image for model prediction"""
    try:
        # Convert to PIL Image
        img = Image.open(io.BytesIO(img_data))
        
        # Convert to RGB if necessary
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Resize to model input size
        img = img.resize((224, 224))
        
        # Convert to array and normalize
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
    except Exception as e:
        print(f"Error preprocessing image: {e}")
        return None

def predict_waste_type(img_array):
    """Predict waste type using the trained model"""
    if model is None:
        return None, 0.0, {}
    
    try:
        # Get model predictions
        predictions = model.predict(img_array)
        
        # Get predicted class and confidence
        predicted_class_idx = np.argmax(predictions[0])
        predicted_class = CLASS_NAMES[predicted_class_idx]
        confidence = float(predictions[0][predicted_class_idx])
        
        # Get all class probabilities
        all_predictions = {
            CLASS_NAMES[i]: float(predictions[0][i]) 
            for i in range(len(CLASS_NAMES))
        }
        
        return predicted_class, confidence, all_predictions
    except Exception as e:
        print(f"Error during prediction: {e}")
        return None, 0.0, {}

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'supported_classes': CLASS_NAMES
    })

@app.route('/predict', methods=['POST'])
def predict():
    """Main prediction endpoint"""
    try:
        # Check if model is loaded
        if model is None:
            return jsonify({
                'success': False,
                'error': 'Model not loaded'
            }), 500
        
        # Check if file is in request
        if 'file' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No file provided'
            }), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({
                'success': False,
                'error': 'No file selected'
            }), 400
        
        # Read and preprocess image
        img_data = file.read()
        img_array = preprocess_image(img_data)
        
        if img_array is None:
            return jsonify({
                'success': False,
                'error': 'Error processing image'
            }), 400
        
        # Make prediction
        predicted_class, confidence, all_predictions = predict_waste_type(img_array)
        
        if predicted_class is None:
            return jsonify({
                'success': False,
                'error': 'Error during prediction'
            }), 500
        
        # Map to application waste type
        app_waste_type = MODEL_TO_APP_MAPPING.get(predicted_class, 'general')
        
        # Calculate points based on waste type
        points_map = {
            'plastic': 10,
            'paper': 8,
            'metal': 12,
            'glass': 15,
            'general': 5
        }
        points = points_map.get(app_waste_type, 5)
        
        # Prepare response
        response = {
            'success': True,
            'prediction': {
                'model_class': predicted_class,
                'app_waste_type': app_waste_type,
                'confidence': round(confidence * 100, 2),
                'points': points
            },
            'all_predictions': {
                k: round(v * 100, 2) for k, v in all_predictions.items()
            },
            'model_info': {
                'input_size': '224x224',
                'classes': CLASS_NAMES,
                'preprocessing': 'RGB normalization'
            }
        }
        
        return jsonify(response)
        
    except Exception as e:
        print(f"Error in predict endpoint: {e}")
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500

@app.route('/predict_base64', methods=['POST'])
def predict_base64():
    """Prediction endpoint for base64 encoded images"""
    try:
        if model is None:
            return jsonify({
                'success': False,
                'error': 'Model not loaded'
            }), 500
        
        data = request.get_json()
        
        if not data or 'image' not in data:
            return jsonify({
                'success': False,
                'error': 'No image data provided'
            }), 400
        
        # Decode base64 image
        try:
            image_data = data['image']
            if image_data.startswith('data:image'):
                image_data = image_data.split(',')[1]
            
            img_data = base64.b64decode(image_data)
        except Exception as e:
            return jsonify({
                'success': False,
                'error': 'Invalid base64 image data'
            }), 400
        
        # Preprocess and predict
        img_array = preprocess_image(img_data)
        
        if img_array is None:
            return jsonify({
                'success': False,
                'error': 'Error processing image'
            }), 400
        
        predicted_class, confidence, all_predictions = predict_waste_type(img_array)
        
        if predicted_class is None:
            return jsonify({
                'success': False,
                'error': 'Error during prediction'
            }), 500
        
        app_waste_type = MODEL_TO_APP_MAPPING.get(predicted_class, 'general')
        
        points_map = {
            'plastic': 10,
            'paper': 8,
            'metal': 12,
            'glass': 15,
            'general': 5
        }
        points = points_map.get(app_waste_type, 5)
        
        response = {
            'success': True,
            'prediction': {
                'model_class': predicted_class,
                'app_waste_type': app_waste_type,
                'confidence': round(confidence * 100, 2),
                'points': points
            },
            'all_predictions': {
                k: round(v * 100, 2) for k, v in all_predictions.items()
            }
        }
        
        return jsonify(response)
        
    except Exception as e:
        print(f"Error in predict_base64 endpoint: {e}")
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500

if __name__ == '__main__':
    print("Starting GreenTrack ML API Service...")
    print(f"Model loaded: {model is not None}")
    print(f"Supported classes: {CLASS_NAMES}")
    
    # Run the Flask app
    app.run(
        host='0.0.0.0',
        port=8000,
        debug=True
    )