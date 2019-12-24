import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

polka() // You can also use Express
/*
  .get('/api/offer-assist/:check_in/', (req, res) => {
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify({
			status: 200,
			message: 'flp 2019!',
			result: [
				{
					"name": "BALI WAT"
				},
				{
					"name": "Thailand? nah, bali"
				}
			]
		}))
	})
	*/
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		sapper.middleware()
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
