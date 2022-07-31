function monitoring() {
  console.log('Rodando SLM');
  window.slm = {
    apiUrl: 'http://localhost:8080',
    youtube: '#count > ytd-video-view-count-renderer > .ytd-video-view-count-renderer',
    tiktok: 'div[data-e2e="live-people-count"]',
    liveName: 'teste',
    time: 60000,
    debugging: false
  }

  const platform = document.location.host.split(".")[1];

  function logHttpResponse() {
    if (window.slm.debugging) {
      console.log('API - Status: ', this.status);
      console.log('Data:', JSON.stringify(this.response));
    }
  }

  function post(body) {
    const request = new XMLHttpRequest();
    request.open('POST', window.slm.apiUrl + '?debugging=' + window.slm.debugging, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onreadystatechange = logHttpResponse;
    request.send(JSON.stringify(body));

  }

  function scrapingViews() {
    let body = {
      date: new Date().toLocaleString('en-US', {timeZone: 'America/Sao_Paulo',}),
      liveName: window.slm.liveName,
      platform: platform,
      liveCount: document.querySelector(window.slm[platform]).textContent
    }

    post(body);
  } 

  setInterval(scrapingViews, window.slm.time);
}