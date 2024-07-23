;(function () {
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

  const generateEventCards = async () => {
    try {
      const events = await getEventData()
      // FIGURE OUT HOW TO SPLIT NEXT FROM PAST EVENTS
      const nextEvents = events.filter(e => e)
      events.forEach((event) => {
        const clone = template.content.cloneNode(true)
        let nameField = clone.querySelector(".event-name")
        let dateField = clone.querySelector(".event-date")
        let locationField = clone.querySelector(".event-location")
        let imageFrame = clone.querySelector("img")

        nameField.innerHTML = event["name"]
        dateField.innerHTML = event["date"]
        locationField.innerHTML = event["location"] ?? ""
        imageFrame.alt = event["name"] + " Poster"
        imageFrame.src = "../images/" + event["image"]

        nextEventContainer.appendChild(clone)
      })
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
