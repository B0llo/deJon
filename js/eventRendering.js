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
      const nextEvents = events.filter(
        (e) => new Date(e.date).getDate() >= new Date().getDate()
      )
      if (nextEvents.length === 0) {
            const eText = document.createElement("p")
            eText.innerHTML = "No events found."
            nextEventContainer.appendChild(eText)
        }
      nextEvents.forEach((event) => {
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

        nextEventContainer.appendChild(clone)
      })
      if (!isHomePage) {
        const pastEvents = events.filter(
          (e) => new Date(e.date).getDate() < new Date().getDate()
        )
        if (pastEvents.length === 0) {
            const eText = document.createElement("p")
            eText.innerHTML = "No events found."
            pastEventContainer.appendChild(eText)
        }
       pastEvents.forEach((event) => {
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

        nextEventContainer.appendChild(clone)
      })
 
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
