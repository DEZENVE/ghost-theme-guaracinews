const HOST =
  location.hostname === 'localhost' ?
    'http://localhost:3001'
  : 'https://api.guaracinews.com.br'

console.log(HOST)

const TODAY_DATE = new Date()

async function youtubeCompletedEvents() {
  const req = await fetch(`${HOST}/youtube/events/completed`)
  const res = await req.json()

  if ('items' in res) {
    const videos = res.items

    const youtubeVideosContainer = document.querySelector(
      '.container-youtube-videos'
    )
    const defaultDivVideos = youtubeVideosContainer.querySelectorAll('.video')

    for (let key = 0; key < videos.length; key++) {
      const div = document.createElement('div')
      div.setAttribute('class', 'video')

      const iframe = document.createElement('iframe')
      const attributes = [
        {
          key: 'src',
          value: `https://www.youtube.com/embed/${videos[key].id.videoId}`,
        },
        {
          key: 'title',
          value: `${videos[key].snippet.title}`,
        },
        {key: 'allowfullscreen'},
      ]

      for (const attribute of attributes) {
        iframe.setAttribute(
          `${attribute.key}`,
          `${attribute.value !== undefined ? attribute.value : null}`
        )
      }

      div.append(iframe)
      youtubeVideosContainer.removeChild(defaultDivVideos[key])

      youtubeVideosContainer.appendChild(div)
    }
  }
}

async function youtubeUpcomingEvents() {
  const getUpcomingEvents = async () => {
    const req = await fetch(`${HOST}/youtube/events/upcoming`)
    const res = await req.json()

    if ('items' in res) {
      return res.items
    } else {
      return null
    }
  }

  const getEventsByDay = (events) => {
    const tomorrowEvents = []
    const todayEvents = []

    for (const event of events) {
      const todayDate = TODAY_DATE
      const eventDate = new Date(
        event.details.liveStreamingDetails.scheduledStartTime
      )

      const difference =
        (eventDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60) // in days
      const todayDay = todayDate.getDate()
      const eventDay = eventDate.getDate()

      if (difference < 48 && todayDay < eventDay) {
        tomorrowEvents.push(event)
      }

      if (difference < 24 && todayDay === eventDay) {
        todayEvents.push(event)
      }
    }

    return {
      todayEvents,
      tomorrowEvents,
    }
  }

  const upcomingEvents = await getUpcomingEvents()

  if (upcomingEvents !== null) {
    const {todayEvents, tomorrowEvents} = getEventsByDay(upcomingEvents)

    if (todayEvents.length > 0) {
    }

    if (tomorrowEvents.length > 0) {
      const day = new Date(
        tomorrowEvents[0].details.liveStreamingDetails.scheduledStartTime
      ).getDate()
      const month = new Date(
        tomorrowEvents[0].details.liveStreamingDetails.scheduledStartTime
      )
        .toLocaleDateString('pt-BR', {month: 'short'})
        .replace('.', '')
      const hours = new Date(
        tomorrowEvents[0].details.liveStreamingDetails.scheduledStartTime
      ).getHours()
      const minutes = new Date(
        tomorrowEvents[0].details.liveStreamingDetails.scheduledStartTime
      ).getMinutes()

      const section = document.getElementById(
        'page-home-youtube-upcoming-live-events'
      )
      section.style.display = 'block'

      const daySpan = section.querySelector('.day')
      daySpan.innerHTML = day

      const monthSpan = section.querySelector('.month')
      monthSpan.innerHTML = month

      const hoursSpan = section.querySelector('.hours')
      hoursSpan.innerHTML = `${hours}h${minutes}`
    }
  }
}

youtubeCompletedEvents()
youtubeUpcomingEvents()
