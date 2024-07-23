import { elements } from "./helpers.js";
import { API } from "./api.js";

//! API ye veri gönderme
elements.form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const value = e.target[0].value;
  if (value) {
    const results = new API();
    const songs = await results.getData(value);
    renderSongs(songs);
  } else {
    throw new Error("Lütfen bir değer giriniz!");
  }

  elements.form.reset();
});

//! API den gelen cevapı render etme
const renderSongs = (songs) => {
  songs.forEach((song) => {
    console.log(song);
    const card = document.createElement("li");
    card.classList.add("song");

    card.dataset.title = song.track.subtitle;
    card.dataset.song = song.track.title;
    card.dataset.img = song.track.images.coverart;
    card.dataset.url = song.track.hub.actions[1].uri;

    card.innerHTML = `
        <figure class="song-img"><img src="${card.dataset.img}" /></figure>
        <div class="song-detail">
            <span>${card.dataset.title}</span>
            <span>${card.dataset.song}</span>
        </div>
        <button class="play-btn"><i class="bi bi-play-fill"></i></button>
    `;

    elements.songList.appendChild(card);

    card.addEventListener("click", findTheSong);
  });
};

//! Tıklanılan müziğin verilerini alma
const findTheSong = (e) => {
  const ele = e.target;
  if (ele.parentElement.className === "play-btn") {
    const song = ele.closest(".song");
    playSong(song.dataset);
  }
};

//! Tıkladığımız şarkıyı çalma
const playSong = ({ img, song, url }) => {
  elements.footer.innerHTML = "";

  const div = document.createElement("div");
  div.classList.add("footer");
  div.innerHTML = `
    <div class="song-detail">
        <figure class="song-img"><img src="${img}" /></figure>

        <div class="song-detail-title">
          <span>Şu an oynatılıyor...</span>
          <h4>${song}</h4>
        </div>
    </div>

    <audio src="${url}" class="playing" controls autoplay></audio>
  `;

  const play = div.querySelector(".playing");
  const songImg = div.querySelector(".song-img");
  let interval = null;
  let count = 0;
  if (play.paused) {
    interval = setInterval(() => {
      count++;
      songImg.style.transform = `rotate(${count}deg)`;

      count === 360 ? (count = 0) : (count = count);
    }, 10);
  } else {
    clearInterval(interval);
  }

  elements.footer.style.height = "100px";
  elements.footer.appendChild(div);
};
