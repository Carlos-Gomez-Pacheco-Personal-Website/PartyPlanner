const EVENTS_URI =
  "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2308-ACC-PT-WEB-PT-A/events";

const state = {
  events: [],
};

const partiesList = document.querySelector("#display-parties");

//GET EVENTS
const getParties = async () => {
  try {
    const response = await fetch(EVENTS_URI);
    const json = await response.json();
    const parties = json.data;
    console.log("inside GET");
    console.log(parties);
    if (json.error) {
      throw new Error(json.error);
    }
    state.events = parties;
  } catch (error) {
    console.error(error);
  }
};

//POST EVENT
//name, time, location, description
const createParty = async (name, description, unformattedDate, location) => {
  try {
    const date = new Date(unformattedDate);
    const response = await fetch(EVENTS_URI, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, date, location }),
    });
    const json = await response.json();
    if (json.error) {
      throw new Error(json.error);
    }
    init();
  } catch (error) {
    console.error(error);
  }
};

document.querySelector("form").addEventListener("submit", (evt) => {
  const formEl = evt.target;
  evt.preventDefault();
  createParty(
    formEl.title.value,
    formEl.description.value,
    formEl.date.value,
    formEl.location.value
  );

  // clear inputs
  formEl.title.value = "";
  formEl.description.value = "";
  formEl.date.value = "";
  formEl.location.value = "";

  // focus the first form element
  formEl.title.focus();
});

//DELETE EVENT

const deleteParty = async (id) => {
  try {
    const response = await fetch(EVENTS_URI + "/" + id, { method: "DELETE" });
    const json = response.json();
    const parties = json.data;
    if (json.error) {
      throw new Error(json.error);
    }
    state.events = parties;
    init();
  } catch (error) {
    console.error(error);
  }
};

function renderEvents() {
  console.log("inside renderEvents");
  console.log(state);
  if (!state.events || !state.events.length) {
    partiesElement = document.createElement("div");
    partiesElement.innerHTML = `<li>No events found</li>`;
    return;
  }

  const partyItems = state.events.map((party) => {
    console.log("inside partyItems");
    console.log(party);
    const partyItem = document.createElement("li");
    partyItem.classList.add("party");
    partyItem.innerHTML = `
        <h2>${party.name}</h2>
        <p>${party.description}<p>
        <p>${party.date}</p>
        <p>${party.location}</p>
        <p>${party.id}</p>
        `;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Party";
    partyItem.append(deleteButton);

    deleteButton.addEventListener("click", () => deleteParty(party.id));
    return partyItem;
  });
  console.log(partyItems);
  partiesList.replaceChildren(...partyItems);
}

const init = async () => {
  await getParties();
  renderEvents();
};
init();
