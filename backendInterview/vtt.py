import speech_recognition as sr

class VoiceToText:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.microphone = sr.Microphone()
        self.recognizer.energy_threshold = 4000  # can be adjusted
        self.recognizer.dynamic_energy_threshold = True  # Adjust threshold dynamically

    def set_recognizer_properties(self, energy_threshold=4000, dynamic_energy_threshold=True):
        # Set the recognizer properties.
        self.recognizer.energy_threshold = energy_threshold
        self.recognizer.dynamic_energy_threshold = dynamic_energy_threshold

    def recognize_speech(self, audio_source=None, language="en-IN"):
        # Recognize speech from the given audio source with support for the Indian accent
        if audio_source is None:
            with self.microphone as source:
                audio = self.recognizer.listen(source,timeout=10, phrase_time_limit=30)
        else:
            audio = audio_source
        
        try:
            text = self.recognizer.recognize_google(audio, language=language)
            return text
        except sr.UnknownValueError:
            return "Sorry, I could not understand the audio. Can you repeat it again?"
        except sr.RequestError:
            return "Sorry, there was a problem with the speech recognition service."

    def stop(self):
        """Cleanup resources if needed."""
        pass
