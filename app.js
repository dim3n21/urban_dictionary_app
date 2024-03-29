const form = document.querySelector('form');
const input = document.querySelector('.form-group #search');
const card = document.querySelector('.search-card-body');
const cardHeader = document.querySelector('.search-card-body-title');
const cardText = document.querySelector('.search-card-body-text');
const readMoreButton = document.querySelector('.read-more-btn');
const history = document.querySelector('.history-query');
const clearHistory = document.querySelector('.clear-history-btn');
//const clearDBHistory = document.querySelector('.clear-db-history-btn');
const randomWordButton = document.querySelector('.random-word-btn');
const trustyPercentage = document.querySelector('.search-card-trusty-percentage');
const nextDefenitionButton = document.querySelector('.next-def-btn');
const prevDefenitionButton = document.querySelector('.prev-def-btn');



let arrayOfSearch = []; // Array for Search History
let nDefinition = 1;

const updateCopy = (copy) => {
    let updatedDifinitionAll = copy.split('[').join('').split(']').join('');
    let updatedDefinition = updatedDifinitionAll.split(' ').length > 40 ?
        updatedDifinitionAll.split(' ').splice(0,70).join(' ') + '...'
        : updatedDifinitionAll
    cardText.textContent = updatedDefinition;

    return updatedDefinition;
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

const updateTrustyPercentate = (data, n) => {
    return Math.floor(100 - ((data.list[n].thumbs_down * 100) / data.list[n].thumbs_up))
}

const updateUI = (data) => {
    card.classList.remove('d-none');
    cardHeader.textContent = data.list[0].word;
    cardText.textContent = updateCopy(data.list[0].definition);
    readMoreButton.setAttribute('href', data.list[0].permalink);
    addToSearchHistory(data.list[0].word);
    // update the trusty percentage
    trustyPercentage.innerHTML = `TRUSTY ${updateTrustyPercentate(data, 0)}%`;
};

const updateDefinition = (data, n) => {
    cardText.textContent = updateCopy(data.list[n].definition);
    readMoreButton.setAttribute('href', data.list[0].permalink);
    trustyPercentage.innerHTML = `TRUSTY ${updateTrustyPercentate(data, n)}%`;
}

/* const updateServerData = (data) => {
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

*/


// - - - Request
const getData = async (request) => {
    const response = await fetch(`http://api.urbandictionary.com/v0/define?term=${request}`)
    const data = await response.json();
    console.log(data);
    return data;
}

// - - - Restore history 
window.addEventListener('load',restoreToSearchHistory());


// - - - Get the word from UI
form.addEventListener('submit', (e) => {
    e.preventDefault();
    let searchWord = input.value.trim();
    form.reset();
    getData(searchWord).then(data => {
        updateUI(data);
        console.log(data);
        // updateServerData(data);
    });
})

// - - - Clear history of search
clearHistory.addEventListener('click', () => {
    card.classList.add('d-none');
    localStorage.clear();
    arrayOfSearch = [];
    history.innerHTML = '';
})


// - - - Clear DB history on the server 
/* clearDBHistory.addEventListener('click', () => {

   db.collection('dictionaryCollection').get().then( snapshot => {
       snapshot.docs.forEach( doc => {
        db.collection('dictionaryCollection').doc(doc.id).delete()
       })
   })
});
*/


// - - - Check the data on the server
db.collection('dictionaryCollection').get().then( snapshot => {
    //console.log(snapshot.docs[0].data());
}).catch (e => {
    console.log(e)
})


// - - - Get the random word from the randomWord.js

randomWordButton.addEventListener('click', () => {
    let randomWord = arrayOfWords[Math.floor(Math.random()*arrayOfWords.length)];
    getData(randomWord).then(data => {
        updateUI(data)
        // updateServerData(data);
    })
})


// - - - Prev/Next Definition in the search box

nextDefenitionButton.addEventListener('click', () => {

    if ( nDefinition < 9) {
        nDefinition += 1;
        console.log(nDefinition)
        getData(arrayOfSearch[arrayOfSearch.length-1]).then( data => {
            updateDefinition(data, nDefinition)
        })
        .catch(err => console.log(err))
    } else {
        //nextDefenitionButton.textContent = "last one"
        nDefinition = 0;
        getData(arrayOfSearch[arrayOfSearch.length-1]).then( data => {
            updateDefinition(data, nDefinition)
        })
        .catch(err => console.log(err))
    }
})

prevDefenitionButton.addEventListener('click', () => {

    if ( nDefinition > 0 ) {
        nDefinition -= 1;
        console.log(nDefinition)
        getData(arrayOfSearch[arrayOfSearch.length-1]).then( data => {
            updateDefinition(data, nDefinition)
        })
        .catch(err => console.log(err))
    } else {
        nDefinition = 9;
        getData(arrayOfSearch[arrayOfSearch.length-1]).then( data => {
            updateDefinition(data, nDefinition)
        })
        .catch(err => console.log(err))
    }
})