# from fastapi import FastAPI, File, UploadFile, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# import numpy as np
# from PIL import Image
# import cv2
# from fastapi import Response
# from heat_map import plot_heatmap
# import matplotlib.pyplot as plt


# app = FastAPI()

# # Add CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Configuration
# SIZE = 224  # Adjust as needed


# @app.post("/generate-heatmap/")
# async def generate_heatmap(file: UploadFile = File(...)):
#     """
#     Process uploaded image and return heatmap directly as image response
#     """
#     # Validate file type
#     if not file.content_type.startswith('image/'):
#         raise HTTPException(status_code=400, detail="File must be an image")
    
#     try:
#         # Read image file
#         contents = await file.read()
        
#         # Convert to numpy array
#         nparr = np.frombuffer(contents, np.uint8)
#         img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
#         if img is None:
#             raise HTTPException(status_code=400, detail="Could not decode image")
        
#         # Convert BGR to RGB
#         img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
#         # Process image (your original code)
#         image_pil = Image.fromarray(img_rgb, "RGB")
#         image_pil = image_pil.resize((SIZE, SIZE))
#         image_array = np.array(image_pil)
#         image_normalized = image_array / 255.0
        
#         # Generate heatmap using your function
#         heatmap_buffer = plot_heatmap(image_normalized)
        
#         # Return heatmap directly as image response
#         return Response(
#             content=heatmap_buffer.getvalue(),
#             media_type="image/png"
#         )
        
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")




from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from PIL import Image
import cv2
from fastapi import Response
from heat_map import plot_heatmap
import matplotlib.pyplot as plt

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
SIZE = 224  # Adjust as needed

async def _process_heatmap_upload(file: UploadFile):
    """
    Process uploaded image and return heatmap directly as image response
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    try:
        contents = await file.read()

        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            raise HTTPException(status_code=400, detail="Could not decode image")

        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        image_pil = Image.fromarray(img_rgb, "RGB")
        image_pil = image_pil.resize((SIZE, SIZE))
        image_array = np.array(image_pil)
        image_normalized = image_array / 255.0

        heatmap_buffer = plot_heatmap(image_normalized)

        return Response(
            content=heatmap_buffer.getvalue(),
            media_type="image/png"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")


@app.get("/")
@app.get("/generate-heatmap/")
async def health_check():
    return {
        "status": "ok",
        "message": "Use POST to / or /generate-heatmap/ with an image file"
    }


@app.post("/")
@app.post("/generate-heatmap/")
async def generate_heatmap(file: UploadFile = File(...)):
    return await _process_heatmap_upload(file)