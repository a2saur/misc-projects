import numpy as np
import random

def blur(arr, radius=2):
    newMap = np.empty(arr.shape)
    for y in range(arr.shape[0]):
        for x in range(arr.shape[1]):
            y0 = max(0, y - radius)
            y1 = min(arr.shape[0], y + radius + 1)
            x0 = max(0, x - radius)
            x1 = min(arr.shape[1], x + radius + 1)

            neighborhood = arr[y0:y1, x0:x1]
            newMap[y, x] = neighborhood.mean()
    
    return newMap

def tile_map(arr, levels=5):
    maxVal = np.max(arr)
    print(maxVal)
    lvlIncrements = maxVal/levels
    print(lvlIncrements)
    newMap = np.empty(arr.shape)
    for y in range(arr.shape[0]):
        for x in range(arr.shape[1]):
            for i in range(levels+1):
                if arr[y, x] < lvlIncrements*i:
                    newMap[y, x] = (i-0.5)*10
                    break
    return newMap

def roughen(arr, radius=1):
    newMap = np.empty(arr.shape)
    for y in range(arr.shape[0]):
        for x in range(arr.shape[1]):
            y0 = max(0, y - radius)
            y1 = min(arr.shape[0], y + radius + 1)
            x0 = max(0, x - radius)
            x1 = min(arr.shape[1], x + radius + 1)

            neighborhood = arr[y0:y1, x0:x1]
            newMap[y, x] = random.choice(neighborhood.reshape(-1))
    
    return newMap