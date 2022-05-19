const fetch = require('node-fetch')
const { setTimeout } = require('timers/promises');

const getLogs = async () => {
	let ret = []
	let i = 1
	let fromBlock = null

	while(1) {
		const s = await fetch(`https://api.bscscan.com/api?module=logs&action=getLogs&topic0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&topic1=0x0000000000000000000000000000000000000000000000000000000000000000&address=0x69d60ad11feb699fe5feeeb16ac691df090bfd50&apikey=${process.env.API_KEY}&fromBlock=${fromBlock}`)
		const result = (await s.json()).result.map((r) => ({timestamp: parseInt(r.timeStamp, 16), blockNumber: parseInt(r.blockNumber, 16), transactionHash: r.transactionHash})).sort((a, b) => (a.timestamp - b.timestamp))
		ret = ret.concat(result)
		console.log(`${ret.length}, ${result[result.length-1].transactionHash}`)

		if (result.length < 1000) {
			break
		}

		fromBlock = result[999].blockNumber + 1
		if (i % 5 == 0) {
			await setTimeout(1000)
		}
		i = (i + 1) % 5
	}

  console.log(ret.map((r) => `${r.timestamp}\t${r.transactionHash}`).join("\n"))
	return ret
}

module.exports = getLogs
