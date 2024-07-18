document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const mainContent = document.getElementById('main-content');
    const homeBtn = document.getElementById('home-btn');
    const aboutBtn = document.getElementById('about-btn');
    const carsBtn = document.getElementById('cars-btn');
    const contactBtn = document.getElementById('contact-btn');
    const themeToggle = document.getElementById('theme-toggle');

    // Event Listeners
    homeBtn.addEventListener('click', showHome);
    aboutBtn.addEventListener('click', showAbout);
    carsBtn.addEventListener('click', showCars);
    contactBtn.addEventListener('click', showContact);
    themeToggle.addEventListener('click', toggleTheme);

    // Functions
    function showHome() {
        mainContent.innerHTML = `
            <div class="home-container">
                <div class="home-text">
                    <h2>Welcome to Blue Star Car Rental</h2>
                    <p>Welcome here, where the road is your playground and adventure awaits at every turn. With a passion for cars and a love for exploration, we bring you the ultimate car rental experience. Founded on the belief that every journey should be extraordinary, Blue Star is not just a car rental company; it's a gateway to unforgettable memories and thrilling escapades. Join us in creating moments that will last a lifetime. At Blue Star, we value freedom, excitement, and the joy of discovery. Our commitment to excellence ensures that your car rental experience is seamless, exhilarating, and filled with endless possibilities.</p>
                </div>
                <div class="login-form">
                    <h2>Login or Sign Up</h2>
                    <form id="login-form">
                        <input type="email" id="email" placeholder="Email" required>
                        <input type="password" id="password" placeholder="Password" required>
                        <button type="submit">Login</button>
                    </form>
                    <p>Don't have an account? <a href="#">Sign Up</a></p>
                </div>
            </div>
        `;
    }

    function showAbout() {
        mainContent.innerHTML = `
            <h2>About Bluestar Car Rentals</h2>
            <p>Welcome to Bluestar Car Rentals, your premier destination for hassle-free and reliable car rentals. Whether you're traveling for business or pleasure, we are committed to providing you with top-quality vehicles and exceptional customer service.</p>
            <p>Our Mission:</p>
            <p>At Bluestar Car Rentals, our mission is to simplify your travel experience by offering a wide range of vehicles to suit every need and budget. From compact cars for city exploring to spacious SUVs for family adventures, we've got you covered.</p>
            <p>Why Choose Us?</p>
            <p>Wide Selection: Choose from a diverse fleet of well-maintained vehicles, including sedans, SUVs, and more. Competitive Pricing: Enjoy competitive rates and transparent pricing with no hidden fees. Convenience: Book online effortlessly and manage your reservations from the comfort of your home. Focus: Our dedicated team is here to ensure your rental experience is seamless and enjoyable. Contact Us: Have questions or ready to book your next rental? Get in touch with our friendly team today! Location Bluestar Car Rentals is conveniently located [mention your location or service area]. Experience the difference with Bluestar Car Rentals. Start your journey with us today</p>
        `;
    }

    async function showCars() {
        try {
            const response = await fetch('https://freetestapi.com/api/v1/cars');
            const cars = await response.json();

            const carList = cars.map(car => `
                <div class="car-card" id="car-${car.id}">
                    <img src="${car.image}" alt="${car.model}">
                    <h3>${car.make}</h3>
                    <p>Price: $${car.price}/day</p>
                    <button onclick="initiateBooking(${car.id}, ${car.fuelType}, '${car.mileage}', ${car.price})">
                        Book Now
                    </button>
                </div>
            `).join('');

            mainContent.innerHTML = `<h2>Our Cars</h2><div class="car-list">${carList}</div>`;
        } catch (error) {
            console.error('Error fetching cars:', error);
            mainContent.innerHTML = '<p>Error loading cars. Please try again later.</p>';
        }
    }

    function showContact() {
        mainContent.innerHTML = `
            <h2>Contact Us</h2>
            <form id="contact-form">
                <input id="input" type="text" placeholder="Name" required>
                <br>
                <input id="input" type="email" placeholder="Email" required>
                <br>
                <textarea id="input" placeholder="Reach out / Comment" required></textarea>
                <br>
                <button id="send-btn" type="submit">Send</button>
            </form>
        `;
        document.getElementById('contact-form').addEventListener('submit', handleContactSubmit);
    }

    function handleContactSubmit(event) {
        event.preventDefault();
        alert('Thank you for your message. We will get back to you soon!');
        event.target.reset();
    }

    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
    }

    // Initial load
    showHome();
});

function initiateBooking(carId, availability, carTitle, pricePerDay) {
    const carCard = document.getElementById(`car-${carId}`);

    carCard.innerHTML += `
        <div id="booking-form-${carId}">
            <label for="start-datetime-${carId}">Start Date and Time:</label>
            <input type="datetime-local" id="start-datetime-${carId}" class="datetime-picker" required>
            <label for="end-datetime-${carId}">End Date and Time:</label>
            <input type="datetime-local" id="end-datetime-${carId}" class="datetime-picker" required>
            <button onclick="bookCar(${carId}, '${carTitle}', ${pricePerDay})">Confirm Booking</button>
        </div>
    `;

    const datetimePickers = carCard.querySelectorAll('.datetime-picker');
    const now = new Date();
    const nowFormatted = now.toISOString().slice(0, 16);
    datetimePickers.forEach(picker => picker.min = nowFormatted);
}

async function bookCar(carId, carTitle, pricePerDay) {
    const startDatetimeInput = document.getElementById(`start-datetime-${carId}`);
    const endDatetimeInput = document.getElementById(`end-datetime-${carId}`);

    const startDatetime = new Date(startDatetimeInput.value);
    const endDatetime = new Date(endDatetimeInput.value);

    // Validation
    if (!startDatetimeInput.value || !endDatetimeInput.value) {
        alert('Please fill in both Start Date and End Date.');
        return;
    }

    if (endDatetime <= startDatetime) {
        alert('End Date and Time must be after Start Date and Time.');
        return;
    }

    const totalHours = (endDatetime - startDatetime) / (1000 * 60 * 60);
    const totalDays = Math.ceil(totalHours / 24); // Round up to the nearest day
    const totalCost = pricePerDay * totalDays;

    alert(`You've successfully booked the ${carTitle}!\n\nBooking Details:\nFrom: ${startDatetime.toLocaleString()}\nTo: ${endDatetime.toLocaleString()}\nNumber of days: ${totalDays}\nCost per day: $${pricePerDay}\nTotal cost: $${totalCost.toFixed(2)}`);
}
