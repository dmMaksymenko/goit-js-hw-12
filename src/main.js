('use strict');
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

document.addEventListener('DOMContentLoaded', function () {
  const searchForm = document.querySelector('.search-form');
  const galleryMarkup = document.querySelector('.gallery');
  const submitBtn = document.querySelector('.search-btn');
  const loader = document.querySelector('.loader');
  const GALLERY_LINK = 'gallery-link';
  const loadMoreBtn = document.querySelector('.load-more-btn');
  let gallery;
  submitBtn.disabled = true;
  let page = 1;
  let query = null;
  let totalResult = 0;

  searchForm.elements.query.addEventListener('input', function () {
    query = this.value.trim();
    submitBtn.disabled = query === '';
  });

  searchForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    query = e.target.elements.query.value.trim();
    if (query === '') {
      return;
    }

    searchForm.reset();
    page = 1;
    galleryMarkup.innerHTML = '';
    try {
      console.log('Fetching images...');
      const { data, maxPage } = await getImage(query, 1);
      console.log('Images fetched.');
      console.log('Data received:', data);
      console.log('Max page:', maxPage);
      totalResult = data.totalHits;
      console.log('Total result:', totalResult);
      loader.style.display = 'none';
      renderImgs(data.hits);
      submitBtn.disabled = true;
      checkBtnStatus(maxPage, page);
      console.log('Checking button status...');

      gallery = new SimpleLightbox(`.${GALLERY_LINK}`, {
        captionsData: 'alt',
        captionDelay: 250,
      });
      gallery.refresh();
      gallery.on('show.simplelightbox');
    } catch (error) {
      console.error('Error fetching images:', error);
      loader.style.display = 'none';
      onError(`Error fetching images: ${error}`);
      submitBtn.disabled = false;
    } finally {
      e.target.elements.query.value = '';
    }
  });
  async function getImage(query, page = 1) {
    const BASE_URL = 'https://pixabay.com/api/';

    const searchParams = new URLSearchParams({
      key: '42137546-386b5be41212ccd429cab5a80',
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safeSearch: true,
      per_page: 15,
      page: page,
    });
    const Params = `?${searchParams}`;
    const url = BASE_URL + Params;

    try {
      const response = await axios.get(url, {
        params: { ...searchParams },
      });
      if (!response.data) {
        throw new Error('No data returned from the API');
      }
      const data = response.data;
      const maxPage = Math.ceil(data.totalHits / searchParams.get('per_page'));
      console.log(data);
      console.log(maxPage);
      console.log(data.hits.length);
      return { data, maxPage, page };
    } catch (error) {
      throw new Error(`Error fetching images: ${error.message}`);
    }
  }

  function checkBtnStatus(maxPage, page) {
    console.log('Max page:', maxPage);
    console.log('Page:', page);
    if (totalResult === 0) {
      loadMoreBtn.style.display = 'none';
      return;
    }
    const isLastPage = page <= maxPage;
    if (!isLastPage) {
      loadMoreBtn.style.display = 'none';
      iziToast.show({
        message: "We're sorry, but you've reached the end of search results.",
        color: 'red',
        position: 'topRight',
      });
    } else {
      loadMoreBtn.style.display = 'block';
    }
  }
  loadMoreBtn.addEventListener('click', loadMoreImages);

  function imgTemplate({
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  }) {
    return `
  <a href="${largeImageURL}" class="${GALLERY_LINK} id="gallery-link">
     <figure>
      <img src="${webformatURL}" alt="${tags}" class="gallery-image">
      <figcaption class="gallery__figcaption">
        <p class="image-item">Likes <span class="image-caption">${likes}</span></p>
        <p class="image-item">Views <span class="image-caption">${views}</span></p>
        <p class="image-item">Comments <span class="image-caption">${comments}</span></p>
        <p class="image-item">Downloads <span class="image-caption">${downloads}</span></p>
  </figcaption>
  </figure>
</a>`;
  }

  function imgsTemplate(imgs) {
    return imgs.map(imgTemplate).join('');
  }

  function renderImgs(images) {
    if (images.length === 0) {
      iziToast.show({
        icon: 'icon-close',
        messageSize: '16px',
        backgroundColor: `red`,
        position: 'topRight',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
      loadMoreBtn.style.display = 'none';
      galleryMarkup.innerHTML = '';
      return;
    }

    const markup = imgsTemplate(images);
    try {
      galleryMarkup.insertAdjacentHTML('beforeend', markup);
      totalResult += images.length;
    } finally {
      loader.style.display = 'none';
    }
  }

  async function loadMoreImages() {
    console.log('Loading more images...');
    page++;
    loader.style.display = 'block';
    try {
      const { data, maxPage } = await getImage(query, page);
      console.log('More images loaded.');
      console.log('Data received:', data);
      console.log('Max page:', maxPage);
      renderImgs(data.hits);

      console.log('Page:', page);
      console.log('Total hits:', data.totalHits);

      if (page >= maxPage || data.totalHits < 15) {
        loadMoreBtn.style.display = 'none';
        console.log('Reached last page.');
        iziToast.show({
          message: "We're sorry, but you've reached the end of search results.",
          color: 'red',
          position: 'topRight',
        });
      } else {
        checkBtnStatus(maxPage, page);
        console.log('Checking button status...');
      }
      const imageElements = document.querySelectorAll('.gallery-link');
      const imageHeight =
        imageElements.length > 0 ? imageElements[0].offsetHeight : 0;
      const scrollHeight = imageHeight * 2;
      window.scrollBy({
        behavior: 'smooth',
        top: scrollHeight,
      });
    } catch (error) {
      console.error('Error fetching more images:', error);
      onError(`Error fetching more images: ${error}`);
    } finally {
      loader.style.display = 'none';
    }
  }

  function onError(message) {
    iziToast.show({
      message,
      backgroundColor: '#59A10D',
      progressBarColor: '#B5EA7C',
      icon: 'icon-check',
    });
  }
});
