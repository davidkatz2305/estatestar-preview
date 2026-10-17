'use strict';
const $ = (q, root = document) => root.querySelector(q);
const $$ = (q, root = document) => [...root.querySelectorAll(q)];
const data = window.ESTATE_DATA;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const behavior = () => reduced.matches ? 'instant' : 'smooth';
const safeText = text => { const e = document.createElement('span'); e.textContent = text; return e.innerHTML; };
const localVideo = remote => 'assets/' + new URL(remote).pathname.split('/').pop();
const menuToggle = $('.menu-toggle');
const menu = $('#mobile-menu');
function closeMenu(){menu.hidden=true;menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Menü öffnen');document.body.classList.remove('menu-open');}
menuToggle.addEventListener('click',()=>{const open=menu.hidden;menu.hidden=!open;menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Menü schließen':'Menü öffnen');document.body.classList.toggle('menu-open',open);});
$$('a',menu).forEach(a=>a.addEventListener('click',closeMenu));
menu.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();menuToggle.focus();}if(e.key==='Tab'){const list=[menuToggle,...$$('a',menu)];const i=list.indexOf(document.activeElement);if(e.shiftKey&&i===0){e.preventDefault();list.at(-1).focus();}else if(!e.shiftKey&&i===list.length-1){e.preventDefault();menuToggle.focus();}}});
matchMedia('(min-width: 761px)').addEventListener('change',e=>{if(e.matches)closeMenu();});

let activePhotos=[], activeFilmCategory='office';
function photoCards(category){activePhotos=data.photos.filter(p=>p.category===category);$('#photo-gallery').innerHTML=activePhotos.map((p,i)=>`<article class="gallery-card"><button data-photo="${i}" aria-label="Fotografie ansehen: ${safeText(p.title)}"><div class="card-image"><img src="${p.image}" alt="${safeText(p.title)}" width="1600" height="1100" loading="lazy" decoding="async"></div><div class="card-caption"><span>${safeText(p.title)}</span><span aria-hidden="true">↗</span></div></button></article>`).join('');$('#photo-gallery').scrollLeft=0;$('#photo-count').textContent=`${activePhotos.length} Fotografien · Zum Entdecken horizontal wischen`;
$$('[data-photo-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.photoFilter===category)));}
function filmCards(category){activeFilmCategory=category;const films=data.films.filter(p=>p.category===category);$('#film-gallery').innerHTML=films.map(p=>`<article class="gallery-card"><button data-film="${data.films.indexOf(p)}" aria-label="Film abspielen: ${safeText(p.title)}"><div class="card-image"><img src="${p.image}" alt="${safeText(p.title)} – Filmvorschau" width="650" height="400" loading="lazy" decoding="async"><span class="play-circle" aria-hidden="true"></span><span class="film-duration">${safeText(category.toUpperCase())} / FILM</span></div><div class="card-caption"><span>${safeText(p.title)}</span><span aria-hidden="true">↗</span></div></button></article>`).join('');$('#film-gallery').scrollLeft=0;$('#film-count').textContent=`${films.length} Filme · Wiedergabe auf Klick`;$$('[data-film-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filmFilter===category)));}
photoCards('exterieur');filmCards('office');
$$('[data-photo-filter]').forEach(b=>b.addEventListener('click',()=>photoCards(b.dataset.photoFilter)));
$$('[data-film-filter]').forEach(b=>b.addEventListener('click',()=>filmCards(b.dataset.filmFilter)));
$$('[data-scroll]').forEach(b=>b.addEventListener('click',()=>{const track=document.getElementById(b.dataset.scroll);const card=$('.gallery-card',track);track.scrollBy({left:(card.getBoundingClientRect().width+parseFloat(getComputedStyle(track).gap))*Number(b.dataset.dir),behavior:behavior()});}));

const dialog=$('#media-dialog');let currentImage=-1;let dialogPhotos=[];let returnFocus=null;
function openDialog(title){returnFocus=document.activeElement;$('#media-title').textContent=title;document.body.classList.add('dialog-open');dialog.showModal();$('#close-dialog').focus();heroVideo.pause();}
function closeDialog(){dialog.close();}
dialog.addEventListener('close',()=>{$('#media-body').replaceChildren();document.body.classList.remove('dialog-open');returnFocus?.focus({preventScroll:true});updateVideo();});
$('#close-dialog').addEventListener('click',closeDialog);
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog();}});
function showImage(i){currentImage=(i+dialogPhotos.length)%dialogPhotos.length;const p=dialogPhotos[currentImage];$('#media-title').textContent=p.title;const img=new Image();img.src=p.image;img.alt=p.title;$('#media-body').replaceChildren(img);$('#media-count').textContent=`${currentImage+1} / ${dialogPhotos.length}`;$('.dialog-bottom').hidden=false;}
$('#photo-gallery').addEventListener('click',e=>{const b=e.target.closest('[data-photo]');if(!b)return;dialogPhotos=[...activePhotos];openDialog(dialogPhotos[Number(b.dataset.photo)].title);showImage(Number(b.dataset.photo));});
$('#media-prev').addEventListener('click',()=>showImage(currentImage-1));$('#media-next').addEventListener('click',()=>showImage(currentImage+1));
dialog.addEventListener('keydown',e=>{if(!$('.dialog-bottom').hidden&&e.key==='ArrowRight'){e.preventDefault();showImage(currentImage+1);}if(!$('.dialog-bottom').hidden&&e.key==='ArrowLeft'){e.preventDefault();showImage(currentImage-1);}});
function showVideo(src,title){openDialog(title);$('.dialog-bottom').hidden=true;const video=document.createElement('video');video.src=src;video.controls=true;video.playsInline=true;video.preload='metadata';video.setAttribute('aria-label',title);$('#media-body').replaceChildren(video);video.play().catch(()=>{});}
$('#film-gallery').addEventListener('click',e=>{const b=e.target.closest('[data-film]');if(b){const film=data.films[Number(b.dataset.film)];showVideo(localVideo(film.link),film.title);}});
$('[data-lab-film]').addEventListener('click',()=>showVideo('assets/Digital-Lab-Virtual-Staging-Renovation-CGI-3D-Modelling-Immobilie-Real-Estate-16x9_Comp.mp4','Digital Lab · Virtual Staging, Renovierung & CGI'));

let selectedTour=0;
$('#tour-picker').innerHTML=data.tours.map((p,i)=>`<button data-tour="${i}" aria-pressed="${i===0}">${safeText(p.title.replace(' 360',''))}</button>`).join('');
$('#tour-picker').addEventListener('click',e=>{const b=e.target.closest('[data-tour]');if(!b)return;selectedTour=Number(b.dataset.tour);const p=data.tours[selectedTour];$('#tour-image').src=p.image;$('#tour-image').alt='Vorschau des virtuellen Rundgangs '+p.title;$('#tour-name').textContent=p.title;$$('[data-tour]').forEach(t=>t.setAttribute('aria-pressed',String(t===b)));});
$('#open-tour').addEventListener('click',()=>{const p=data.tours[selectedTour];openDialog(p.title);$('.dialog-bottom').hidden=true;const frame=document.createElement('iframe');frame.src=p.link;frame.title='Interaktiver Rundgang: '+p.title;frame.allowFullscreen=true;frame.allow='fullscreen; xr-spatial-tracking';frame.referrerPolicy='strict-origin-when-cross-origin';$('#media-body').replaceChildren(frame);});

const ai=[
{kicker:'KI HOME STAGING',title:'Ein Raum. Neue Vorstellungen.',copy:'Virtuelle Einrichtung mit einem stimmigen Stil. Geplant als kuratierte Bildserie mit Originalvergleich – für Exposé, Website und Präsentation.',image:'assets/01-Rocket-Tower-Konferenzraum-GSW-Hochhaus-Architektur-Innen-Immobilie-Foto-Berlin-Desktop.webp',alt:'Originalaufnahme eines Konferenzraums als mögliches Ausgangsmaterial'},
{kicker:'RENOVIERUNGSVISIONEN',title:'Bestand sehen. Potenzial verstehen.',copy:'Materialien, Farben und Einrichtung als Gestaltungsidee. Klar vom Istzustand getrennt, mit dem Original zum Vergleich. Keine Bauplanung oder Zusage zur baulichen Machbarkeit.',image:'assets/03-Luxus-Townhouse-Berlin-Wohnzimmer-Esszimmer-Architektur-Innen-Immobilie-Foto-Desktop.webp',alt:'Originalaufnahme eines Berliner Wohnraums als mögliches Ausgangsmaterial'},
{kicker:'KI-GESTÜTZTE IMMOBILIENCLIPS',title:'Aus Bildern wird Bewegung.',copy:'Kurze Clips aus vorhandenen Fotos, Aufnahmen und gekennzeichneten Visualisierungen. Mit Schnitt, Typografie und passenden Formaten für Website und Social Media.',image:'assets/08-PwC-Berlin-Kapelle-Ufer-4-Berlin-Architekturfotografie-Architektur-Immobilie-Foto-Desktop.webp',alt:'Originalaufnahme eines Bürogebäudes als mögliches Ausgangsmaterial für Immobilienclips'}
];
function selectAI(i,focus=false){const p=ai[i];$$('[data-ai]').forEach((b,n)=>{b.setAttribute('aria-selected',String(n===i));b.tabIndex=n===i?0:-1;if(focus&&n===i)b.focus();});$('#ai-detail').setAttribute('aria-labelledby','ai-tab-'+i);$('#ai-kicker').textContent=p.kicker;$('#ai-heading').textContent=p.title;$('#ai-description').textContent=p.copy;$('#ai-image').src=p.image;$('#ai-image').alt=p.alt;$('#ai-cta').href='mailto:studio@estatestar.de?subject='+encodeURIComponent('Projektidee: '+p.kicker);}
$$('[data-ai]').forEach(b=>{b.addEventListener('click',()=>selectAI(Number(b.dataset.ai)));b.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(Number(b.dataset.ai)+1)%3;if(e.key==='ArrowLeft')next=(Number(b.dataset.ai)+2)%3;if(e.key==='Home')next=0;if(e.key==='End')next=2;if(next!==undefined){e.preventDefault();selectAI(next,true);}});});

// Native scroll snap preserves touch momentum, keyboard scrolling and oversized sections.
const sections=$$('main>.panel');let heroVisible=true;
const sectionObserver=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){$$('.section-nav a').forEach(a=>{if(a.hash==='#'+e.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}}},{rootMargin:'-35% 0px -55% 0px',threshold:0});sections.forEach(s=>sectionObserver.observe(s));
const heroVideo=$('#hero-video');const motionButton=$('#motion-toggle');let userPaused=reduced.matches||Boolean(navigator.connection?.saveData);let videoLoaded=false;
function loadHero(){if(videoLoaded)return;videoLoaded=true;heroVideo.src='assets/Estatestar-Showreel-Immobilienvideo-Immobilie-Foto-Film-360-'+(matchMedia('(max-width:760px)').matches?'9x16':'16x9')+'_Comp.mp4';heroVideo.load();}
function motionLabel(){const paused=heroVideo.paused;motionButton.innerHTML=(paused?'▶':'Ⅱ')+' <span>'+(paused?'Film abspielen':'Film pausieren')+'</span>';motionButton.setAttribute('aria-label',paused?'Hintergrundfilm abspielen':'Hintergrundfilm pausieren');}
function updateVideo(){if(heroVisible&&!userPaused&&!document.hidden&&!dialog.open){loadHero();heroVideo.play().catch(()=>{userPaused=true;motionLabel();});}else heroVideo.pause();motionLabel();}
heroVideo.addEventListener('playing',()=>{heroVideo.classList.add('ready');motionLabel();});heroVideo.addEventListener('pause',motionLabel);heroVideo.addEventListener('error',()=>{heroVideo.classList.remove('ready');motionButton.hidden=true;});
motionButton.addEventListener('click',()=>{userPaused=!heroVideo.paused;loadHero();updateVideo();});
new IntersectionObserver(([e])=>{heroVisible=e.isIntersecting;updateVideo();},{threshold:.08}).observe($('#start'));
document.addEventListener('visibilitychange',updateVideo);reduced.addEventListener('change',()=>{userPaused=reduced.matches;updateVideo();});
$('#snap-toggle').addEventListener('click',e=>{const off=document.documentElement.classList.toggle('no-snap');e.currentTarget.setAttribute('aria-pressed',String(!off));e.currentTarget.textContent='Einrasten: '+(off?'aus':'an');});
matchMedia('(max-width:760px)').addEventListener('change',()=>{if(!videoLoaded)return;heroVideo.classList.remove('ready');videoLoaded=false;updateVideo();});
motionButton.addEventListener('click',()=>heroVideo.classList.toggle('user-enabled',!userPaused));
