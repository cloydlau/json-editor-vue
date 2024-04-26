import axios from 'axios'
import { name } from '../package.json'

const initialPublishDate = '2020-07-15'
const currentDate = new Date().toISOString().split('T')[0]
const url = `https://api.npmjs.org/downloads/range/${initialPublishDate}:${currentDate}/${name}`

axios.get(url).then((response) => {
  const data = response.data
  const totalDownloads = data.downloads.reduce((acc: number, day: any) => acc + day.downloads, 0)
  console.log(`Total npm downloads for ${name}: ${totalDownloads}`)
})
