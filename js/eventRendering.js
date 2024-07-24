(function () {
  const nextEventContainer = document.querySelector("#next-event-container")
  const pastEventContainer = document.querySelector("#past-event-container")
  const template = document.querySelector("template.event")
  const isHomePage = nextEventContainer.dataset.page === "home"
  const getEventData = async () => {
    const data = await fetch("../data/events.json")
    if (data.ok) {
      let json = await data.json()
      return json
    } else {
      throw Error()
    }
  }

  const eventToHTML = (event) => {
    const clone = template.content.cloneNode(true)
    let nameField = clone.querySelector(".event-name")
    let dateField = clone.querySelector(".event-date")
    let locationField = clone.querySelector(".event-location")
    let imageFrame = clone.querySelector("img")

    nameField.innerHTML = event["name"]
    dateField.innerHTML = new Date(event["date"])
      .toLocaleString("en-GB", {
        timeZone: "CET",
      })
      .replace(",", " @")
      .replace(/:(\d+)$/, "")
    locationField.innerHTML = event["location"]
    imageFrame.alt = event["name"] + " Poster"
    imageFrame.src = "../images/" + event["image"]
    return clone
  }
  const generateEventCards = async () => {
    try {
      const events = await getEventData()
      // FIGURE OUT HOW TO SPLIT NEXT FROM PAST EVENTS
      let nextEvents = []
      let pastEvents = []
      events.forEach((e) => {
        let a = new Date(e["date"])
        let b = (new Date() - 7200000000)
        if (a < b) {
          pastEvents.push(e)
        } else {
          nextEvents.push(e)
        }
      })
      if (nextEvents.length === 0) {
        const eText = document.createElement("p")
        eText.innerHTML = "No events found."
        nextEventContainer.appendChild(eText)
      }
      nextEvents
        .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
        .map(eventToHTML)
        .forEach((e) => nextEventContainer.appendChild(e))
      if (!isHomePage) {
        if (pastEvents.length === 0) {
          const eText = document.createElement("p")
          eText.innerHTML = "No events found."
          pastEventContainer.appendChild(eText)
        }
        pastEvents
          .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
          .map(eventToHTML)
          .forEach((e) => pastEventContainer.appendChild(e))
      }
    } catch (e) {
      const eText = document.createElement("p")
      eText.innerHTML = "The events couldn't be loaded."
      nextEventContainer.appendChild(eText)
      if (!isHomePage) {
        pastEventContainer.appendChild(eText)
      }
    }
  }
  generateEventCards()
})()
