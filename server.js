const fastify = require('fastify')({ logger: { level: 'debug' } });
const axios = require('axios');
const cors = require('@fastify/cors')

const pythonBackend = 'http://backend-python:5000'
const goBackend = 'http://backend-go:5001'

fastify.register(cors, {
    origin: '*',
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
});

fastify.post('/login', async (request, reply) => {
  try {
    const responseGo = await axios.post(`${goBackend}/login`, request.body);

    // In questo caso, solo il login è gestito dal backend Go
    reply.send(responseGo.data);
  } catch (error) {
    reply.code(500).send({ error: 'Internal Server Error' });
  }
});

fastify.post('/post_name', async (request, reply) => {
  try {
    // Inoltra la richiesta al backend Python
    const response = await axios.post(`${pythonBackend}/post_name`, request.body);
    reply.send(response.data);
  } catch (error) {
    reply.code(500).send({ error: 'Internal Server Error' });
  }
});

fastify.post('/book', async (request, reply) => {
  try {
    // Inoltra la richiesta al backend Python per la route "/book"
    const response = await axios.post(`${pythonBackend}/book`, request.body);
    reply.send(response.data);
  } catch (error) {
    reply.code(500).send({ error: 'Internal Server Error' });
  }
});

fastify.get('/myreservations', async (request, reply) => {
  try {
    const employee_id = request.query.employee_id; // Ottieni il parametro employee_id dall'URL

    // Inoltra la richiesta al backend Python per la route "/myreservations"
    const response = await axios.get(`${pythonBackend}/myreservations?employee_id=${employee_id}`);
    reply.send(response.data);
  } catch (error) {
    reply.code(500).send({ error: 'Internal Server Error' });
  }
});

fastify.listen(3002, '0.0.0.0', (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('BFF Server is running on port 3002');
});
