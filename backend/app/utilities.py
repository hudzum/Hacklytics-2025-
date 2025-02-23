import pandas as pd
import openpyxl
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def get_data():
    # Read data from Excel file
    df = pd.read_excel('CPTtoDesc.xlsx')
    df["Description"] = df["Description"].apply(lambda x: (re.sub(r'[^\w\s]', '', x)))
    df["Description"] = df["Description"].apply(lambda x: x.lower())
    return df

def desc2CPT(df, inputDesc: str) -> str:
    # make input lowercase
    inputDesc = inputDesc.lower()
    # remove punctuation
    inputDesc = re.sub(r'[^\w\s]', '', inputDesc)
    # vectorize the input
    vectorizer = TfidfVectorizer()
    X = vectorizer.fit_transform(df["Description"])
    inputVec = vectorizer.transform([inputDesc])
    # calculate cosine similarity
    cosineSimilarities = cosine_similarity(inputVec, X)
    # get the index of the most similar description
    index = cosineSimilarities.argmax()
    # get the CPT code of the most similar description
    CPT = df.iloc[index]["CPT"]
    return CPT

def get_desc(df, CPT: str) -> str:
    # get the description of the CPT code
    desc = df[df["CPT"] == CPT]["Description"].values[0]
    return desc

