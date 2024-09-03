import json
import redis
from tts import TextToSpeech
from vtt import VoiceToText
from finetune import generate_follow_up_question

class VoiceInterview:
    def __init__(self, redis_host='localhost', redis_port=6379):
        self.redis_client = redis.StrictRedis(host=redis_host, port=redis_port, decode_responses=True)
        self.tts = TextToSpeech()
        self.vtt = VoiceToText()

    def get_questions_from_redis(self, session_id):
        questions_json = self.redis_client.get(session_id)
        if questions_json:
            return json.loads(questions_json)
        return []

    def ask_question(self, question):
        self.tts.speak_text(question)

    def listen_response(self):
        response_text = self.vtt.recognize_speech()
        print(f"User's response: {response_text}")
        return response_text

    def conduct_interview(self, session_id):
        questions = self.get_questions_from_redis(session_id)
        if not questions:
            print("No questions found for the session.")
            return

        responses = []
        print(f"questions are : {questions['questions']}")
        questions=questions['questions'].split('?')
        for q in questions:
            print(f"Interviewer : {q}")
            self.ask_question(q)
            response = self.listen_response()

            # Generate and ask follow-up question
            follow_up_question = generate_follow_up_question(q, response)
            if follow_up_question:
                self.ask_question(follow_up_question)
                follow_up_response = self.listen_response()
                responses.append({
                    "question": q, 
                    "response": response, 
                    "follow_up_question": follow_up_question, 
                    "follow_up_response": follow_up_response
                })
            else:
                responses.append({"question": q, "response": response})

        #self.redis_client.set(f"{session_id}_responses", json.dumps(responses))
        print(responses)
        print("Interview completed. Responses saved.")