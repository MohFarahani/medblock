import sys
import json
import numpy as np
from pydicom import dcmread
from pydicom.multival import MultiValue
from pydicom.valuerep import PersonName

def getDicomValue(ds, name):
    try:
        value = ds.get(name)
        if value is None:
            return ''
        if isinstance(value, MultiValue):
            return [str(x) for x in value]
        if isinstance(value, PersonName):
            return str(value)
        if isinstance(value, (np.ndarray, list)):
            return [str(x) for x in value]
        if isinstance(value, (np.floating, np.integer)):
            return float(value)
        return str(value)
    except:
        return ''

def convert_dicom(filepath: str) -> dict:
    try:
        ds = dcmread(filepath)
        
        output_json = {
            "PatientName": getDicomValue(ds, 'PatientName'),
            "StudyDate": getDicomValue(ds, 'StudyDate'),
            "StudyDescription": getDicomValue(ds, 'StudyDescription'),
            "SeriesDescription": getDicomValue(ds, 'SeriesDescription'),
            "Modality": getDicomValue(ds, 'Modality'),
            "filepath": filepath
        }
        
        return output_json
    except Exception as e:
        return {
            "error": str(e),
            "details": str(sys.exc_info())
        }

if __name__ == "__main__":
    try:
        if len(sys.argv) < 2:
            result = {
                "error": f"Invalid arguments. Expected at least 1, got {len(sys.argv) - 1}"
            }
        else:
            filepath = sys.argv[1]
            result = convert_dicom(filepath)
        
        # Ensure proper JSON output
        print(json.dumps(result, ensure_ascii=False, default=str))
        sys.stdout.flush()

    except Exception as e:
        error_result = {
            "error": str(e),
            "traceback": str(sys.exc_info())
        }
        print(json.dumps(error_result, ensure_ascii=False, default=str))
        sys.stdout.flush()