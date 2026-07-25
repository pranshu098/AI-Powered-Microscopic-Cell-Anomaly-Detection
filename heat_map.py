import io
from matplotlib.patches import Rectangle
from skimage.feature.peak import peak_local_max
import numpy as np
import tensorflow as tf
from keras.models import Model
import scipy
import matplotlib.pyplot as plt

model = tf.keras.models.load_model("model.h5")

def plot_heatmap(img):
    pred = model.predict(np.expand_dims(img, axis=0))
    pred_class = np.argmax(pred)

    last_layer_weights = model.layers[-1].get_weights()[0]  # Prediction layer
    last_layer_weights_for_pred = last_layer_weights[:, pred_class]

    last_conv_model = Model(model.input, model.get_layer("block5_conv3").output)
    last_conv_output = last_conv_model.predict(img[np.newaxis, :, :, :])
    last_conv_output = np.squeeze(last_conv_output)

    # Upsample conv output
    h = int(img.shape[0]/last_conv_output.shape[0])
    w = int(img.shape[1]/last_conv_output.shape[1])
    upsampled_last_conv_output = scipy.ndimage.zoom(last_conv_output, (h, w, 1), order=1)

    heat_map = np.dot(
        upsampled_last_conv_output.reshape((img.shape[0]*img.shape[1], 512)),
        last_layer_weights_for_pred
    ).reshape(img.shape[0], img.shape[1])

    heat_map[img[:, :, 0] == 0] = 0  # Mask out dark pixels

    peak_coords = peak_local_max(heat_map, num_peaks=5, threshold_rel=0.5, min_distance=10)

    # Plot
    plt.imshow(img.astype('float32').reshape(img.shape[0], img.shape[1], 3))
    plt.imshow(heat_map, cmap='jet', alpha=0.3)
    for i in range(peak_coords.shape[0]):
        y, x = peak_coords[i]
        plt.gca().add_patch(Rectangle((x-25, y-25), 50, 50, linewidth=1, edgecolor='r', facecolor='none'))

    # Save figure to buffer
    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0)
    buf.seek(0)
    plt.close()
    return buf
