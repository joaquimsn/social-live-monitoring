const { BigQuery } = require('@google-cloud/bigquery');
const BQ_DATASET_ID = process.env.BQ_DATASET_ID;
const BQ_TABLE_ID_RAWDATA = process.env.BQ_TABLE_ID_RAWDATA;
let debugging = false;

const socialLiveMonitoring = async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Credentials', 'true');

  // Liberação de CROS
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.sendStatus(204);
  } else {
    let body = req.body;
    const query = req.query;
    debugging = query.debugging; //Se true habilita o log do json de validação
    delete query.debugging;

    // Preserva os dados brutos recebidos na requisição
    body.rawData = JSON.stringify(body);
    body.liveCount = cleanData(body);
    addTimestamp(body);

    trace(body);
    insertRowsAsStream(body);
    res.status(200).send(debugging ? { debugging: debugging, result: body } : 'sucesso!');
  }
};

/**
 * Extrai o valor númerico corresponde do campo liveCount
 * @param {Object} body Objeto
 * @returns {int} número  
 */
function cleanData(body) {
  let liveCount = body.liveCount;

  if (body.platform === 'youtube') {
    body.liveCount = liveCount.match(/[\d,]+/g)[0].replace(',', '');
  } else if (body.platform === 'tiktok') {
    // Tranforma o número quando é maior que 1000
    body.liveCount = liveCount.match(/[\d\.]/g).join('') * (liveCount.indexOf('K') != -1 ? 1000 : 1)
  } else {
    body.liveCount = 'unknown platform'
  }

  return body.liveCount;
}

/**
 * Adiciona o atributo date para o objeto, contendo o timestamp do momento da execução
 * @param {Object} body Objeto
 * @returns {Object} Objeto com o atributo no padrão yyyy-mm-ddThh:mm:ss
 */
function addTimestamp(body) {
  let [date, time] = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }).split(' ');
  date = date.split('/');
  let timestamp = `${date[2]}-${date[1]}-${date[0]}T${time}`;
  body.date = timestamp;
  return body;
}

/**
 * Realiza a persistências dos dados por Stream no BigQuery
 * @param {Array} data Dados estruturados no padrão de persistência do BQ
 */
async function insertRowsAsStream(data) {
  const bigquery = new BigQuery();
  const options = {
    //schema: BQ_SCHEMA_RAWDATA,
    skipInvalidRows: true,
    ignoreUnknownValues: true,
  };

  trace(data);
  // Insert data into a table
  await bigquery.dataset(BQ_DATASET_ID).table(BQ_TABLE_ID_RAWDATA).insert(data, options, insertHandler);

  console.log(`Inserted ${data.length} rows`);
}

function insertHandler(err, apiResponse) {
  if (err) {
    console.error(err.name, JSON.stringify(err));
  }
}

/**
 * Enviado o log para o stdout, se somente se, a variável debugging = true
 * @param {Object} log Que será apresentado no stdout
 */
function trace(log) {
  if (debugging) {
    console.log(log);
  }
}

module.exports = {
  addTimestamp,
  insertRowsAsStream,
  socialLiveMonitoring,
};