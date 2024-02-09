async function Youtube() {
  const host =
    location.hostname === 'localhost' ?
      'http://localhost:3001'
    : 'https://guaracinews.com.br'

  const req = await fetch(`${host}/youtube/events/completed`)
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

Youtube()
