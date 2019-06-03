const form = document.querySelector('form');
const input = document.querySelector('.form-group #search');
const card = document.querySelector('.card-body');
const cardHeader = document.querySelector('.card-title');
const cardText = document.querySelector('.card-text');
const readMoreButton = document.querySelector('.read-more-btn');
const history = document.querySelector('.history-query');
const clearHistory = document.querySelector('.clear-history-btn');
const clearDBHistory = document.querySelector('.clear-db-history-btn');
const randomWordButton = document.querySelector('.random-word-btn');


let arrayOfSearch = []; // Array for Search History

const updateCopy = (copy) => {
    updatedDifinition = copy.split('[').join('').split(']').join('');
    cardText.textContent = updatedDifinition;

    return updatedDifinition;
};

const restoreToSearchHistory = () => {
    for (let key in localStorage) {
        arrayOfSearch.push(key);
    }

    arrayOfSearch = arrayOfSearch.splice(0, localStorage.length);
    
    if (arrayOfSearch.length) {
        arrayOfSearch.forEach( elem => {
            history.innerHTML += `<div class="history-item">
                              ${elem}
                            </div>`
        })
    }
}

const addToSearchHistory = (search) => {
    arrayOfSearch.push(search);
    localStorage.setItem
    localStorage.setItem(search.toString(), search);
    history.innerHTML += `<div class="history-item">
                              ${search}
                            </div>`
}

const updateUI = (data) => {
    card.classList.remove('d-none');
    cardHeader.textContent = data.list[0].word;
    updateCopy(data.list[0].definition);
    //cardText.textContent = data.list[0].definition;
    readMoreButton.setAttribute('href', data.list[0].permalink);
    addToSearchHistory(data.list[0].word);
};

const updateServerData = (data) => {
    const now = new Date();
    const definition = {
        discription: updateCopy(data.list[0].definition),
        title: data.list[0].word,
        created_at: firebase.firestore.Timestamp.fromDate(now)
    };

    db.collection('dictionaryCollection').add(definition).then(()=>{
        console.log('the word was added to the server')
    })

}


// request
const getData = async (request) => {
    const response = await fetch(`http://api.urbandictionary.com/v0/define?term=${request}`)
    const data = await response.json();
    // console.log(data);
    return data;
}

//restore history 
window.addEventListener('load',restoreToSearchHistory());


// Get the request from UI

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let searchWord = input.value.trim();
    form.reset();
    getData(searchWord).then(data => {
        updateUI(data);
        updateServerData(data);
    });
})

// clear history of search

clearHistory.addEventListener('click', () => {
    localStorage.clear();
    arrayOfSearch = [];
    history.innerHTML = '';
})


// clear DB history on the server 

clearDBHistory.addEventListener('click', () => {

   db.collection('dictionaryCollection').get().then( snapshot => {
       snapshot.docs.forEach( doc => {
        db.collection('dictionaryCollection').doc(doc.id).delete()
       })
   })
});


// Check the data on the server
db.collection('dictionaryCollection').get().then( snapshot => {
    console.log(snapshot.docs[0].data());
}).catch (e => {
    console.log(e)
})


// RANDOM WORD

randomWordButton.addEventListener('click', () => {
    let randomWord = arrayOfWords[Math.floor(Math.random()*arrayOfWords.length)];
    getData(randomWord).then(data => {
        updateUI(data);
        updateServerData(data);
    })
})