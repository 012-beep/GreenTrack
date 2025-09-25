import os
import glob
import numpy as np
import tensorflow as tf
from tensorflow.keras.utils import load_img, img_to_array

MODEL_PATH = "models/waste_transfer_model.h5"
LABELS = ["cardboard", "glass", "metal", "paper", "plastic", "trash"]
TARGET_SIZE = (224, 224)
FOLDER = "C:/Users/user/Desktop/GreenTrack/backend/ml_service/test_images"

# Find all image files
exts = {".jpg", ".jpeg", ".png", ".bmp", ".gif"}
image_paths = []
for ext in exts:
    image_paths.extend(glob.glob(os.path.join(FOLDER, f"*{ext}")))
image_paths.sort()

if not image_paths:
    print(f"No images found in {FOLDER}/")
    exit(1)

# Load model
model = tf.keras.models.load_model(MODEL_PATH)

# Predict each image
for p in image_paths:
    img = load_img(p, target_size=TARGET_SIZE)
    arr = img_to_array(img) / 255.0
    arr = np.expand_dims(arr, 0)
    preds = model.predict(arr)
    print(f"Image: {os.path.basename(p)}")
    print(f"Prediction probabilities: {preds}")
    predicted_class = LABELS[np.argmax(preds)]
    print(f"Predicted class: {predicted_class}")
    print("-" * 40)
