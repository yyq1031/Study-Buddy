import sys
import whisper

def transcribe(file_path):
    model = whisper.load_model("base")
    result = model.transcribe(file_path)
    return result["text"]

if __name__ == "__main__":
    file_path = sys.argv[1]
    print(transcribe(file_path))
