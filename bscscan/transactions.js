const fetch = require('node-fetch')
const { setTimeout } = require('timers/promises');

const getLogs = async (startBlock) => {
	let ret = []
	let i = 1
	const bnb = 1000000000000000000.0
	const stepnWallet = '0x6238872a0bd9f0e19073695532a7ed77ce93c69e'
	const mintAddress = '0x0000000000000000000000000000000000000000'
	const deadAddress = '0x000000000000000000000000000000000000dEaD'
	const officialAddress = '0xfcfc7130e8af8c016823fa06d00d7c512c61ac7f'

	while(1) {
		const s = await fetch(`https://api.bscscan.com/api?module=account&action=txlist&address=${stepnWallet}&startBlock=${startBlock}&sort=asc&apikey=${process.env.API_KEY}`)
		const result = (await s.json()).result.map((r) => ({timestamp: parseInt(r.timeStamp), blockNumber: parseInt(r.blockNumber), transactionHash: r.hash, value: parseInt(r.value) / bnb * (r.to === stepnWallet ? 1 : -1), address: r.to === stepnWallet ? r.from : r.to, io: r.to === stepnWallet ? 'in' : 'out', data: r})).sort((a, b) => (a.timestamp - b.timestamp))
		ret = ret.concat(result.filter((r) => r.data.isError === '0' && r.data.from !== mintAddress && r.data.to !== deadAddress && r.address !== officialAddress))
		console.log(`${ret.length}, ${result[result.length-1].transactionHash}`)

		if (result.length < 10000) {
			break
		}

		startBlock = result[9999].blockNumber + 1
		if (i % 5 == 0) {
			await setTimeout(1000)
		}
		i = (i + 1) % 5
	}

  console.log(ret.map((r) => `${r.timestamp}\t${r.blockNumber}\t${r.transactionHash}\t${r.address}\t${r.io}\t${r.value}`).join("\n"))
	return ret
}

module.exports = getLogs
