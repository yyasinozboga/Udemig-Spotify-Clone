//! API ye istek atma
export class API {
  constructor() {
    this.songs = [];
  }

  async getData(value) {
    const url = `https://shazam.p.rapidapi.com/search?term=${value}&locale=tr-TR&offset=0&limit=5`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "c3202f5227mshefb2446baaf43e6p1b2232jsn6cc6e405ba66",
        "x-rapidapi-host": "shazam.p.rapidapi.com",
      },
    };

    try {
      const res = await fetch(url, options);
      const data = await res.json();

      return (this.songs = data.tracks.hits);
    } catch (error) {
      throw new Error(error);
    }
  }
}
