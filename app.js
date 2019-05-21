const form = document.querySelector('form');
const input = document.querySelector('.form-group #search');
const card = document.querySelector('.card-body');
const cardHeader = document.querySelector('.card-title');
const cardText = document.querySelector('.card-text');
const readMoreButton = document.querySelector('.read-more-btn');


const updateCopy = (copy) => {
    updatedDifinition = copy.split('[').join('').split(']').join('');
    cardText.textContent = updatedDifinition;
};

const updateUI = (data) => {
    card.classList.remove('d-none');
    cardHeader.textContent = data.list[0].word;
    updateCopy(data.list[0].definition);
    //cardText.textContent = data.list[0].definition;
    readMoreButton.setAttribute('href', data.list[0].permalink);
};


// request
const getData = async (request) => {
    const response = await fetch(`http://api.urbandictionary.com/v0/define?term=${request}`)
    const data = await response.json();
    // console.log(data);
    return data;
}


// Get the request from UI

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let searchWord = input.value.trim();
    form.reset();
    getData(searchWord).then(data => updateUI(data));
})







