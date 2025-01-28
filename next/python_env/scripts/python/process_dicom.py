# scripts/process_dicom.py
import sys
import json
from pydicom import dcmread

def process_dicom(filepath):
    ds = dcmread(filepath)
    
    return {
        "InstanceNumber": getattr(ds, 'InstanceNumber', ''),
        "SliceLocation": getattr(ds, 'SliceLocation', ''),
        "ImageOrientationPatient": getattr(ds, 'ImageOrientationPatient', []).tolist() if hasattr(ds, 'ImageOrientationPatient') else [],
        "ImagePositionPatient": getattr(ds, 'ImagePositionPatient', []).tolist() if hasattr(ds, 'ImagePositionPatient') else [],
        "Modality": getattr(ds, 'Modality', ''),
        "SeriesDescription": getattr(ds, 'SeriesDescription', ''),
        "ProtocolName": getattr(ds, 'ProtocolName', ''),
        "PatientName": str(getattr(ds, 'PatientName', '')),
        "StudyDate": getattr(ds, 'StudyDate', ''),
        "StudyTime": getattr(ds, 'StudyTime', ''),
        "SliceThickness": float(getattr(ds, 'SliceThickness', 0)),
        "SpacingBetweenSlices": float(getattr(ds, 'SpacingBetweenSlices', 0)),
        "filepath": filepath
    }

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(json.dumps({"error": "No file path provided"}))
        sys.exit(1)

    try:
        result = process_dicom(sys.argv[1])
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)