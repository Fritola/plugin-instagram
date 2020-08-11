const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/web', express.static(path.resolve(__dirname, 'public')))

app.get('/:user', async (req, res) => {
    const { user } = req.params

    // http://localhost:3000/nasa

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://www.instagram.com/${user}`);

    const imgList = await page.evaluate(() => {
        const nodeList = document.querySelectorAll('article img')
        const imgArray = [...nodeList]

        const imgList = imgArray.map(({ src }) => ({ src }))

        return imgList
    })

    await browser.close();
    
    return res.json(imgList)
})

app.listen(process.env.port || 3000);