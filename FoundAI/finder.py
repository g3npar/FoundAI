import torch
from torchvision import models, transforms
from PIL import Image
import torch.nn.functional as F


# Load pre-trained ResNet50 model
model = models.resnet50(pretrained=True)
model.eval()  # Set model to evaluation mode


# Transformation for input images
preprocess = transforms.Compose([
   transforms.Resize((224, 224)),  # Resize the image to 224x224 pixels
   transforms.ToTensor(),          # Convert the image to a PyTorch tensor
   transforms.Normalize(           # Normalize with ImageNet mean and std
       mean=[0.485, 0.456, 0.406],
       std=[0.229, 0.224, 0.225]
   ),
])


# Function to extract features from an image using ResNet
def extract_features(image):
   # Load the image



   # Preprocess the image
   input_tensor = preprocess(image)
   input_batch = input_tensor.unsqueeze(0)  # Create a mini-batch as expected by the model


   with torch.no_grad():
       # Extract features (the output of the second-to-last layer in ResNet50)
       features = model(input_batch)


   return features.squeeze()  # Remove the batch dimension


# Function to compute cosine similarity between two feature vectors
def cosine_similarity(features1, features2):
   similarity = F.cosine_similarity(features1, features2, dim=0).item()
   return similarity


# Convert cosine similarity to a similarity score from 1 to 10
def similarity_score_from_cosine(cosine_sim):
   # Cosine similarity ranges from -1 to 1, so we map it to the range [1, 10]
   # 1 corresponds to -1 (most dissimilar), and 10 corresponds to 1 (most similar)
   return (cosine_sim + 1) * 4.5 + 1  # Maps [-1, 1] to [1, 10]


# Main function to compare two images and output a similarity score
def compare_images(image_path1, image_path2):
   # Extract features from both images
   features1 = extract_features(image_path1)
   features2 = extract_features(image_path2)


   # Compute cosine similarity
   cosine_sim = cosine_similarity(features1, features2)
   return cosine_sim


# Example usage
if __name__ == "__main__":
   image_path1 = 'flask.jpg'  # Path to the first image
   image_path2 = 'image3.jpg'  # Path to the second image


   similarity_score = compare_images(image_path1, image_path2)
   print(f"Similarity Score (0-1): {similarity_score:.2f}")


