const { BigQuery } = require('@google-cloud/bigquery');
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
    debugging = query.debugging; //Se true habilita o log do json de validação
    delete query.debugging;

    // Fazer tratamento de String

    trace('RESULT VALID', result);
    insertRowsAsStream(result);
    res.status(200).send(debugging ? { debugging: debugging, result: result } : 'sucesso!');
  }
};

/**
 * Adiciona o atributo data para o objeto, contendo o timestamp do momento da execução
 * @param {Object} data Objeto
 * @returns {Object} Objeto com o atributo no padrão yyyy-mm-ddThh:mm:ss
 */
function addTimestamp(data) {
  let [date, time] = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }).split(' ');
  date = date.split('/');
  let timestamp = `${date[2]}-${date[1]}-${date[0]}T${time}`;
  data.data = timestamp;
  return data;
}

/**
 * Realiza a persistências dos dados por Stream no BigQuery
 * @param {Array} data Dados estruturados no padrão de persistência do BQ
 */
async function insertRowsAsStream(data) {
  const bigquery = new BigQuery();
  const options = {
    schema: penguinConfig.BQ_SCHEMA_RAWDATA,
    skipInvalidRows: true,
    ignoreUnknownValues: true,
  };

  trace(data);
  // Insert data into a table
  await bigquery.dataset(BQ_DATASET_ID).table(penguinConfig.BQ_TABLE_ID_RAWDATA).insert(data, options, insertHandler);

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