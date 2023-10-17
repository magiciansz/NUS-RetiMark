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
            nn.BatchNorm1d(num_features),
            nn.Dropout(0.5),
            nn.Linear(num_features, 120),
            nn.ReLU(),
            nn.Linear(120, 5),
            nn.LogSoftmax(dim=1)
        )
        

    def forward(self, x):
        x = self.model(x)
        return x