import{S as $,a as v,i as f}from"./assets/vendor-da186403.js";(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))c(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&c(s)}).observe(document,{childList:!0,subtree:!0});function i(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerPolicy&&(r.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?r.credentials="include":t.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function c(t){if(t.ep)return;t.ep=!0;const r=i(t);fetch(t.href,r)}})();document.addEventListener("DOMContentLoaded",function(){const m=document.querySelector(".search-form"),n=document.querySelector(".gallery"),i=document.querySelector(".search-btn"),c=document.querySelector(".loader"),t="gallery-link",r=document.querySelector(".load-more-btn");let s;i.disabled=!0;let d=1,g=null,h=0;m.elements.query.addEventListener("input",function(){g=this.value.trim(),i.disabled=g===""}),m.addEventListener("submit",async function(e){e.preventDefault();const o=e.target.elements.query.value.trim();if(o!==""){c.style.display="block",n.innerHTML="";try{const a=await b(o,1);c.style.display="none",w(a.hits),i.disabled=!0,h=a.total,L(),s=new $(`.${t}`,{captionsData:"alt",captionDelay:250}),s.refresh(),s.on("show.simplelightbox")}catch(a){c.style.display="none",E(`Error fetching images: ${a}`)}e.target.elements.query.value=""}});async function b(e,o=1){const a="https://pixabay.com/api/",p=`?${new URLSearchParams({key:"42137546-386b5be41212ccd429cab5a80",q:e,image_type:"photo",orientation:"horizontal",safeSearch:!0,per_page:15,page:o})}`,y=a+p;try{const l=await v.get(y);if(!l.data)throw new Error("No data returned from th API");return l.data}catch(l){throw new Error(`Error fetching images: ${l.message}`)}}function L(){Math.ceil(h/15)===d?(r.style.display="none",f.show({message:"We're sorry, but you've reached the end of search results.",color:"red",position:"topRight"})):r.style.display="block"}function S({webformatURL:e,largeImageURL:o,tags:a,likes:u,views:p,comments:y,downloads:l}){return`
  <a href="${o}" class="${t} id="gallery-link">
     <figure>
      <img src="${e}" alt="${a}" class="gallery-image">
      <figcaption class="gallery__figcaption">
        <p class="image-item">Likes <span class="image-caption">${u}</span></p>
        <p class="image-item">Views <span class="image-caption">${p}</span></p>
        <p class="image-item">Comments <span class="image-caption">${y}</span></p>
        <p class="image-item">Downloads <span class="image-caption">${l}</span></p>
  </figcaption>
  </figure>
</a>`}function q(e){return e.map(S).join("")}function w(e){if(e.length===0){f.show({icon:"icon-close",messageSize:"16px",backgroundColor:"red",position:"topRight",message:"Sorry, there are no images matching your search query. Please try again!"}),i.disabled=!0;return}const o=q(e);n.insertAdjacentHTML("beforeend",o),r.style.display="block"}function E(e){f.show({message:e,backgroundColor:"#59A10D",progressBarColor:"#B5EA7C",icon:"icon-check",...toastOptions})}r.addEventListener("click",P);async function P(){d++;try{const e=await b(g,d);w(e.hits),L();const o=document.querySelectorAll(".gallery-link"),u=(o.length>0?o[0].offsetHeight:0)*2;console.log(u),window.scrollBy({behavior:"smooth",top:u})}catch(e){E(`Error fetching more images: ${e}`)}}});
//# sourceMappingURL=commonHelpers.js.map
