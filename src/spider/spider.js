import cheerio from 'cheerio';


class Spider {
  constructor(title, site, decode, plantformId) {
    this.title = title;
    this.site = site;
    this.decode = decode;
    this.plantformId = plantformId;
  }

  getNovel(data) {
    let $ = cheerio.load(data, { decodeEntities: false });
    let tempVal = $(`meta[property='og:novel:read_url']`);
    if (tempVal.length === 0) {
      console.log(`[info]${this.site} | Error,jmp`);
      return null;
    }
    let novel = {
      name: $(`meta[property='og:novel:book_name']`)[0].attribs.content,
      author: $(`meta[property='og:novel:author']`)[0].attribs.content,
      url: tempVal[0].attribs.content,
      img: $(`meta[property='og:image']`)[0].attribs.content,
      desc: $(`meta[property='og:description']`)[0].attribs.content.replace(/<br\/>/g, '\n'),
      plantFormId: this.plantformId,
    };

    return novel;
  }
}

export default Spider;