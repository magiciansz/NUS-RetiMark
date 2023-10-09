from torch import nn
from torchvision import models

class EyeClassifier(nn.Module):
    def __init__(self, pretrained=True):
        super().__init__()
        self.model = models.resnet34(pretrained=pretrained, progress=pretrained)
        for param in self.model.parameters():
            param.requires_grad = True
        
        num_features = self.model.fc.in_features
        self.model.fc = nn.Sequential(
            nn.Flatten(),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.BatchNorm1d(num_features),
            nn.Dropout(0.3),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(num_features, 1),
            nn.Sigmoid()
        )
        
    def forward(self, x):
        x = self.model(x)
        return x