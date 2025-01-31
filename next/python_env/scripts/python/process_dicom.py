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
    """
    Convert DICOM file to structured data matching database tables:
    - PatientTable (Name)
    - StudiesTable (StudyName, StudyDate)
    - SeriesTable (SeriesName)
    - ModalityTable (Name)
    - FilesTable (FilePath)
    """
    try:
        ds = dcmread(filepath)
        
        # Extract relevant DICOM fields
        patient_name = getDicomValue(ds, 'PatientName')
        study_date = getDicomValue(ds, 'StudyDate')
        study_description = getDicomValue(ds, 'StudyDescription')
        series_description = getDicomValue(ds, 'SeriesDescription')
        modality = getDicomValue(ds, 'Modality')
        
        # Format the output to match the database structure
        output_json = {
            "PatientName": patient_name,  # For PatientTable
            "StudyDate": study_date,  # For StudiesTable
            "StudyDescription": study_description,  # For StudiesTable
            "SeriesDescription": series_description,  # For SeriesTable
            "Modality": modality,  # For ModalityTable
            "filePath": filepath  # For FilesTable
        }
        
        return output_json
    except Exception as e:
        return {
            "error": str(e),
            "details": str(sys.exc_info())
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