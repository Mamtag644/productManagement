let axios = require("axios");
const coinModel = require("../model/chainModel.js");

let getCryptoCurrency = async function (req, res) {

    try{

    let options = {
        method: 'get',
        url: 'https://api.coincap.io/v2/assets'
    }
    let result = await axios(options)
    
    let data = result.data.data

    let updates = data.map(element => {
        return {
            updateOne: {
            filter: { name: element.name },
            update: { $set: { name : element.name , symbol : element.symbol , marketCapUsd : element.marketCapUsd , priceUsd : element.priceUsd } },
            upsert: true
        }
        }
    })

    await coinModel.bulkWrite(updates)

    let sortedCoins = data.sort((a, b) => b['changePercent24Hr'] - a['changePercent24Hr'])

    res.status(201).send({ status : true , message : sortedCoins })

} catch (err) {
        res.status(500).send({ message : err.message })
    }
}

module.exports = { getCryptoCurrency }

// token key:  5d5d21e8-7d1c-4fa3-9849-11b7011ab7e1