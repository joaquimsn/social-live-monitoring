function monitoring() {
  console.log('Rodando SLM');
  window.slm = {
    youtube: '#count > ytd-video-view-count-renderer > .ytd-video-view-count-renderer',
    tiktok: 'div[data-e2e="live-people-count"]',
    time: 30000
  }

  const platform = document.location.host.split(".")[1];

  function scrapingViews() {
    let body = {
      date: new Date().toLocaleString('en-US', {timeZone: 'America/Sao_Paulo',}),
      platform: platform,
      liveCount: document.querySelector(window.slm[platform]).textContent
    }

    console.log(body);
  } 

  setInterval(scrapingViews, window.slm.time);
}