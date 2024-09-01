from rake_nltk import Rake
text = """
Certainly! While working on the N-CMAPSS dataset, my goal was to predict the Remaining Useful Life (RUL) of turbofan engines. 
I started by cleaning and preprocessing the data, ensuring it was ready for modeling. Given the high dimensionality of the dataset, 
I used Principal Component Analysis (PCA) to reduce the number of features while retaining the most important information.
For the modeling, I integrated an Attention Mechanism into a Bi-LSTM architecture, combined with a CNN layer. 
This approach allowed the model to focus on the most critical parts of the time-series data, which significantly improved 
prediction accuracy—by about 28.6%. Overall, the combination of dimensionality reduction and an optimized model architecture 
led to a robust predictive model that could be very effective in real-world predictive maintenance scenarios.
"""


rake = Rake(min_length=2)
rake.extract_keywords_from_text(text)
keywords_with_scores = rake.get_ranked_phrases_with_scores()

for score, keyword in keywords_with_scores:
    print(f"{keyword}: {score}")