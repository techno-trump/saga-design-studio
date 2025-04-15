import "../styles/index.scss";
import "vanilla-drawers";
import throttle from "lodash.throttle";
import Swiper from "swiper";
import { Navigation, Pagination, EffectFade, Autoplay } from 'swiper/modules';

import { isMobile } from "./utils.js";
//import initDisclosures from "./disclosure.js";
import Lenis from 'lenis';

class LazyLoadAgent {
	constructor() {
		this.paramsMap = new WeakMap();
		this.intersectionObserver = new IntersectionObserver((entries, observer) => {
			entries.forEach(({ isIntersecting, target }) => {
				if (isIntersecting) {
					this.load(target);
					observer.unobserve(target);
				}
			});
		}, { threshold: 0, rootMargin: "30%" });
		this.mutationObserver = new MutationObserver((mutations, observer) => {
				console.log("observer: ", observer);
			mutations.forEach((mutation) => {
				const { type, target, attributeName } = mutation;
				const params = this.paramsMap.get(target);
				if (!params) return;
				if (attributeName !== params.triggerAttribute) return;
				if (attributeName === "class") {
					if (!params.values.some(item => target.classList.contains(item))) return;
				} else {
					if (!params.values.some(item => target.getAttribute(attributeName).includes(item))) return;
				}
				this.load(params.elem);
			});
		});
	}
	watch(elem) {
		const triggerElem = elem.hasAttribute("data-lazyload-trigger-target") ? elem.closest(elem.getAttribute("data-lazyload-trigger-target")) : elem;
		if (elem.hasAttribute("data-lazyload-trigger")) {
			const [triggerAttribute, rawValues] = elem.getAttribute("data-lazyload-trigger").split(":").map(part => part.trim());
			const values = rawValues.split(",").map(part => part.trim());
			this.paramsMap.set(triggerElem, { elem, triggerAttribute, values });
			this.mutationObserver.observe(triggerElem, { attributes: true, attributeFilter: [triggerAttribute] });
		} else {
			this.intersectionObserver.observe(triggerElem);
		}
	}
	load(target) {
		target.hasAttribute("data-srcset") && target.setAttribute("srcset", target.getAttribute("data-srcset"));
		target.hasAttribute("data-src") && target.setAttribute("src", target.getAttribute("data-src"));
	}
}

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
//initDisclosures();
app.drawers.init();
initImgLazyLoad();

initHeroSlider();
initProjectsSlider();
initHeaderChangeOnScroll();

document.querySelectorAll(`[href*="#"]`).forEach(elem => {
	elem.addEventListener("click", (e) => {
		e.preventDefault();
		const pattern = /.*?(\#.*)/;
		const href = elem.getAttribute("href");
		const match = href.match(pattern);
		const anchor = match ? match[1] : null;

		history.pushState(null, "", anchor);
		app.drawers.close("main-menu");
		window.app.lenis.scrollTo(anchor, { offset: -60 });
	});
});

const intersectionObserver = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			entry.target.classList.add("_shown");
		}
	});
}, { threshold: window.innerWidth <= 768 ? 0.2 : 0.3 });

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
		loop: true,
		speed: 600,
		autoplay: {
			delay: 5000,
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

	const currentTheme = localStorage.getItem("theme") || "light";
	document.documentElement.setAttribute("data-theme", currentTheme);

	const switchTheme = () => {
		const currentTheme  = localStorage.getItem("theme") || "light";
		const nextTheme = currentTheme === "light" ? "dark" : "light";
		localStorage.setItem("theme", nextTheme);
		document.documentElement.setAttribute("data-theme", nextTheme);
	};

	elems.forEach(elem => elem.addEventListener("click", switchTheme));
}

function initImgLazyLoad() {
	app.lazyLoadAgent = new LazyLoadAgent();
	document.querySelectorAll("[data-lazyload], [data-lazyload-trigger]").forEach(elem => app.lazyLoadAgent.watch(elem));
}

function initHeaderChangeOnScroll() {
	const header = document.querySelector("header");
	document.addEventListener("scroll", throttle(() => {
		header.classList.toggle("header_background", document.documentElement.scrollTop > 50);
	}, 50));
}