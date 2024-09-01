import pyttsx3

class TextToSpeech:
    def __init__(self):
        self.engine = pyttsx3.init()
        self.voices = self.engine.getProperty('voices')
        self.current_voice_id = None
        self.current_rate = 100
        self.current_volume = 0.8

    def set_voice_properties(self, voice_id=None, rate=100, volume=1.0):
        #Set the voice properties of the pyttsx3 engine.
        if voice_id is not None and 0 <= voice_id < len(self.voices):
            self.engine.setProperty('voice', self.voices[voice_id].id)
            self.current_voice_id = voice_id
        
        self.engine.setProperty('rate', rate)
        self.engine.setProperty('volume', volume)
        self.current_rate = rate
        self.current_volume = volume

    def speak_text(self, text, save_to_file=None):
        #Convert text to speech using the configured voice properties.
        self.engine.say(text)
        #If a file path is provided, save the speech to the file
        if save_to_file:
            self.engine.save_to_file(text, save_to_file)
        
        self.engine.runAndWait()

    def stop(self):
        """Stop the engine."""
        self.engine.stop()