// Create animated particles in the background
document.addEventListener('DOMContentLoaded', function() {
    const particlesContainer = document.getElementById('particles');
    const numberOfParticles = 20;
    
    for (let i = 0; i < numberOfParticles; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.width = `${Math.random() * 8 + 2}px`;
        particle.style.height = particle.style.width;
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        
        // Different speeds and directions
        particle.style.animationDuration = `${Math.random() * 30 + 10}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        particlesContainer.appendChild(particle);
    }
    
    // Scroll animation for elements
    const animateElements = document.querySelectorAll('.animate-in');
    
    function checkIfInView() {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight - 100 && elementBottom > 0) {
                element.classList.add('show');
            }
        });
    }
    
    // Initially check if elements are in view
    checkIfInView();
    
    // Check again on scroll
    window.addEventListener('scroll', checkIfInView);
    
    // Tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const forms = {
        'cooling-load': document.getElementById('cooling-load-form'),
        'aircon-sizing': document.getElementById('aircon-sizing-form')
    };
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all forms and show the selected one
            for (const key in forms) {
                forms[key].classList.remove('active');
            }
            
            forms[this.dataset.tab].classList.add('active');
        });
    });
    
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('show');
        
        // Change icon
        const icon = this.querySelector('i');
        if (navLinks.classList.contains('show')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Accordion functionality
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', function() {
            // Toggle the current item
            item.classList.toggle('active');
            
            // Optional: Close other items
            accordionItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (navLinks.classList.contains('show')) {
                navLinks.classList.remove('show');
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            }
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Cooling Load Calculator functionality
    const calculateCoolingLoadBtn = document.getElementById('calculate-cooling-load');
    const coolingLoadResult = document.getElementById('cooling-load-result');
    
    calculateCoolingLoadBtn.addEventListener('click', function() {
        // Show loading indicator
        document.getElementById('calculatorLoading').classList.add('show');
        
        // Simulate calculation delay
        setTimeout(() => {
            calculateCoolingLoad();
            document.getElementById('calculatorLoading').classList.remove('show');
        }, 1500);
    });
    
    function calculateCoolingLoad() {
        // Get inputs
        const buildingType = document.getElementById('building-type').value;
        const floorArea = parseFloat(document.getElementById('floor-area').value) || 0;
        const ceilingHeight = parseFloat(document.getElementById('ceiling-height').value) || 0;
        const numOccupants = parseInt(document.getElementById('num-occupants').value) || 0;
        const windowArea = parseFloat(document.getElementById('window-area').value) || 0;
        const windowType = document.getElementById('window-type').value;
        const wallType = document.getElementById('wall-type').value;
        const orientation = document.getElementById('orientation').value;
        const equipmentLoad = parseFloat(document.getElementById('equipment-load').value) || 0;
        const lightingDensity = parseInt(document.getElementById('lighting-density').value) || 0;
        
        // Validation
        if (floorArea === 0 || ceilingHeight === 0) {
            alert('Please enter floor area and ceiling height');
            return;
        }
        
        // Calculate room volume
        const roomVolume = floorArea * ceilingHeight;
        
        // Base cooling load factors (simplified)
        let baseSensibleLoad = 0;
        let baseLatentLoad = 0;
        
        // Different base loads depending on building type (simplified values)
        switch (buildingType) {
            case 'residential':
                baseSensibleLoad = 60; // W/m²
                baseLatentLoad = 20; // W/m²
                break;
            case 'office':
                baseSensibleLoad = 80;
                baseLatentLoad = 25;
                break;
            case 'retail':
                baseSensibleLoad = 90;
                baseLatentLoad = 30;
                break;
            case 'hotel':
                baseSensibleLoad = 70;
                baseLatentLoad = 25;
                break;
            case 'hospital':
                baseSensibleLoad = 85;
                baseLatentLoad = 35;
                break;
            case 'industrial':
                baseSensibleLoad = 100;
                baseLatentLoad = 15;
                break;
        }
        
        // Window factor
        let windowFactor = 1.0;
        switch (windowType) {
            case 'single':
                windowFactor = 1.2;
                break;
            case 'double':
                windowFactor = 0.9;
                break;
            case 'low-e':
                windowFactor = 0.7;
                break;
            case 'tinted':
                windowFactor = 0.8;
                break;
        }
        
        // Wall factor
        let wallFactor = 1.0;
        switch (wallType) {
            case 'concrete':
                wallFactor = 1.0;
                break;
            case 'brick':
                wallFactor = 1.1;
                break;
            case 'lightweight':
                wallFactor = 0.9;
                break;
            case 'insulated':
                wallFactor = 0.7;
                break;
        }
        
        // Orientation factor
        let orientationFactor = 1.0;
        switch (orientation) {
            case 'north':
                orientationFactor = 0.9;
                break;
            case 'south':
                orientationFactor = 1.0;
                break;
            case 'east':
                orientationFactor = 1.1;
                break;
            case 'west':
                orientationFactor = 1.2;
                break;
            case 'northeast':
                orientationFactor = 1.0;
                break;
            case 'northwest':
                orientationFactor = 1.05;
                break;
            case 'southeast':
                orientationFactor = 1.05;
                break;
            case 'southwest':
                orientationFactor = 1.15;
                break;
        }
        
        // Calculate loads
        let sensibleLoad = (baseSensibleLoad * floorArea + 
                          numOccupants * 75 + 
                          windowArea * 250 * windowFactor * orientationFactor + 
                          (floorArea - windowArea) * 15 * wallFactor +
                          equipmentLoad +
                          lightingDensity * floorArea) / 1000; // Convert to kW
        
        let latentLoad = (baseLatentLoad * floorArea + 
                        numOccupants * 55) / 1000; // Convert to kW
        
        // Add safety factor (15%)
        sensibleLoad *= 1.15;
        latentLoad *= 1.15;
        
        const totalLoad = sensibleLoad + latentLoad;
        const requiredCapacity = totalLoad * 0.284; // Convert kW to RT (1 kW = 0.284 RT)
        
        // Display results
        document.getElementById('sensible-load').textContent = sensibleLoad.toFixed(2) + ' kW';
        document.getElementById('latent-load').textContent = latentLoad.toFixed(2) + ' kW';
        document.getElementById('total-load').textContent = totalLoad.toFixed(2) + ' kW';
        document.getElementById('required-capacity').textContent = requiredCapacity.toFixed(2) + ' RT';
        
        // Show result section with animation
        coolingLoadResult.style.display = 'block';
        
        // Generate system recommendations
        generateSystemRecommendations(buildingType, totalLoad, requiredCapacity);
    }
    
    function generateSystemRecommendations(buildingType, totalLoad, requiredCapacity) {
        let recommendationText = '';
        let recommendedBrands = [];
        
        // Generate recommendations based on building type and capacity
        if (buildingType === 'residential') {
            if (requiredCapacity < 2) {
                recommendationText = 'For small residential spaces, we recommend Split System Air Conditioners.';
                recommendedBrands = [
                    { name: 'Daikin', icon: 'fa-snowflake' },
                    { name: 'Mitsubishi Electric', icon: 'fa-snowflake' },
                    { name: 'Panasonic', icon: 'fa-snowflake' }
                ];
            } else if (requiredCapacity < 5) {
                recommendationText = 'For medium-sized residential spaces, we recommend Multi-Split Systems.';
                recommendedBrands = [
                    { name: 'Daikin', icon: 'fa-snowflake' },
                    { name: 'Mitsubishi Electric', icon: 'fa-snowflake' },
                    { name: 'Fujitsu', icon: 'fa-snowflake' }
                ];
            } else {
                recommendationText = 'For large residential spaces, consider VRF/VRV Systems.';
                recommendedBrands = [
                    { name: 'Daikin VRV', icon: 'fa-snowflake' },
                    { name: 'Mitsubishi VRF', icon: 'fa-snowflake' },
                    { name: 'LG Multi V', icon: 'fa-snowflake' }
                ];
            }
        } else if (buildingType === 'office' || buildingType === 'retail') {
            if (requiredCapacity < 10) {
                recommendationText = 'For small commercial spaces, we recommend VRF/VRV Systems.';
                recommendedBrands = [
                    { name: 'Daikin VRV', icon: 'fa-snowflake' },
                    { name: 'Mitsubishi VRF', icon: 'fa-snowflake' },
                    { name: 'Toshiba SMMS', icon: 'fa-snowflake' }
                ];
            } else if (requiredCapacity < 50) {
                recommendationText = 'For medium commercial spaces, consider Air-Cooled Chillers or VRF/VRV Systems.';
                recommendedBrands = [
                    { name: 'Carrier', icon: 'fa-snowflake' },
                    { name: 'Trane', icon: 'fa-snowflake' },
                    { name: 'York', icon: 'fa-snowflake' }
                ];
            } else {
                recommendationText = 'For large commercial spaces, we recommend Water-Cooled Chillers.';
                recommendedBrands = [
                    { name: 'Carrier', icon: 'fa-snowflake' },
                    { name: 'Trane', icon: 'fa-snowflake' },
                    { name: 'York', icon: 'fa-snowflake' },
                    { name: 'Daikin Applied', icon: 'fa-snowflake' }
                ];
            }
        } else if (buildingType === 'hotel' || buildingType === 'hospital') {
            if (requiredCapacity < 20) {
                recommendationText = 'For small facilities, consider VRF/VRV Systems with Heat Recovery.';
                recommendedBrands = [
                    { name: 'Daikin VRV', icon: 'fa-snowflake' },
                    { name: 'Mitsubishi VRF', icon: 'fa-snowflake' },
                    { name: 'LG Multi V', icon: 'fa-snowflake' }
                ];
            } else {
                recommendationText = 'For large facilities, we recommend Water-Cooled Chillers with specialized air handling.';
                recommendedBrands = [
                    { name: 'Carrier', icon: 'fa-snowflake' },
                    { name: 'Trane', icon: 'fa-snowflake' },
                    { name: 'York', icon: 'fa-snowflake' }
                ];
            }
        } else if (buildingType === 'industrial') {
            recommendationText = 'For industrial applications, consider process-specific cooling systems.';
            recommendedBrands = [
                { name: 'Trane', icon: 'fa-industry' },
                { name: 'York', icon: 'fa-industry' },
                { name: 'Carrier', icon: 'fa-industry' }
            ];
        }
        
        // Update the recommendation text
        document.getElementById('system-recommendation').textContent = recommendationText;
        
        // Create brand badges
        const brandContainer = document.getElementById('brand-recommendations');
        brandContainer.innerHTML = '';
        
        recommendedBrands.forEach(brand => {
            const badge = document.createElement('div');
            badge.className = 'brand-badge';
            badge.innerHTML = `<i class="fas ${brand.icon}"></i> ${brand.name}`;
            brandContainer.appendChild(badge);
        });
    }
    
    // Aircon Size Calculator functionality
    const calculateAirconSizeBtn = document.getElementById('calculate-aircon-size');
    const airconSizeResult = document.getElementById('aircon-size-result');
    
    calculateAirconSizeBtn.addEventListener('click', function() {
        // Show loading indicator
        document.getElementById('calculatorLoading').classList.add('show');
        
        // Simulate calculation delay
        setTimeout(() => {
            calculateAirconSize();
            document.getElementById('calculatorLoading').classList.remove('show');
        }, 1500);
    });
    
    function calculateAirconSize() {
        // Get inputs
        const roomType = document.getElementById('room-type').value;
        const roomArea = parseFloat(document.getElementById('room-area').value) || 0;
        const roomHeight = parseFloat(document.getElementById('room-height').value) || 0;
        const windowSize = parseFloat(document.getElementById('window-size').value) || 0;
        const sunExposure = document.getElementById('sun-exposure').value;
        const insulation = document.getElementById('insulation').value;
        const occupants = parseInt(document.getElementById('occupants').value) || 0;
        const appliances = document.getElementById('appliances').value;
        
        // Validation
        if (roomArea === 0 || roomHeight === 0) {
            alert('Please enter room area and height');
            return;
        }
        
        // Base BTU calculation (Singapore specific)
        let baseBTU = roomArea * 600; // Base value for Singapore climate
        
        // Room type adjustment
        let roomTypeFactor = 1.0;
        switch (roomType) {
            case 'bedroom':
                roomTypeFactor = 1.0;
                break;
            case 'living':
                roomTypeFactor = 1.1;
                break;
            case 'dining':
                roomTypeFactor = 1.05;
                break;
            case 'study':
                roomTypeFactor = 1.0;
                break;
            case 'kitchen':
                roomTypeFactor = 1.2;
                break;
            case 'office-room':
                roomTypeFactor = 1.1;
                break;
        }
        
        // Ceiling height adjustment
        const heightFactor = roomHeight > 2.7 ? (roomHeight / 2.7) : 1.0;
        
        // Window adjustment
        const windowFactor = 1.0 + ((windowSize / roomArea) * 0.5);
        
        // Sun exposure adjustment
        let sunFactor = 1.0;
        switch (sunExposure) {
            case 'low':
                sunFactor = 1.0;
                break;
            case 'medium':
                sunFactor = 1.1;
                break;
            case 'high':
                sunFactor = 1.2;
                break;
        }
        
        // Insulation quality
        let insulationFactor = 1.0;
        switch (insulation) {
            case 'poor':
                insulationFactor = 1.2;
                break;
            case 'average':
                insulationFactor = 1.0;
                break;
            case 'good':
                insulationFactor = 0.9;
                break;
            case 'excellent':
                insulationFactor = 0.8;
                break;
        }
        
        // Occupancy adjustment
        const occupancyFactor = 1.0 + (occupants * 0.05);
        
        // Appliances adjustment
        let appliancesFactor = 1.0;
        switch (appliances) {
            case 'low':
                appliancesFactor = 1.0;
                break;
            case 'medium':
                appliancesFactor = 1.1;
                break;
            case 'high':
                appliancesFactor = 1.2;
                break;
        }
        
        // Calculate total BTU required
        let requiredBTU = baseBTU * roomTypeFactor * heightFactor * windowFactor * 
                         sunFactor * insulationFactor * occupancyFactor * appliancesFactor;
        
        // Add 10% safety margin
        requiredBTU *= 1.1;
        
        // Calculate kW and horsepower
        const requiredKW = requiredBTU / 3412; // 1 kW = 3412 BTU/h
        const requiredHP = requiredBTU / 9000; // Approximation: 1 HP ≈ 9000 BTU/h
        
        // Round up to common aircon sizes (in HP)
        let idealSize = requiredHP;
        if (idealSize <= 0.75) idealSize = 0.75;
        else if (idealSize <= 1) idealSize = 1;
        else if (idealSize <= 1.5) idealSize = 1.5;
        else if (idealSize <= 2) idealSize = 2;
        else if (idealSize <= 2.5) idealSize = 2.5;
        else if (idealSize <= 3) idealSize = 3;
        else idealSize = Math.ceil(idealSize);
        
        // Estimate coverage area based on standard sizing
        const coverageArea = (idealSize * 9000) / 600; // Approximate m² based on BTU rule of thumb for Singapore
        
        // Display results
        document.getElementById('required-btu').textContent = Math.round(requiredBTU).toLocaleString() + ' BTU/h';
        document.getElementById('required-kw').textContent = requiredKW.toFixed(2) + ' kW';
        document.getElementById('ideal-size').textContent = idealSize + ' HP';
        document.getElementById('coverage-area').textContent = Math.round(coverageArea) + ' m²';
        
        // Show result section with animation
        airconSizeResult.style.display = 'block';
        
        // Generate aircon type recommendations
        generateAirconRecommendations(roomType, idealSize, sunExposure);
    }
    
    function generateAirconRecommendations(roomType, idealSize, sunExposure) {
        let recommendationText = '';
        let recommendedBrands = [];
        
        if (idealSize <= 1) {
            recommendationText = 'For this space, we recommend a Wall-Mounted Split System Air Conditioner.';
            
            if (roomType === 'bedroom') {
                recommendedBrands = [
                    { name: 'Daikin FTXM Series', icon: 'fa-snowflake' },
                    { name: 'Mitsubishi MSZ-FH Series', icon: 'fa-snowflake' },
                    { name: 'Panasonic ECONAVI Series', icon: 'fa-snowflake' }
                ];
            } else {
                recommendedBrands = [
                    { name: 'Daikin FTKM Series', icon: 'fa-snowflake' },
                    { name: 'Mitsubishi MSY-GN Series', icon: 'fa-snowflake' },
                    { name: 'Samsung AR5000 Series', icon: 'fa-snowflake' }
                ];
            }
        } else if (idealSize <= 2.5) {
            if (roomType === 'living' || roomType === 'office-room') {
                recommendationText = 'For this medium-sized space, we recommend a powerful Wall-Mounted or Ceiling Cassette.';
                recommendedBrands = [
                    { name: 'Daikin FCAG Series Cassette', icon: 'fa-snowflake' },
                    { name: 'Mitsubishi SLZ-KF Cassette', icon: 'fa-snowflake' },
                    { name: 'LG DUAL Inverter', icon: 'fa-snowflake' }
                ];
            } else {
                recommendationText = 'For this space, we recommend a high-capacity Wall-Mounted system.';
                recommendedBrands = [
                    { name: 'Daikin FTKF Series', icon: 'fa-snowflake' },
                    { name: 'Fujitsu ASYG30LFCA', icon: 'fa-snowflake' },
                    { name: 'Panasonic Elite Inverter', icon: 'fa-snowflake' }
                ];
            }
        } else {
            recommendationText = 'For this larger space, consider a Ceiling Cassette, Floor Standing, or Multi-Split system.';
            recommendedBrands = [
                { name: 'Daikin VRV System', icon: 'fa-snowflake' },
                { name: 'Mitsubishi MXZ Multi-Split', icon: 'fa-snowflake' },
                { name: 'LG Floor Standing', icon: 'fa-snowflake' },
                { name: 'Toshiba Cassette', icon: 'fa-snowflake' }
            ];
        }
        
        // Add energy efficiency recommendations
        if (sunExposure === 'high') {
            recommendationText += ' Due to high sun exposure, we recommend models with high EER/COP ratings and inverter technology for better energy efficiency.';
        }
        
        // Update the recommendation text
        document.getElementById('aircon-recommendation').textContent = recommendationText;
        
        // Create brand badges
        const brandContainer = document.getElementById('aircon-brand-recommendations');
        brandContainer.innerHTML = '';
        
        recommendedBrands.forEach(brand => {
            const badge = document.createElement('div');
            badge.className = 'brand-badge';
            badge.innerHTML = `<i class="fas ${brand.icon}"></i> ${brand.name}`;
            brandContainer.appendChild(badge);
        });
    }
});