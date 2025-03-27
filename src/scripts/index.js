import "../styles/index.scss";
import "vanilla-drawers";
import throttle from "lodash.throttle";
import Swiper from "swiper";
import { Navigation, Pagination, EffectFade, Autoplay } from 'swiper/modules';

import { isMobile } from "./utils.js";
//import initDisclosures from "./disclosure.js";
import Lenis from 'lenis';

window.app = window.app || {};
window.app.hoverMedia = window.matchMedia("(any-hover: hover)");
window.app.lenis =  new Lenis({
	autoRaf: true,
})
document.documentElement.classList.toggle("is-mobile", isMobile.any());

// bp set scroll width
document.documentElement.style.setProperty("--scroll-width", `${window.innerWidth - document.documentElement.offsetWidth}px`);
// bp theme switch
initThemes();

initHeroSlider();
initProjectsSlider();

//initDisclosures();
app.drawers.init();

const intersectionObserver = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			entry.target.classList.add("_shown");
		}
	});
}, { threshold: window.innerWidth <= 768 ? 0.4 : 0.8 });

document.querySelectorAll(`[data-component*=":intersection-observer:"]`).forEach(elem => {
	intersectionObserver.observe(elem);
});

// Hide title
// document.addEventListener("scroll", throttle(() => {
// 	document.documentElement.classList.toggle("hide-title", window.scrollY > 50);
// }));

function initHeroSlider() {
	new Swiper("#hero-slider", {
		modules: [Navigation, Pagination, EffectFade, Autoplay],
		effect: 'fade', // Используем эффект fade
		fadeEffect: {
			crossFade: true, // Плавный переход между слайдами
		},
		loop: true, // Бесконечный цикл (опционально)
		speed: 300,
		autoplay: {
			delay: 3000, // Автопереключение каждые 3 секунды
			disableOnInteraction: false, // Не отключать автоплей при взаимодействии
		},
		navigation: {
			nextEl: '#hero-slider-next-btn',
			prevEl: '#hero-slider-prev-btn',
		},
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
	})
}

function initProjectsSlider() {
	new Swiper("#projects-slider", {
		modules: [Navigation, Pagination, Autoplay],
		//loop: true, // Бесконечный цикл (опционально),
		initialSlide: 1,
		slidesPerView: 1,
		spaceBetween: 40,
		speed: 300,
		// autoplay: {
		// 	delay: 3000, // Автопереключение каждые 3 секунды
		// 	disableOnInteraction: false, // Не отключать автоплей при взаимодействии
		// },
		breakpoints: {
			1120: {
				slidesPerView: 3,
				spaceBetween: 32,
			},
			768: {
				slidesPerView: 2,
				spaceBetween: 32,
			}
		},
		navigation: {
			nextEl: '#projects-slider-next-btn',
			prevEl: '#projects-slider-prev-btn',
		},
		// pagination: {
		// 	el: '.swiper-pagination',
		// 	clickable: true,
		// },
	})
}
// bp
function initThemes() {
	const elems = document.querySelectorAll(".theme-switch__switch");

	const currentTheme = localStorage.getItem("theme") || "dark";
	document.documentElement.setAttribute("data-theme", currentTheme);

	const switchTheme = () => {
		const currentTheme  = localStorage.getItem("theme") || "light";
		const nextTheme = currentTheme === "light" ? "dark" : "light";
		localStorage.setItem("theme", nextTheme);
		document.documentElement.setAttribute("data-theme", nextTheme);
	};

	elems.forEach(elem => elem.addEventListener("click", switchTheme));
}