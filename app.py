from flask import Flask, request, jsonify, render_template
from sklearn.datasets import fetch_20newsgroups
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics.pairwise import cosine_similarity


# Creates Term-document Matrix, and Performs SVD
newsgroups = fetch_20newsgroups(subset='all')
documents = newsgroups.data
vectorizer = TfidfVectorizer(stop_words='english')
X = vectorizer.fit_transform(documents)
svd = TruncatedSVD(n_components=100)
X_reduced = svd.fit_transform(X)

def process_query(query):
    query_vec = vectorizer.transform([query])  # Transform the query to TF-IDF space
    query_reduced = svd.transform(query_vec)  # Reduce query dimensionality
    similarities = cosine_similarity(query_reduced, X_reduced)  # Compute cosine similarities
    return similarities


# FRONT END

app = Flask(__name__,static_folder='static', template_folder='templates')

@app.route('/')
def home():
    return render_template('index.html')  # Front-end HTML page

@app.route('/search', methods=['POST'])
def search():
    query = request.json['query']
    similarities = process_query(query)
    top_docs = similarities.argsort()[0][-5:][::-1]  # Get indices of top 5 documents
    top_results = [{'doc': documents[i], 'similarity': similarities[0][i]} for i in top_docs]
    return jsonify(top_results)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)