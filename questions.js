const urlParams = new URLSearchParams(window.location.search);
let level = urlParams.get('level');
let ege =  urlParams.get('ege');
let count = 0
console.log(ege)

const baseUrl = "http://95.165.90.137:8080";
let sus = {};

let max_c = 10
if(ege){
    max_c=22
}
let incorrectAnswers = [];
function getRandomInt(min, max) {
    min = Math.ceil(min); // Round up to the nearest integer
    max = Math.floor(max); // Round down to the nearest integer
    return Math.floor(Math.random() * (max - min + 1)) + min; // Generate random integer
}

async function httpGet(theUrl) {
    try {
        const response = await fetch(theUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

async function gettask(id, action) {
    const url = `${baseUrl}/users/${action}/${id}`;
    return await httpGet(url);
}

async function getRandomTask(task) {
    try {
        const response = await gettask(String(getRandomInt(1, 30000)), String(task));
        //console.log(JSON.stringify(response));
        return response;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}


document.getElementById('level-number').innerText = level;

function back() {
    window.location.href = "index.html";
}


async function initialize() {
    if(ege>0){
        level = count+1
    }
    updateProgress(count, max_c)
    made = document.getElementById("made")
    made.innerText = count
    sus = await getRandomTask(level);
    console.log(sus)
    if (!sus) {
        console.error('Failed to fetch user data.');
        return;
    }

    const questionsByLevel = {
        1: [
            { question: `вопрос 1`, answer: `1`, explanation: "11" },
            { question: `вопрос 2`, answer: `1`, explanation: "11" },
            { question: `вопрос 3`, answer: `1`, explanation: "11" }
        ],
        2: [
            { question: `вопрос 1`, answer: `1`, explanation: "11" },
            { question: `вопрос 2`, answer: `1`, explanation: "11" },
            { question: `вопрос 3`, answer: `1`, explanation: "11" }
        ],
        3: [
            { question: `вопрос 1`, answer: `1`, explanation: "11" },
            { question: `вопрос 2`, answer: `1`, explanation: "11" },
            { question: `вопрос 3`, answer: `1`, explanation: "11" }
        ],
        level: [
            sus
        ]
    };

    let currentQuestionIndex = 0;
    // let currentQuestions = questionsByLevel[level] || [];
    let currentQuestions = [sus] || [];
    
    const correctSound = document.getElementById('correct-sound');
    const incorrectSound = document.getElementById('incorrect-sound');

    correctSound.volume = 0.1;
    incorrectSound.volume = 0.1;

    function displayQuestion() {
        if (currentQuestions.length === 0) {
            console.error('No questions available.');
            return;
        }
        const task = document.getElementById('task');
        task.innerHTML = `
            <label>${currentQuestions[currentQuestionIndex].question}</label>
            <div>
                <input type="text" class="underline-input" name="answer${currentQuestionIndex + 1}" required>
            </div>
        `;
    }

    document.getElementById('next-button').addEventListener('click', function() {
        const input = document.querySelector(`input[name="answer${currentQuestionIndex + 1}"]`);
        const userAnswer = input.value.trim().toLowerCase();
        var sp = currentQuestions[currentQuestionIndex].answer.split("|")
        if (sp.includes(userAnswer)) {
            console.log(sp, userAnswer)
            document.body.style.backgroundColor = "lightgreen";
            correctSound.play();
        } else {
            console.log(sp, userAnswer)
            document.body.style.backgroundColor = "lightcoral";
            location.href = "#zatemnenie";
            const a = document.getElementById("correct-answer");
            a.innerHTML = currentQuestions[currentQuestionIndex].explanation;
            incorrectSound.play();
            incorrectAnswers.push(currentQuestions[currentQuestionIndex]);
        }

        currentQuestionIndex++;
        if (currentQuestionIndex < currentQuestions.length) {
            setTimeout(() => {
                displayQuestion();
                // updateProgress(currentQuestionIndex, currentQuestions.length);
                document.body.style.backgroundColor = "";
            }, 1000);
            
            updateProgress(count, max_c)
            made = document.getElementById("made")
            made.innerText = count
        } else {
                count +=1
                if (count<max_c){
                    initialize()
                }else{
                    if (incorrectAnswers.length > 0) {
                        currentQuestions = incorrectAnswers;
                        currentQuestionIndex = 0;
                        incorrectAnswers = [];
                        displayQuestion();
                        document.body.style.backgroundColor = "";
                        
                    }
                    else{location.href = "#zatemnenie2";}
                    
                }
            }
        }
    );

    function updateProgress(current, total) {
        const progressBar = document.getElementById('progress-bar');
        const percentage = (current / total) * 100;
        progressBar.style.width = percentage + '%';
    }

    displayQuestion();
}

initialize();
