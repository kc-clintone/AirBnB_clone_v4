document.ready(function () {
	const amenities = {};
	const cities = {};
	const states = {};
        const HOST = "http://127.0.0.1:5001";

	$('ul li input[type="checkbox"]').bind("change", (e) => {
		const element = e.target;
		let td;
		switch (element.id) {
			case "state_filter":
				td = states;
				break;
			case "city_filter":
				td = cities;
				break;
			case "amenity_filter":
				td = amenities;
				break;
		}
		if (element.checked) {
			td[element.dataset.name] = element.dataset.id;
		} else {
			delete td[element.dataset.name];
		}
		if (element.id === "amenity_filter") {
			$(".amenities h4").text(Object.keys(amenities).sort().join(", "));
		} else {
			$(".locations h4").text(
				Object.keys(Object.assign({}, states, cities)).sort().join(", ")
			);
		}
	});
	$.getJSON("http://0.0.0.0:5001/api/v1/status/", (data) => {
		if (data.status === "OK") {
			$("div#api_status").addClass("available");
		} else {
			$("div#api_status").removeClass("available");
		}
	});
	$.post({
		url: `${HOST}/api/v1/places_search`,
		data: JSON.stringify({}),
		headers: {
			"Content-Type": "application/json",
		},
		success: (data) => {
			data.forEach((place) =>
				$("section.places").append(
					`<article>
			<div class="title_box">
			<h2>${place.name}</h2>
			<div class="price_by_night">$${place.price_by_night}</div>
			</div>
			<div class="information">
			<div class="max_guest">${place.max_guest} Guest${
						place.max_guest !== 1 ? "s" : ""
					}</div>
			<div class="number_rooms">${place.number_rooms} Bedroom${
						place.number_rooms !== 1 ? "s" : ""
					}</div>
			<div class="number_bathrooms">${place.number_bathrooms} Bathroom${
						place.number_bathrooms !== 1 ? "s" : ""
					}</div>
			</div>
			<div class="description">
			${place.description}
			</div>
				</article>`
				)
			);
		},
		dataType: "json",
	});
	$(".filters button").bind("click", searchPlace);
	searchPlace();

	 function searchPlace() {
		$.post({
		  url: `${HOST}/api/v1/places_search`,
		  data: JSON.stringify({
			amenities: Object.values(amenities),
			states: Object.values(states),
			cities: Object.values(cities),
		  }),
		  headers: {
			"Content-Type": "application/json",
		  },
		  success: (data) => {
			$("section.places").empty();
			data.forEach((dt) => console.log(dt.id));
			data.forEach((place) => {
			  $("section.places").append(
				`<article>
				  <div class="title_box">
					<h2>${place.name}</h2>
					<div class="price_by_night">$${place.price_by_night}</div>
				  </div>
				  <div class="information">
					<div class="max_guest">${place.max_guest} Guest${
				  place.max_guest !== 1 ? "s" : ""
				}</div>
					  <div class="number_rooms">${place.number_rooms} Bedroom${
				  place.number_rooms !== 1 ? "s" : ""
				}</div>
					  <div class="number_bathrooms">${
						place.number_bathrooms
					  } Bathroom${place.number_bathrooms !== 1 ? "s" : ""}</div>
				  </div>
				  <div class="description">
					${place.description}
				  </div>
				  <div class="reviews" data-place="${place.id}">
					<h2></h2>
					<ul></ul>
				  </div>
				</article>`
			  );
			  fetchReviews(place.id);
			});
		  },
		  dataType: "json",
		});
	  }
	  function fetchReviews(placeId) {
		$.getJSON(
		  `${HOST}/api/v1/places/${placeId}/reviews`,
		  (data) => {
			$(`.reviews[data-place="${placeId}"] h2`)
			  .text("test")
			  .html(`${data.length} Reviews <span id="toggle_review">show</span>`);
			$(`.reviews[data-place="${placeId}"] h2 #toggle_review`).bind(
			  "click",
			  { placeId },
			  function (e) {
				const rev = $(`.reviews[data-place="${e.data.placeId}"] ul`);
				if (rev.css("display") === "none") {
				  rev.css("display", "block");
				  data.forEach((rv) => {
					$.getJSON(
					  `${HOST}/api/v1/users/${r.user_id}`,
					  (u) =>
						$(".reviews ul").append(`
					  <li>
						<h3>From ${u.first_name + " " + u.last_name} the ${
						  rv.created_at
						}</h3>
						<p>${r.text}</p>
					  </li>`),
					  "json"
					);
				  });
				} else {
				  rev.css("display", "none");
				}
			  }
			);
		  },
		  "json"
		);
	  }
});
