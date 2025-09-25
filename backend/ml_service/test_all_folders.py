import os
from predict_waste import predict_waste
import csv

# Root folder containing all categories
root_folder = r"C:\Users\user\OneDrive\Desktop\dataset-resized"

# Output CSV
output_csv = "all_test_results.csv"

results = []

# Loop through all category folders
for category in os.listdir(root_folder):
    category_path = os.path.join(root_folder, category)
    if os.path.isdir(category_path):
        for img_file in os.listdir(category_path):
            img_path = os.path.join(category_path, img_file)
            if os.path.isfile(img_path):
                cls, conf = predict_waste(img_path)
                results.append([category, img_file, cls, conf])
                print(f"{category}/{img_file}: {cls} ({conf*100:.2f}%)")

# Save results to CSV
with open(output_csv, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["Folder", "Image", "Predicted Class", "Confidence"])
    writer.writerows(results)
