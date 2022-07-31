# social-live-monitoring
Com esse projeto você pode monitorar os picos de usuários ativos durante as lives no youtube e tiktok, de forma simples e estruturada. 
## Como executar

### 1. Criar a cloud function e tabela no BQ
1 - Criar a tabela em um dataset do BQ de sua escolha, usando o schema _base-schema.json_ localizado na pasta api.

2 - Fazer o deploy da cloud function usando o código da pasta **api**. Durante o processo de deploy é necessário criar as variaveis de ambiente _BQ_DATASET_ID_ e _BQ_TABLE_ID_RAWDATA_, os valores para as variaveis deve corresponder as informações da etapa 1.

### 2. Executar o script do crawler no browser
1 - A primeira coisa é definir parametrizações do objeto global _slm_ disponível no objeto window, essa alteração pode ser feita em runtime ou no código fone do script _browser-scraping.js_.

```js
  // Edição direta no código fonte, deve ser feita da linha 3-9
  window.slm = {
    apiUrl: 'http://localhost:8080',
    youtube: '#count > ytd-video-view-count-renderer > .ytd-video-view-count-renderer',
    tiktok: 'div[data-e2e="live-people-count"]',
    liveName: 'teste',
    time: 60000, // executa a cada 60 segundos
    debugging: false
  }
```

**Observação**: o atributo _apiUrl_ deve ser parametrizado com a url pública da Cloud Function criada.


2 - Executar o script parametrizado na etapa 1, no console do navegador na aba onde a live está sendo exibida.
```js
// Após colar todo o código do arquivo browser-scraping.js no console do navegador aperte enter e execute a função;
monitoring();  
```
<img src="./executando-script-no-navegador.gif"></img>

### Visualização do Data Studio
TODO