// quiz.js - Advanced Interactive Quiz System

class QuizEngine {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.timer = null;
        this.timeLeft = 0;
        this.quizDuration = 0;
        this.userAnswers = [];
        this.quizStarted = false;
        this.quizCompleted = false;
        
        this.init();
    }

    init() {
        this.createQuizContainer();
        this.loadSampleQuestions();
        this.bindEvents();
        this.initAnimations();
    }

    createQuizContainer() {
        // Create quiz modal container
        this.quizContainer = document.createElement('div');
        this.quizContainer.className = 'quiz-container';
        this.quizContainer.innerHTML = this.getQuizHTML();
        document.body.appendChild(this.quizContainer);

        this.injectQuizStyles();
    }

    getQuizHTML() {
        return `
            <div class="quiz-overlay">
                <div class="quiz-modal">
                    <!-- Quiz Header -->
                    <div class="quiz-header">
                        <div class="quiz-progress">
                            <div class="progress-bar">
                                <div class="progress-fill"></div>
                            </div>
                            <div class="progress-text">Question <span class="current-q">1</span> of <span class="total-q">10</span></div>
                        </div>
                        <div class="quiz-timer">
                            <i class="fas fa-clock"></i>
                            <span class="time-left">00:00</span>
                        </div>
                        <button class="quiz-close" onclick="quiz.closeQuiz()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <!-- Quiz Content -->
                    <div class="quiz-content">
                        <div class="question-container">
                            <div class="question-number">Question 1</div>
                            <h2 class="question-text">Loading question...</h2>
                            <div class="question-image"></div>
                        </div>

                        <div class="options-container">
                            <!-- Options will be dynamically added -->
                        </div>

                        <div class="quiz-feedback">
                            <div class="feedback-content"></div>
                        </div>
                    </div>

                    <!-- Quiz Footer -->
                    <div class="quiz-footer">
                        <div class="score-display">
                            Score: <span class="score-value">0</span>
                        </div>
                        <div class="quiz-controls">
                            <button class="btn-prev" onclick="quiz.previousQuestion()" disabled>
                                <i class="fas fa-arrow-left"></i> Previous
                            </button>
                            <button class="btn-next" onclick="quiz.nextQuestion()">
                                Next <i class="fas fa-arrow-right"></i>
                            </button>
                            <button class="btn-submit" onclick="quiz.submitQuiz()" style="display: none;">
                                Submit Quiz
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quiz Results Modal -->
            <div class="quiz-results" style="display: none;">
                <div class="results-overlay">
                    <div class="results-modal">
                        <div class="results-header">
                            <h2>Quiz Completed!</h2>
                            <div class="results-score">
                                <div class="score-circle">
                                    <svg class="progress-ring" width="120" height="120">
                                        <circle class="progress-ring-circle" stroke="#fdbb2d" stroke-width="8" fill="transparent" r="52" cx="60" cy="60"/>
                                    </svg>
                                    <div class="score-text">
                                        <span class="score-percent">0%</span>
                                        <span class="score-label">Score</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="results-body">
                            <div class="stats-grid">
                                <div class="stat-item">
                                    <i class="fas fa-check-circle"></i>
                                    <span class="stat-value correct-answers">0</span>
                                    <span class="stat-label">Correct</span>
                                </div>
                                <div class="stat-item">
                                    <i class="fas fa-times-circle"></i>
                                    <span class="stat-value wrong-answers">0</span>
                                    <span class="stat-label">Wrong</span>
                                </div>
                                <div class="stat-item">
                                    <i class="fas fa-clock"></i>
                                    <span class="stat-value time-taken">00:00</span>
                                    <span class="stat-label">Time</span>
                                </div>
                                <div class="stat-item">
                                    <i class="fas fa-trophy"></i>
                                    <span class="stat-value rank">Beginner</span>
                                    <span class="stat-label">Rank</span>
                                </div>
                            </div>

                            <div class="performance-chart">
                                <canvas id="performanceChart" width="400" height="200"></canvas>
                            </div>

                            <div class="action-buttons">
                                <button class="btn-review" onclick="quiz.reviewAnswers()">
                                    <i class="fas fa-list-ol"></i> Review Answers
                                </button>
                                <button class="btn-retry" onclick="quiz.retryQuiz()">
                                    <i class="fas fa-redo"></i> Try Again
                                </button>
                                <button class="btn-close-results" onclick="quiz.closeResults()">
                                    <i class="fas fa-times"></i> Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    injectQuizStyles() {
        const styles = `
            .quiz-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: none;
            }

            .quiz-overlay {
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }

            .quiz-modal {
                background: linear-gradient(135deg, #1a2a6c, #b21f1f);
                border-radius: 20px;
                width: 100%;
                max-width: 800px;
                max-height: 90vh;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .quiz-header {
                background: rgba(0, 0, 0, 0.3);
                padding: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .quiz-progress {
                flex: 1;
            }

            .progress-bar {
                background: rgba(255, 255, 255, 0.1);
                height: 6px;
                border-radius: 10px;
                overflow: hidden;
                margin-bottom: 8px;
            }

            .progress-fill {
                background: linear-gradient(90deg, #fdbb2d, #ffa500);
                height: 100%;
                width: 0%;
                transition: width 0.5s ease;
                border-radius: 10px;
            }

            .progress-text {
                color: white;
                font-size: 0.9rem;
                opacity: 0.8;
            }

            .quiz-timer {
                color: white;
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 1.1rem;
                font-weight: 600;
            }

            .quiz-timer.warning {
                color: #ff6b6b;
                animation: pulse 1s infinite;
            }

            .quiz-close {
                background: rgba(255, 255, 255, 0.1);
                border: none;
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .quiz-close:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: scale(1.1);
            }

            .quiz-content {
                padding: 30px;
                max-height: 60vh;
                overflow-y: auto;
            }

            .question-container {
                margin-bottom: 30px;
            }

            .question-number {
                color: #fdbb2d;
                font-size: 0.9rem;
                font-weight: 600;
                margin-bottom: 10px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .question-text {
                color: white;
                font-size: 1.4rem;
                line-height: 1.4;
                margin-bottom: 20px;
            }

            .question-image {
                margin-top: 20px;
                border-radius: 10px;
                overflow: hidden;
                display: none;
            }

            .question-image img {
                width: 100%;
                height: auto;
                border-radius: 10px;
            }

            .options-container {
                display: grid;
                gap: 12px;
            }

            .option {
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid transparent;
                border-radius: 12px;
                padding: 16px 20px;
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .option:hover {
                background: rgba(255, 255, 255, 0.15);
                transform: translateY(-2px);
            }

            .option.selected {
                border-color: #fdbb2d;
                background: rgba(253, 187, 45, 0.1);
            }

            .option.correct {
                border-color: #4CAF50;
                background: rgba(76, 175, 80, 0.1);
            }

            .option.wrong {
                border-color: #f44336;
                background: rgba(244, 67, 54, 0.1);
            }

            .option-number {
                background: rgba(255, 255, 255, 0.2);
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                font-size: 0.9rem;
            }

            .option-text {
                flex: 1;
            }

            .quiz-feedback {
                margin-top: 20px;
                padding: 15px;
                border-radius: 10px;
                background: rgba(255, 255, 255, 0.05);
                display: none;
            }

            .feedback-content {
                color: white;
                font-size: 0.95rem;
                line-height: 1.5;
            }

            .quiz-footer {
                background: rgba(0, 0, 0, 0.3);
                padding: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .score-display {
                color: white;
                font-size: 1.1rem;
                font-weight: 600;
            }

            .quiz-controls {
                display: flex;
                gap: 12px;
            }

            .quiz-controls button {
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .btn-prev, .btn-next {
                background: rgba(255, 255, 255, 0.1);
                color: white;
            }

            .btn-prev:hover, .btn-next:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: translateY(-2px);
            }

            .btn-prev:disabled, .btn-next:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
            }

            .btn-submit {
                background: linear-gradient(135deg, #fdbb2d, #ffa500);
                color: #1a2a6c;
            }

            .btn-submit:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(253, 187, 45, 0.4);
            }

            /* Results Styles */
            .quiz-results {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10001;
            }

            .results-overlay {
                background: rgba(0, 0, 0, 0.9);
                backdrop-filter: blur(20px);
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }

            .results-modal {
                background: linear-gradient(135deg, #1a2a6c, #b21f1f);
                border-radius: 20px;
                width: 100%;
                max-width: 600px;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .results-header {
                text-align: center;
                padding: 40px 30px 30px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .results-header h2 {
                color: white;
                margin-bottom: 30px;
            }

            .score-circle {
                position: relative;
                width: 120px;
                height: 120px;
                margin: 0 auto;
            }

            .progress-ring-circle {
                transition: stroke-dashoffset 1s ease;
                transform: rotate(-90deg);
                transform-origin: 50% 50%;
            }

            .score-text {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                color: white;
            }

            .score-percent {
                display: block;
                font-size: 1.8rem;
                font-weight: bold;
                color: #fdbb2d;
            }

            .score-label {
                font-size: 0.9rem;
                opacity: 0.8;
            }

            .results-body {
                padding: 30px;
            }

            .stats-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
                margin-bottom: 30px;
            }

            .stat-item {
                background: rgba(255, 255, 255, 0.1);
                padding: 20px;
                border-radius: 12px;
                text-align: center;
                color: white;
            }

            .stat-item i {
                font-size: 1.5rem;
                margin-bottom: 10px;
                display: block;
            }

            .stat-item i.fa-check-circle { color: #4CAF50; }
            .stat-item i.fa-times-circle { color: #f44336; }
            .stat-item i.fa-clock { color: #fdbb2d; }
            .stat-item i.fa-trophy { color: #ffd700; }

            .stat-value {
                display: block;
                font-size: 1.5rem;
                font-weight: bold;
                margin-bottom: 5px;
            }

            .stat-label {
                font-size: 0.9rem;
                opacity: 0.8;
            }

            .performance-chart {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 30px;
            }

            .action-buttons {
                display: grid;
                grid-template-columns: 1fr;
                gap: 12px;
            }

            .action-buttons button {
                padding: 15px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }

            .btn-review {
                background: rgba(255, 255, 255, 0.1);
                color: white;
            }

            .btn-retry {
                background: linear-gradient(135deg, #fdbb2d, #ffa500);
                color: #1a2a6c;
            }

            .btn-close-results {
                background: rgba(255, 255, 255, 0.05);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .action-buttons button:hover {
                transform: translateY(-2px);
            }

            /* Animations */
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }

            @keyframes bounceIn {
                0% { transform: scale(0.3); opacity: 0; }
                50% { transform: scale(1.05); }
                70% { transform: scale(0.9); }
                100% { transform: scale(1); opacity: 1; }
            }

            @keyframes slideInUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }

            .bounce-in {
                animation: bounceIn 0.6s ease;
            }

           .slide-in-up {
                animation: slideInUp 0.5s ease;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    loadSampleQuestions() {
        // Sample questions - in real implementation, this would come from an API
        this.questions = [
            {
                id: 1,
                question: "What is the capital of France?",
                options: ["London", "Berlin", "Paris", "Madrid"],
                correctAnswer: 2,
                explanation: "Paris is the capital and most populous city of France.",
                image: null
            },
            {
                id: 2,
                question: "Which planet is known as the Red Planet?",
                options: ["Venus", "Mars", "Jupiter", "Saturn"],
                correctAnswer: 1,
                explanation: "Mars is often called the Red Planet due to its reddish appearance.",
                image: null
            },
            {
                id: 3,
                question: "What is the chemical symbol for Gold?",
                options: ["Go", "Gd", "Au", "Ag"],
                correctAnswer: 2,
                explanation: "The chemical symbol for Gold is Au, from the Latin word 'Aurum'.",
                image: null
            },
            {
                id: 4,
                question: "Who wrote 'Romeo and Juliet'?",
                options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
                correctAnswer: 1,
                explanation: "William Shakespeare wrote the famous tragedy 'Romeo and Juliet'.",
                image: null
            },
            {
                id: 5,
                question: "What is the largest ocean on Earth?",
                options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
                correctAnswer: 3,
                explanation: "The Pacific Ocean is the largest and deepest ocean on Earth.",
                image: null
            }
        ];
    }

    bindEvents() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.quizContainer.style.display || this.quizContainer.style.display === 'none') return;

            switch(e.key) {
                case 'Escape':
                    this.closeQuiz();
                    break;
                case 'ArrowLeft':
                    if (!document.querySelector('.btn-prev').disabled) {
                        this.previousQuestion();
                    }
                    break;
                case 'ArrowRight':
                    if (!document.querySelector('.btn-next').disabled) {
                        this.nextQuestion();
                    }
                    break;
                case '1': case '2': case '3': case '4':
                    const optionIndex = parseInt(e.key) - 1;
                    this.selectOption(optionIndex);
                    break;
            }
        });
    }

    initAnimations() {
        // Initialize any additional animations
    }

    startQuiz(quizData = null) {
        if (quizData) {
            this.questions = quizData.questions || this.questions;
            this.quizDuration = quizData.duration || 600; // 10 minutes default
        }

        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = new Array(this.questions.length).fill(null);
        this.quizStarted = true;
        this.quizCompleted = false;

        this.quizContainer.style.display = 'block';
        this.startTimer();
        this.displayQuestion();

        // Add entrance animation
        this.quizContainer.querySelector('.quiz-modal').classList.add('bounce-in');
    }

    startTimer() {
        this.timeLeft = this.quizDuration;
        this.updateTimerDisplay();

        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();

            if (this.timeLeft <= 0) {
                this.submitQuiz();
            } else if (this.timeLeft <= 30) {
                this.quizContainer.querySelector('.quiz-timer').classList.add('warning');
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const timerElement = this.quizContainer.querySelector('.time-left');
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    displayQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        
        // Update progress
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        this.quizContainer.querySelector('.progress-fill').style.width = `${progress}%`;
        this.quizContainer.querySelector('.current-q').textContent = this.currentQuestionIndex + 1;
        this.quizContainer.querySelector('.total-q').textContent = this.questions.length;

        // Update question number and text
        this.quizContainer.querySelector('.question-number').textContent = `Question ${this.currentQuestionIndex + 1}`;
        this.quizContainer.querySelector('.question-text').textContent = question.question;

        // Display image if available
        const questionImage = this.quizContainer.querySelector('.question-image');
        if (question.image) {
            questionImage.style.display = 'block';
            questionImage.innerHTML = `<img src="${question.image}" alt="Question Image">`;
        } else {
            questionImage.style.display = 'none';
            questionImage.innerHTML = '';
        }

        // Generate options
        this.generateOptions(question.options);

        // Update navigation buttons
        this.updateNavigationButtons();

        // Hide feedback
        this.quizContainer.querySelector('.quiz-feedback').style.display = 'none';

        // Update score
        this.quizContainer.querySelector('.score-value').textContent = this.score;

        // Add slide animation
        this.quizContainer.querySelector('.question-container').classList.add('slide-in-up');
        setTimeout(() => {
            this.quizContainer.querySelector('.question-container').classList.remove('slide-in-up');
        }, 500);
    }

    generateOptions(options) {
        const optionsContainer = this.quizContainer.querySelector('.options-container');
        optionsContainer.innerHTML = '';

        options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.innerHTML = `
                <div class="option-number">${String.fromCharCode(65 + index)}</div>
                <div class="option-text">${option}</div>
            `;

            optionElement.addEventListener('click', () => this.selectOption(index));
            
            // Pre-select if already answered
            if (this.userAnswers[this.currentQuestionIndex] === index) {
                optionElement.classList.add('selected');
            }

            optionsContainer.appendChild(optionElement);
        });
    }

    selectOption(optionIndex) {
        const options = this.quizContainer.querySelectorAll('.option');
        
        // Remove selected class from all options
        options.forEach(option => option.classList.remove('selected'));
        
        // Add selected class to clicked option
        options[optionIndex].classList.add('selected');

        // Store user's answer
        this.userAnswers[this.currentQuestionIndex] = optionIndex;

        // Enable next button
        this.quizContainer.querySelector('.btn-next').disabled = false;

        // Show immediate feedback if enabled
        this.showFeedback(optionIndex);
    }

    showFeedback(selectedOption) {
        const question = this.questions[this.currentQuestionIndex];
        const feedbackElement = this.quizContainer.querySelector('.quiz-feedback');
        const feedbackContent = this.quizContainer.querySelector('.feedback-content');

        if (selectedOption === question.correctAnswer) {
            feedbackContent.innerHTML = `
                <i class="fas fa-check-circle" style="color: #4CAF50; margin-right: 8px;"></i>
                <strong>Correct!</strong> ${question.explanation}
            `;
        } else {
            feedbackContent.innerHTML = `
                <i class="fas fa-times-circle" style="color: #f44336; margin-right: 8px;"></i>
                <strong>Incorrect.</strong> ${question.explanation}
            `;
        }

        feedbackElement.style.display = 'block';

        // Highlight correct and wrong answers
        const options = this.quizContainer.querySelectorAll('.option');
        options.forEach((option, index) => {
            if (index === question.correctAnswer) {
                option.classList.add('correct');
            } else if (index === selectedOption && index !== question.correctAnswer) {
                option.classList.add('wrong');
            }
        });
    }

    updateNavigationButtons() {
        const prevButton = this.quizContainer.querySelector('.btn-prev');
        const nextButton = this.quizContainer.querySelector('.btn-next');
        const submitButton = this.quizContainer.querySelector('.btn-submit');

        prevButton.disabled = this.currentQuestionIndex === 0;
        
        if (this.currentQuestionIndex === this.questions.length - 1) {
            nextButton.style.display = 'none';
            submitButton.style.display = 'block';
        } else {
            nextButton.style.display = 'block';
            submitButton.style.display = 'none';
        }

        // Disable next button if current question not answered
        nextButton.disabled = this.userAnswers[this.currentQuestionIndex] === null;
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
        }
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayQuestion();
        }
    }

    submitQuiz() {
        clearInterval(this.timer);
        this.calculateScore();
        this.showResults();
        this.quizCompleted = true;
    }

    calculateScore() {
        this.score = 0;
        this.questions.forEach((question, index) => {
            if (this.userAnswers[index] === question.correctAnswer) {
                this.score++;
            }
        });
    }

    showResults() {
        const scorePercentage = Math.round((this.score / this.questions.length) * 100);
        
        // Update results modal
        document.querySelector('.score-percent').textContent = `${scorePercentage}%`;
        document.querySelector('.correct-answers').textContent = this.score;
        document.querySelector('.wrong-answers').textContent = this.questions.length - this.score;
        
        const minutes = Math.floor((this.quizDuration - this.timeLeft) / 60);
        const seconds = (this.quizDuration - this.timeLeft) % 60;
        document.querySelector('.time-taken').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Determine rank
        let rank = "Beginner";
        if (scorePercentage >= 90) rank = "Expert";
        else if (scorePercentage >= 75) rank = "Advanced";
        else if (scorePercentage >= 60) rank = "Intermediate";
        document.querySelector('.rank').textContent = rank;

        // Animate progress circle
        this.animateProgressCircle(scorePercentage);

        // Show results
        this.quizContainer.style.display = 'none';
        document.querySelector('.quiz-results').style.display = 'block';

        // Create performance chart
        this.createPerformanceChart();
    }

    animateProgressCircle(percentage) {
        const circle = document.querySelector('.progress-ring-circle');
        const radius = circle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;

        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;

        const offset = circumference - (percentage / 100) * circumference;
        setTimeout(() => {
            circle.style.strokeDashoffset = offset;
        }, 100);
    }

    createPerformanceChart() {
        const ctx = document.getElementById('performanceChart').getContext('2d');
        
        // Simple bar chart showing score distribution
        const data = {
            labels: ['Your Score', 'Average', 'Topper'],
            datasets: [{
                label: 'Performance',
                data: [this.score, Math.round(this.questions.length * 0.6), this.questions.length],
                backgroundColor: [
                    '#fdbb2d',
                    'rgba(255, 255, 255, 0.3)',
                    'rgba(76, 175, 80, 0.6)'
                ],
                borderColor: [
                    '#ffa500',
                    'rgba(255, 255, 255, 0.5)',
                    'rgba(76, 175, 80, 1)'
                ],
                borderWidth: 1
            }]
        };

        new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: this.questions.length,
                        ticks: {
                            color: 'white'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'white'
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    reviewAnswers() {
        // Implementation for reviewing answers
        console.log('Review answers functionality');
    }

    retryQuiz() {
        document.querySelector('.quiz-results').style.display = 'none';
        this.startQuiz();
    }

    closeResults() {
        document.querySelector('.quiz-results').style.display = 'none';
    }

    closeQuiz() {
        if (this.quizStarted && !this.quizCompleted) {
            if (confirm('Are you sure you want to quit? Your progress will be lost.')) {
                this.cleanup();
            }
        } else {
            this.cleanup();
        }
    }

    cleanup() {
        clearInterval(this.timer);
        this.quizContainer.style.display = 'none';
        document.querySelector('.quiz-results').style.display = 'none';
        this.quizStarted = false;
    }
}

// Initialize quiz when DOM is loaded
let quiz;
document.addEventListener('DOMContentLoaded', function() {
    quiz = new QuizEngine();
});

// Global function to start quiz from anywhere
window.startQuiz = function(quizData = null) {
    quiz.startQuiz(quizData);
};

// Example usage:
// startQuiz({
//     questions: [...], // Array of question objects
//     duration: 300 // Quiz duration in seconds
// });