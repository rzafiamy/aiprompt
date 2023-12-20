// create global variables to store data from json
let contexts = [];
let roles = [];
let requests = [];
let formats = [];


function updateResult(){
    const context = document.getElementById('in_context').value.trim();
    const role = document.getElementById('in_role').value.trim();
    const request = document.getElementById('in_request').value.trim();
    const format = document.getElementById('in_format').value.trim();

    const prompt = `${context}\n${role}\n${request}\n${format}`;
    document.getElementById('result').innerText = prompt;

    // update word count
    const wordCount = document.getElementById('wordsCount');
    wordCount.innerText = prompt.split(' ').length;

    // update character count
    const charCount = document.getElementById('charsCount');
    charCount.innerText = prompt.length;

}


document.getElementById('promptForm').addEventListener('submit', function(event) {
    event.preventDefault();
    updateResult();
});

// manage result copy button
document.getElementById('copyButton').addEventListener('click', function(event) {
    event.preventDefault();
    const result = document.getElementById('result');
    navigator.clipboard.writeText(result.innerText)
    // display tooltip under the button
    const tooltip = document.getElementById('tooltip');
    tooltip.classList.add('show');
    setTimeout(function() {
        tooltip.classList.remove('show');
    }, 1000);

});

// Handle random button btn_context
document.getElementById('btn_context').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('in_context').value = contexts[Math.floor(Math.random() * contexts.length)];
    updateResult();
});

// Handle random button btn_role
document.getElementById('btn_role').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('in_role').value = roles[Math.floor(Math.random() * roles.length)];
    updateResult();
});

// If any input tag is changed  or udated, update the result
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', function(event) {
        updateResult();
    });
});


fetch('/data.json')
.then(response => response.json())
.then(data => {
    
    // autocomplete input with relevant data from json
    contexts = data.context;
    roles = data.role;
    requests = data.request;
    formats = data.format;

    // for each requests category, create a button before the input
    const requestsCategories = Object.keys(requests);
    const requestsContainer = document.getElementById('requestsContainer');
    requestsCategories.forEach(category => {
        const button = document.createElement('button');
        button.innerText = category;
        button.classList.add('btn', 'btn-sm', 'btn-secondary', 'm-1');
        button.addEventListener('click', function(event) {
            document.getElementById('in_request').value = requests[category][Math.floor(Math.random() * requests[category].length)];
        });
        requestsContainer.appendChild(button);
    });

    // for each formats category, create a button before the input
    const formatsCategories = Object.keys(formats);
    const formatsContainer = document.getElementById('formatsContainer');
    formatsCategories.forEach(category => {
        const button = document.createElement('button');
        button.innerText = category;
        button.classList.add('btn', 'btn-sm', 'btn-secondary', 'm-1');
        button.addEventListener('click', function(event) {
            document.getElementById('in_format').value = formats[category][Math.floor(Math.random() * formats[category].length)];
        });
        formatsContainer.appendChild(button);
    });

    // fill automatically context and role inputs with random data
    const contextInput = document.getElementById('in_context');
    const roleInput = document.getElementById('in_role');


    contextInput.value = contexts[Math.floor(Math.random() * contexts.length)];
    roleInput.value = roles[Math.floor(Math.random() * roles.length)];

    // autocomplete context
    populateDatalist(contexts, 'contextList');
    // autocomplete role
    populateDatalist(roles, 'roleList');

    // update result
    updateResult();
})
.catch(error => console.error('Error:', error));

function populateDatalist(data, datalistId) {
    const datalist = document.getElementById(datalistId);
    datalist.innerHTML = '';
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        datalist.appendChild(option);
    });
}
