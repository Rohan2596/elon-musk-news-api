
const express= require('express')
const axios= require('axios')
const cheerio= require('cheerio')
const app=express();
const PORT=process.env.PORT|| 8080;
const newspapers = [
    {
        name: 'yahoo',
        address: 'https://news.yahoo.com',
        base: ''
    },
    {
        name: 'nbc-tech',
        address: 'https://www.nbcnews.com/tech-media',
        base: ''
    },
    {
        name: 'nbc-biz',
        address: 'https://www.nbcnews.com/business',
        base: ''
    },
    {
        name: 'cbs',
        address: 'https://www.cbsnews.com/technology/',
        base: '',
    },
    {
        name: 'cnn',
        address: 'https://edition.cnn.com/business/tech',
        base: '',
    },
    {
        name: 'nyt',
        address: 'https://www.nytimes.com/international/section/technology',
        base: '',
    },
    {
        name: 'fox',
        address: 'https://www.foxbusiness.com/',
        base: 'https://www.foxnews.com/',
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.com/',
        base: 'https://www.bbc.co.uk',
    },
    {
        name: 'cnbc',
        address: 'https://www.cnbc.com/elon-musk/',
        base: 'https://www.cnbc.com',
    }
    
]

const articles = []
const websites=[]

newspapers.forEach(newspaper => {
    
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("Elon")' , html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                
                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })

        })
        
})

app.get('/', (req, res) => {
    res.json('Welcome to ELON MUSK news apis')
})

app.get('/news', (req, res) => {
    res.json(articles)
})
app.get('/news/websites',(req,res)=>{
    newspapers.forEach(newspaper => {
        websites.push({
            source: newspaper.name
        })
    })

    res.json(websites)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base


    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const curatedArticles = []

            $('a:contains("Elon")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                curatedArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(curatedArticles)
        }).catch(err => console.log(err))
})
app.listen(PORT,()=>{console.log("Server ELON MUSK  api Started");})