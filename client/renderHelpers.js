import { addNewPlayer, fetchAllPlayers, fetchSinglePlayer, removePlayer} from './ajaxHelpers';

const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');



export const renderAllPlayers = (playerList) => {
  // First check if we have any data before trying to render it!
  if (!playerList || !playerList.length) {
    playerContainer.innerHTML = '<h3>No players to display!</h3>';
    return;
  }

  // Loop through the list of players, and construct some HTML to display each one
  let playerContainerHTML = '';
  for (let i = 0; i < playerList.length; i++) {
    const pup = playerList[i];
    let pupHTML = `
      <div class="single-player-card">
        <div class="header-info">
          <p class="pup-title">${pup.name}</p>
          <p class="pup-number">#${pup.id}</p>
        </div>
        <img src="${pup.imageUrl}" alt="photo of ${pup.name} the puppy">
        <button class="detail-button" data-id=${pup.id}>See details</button>
        <button class="remove-button" data-id=${pup.id}>Remove</button>
      </div>
    `;
    playerContainerHTML += pupHTML;
  }

  // After looping, fill the `playerContainer` div with the HTML we constructed above
  playerContainer.innerHTML = playerContainerHTML;

  // Now that the HTML for all players has been added to the DOM,
  // we want to grab those "See details" buttons on each player
  // and attach a click handler to each one
  let detailButtons = [...document.getElementsByClassName('detail-button')];
  for (let i = 0; i < detailButtons.length; i++) {
    const button = detailButtons[i];
    button.addEventListener('click', async () => {
    
     let response = await fetchSinglePlayer(button.dataset.id)
    console.log(button)
    console.log(response.data.player)
    renderSinglePlayer(response.data.player)
    });
  }
  let deleteButton = [...document.getElementsByClassName('remove-button')];
  for (let i = 0; i < deleteButton.length; i++) {
    const button = deleteButton[i];
    button.addEventListener('click', async () => {
      await removePlayer(button.dataset.id)
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
    });
  }
};

export const renderSinglePlayer = (playerObj) => {
  if (!playerObj || !playerObj.id) {
    playerContainer.innerHTML = "<h3>Couldn't find data for this player!</h3>";
    return;
  }

  let pupHTML = `
    <div class="single-player-view">
      <div class="header-info">
        <p class="pup-title">${playerObj.name}</p>
        <p class="pup-number">#${playerObj.id}</p>
      </div>
      <p>Team: ${playerObj.team ? playerObj.team.name : 'Unassigned'}</p>
      <p>Breed: ${playerObj.breed}</p>
      <img src="${playerObj.imageUrl}" alt="photo of ${
    playerObj.name
  } the puppy">
      <button class="see-all">Back to all players</button>
    </div>
  `;

  playerContainer.innerHTML = pupHTML;


  let goHomeButton = [...document.getElementsByClassName('see-all')];
  for (let i = 0; i < goHomeButton.length; i++) {
    const button = goHomeButton[i];
    button.addEventListener('click', async () => {
    
     let response = await fetchAllPlayers()
    console.log(button)
    console.log(response)
    renderAllPlayers(response);
    });
  }
};

export const renderNewPlayerForm = () => {
  let formHTML = `
    <form>
      <label for="name">Name:</label>
      <input type="text" name="name" />
      <label for="breed">Breed:</label>
      <input type="text" name="breed" />
      <button type="submit">Submit</button>
    </form>
  `;
  newPlayerFormContainer.innerHTML = formHTML;

  let form = document.querySelector('#new-player-form > form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    let playerData = {
      name: form.elements.breed.value,
      breed: form.elements.breed.value,
    };
    console.log(playerData)
    addNewPlayer(playerData);

    const reload = await fetchAllPlayers();
    renderAllPlayers(reload);
    renderNewPlayerForm() 
  });
};
