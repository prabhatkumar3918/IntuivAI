import cohere

cohere_api_key = "MvISiDVtjUD1qkhxysW3bYVLwbCwOnnlUcZDXynD"  
co = cohere.Client(cohere_api_key)

examples = [
    {
        "question": "What is dimensionality reduction, and why is it important in machine learning?",
        "answer": "Dimensionality reduction is the process of reducing the number of input variables in a dataset, which helps in removing noise, avoiding overfitting, and improving model performance by focusing on the most relevant features.",
        "follow_up": "Can you explain how you applied Principal Component Analysis (PCA) in the N-CMAPSS dataset to enhance engine failure prediction?"
    },
    {
        "question": "What is a Bi-directional LSTM?",
        "answer": "A Bi-directional LSTM is a type of LSTM neural network that processes data in both forward and backward directions, capturing information from both past and future states to improve sequence prediction accuracy.",
        "follow_up": "How did you implement Bi-directional LSTM with GloVe embeddings for fake news detection?"
    },
    {
        "question":"What is the Attention Mechanism in deep learning?",
        "answer":"The Attention Mechanism allows models to focus on specific parts of the input data when making predictions, giving more weight to relevant features, which enhances the model's performance, especially in sequence-based tasks.",
        "follow_up": "Can you describe how integrating an Attention Mechanism into a Bi-LSTM improved your model's predictions on the N-CMAPSS dataset?"
    },
    {
        "question":"What is Generative AI, and how does it differ from traditional AI?",
        "answer":"Generative AI refers to algorithms that can generate new content, such as text, images, or audio, by learning patterns from existing data, whereas traditional AI focuses more on classification or prediction based on given data.",
        "follow_up": "How did your certification in Generative AI with Large Language Models influence your approach to any of the projects you’ve worked on?"
    },
    {
        "question": "Can you tell me about a time when you had to demonstrate leadership in a team setting?",
        "answer":"During my time as a member of the Azad Hall Cricket Team, I often took on leadership roles by organizing practice sessions and motivating the team, which contributed to our victory in the All Bengal Day-Night Knock-Out Cricket Tournament.",
        "follow_up":  "What specific strategies did you use to keep the team motivated and focused during challenging matches?"
    },
    {
        "question":"What are the advantages of using CNNs in predictive modeling?",
        "answer":"CNNs are effective for capturing spatial hierarchies in data due to their convolutional layers, which makes them highly useful for tasks involving image or sequence data by detecting patterns such as edges and textures.",
        "follow_up": "How did combining CNN with Bi-LSTM and an Attention Mechanism improve the performance of your model for engine failure prediction?"
    },
    {
        "question":"What is the Generalized Extreme Value (GEV) distribution, and where is it applied?",
        "answer":"The GEV distribution is a family of continuous probability distributions used to model the maxima of long sequences of random variables, often applied in fields like finance, meteorology, and environmental science.",
        "follow_up": "How did you apply the GEV distribution in your project on rainfall prediction to boost model accuracy?"
    }
]

def create_prompt(examples, input_question, input_answer):
    prompt = '''I am a virtual interview bot. Below are some examples of technical interview questions, 
    the candidate's responses, and the follow-up questions I should ask.\n\n'''
    
    for i, example in enumerate(examples):
        prompt += f"Example {i + 1}:\n"
        prompt += f"Question: {example['question']}\n"
        prompt += f"Answer: {example['answer']}\n"
        prompt += f"Follow-up Question: {example['follow_up']}\n\n"
    
    prompt += "Now, given the following question and answer, generate a relevant follow-up question:\n\n"
    prompt += f"Question: {input_question}\n"
    prompt += f"Answer: {input_answer}\n"
    prompt += "Follow-up Question:"
    
    return prompt


input_question = '''Hello, I'm Pihu, and I'll be conducting your interview today. Thank you for taking the time to speak with me. Before we begin, could you please introduce yourself and tell me a bit about your background and experience?'''
input_answer = "Sure, my name is [Sajal], and I have a background in data science. I've completed my Bachelor's degree in Computer Science and have been working in the field for the past five years, specializing in Artificial Intelligence. "


prompt = create_prompt(examples, input_question, input_answer)

response = co.generate(
    model='command-r-plus',
    prompt=prompt,
    max_tokens=100,
    temperature=0.2,
    k=2,
    stop_sequences=["\n"]
)

follow_up_question = response.generations[0].text.strip()

print(f"Follow-up Question: {follow_up_question}")

