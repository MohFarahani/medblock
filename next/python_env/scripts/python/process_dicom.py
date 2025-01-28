# python_env/scripts/python/process_dicom.py

import sys
import json
import numpy as np
from PIL import Image
from pydicom import dcmread
from pydicom.multival import MultiValue
from pydicom.valuerep import PersonName

def getDicomValue(ds, name):
    value = ds.get(name)
    if value is None:
        return ''
    if isinstance(value, MultiValue):
        array = np.array(value)
        return array.tolist()
    if isinstance(value, PersonName):
        return str(value)
    if isinstance(value, np.ndarray):
        return value.tolist()
    if isinstance(value, (np.floating, np.integer)):
        return value.item()
    return value

def convert_dicom(filepath, output_type="json", with_metadata=False):
    try:
        # Extract dataset from dcm file
        ds = dcmread(filepath)
        
        # Extract the pixel data from dataset
        pixel_data = ds.pixel_array
        
        # Get rescale intercept or default to 0
        try:
            rescale_intercept = ds.RescaleIntercept
        except:
            rescale_intercept = 0

        # Convert to float to avoid overflow or underflow losses
        pixel_data_float = pixel_data.astype(float)
        pixel_data_float += rescale_intercept
        
        # Get maximum and minimum values
        maximum = float(np.amax(pixel_data_float))
        minimum = float(np.amin(pixel_data_float))

        # Rescaling grey scale between 0-255
        # Fix the line that had the syntax error by putting it all on one line
        pixel_data_float_scaled = (np.maximum(pixel_data_float, 0) / pixel_data_float.max()) * 255.0

        # Convert to uint8 ndarray
        pixel_data_uint8_scaled = np.uint8(pixel_data_float_scaled)

        if output_type == "json":
            # Get all the DICOM values
            output_json = {
                "slices": [{
                    "image": pixel_data_uint8_scaled.tolist(),
                    "InstanceNumber": getDicomValue(ds, 'InstanceNumber'),
                    "SliceLocation": getDicomValue(ds, 'SliceLocation'),
                    "ImageOrientationPatient": getDicomValue(ds, 'ImageOrientationPatient'),
                    "ImagePositionPatient": getDicomValue(ds, 'ImagePositionPatient'),
                    "filepath": filepath,
                }],
                "width": int(ds.Columns),
                "height": int(ds.Rows),
                "minimum": minimum,
                "maximum": maximum,
                "Modality": getDicomValue(ds, 'Modality'),
                "SeriesDescription": getDicomValue(ds, 'SeriesDescription'),
                "ProtocolName": getDicomValue(ds, 'ProtocolName'),
                "PatientName": getDicomValue(ds, 'PatientName'),
                "StudyDate": getDicomValue(ds, 'StudyDate'),
                "StudyTime": getDicomValue(ds, 'StudyTime'),
                "SliceThickness": float(getDicomValue(ds, 'SliceThickness') or 0),
                "SpacingBetweenSlices": float(getDicomValue(ds, 'SpacingBetweenSlices') or 0),
                "PixelSpacing": getDicomValue(ds, 'PixelSpacing'),
                "RepetitionTime": getDicomValue(ds, 'RepetitionTime'),
                "EchoTime": getDicomValue(ds, 'EchoTime'),
                "ImageType": getDicomValue(ds, 'ImageType'),
                "MagneticFieldStrength": getDicomValue(ds, 'MagneticFieldStrength'),
                "SeriesNumber": getDicomValue(ds, 'SeriesNumber'),
                "NumberOfFrames": getDicomValue(ds, 'NumberOfFrames'),
                "StudyDescription": getDicomValue(ds, 'StudyDescription')
            }
            return output_json
        elif output_type == "image":
            img = Image.fromarray(pixel_data_uint8_scaled)
            return img
        
    except Exception as e:
        return {
            "error": str(e),
            "details": str(sys.exc_info())
        }

if __name__ == "__main__":
    try:
        if len(sys.argv) < 4:
            print(json.dumps({
                "error": f"Invalid arguments. Expected 3, got {len(sys.argv) - 1}"
            }))
            sys.exit(1)

        filepath = sys.argv[1]
        output_type = sys.argv[2]
        with_metadata = sys.argv[3].lower() == "true"

        result = convert_dicom(filepath, output_type, with_metadata)
        
        # Ensure the result is JSON serializable
        print(json.dumps(result))
        sys.stdout.flush()

    except Exception as e:
        print(json.dumps({
            "error": str(e),
            "traceback": str(sys.exc_info())
        }))
        sys.exit(1)