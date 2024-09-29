import torch
from torchvision import models, transforms
from PIL import Image

# Load a pre-trained ResNet model
model = models.resnet50(weights='IMAGENET1K_V1')  # Use the correct weights
model.eval()  # Set the model to evaluation mode

# Load Stanford Online Products class names (modify this path as needed)
with open("stanford_online_products_classes.txt", "r") as f:
    labels = [line.strip() for line in f.readlines()]

# Define image transforms
preprocess = transforms.Compose([
    transforms.Resize(256),  # Resize the image to 256x256 pixels
    transforms.CenterCrop(224),  # Crop the center of the image
    transforms.ToTensor(),  # Convert image to a tensor
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],  # Normalize with ImageNet's mean
        std=[0.229, 0.224, 0.225]   # Normalize with ImageNet's std
    ),
])

# Load the image
img_path = "kirkland.jpg"  # Change this to your image file
image = Image.open(img_path)

# Preprocess the image
image = preprocess(image)
image = image.unsqueeze(0)  # Add a batch dimension

# Run the image through the model
with torch.no_grad():  # No need for gradients during inference
    output = model(image)

# Get the top 5 predicted class indexes
_, indices = torch.topk(output, 5)

# Print the top 5 keywords (class names)
for idx in indices[0]:
    print(f"Keyword: {labels[idx]}")
