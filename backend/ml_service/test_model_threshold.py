import os
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

MODEL_PATH = "models/waste_transfer_model.h5"
IMAGE_FOLDER = "test_images"
IMAGE_SIZE = (224, 224)
LABELS = ['cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash']

model = load_model(MODEL_PATH)

image_files = [f for f in os.listdir(IMAGE_FOLDER) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]

if not image_files:
    print(f"No images found in {IMAGE_FOLDER}/")
else:
    for img_file in image_files:
        img_path = os.path.join(IMAGE_FOLDER, img_file)
        img = image.load_img(img_path, target_size=IMAGE_SIZE)
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) / 255.0

        predictions = model.predict(img_array)
        predicted_class = LABELS[np.argmax(predictions)]
        print(f"{img_file} -> {predicted_class} ({np.max(predictions):.4f})")
