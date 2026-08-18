


from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_bcrypt import Bcrypt
from datetime import timedelta
import random
import json
import os

from dotenv import load_dotenv
import google.generativeai as genai

# ---------------- ENV ----------------

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

# ---------------- APP ----------------

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=5)

db = SQLAlchemy(app)
login_manager = LoginManager(app)
bcrypt = Bcrypt(app)

# ---------------- MODELS ----------------

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    username = db.Column(db.String(50))
    avatar = db.Column(db.String(200))
    score = db.Column(db.Integer, default=0)

class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    folder_name = db.Column(db.String(100), nullable=False)
    code = db.Column(db.String(5), unique=True, nullable=False)
    questions = db.Column(db.PickleType, nullable=False)
    owner = db.Column(db.String(100), nullable=False)

class Folder(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

class QuizResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer)
    user_id = db.Column(db.Integer)
    correct_answers = db.Column(db.Integer)
    total_questions = db.Column(db.Integer)

# ---------------- LOGIN LOADER ----------------

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# ---------------- HOME ----------------

@app.route('/')
def index():
    return render_template('index.html')

# ---------------- SIGNUP ----------------

@app.route('/signup', methods=['GET','POST'])
def signup():

    if request.method == 'POST':

        email = request.form['email']
        password = request.form['password']

        if User.query.filter_by(email=email).first():
            flash("Email already registered")
            return redirect(url_for('login'))

        hashed = bcrypt.generate_password_hash(password).decode('utf-8')

        user = User(email=email,password=hashed)

        db.session.add(user)
        db.session.commit()

        flash("Signup successful")

        return redirect(url_for('login'))

    return render_template('signup.html')

# ---------------- LOGIN ----------------

@app.route('/login', methods=['GET','POST'])
def login():

    if request.method == 'POST':

        email = request.form['email']
        password = request.form['password']

        user = User.query.filter_by(email=email).first()

        if user and bcrypt.check_password_hash(user.password,password):

            login_user(user, remember=True)
            session.permanent=True

            return redirect(url_for('select'))

        flash("Invalid email or password")

    return render_template('login.html')

# ---------------- LOGOUT ----------------

@app.route('/logout')
@login_required
def logout():

    logout_user()

    flash("Logout successful")

    return redirect(url_for('login'))

# ---------------- SELECT ----------------

@app.route('/select')
@login_required
def select():
    return render_template('select.html')

# ---------------- SUBJECT PAGES ----------------

@app.route('/math')
@login_required
def math():
    return render_template('math.html')

@app.route('/gk')
@login_required
def gk():
    return render_template('gk.html')

@app.route('/english')
@login_required
def english():
    return render_template('english.html')

@app.route('/science')
@login_required
def science():
    return render_template('science.html')

# ---------------- CODE PAGE ----------------

@app.route('/code', methods=['GET','POST'])
@login_required
def code():

    if request.method == 'POST':

        entered_code=request.form.get('code')

        if entered_code=='00000':
            session['quiz_code']=entered_code
            return redirect(url_for('switch'))

        quiz=Quiz.query.filter_by(code=entered_code).first()

        if quiz:
            session['quiz_code']=entered_code
            return redirect(url_for('switch'))

        return render_template('code.html',error=True)

    return render_template('code.html',error=False)

# ---------------- SWITCH USER ----------------

@app.route('/switch', methods=['GET','POST'])
@login_required
def switch():

    if request.method=='POST':

        username=request.form.get('username')
        avatar=request.form.get('avatar')

        if not username:
            flash("Enter name")
            return redirect(url_for('switch'))

        current_user.username=username
        current_user.avatar=avatar

        db.session.commit()

        quiz_code=session.get('quiz_code')

        if quiz_code=='00000':
            return redirect(url_for('selectquiz'))

        quiz=Quiz.query.filter_by(code=quiz_code).first()

        if quiz:
            return redirect(url_for('quizplay',quiz_code=quiz_code))

        return redirect(url_for('code'))

    return render_template('switch.html')

# ---------------- SELECT QUIZ ----------------

@app.route('/selectquiz')
@login_required
def selectquiz():

    if not current_user.username or not current_user.avatar:
        return redirect(url_for('switch'))

    return render_template('selectquiz.html')

# ---------------- PLAY QUIZ ----------------

@app.route('/quizplay/<quiz_code>')
@login_required
def quizplay(quiz_code):

    quiz=Quiz.query.filter_by(code=quiz_code).first()

    if not quiz:
        flash("Quiz not found")
        return redirect(url_for('select'))

    return render_template('quizplay.html',questions=quiz.questions)

# ---------------- CREATE QUIZ ----------------

@app.route('/create')
@login_required
def create():

    folders=Folder.query.filter_by(user_id=current_user.id).all()

    return render_template('create.html',folders=folders)

@app.route('/create_folder',methods=['POST'])
@login_required
def create_folder():

    folder_name=request.form.get('folder_name')

    if folder_name:

        folder=Folder(name=folder_name,user_id=current_user.id)

        db.session.add(folder)
        db.session.commit()

        return jsonify({"success":True})

    return jsonify({"success":False})

# ---------------- GENERATE UNIQUE CODE ----------------

def generate_unique_code():

    while True:

        code=''.join(random.choices('0123456789',k=5))

        if not Quiz.query.filter_by(code=code).first():
            return code

# ---------------- CUSTOM QUIZ ----------------

@app.route('/custom/<folder_name>',methods=['GET','POST'])
@login_required
def custom(folder_name):

    if request.method=='POST':

        data=request.get_json()
        questions=data.get('questions',[])

        code=generate_unique_code()

        existing_quiz=Quiz.query.filter_by(
            folder_name=folder_name,
            owner=current_user.email
        ).first()

        if existing_quiz:
            existing_quiz.questions=questions
            existing_quiz.code=code
        else:
            new_quiz=Quiz(
                folder_name=folder_name,
                code=code,
                questions=questions,
                owner=current_user.email
            )
            db.session.add(new_quiz)

        db.session.commit()

        return jsonify({"success":True,"code":code})

    existing_quiz=Quiz.query.filter_by(
        folder_name=folder_name,
        owner=current_user.email
    ).first()

    saved_questions=existing_quiz.questions if existing_quiz else []

    return render_template(
        'custom.html',
        folder_name=folder_name,
        saved_questions=saved_questions
    )

# ---------------- GEMINI QUESTION GENERATOR ----------------

@app.route('/generate_questions',methods=['POST'])
def generate_questions():

    topic=request.json.get("topic")

    if not topic:
        return jsonify({"success":False,"error":"Topic required"})

    try:

        prompt=f"""
Generate 10 multiple choice quiz questions about {topic}.

Return ONLY JSON:

[
{{
"question":"...",
"options":["Option A","Option B","Option C"],
"correct":"A"
}}
]
"""

        response=model.generate_content(prompt)

        text=response.text.strip()
        text=text.replace("```json","").replace("```","")

        questions=json.loads(text)

        return jsonify({
            "success":True,
            "questions":questions
        })

    except Exception as e:

        return jsonify({
            "success":False,
            "error":str(e)
        })

# ---------------- SUBMIT QUIZ ----------------

@app.route('/submit_quiz',methods=['POST'])
@login_required
def submit_quiz():

    score=request.json.get('score',0)

    current_user.score=score

    db.session.commit()

    return jsonify({"message":"Score saved"})

# ---------------- SCORE PAGE ----------------

@app.route('/score')
@login_required
def score():

    return render_template(
        'score.html',
        username=current_user.username,
        avatar=current_user.avatar or "/static/images/default_avatar.png",
        score=current_user.score,
        total_questions=10
    )

# ---------------- END QUIZ ----------------

@app.route('/end-quiz',methods=['POST'])
@login_required
def end_quiz():

    data=request.get_json()
    score=data.get('score')

    current_user.score=score
    db.session.commit()

    return jsonify({"success":True})

# ---------------- RUN APP ----------------

if __name__=="__main__":

    with app.app_context():
        db.create_all()

    app.run(debug=True)