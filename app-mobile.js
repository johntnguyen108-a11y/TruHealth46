let currentProvider=null,selectedDate=null,selectedTime=null,callTimer=0,callInterval=null,searchFilters={},aiContext={state:0,data:{}},analyzedBills=[];

// Scroll helper function for phone frame compatibility
function scrollToTop(){window.scrollTo(0,0);const appDiv=document.getElementById('app');if(appDiv)appDiv.scrollTop=0;}

// Appointments tracking
let bookedAppointments = [];

// Bills tracking
let disputedBillIds = [];

// User Profile System
let userProfile = {
    fullName: '',
    dateOfBirth: '',
    address: '',
    phone: '',
    insuranceProvider: '',
    profileComplete: false
};

// 5 Insurance Providers
const insuranceProviders = [
    'BlueCross BlueShield',
    'UnitedHealthcare',
    'Aetna',
    'Cigna',
    'Humana'
];

// Load profile from localStorage
try {
    const saved = localStorage.getItem('truhealth_profile');
    if (saved) {
        userProfile = JSON.parse(saved);
    }
} catch(e) {
    console.log('No saved profile');
}

// Save profile to localStorage
function saveUserProfile() {
    try {
        localStorage.setItem('truhealth_profile', JSON.stringify(userProfile));
    } catch(e) {
        console.log('Could not save profile');
    }
}

const pages={home:`<div class="header"><h1>TruHealth</h1><p>100% Transparent Healthcare</p></div><div class="features"><button class="edit-profile-btn" onclick="showProfile()">👤 ${userProfile.profileComplete ? '✓ ' : ''}Edit Profile</button><div class="feature-card" onclick="showPage('search')"><div class="feature-icon" style="background:linear-gradient(135deg,#1e88e5 0%,#1565c0 100%);">🔍</div><h3>Find Care</h3><p>Search for healthcare providers</p></div><button class="view-appointments-btn" onclick="viewAllAppointments()" style="background:linear-gradient(135deg,#1e88e5 0%,#1565c0 100%);color:white;border:none;padding:14px 24px;border-radius:12px;font-size:16px;font-weight:600;cursor:pointer;box-shadow:0 4px 16px rgba(30,136,229,0.3);margin-bottom:16px;width:100%;transition:all 0.35s cubic-bezier(0.4,0,0.2,1);">📅 View My Appointments (<span id="homeApptCount">0</span>)</button><div class="feature-card" onclick="showPage('chatbot')"><div class="feature-icon" style="background:linear-gradient(135deg,#43a047 0%,#2e7d32 100%);">💬</div><h3>AI Health Assistant</h3><p>Get instant help with symptoms</p></div><div class="feature-card" onclick="showPage('bills')"><div class="feature-icon" style="background:linear-gradient(135deg,#1e88e5 0%,#43a047 100%);">📄</div><h3>Bill Analyzer</h3><p>Find errors in medical bills</p></div><button class="view-appointments-btn" onclick="viewAllBills()" style="background:linear-gradient(135deg,#1e88e5 0%,#43a047 100%);color:white;border:none;padding:14px 24px;border-radius:12px;font-size:16px;font-weight:600;cursor:pointer;box-shadow:0 4px 16px rgba(30,136,229,0.3);margin-bottom:16px;width:100%;transition:all 0.35s cubic-bezier(0.4,0,0.2,1);">📋 View Bill History (<span id="homeBillCount">0</span>)</button><div class="feature-card" onclick="showPage('premium')"><div class="feature-icon" style="background:linear-gradient(135deg,#ffd700 0%,#ffa000 100%);">⭐</div><h3>Premium Plan</h3><p>Unlock advanced features</p></div></div>`,
search:`<div class="page-header"><button class="back-btn" onclick="showPage('home')">← Back</button><h2>Find Care</h2></div><div class="page-content"><button class="edit-profile-btn" onclick="showProfile()">👤 ${userProfile.profileComplete ? '✓ ' : ''}Edit Profile</button><button class="view-appointments-btn" onclick="viewAllAppointments()" style="background:linear-gradient(135deg,#1e88e5 0%,#1565c0 100%);color:white;border:none;padding:14px 24px;border-radius:12px;font-size:16px;font-weight:600;cursor:pointer;box-shadow:0 4px 16px rgba(30,136,229,0.3);margin-bottom:16px;width:100%;transition:all 0.35s cubic-bezier(0.4,0,0.2,1);">📅 View My Appointments (<span id="searchApptCount">0</span>)</button><div class="search-section"><h3 style="font-size:18px;margin-bottom:12px;">Find Providers</h3><div class="input-group"><label>Type of Care</label><select id="specialtySelect"><option value="">Select specialty</option><option value="chiropractic">Chiropractic Care</option><option value="family">Family Medicine</option><option value="therapy">Therapy/Counseling</option><option value="orthodontist">Orthodontist</option><option value="dentist">Dentist</option><option value="optometrist">Optometrist</option></select></div><input type="text" class="search-input" placeholder="Enter ZIP" id="zipInput"></div><div class="filter-section"><h4>Experience Level</h4><div class="filter-chips"><div class="chip" onclick="toggleFilter(this,'experience')">All Levels</div><div class="chip" onclick="toggleFilter(this,'experience')">5+ Years</div><div class="chip" onclick="toggleFilter(this,'experience')">10+ Years</div><div class="chip" onclick="toggleFilter(this,'experience')">15+ Years</div></div></div><div class="filter-section"><h4>Price Range</h4><div class="filter-chips"><div class="chip" onclick="toggleFilter(this,'price')">Any Price</div><div class="chip" onclick="toggleFilter(this,'price')">Under $50</div><div class="chip" onclick="toggleFilter(this,'price')">$50-$100</div><div class="chip" onclick="toggleFilter(this,'price')">$100+</div></div></div><div class="filter-section"><h4>Distance</h4><div class="filter-chips"><div class="chip" onclick="toggleFilter(this,'distance')">Any distance</div><div class="chip" onclick="toggleFilter(this,'distance')">Within 5 miles</div><div class="chip" onclick="toggleFilter(this,'distance')">Within 10 miles</div></div></div><div class="filter-section"><h4>Availability</h4><div class="filter-chips"><div class="chip" onclick="toggleFilter(this,'availability')">Any Time</div><div class="chip" onclick="toggleFilter(this,'availability')">Same Day</div><div class="chip" onclick="toggleFilter(this,'availability')">Next Day</div><div class="chip" onclick="toggleFilter(this,'availability')">This Week</div></div></div><button class="btn-primary" onclick="searchProviders()">Search Providers</button><div id="providerResults" style="margin-top:20px;display:none;"></div><div id="noResults" class="no-results"><div style="font-size:64px;margin-bottom:16px;">🔍</div><h3>Ready to find care?</h3><p>Select specialty and search</p></div></div>`,
chatbot:`<div class="page-header"><button class="back-btn" onclick="showPage('home')">← Back</button><h2>AI Assistant</h2></div><div class="page-content" style="padding:0;height:100vh;overflow:hidden;"><div class="chat-container" id="chatContainer"><div class="message ai"><div class="message-bubble">Hello! I'm your AI health assistant. What symptoms are you experiencing today?<div class="symptom-chips"><div class="symptom-chip" onclick="selectSymptom('fever')">🌡️ Fever</div><div class="symptom-chip" onclick="selectSymptom('headache')">🤕 Headache</div><div class="symptom-chip" onclick="selectSymptom('nausea')">🤢 Nausea</div><div class="symptom-chip" onclick="selectSymptom('cough')">🤧 Cough</div><div class="symptom-chip" onclick="selectSymptom('sore throat')">😷 Sore Throat</div></div></div></div></div></div><button class="chat-with-doctor-btn" onclick="showCallScreen()">📞 Call Doctor</button><div class="chat-input-container"><input type="text" class="chat-input" id="chatInput" placeholder="Describe symptoms..." onkeypress="if(event.key==='Enter')sendMessage()"><button class="send-btn" onclick="sendMessage()">→</button></div><div class="call-doctor-screen" id="callScreen"><div class="page-header"><button class="back-btn" onclick="hideCallScreen()">← Back</button><h2>Talk to Doctor</h2></div><div class="page-content" id="careTypeContent" style="padding-top:90px;padding-left:20px;padding-right:20px;"><h2 style="margin-bottom:24px;font-size:22px;">What type of care do you need?</h2><div class="call-option" onclick="selectCareType('general')"><h3>🩺 General Health</h3><p style="color:#86868b;">Common symptoms, preventive care</p></div><div class="call-option" onclick="selectCareType('urgent')"><h3>🚑 Urgent Care</h3><p style="color:#86868b;">Immediate concerns, injuries</p></div></div><div class="page-content" id="providerSelectContent" style="display:none;padding-top:90px;padding-left:20px;padding-right:20px;"><h2 style="margin-bottom:24px;font-size:22px;">Select a Doctor</h2><div id="doctorList"></div></div><div class="page-content" id="connectionTypeContent" style="display:none;padding-top:90px;padding-left:20px;padding-right:20px;"><h2 style="margin-bottom:24px;font-size:22px;">How would you like to connect?</h2><div class="call-option" onclick="initiateCall()"><h3>📞 Voice Call</h3><p style="color:#86868b;">Talk with professional</p></div><div class="call-option" onclick="initiateChat()"><h3>💬 Text Chat</h3><p style="color:#86868b;">Message with professional</p></div></div><div class="call-loading" id="callLoading"><div class="loading-spinner"></div><h3>Connecting...</h3></div><div class="call-screen" id="activeCall"><div><div class="caller-avatar" id="callAvatar">👨‍⚕️</div><h2 style="font-size:26px;margin-bottom:8px;" id="callDoctorName">Dr. Sarah Mitchell</h2><p class="call-duration" id="callTimer">00:00</p></div><button class="end-call-btn" onclick="endCall()">📞</button></div><div class="chat-screen" id="activeChat"><div class="page-header" style="border-bottom:none;"><button class="back-btn" onclick="endChat()">← End</button><h2 id="chatDoctorName">Dr. Sarah Mitchell</h2></div><div class="chat-messages" id="doctorChatMessages"><div class="imessage-bubble doctor">Hello! I'm <span id="chatDoctorGreeting">Dr. Sarah Mitchell</span>. What can I help you with?</div></div><div class="chat-input-container"><input type="text" class="chat-input" id="doctorChatInput" placeholder="iMessage" onkeypress="if(event.key==='Enter')sendDoctorMessage()"><button class="send-btn" onclick="sendDoctorMessage()">→</button></div></div></div>`,
bills:`<div class="page-header"><button class="back-btn" onclick="showPage('home')">← Back</button><h2>Bill Analyzer</h2></div><div class="page-content"><div id="uploadSection"><button class="view-history-btn" onclick="viewAllBills()">📋 View Bill History (<span id="billCount">0</span>)</button><div class="upload-area" onclick="analyzeBill()"><div style="font-size:56px;margin-bottom:16px;">📤</div><h3>Upload Medical Bill</h3><p>Tap to upload bill</p><p style="margin-top:8px;font-size:13px;color:#86868b;">PDF, JPG, or PNG</p></div><div class="how-it-works"><h3>How it works</h3><div class="step-item"><div class="step-number">1</div><div class="step-content"><h4>Upload your bill</h4><p>We scan for errors and overcharges</p></div></div><div class="step-item"><div class="step-number">2</div><div class="step-content"><h4>We dispute on your behalf</h4><p>Our team contacts providers and insurance</p></div></div><div class="step-item"><div class="step-number">3</div><div class="step-content"><h4>You save money</h4><p>Get updates and see your savings grow</p></div></div></div></div><div id="scanningSection" style="display:none;"><div class="scanning-animation"><div style="font-size:56px;margin-bottom:16px;">🔍</div><h3>Analyzing Bill...</h3><div class="scanner-bar"></div></div></div><div id="analysisSection" style="display:none;"></div></div>`,
premium:`<div class="page-header"><button class="back-btn" onclick="showPage('home')">← Back</button><h2>Premium Plans</h2></div><div class="page-content"><h2 style="font-size:24px;margin-bottom:8px;">Upgrade to Premium</h2><p style="color:#86868b;margin-bottom:24px;">Get the most out of TruHealth</p><div class="plan-card"><h3>Free Plan</h3><div style="font-size:36px;font-weight:700;color:#1e88e5;margin:10px 0;">$0<span style="font-size:16px;color:#86868b;">/month</span></div><div style="margin:20px 0;"><p style="margin:8px 0;">✓ Basic provider search</p><p style="margin:8px 0;">✓ AI health assistant</p><p style="margin:8px 0;">✓ Bill error detection</p><p style="margin:8px 0;color:#86868b;">✗ In-depth search filters</p><p style="margin:8px 0;color:#86868b;">✗ Advanced AI diagnostics</p></div><button class="btn-primary" style="background:#e5e5e7;color:#86868b;" disabled>Current Plan</button></div><div class="plan-card popular"><div class="popular-badge">Most Popular</div><h3>Premium - Yearly</h3><div style="font-size:36px;font-weight:700;color:#1e88e5;margin:10px 0;">$50<span style="font-size:16px;color:#86868b;">/year</span></div><p style="color:#43a047;font-size:13px;font-weight:600;margin-bottom:16px;">Save $10 compared to monthly!</p><div style="margin:20px 0;"><p style="margin:8px 0;">✓ In-depth search options</p><p style="margin:8px 0;">✓ Advanced AI support</p><p style="margin:8px 0;">✓ Detailed bill analyzing</p><p style="margin:8px 0;">✓ Priority booking</p><p style="margin:8px 0;">✓ 24/7 live chat support</p><p style="margin:8px 0;">✓ Prescription discounts (up to 80%)</p></div><button class="btn-primary" onclick="alert('Subscribed to Yearly Premium!')">Subscribe - $50/year</button></div><div class="plan-card"><h3>Premium - Monthly</h3><div style="font-size:36px;font-weight:700;color:#1e88e5;margin:10px 0;">$4.99<span style="font-size:16px;color:#86868b;">/month</span></div><div style="margin:20px 0;"><p style="margin:8px 0;">✓ All Premium features</p><p style="margin:8px 0;font-size:13px;color:#86868b;">Same benefits as yearly</p></div><button class="btn-primary" onclick="alert('Subscribed to Monthly Premium!')">Subscribe - $4.99/month</button></div></div>`};
function showPage(p){const container=document.getElementById('appContainer');container.style.opacity='0';container.style.transform='translateY(10px)';setTimeout(()=>{container.innerHTML=`<div class="feature-page active">${pages[p]||pages.home}</div>`;document.querySelectorAll('.nav-item').forEach(x=>x.classList.remove('active'));const n=document.querySelectorAll('.nav-item');if(p==='home')n[0].classList.add('active');if(p==='search')n[1].classList.add('active');if(p==='chatbot')n[2].classList.add('active');if(p==='bills')n[3].classList.add('active');if(p==='premium')n[4].classList.add('active');scrollToTop();const chatInput=document.querySelector('.chat-input-container');const callBtn=document.querySelector('.chat-with-doctor-btn');if(chatInput)chatInput.style.display=p==='chatbot'?'flex':'none';if(callBtn)callBtn.style.display=p==='chatbot'?'block':'none';container.style.transition='all 0.3s ease';container.style.opacity='1';container.style.transform='translateY(0)';updateAppointmentCounts();updateBillCounts();},150);}
function toggleFilter(chip,cat){chip.parentElement.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));chip.classList.add('active');searchFilters[cat]=chip.textContent.trim();}
function searchProviders(){const spec=document.getElementById('specialtySelect').value,zip=document.getElementById('zipInput').value;if(!spec||!zip){alert('Select specialty & ZIP');return;}let providers;if(spec==='chiropractic')providers=[...chiropractors];else if(spec==='therapy')providers=[...therapists];else if(spec==='family')providers=[...familyDoctors];else if(spec==='orthodontist')providers=[...orthodontists];else if(spec==='dentist')providers=[...dentists];else if(spec==='optometrist')providers=[...optometrists];if(userProfile.insuranceProvider){providers.sort((a,b)=>{const aMatch=a.acceptedInsurance&&a.acceptedInsurance.includes(userProfile.insuranceProvider);const bMatch=b.acceptedInsurance&&b.acceptedInsurance.includes(userProfile.insuranceProvider);if(aMatch&&!bMatch)return -1;if(!aMatch&&bMatch)return 1;return 0;});}displayResults(providers);}
function displayResults(providers){const res=document.getElementById('providerResults'),noRes=document.getElementById('noResults');noRes.style.display='none';res.style.display='block';res.innerHTML=providers.map(p=>{let insuranceBadge='';if(userProfile.insuranceProvider){const isCompatible=p.acceptedInsurance&&p.acceptedInsurance.includes(userProfile.insuranceProvider);if(isCompatible){insuranceBadge=`<div class="insurance-badge compatible">✓ ${userProfile.insuranceProvider}</div>`;}else{insuranceBadge=`<div class="insurance-badge not-compatible">⚠️ Insurance Not Accepted</div>`;}}return `<div class="provider-card" onclick="viewProfile(${p.id},'${p.specialty}')"><div class="provider-avatar" style="background:${p.gradient}">${p.avatar}</div><div class="provider-details"><h4>${p.name}</h4><p style="color:#86868b;font-size:15px;margin-bottom:6px;">${p.specialtyName} • ${p.distance}mi</p>${insuranceBadge}<div style="margin:6px 0;"><span class="rating">${'★'.repeat(Math.floor(p.rating))} ${p.rating}</span></div><div style="font-size:15px;"><span>${p.availability==='same-day'?'Same Day':'Next Day'}</span> • <span style="font-weight:600;">$${p.price}</span></div></div></div>`;}).join('');}
function viewProfile(id,spec){let providers;if(spec==='chiropractic')providers=chiropractors;else if(spec==='therapy')providers=therapists;else if(spec==='family')providers=familyDoctors;else if(spec==='orthodontist')providers=orthodontists;else if(spec==='dentist')providers=dentists;else if(spec==='optometrist')providers=optometrists;let p=providers.find(x=>x.id===id);if(!p)return;currentProvider=p;document.getElementById('appContainer').innerHTML=`<div class="feature-page active"><div class="page-header"><button class="back-btn" onclick="showPage('search')">← Back</button><h2>Provider</h2></div><div class="page-content"><div style="background:white;padding:28px 20px;text-align:center;border-bottom:1px solid #e5e5e7;"><div style="width:110px;height:110px;border-radius:55px;font-size:56px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;background:${p.gradient}">${p.avatar}</div><h2 style="font-size:24px;margin-bottom:6px;">${p.name}</h2><p style="color:#86868b;margin-bottom:10px;font-size:16px;">${p.specialtyName}</p><div style="font-size:17px;margin-bottom:10px;"><span class="rating">${'★'.repeat(Math.floor(p.rating))} ${p.rating}</span> <span style="color:#86868b;">(${p.reviews} reviews)</span></div><span style="background:#34c759;color:white;padding:8px 14px;border-radius:12px;font-size:14px;">${p.insurance}</span></div><div class="profile-section"><h3>About</h3><p style="line-height:1.7;font-size:16px;">${p.about}</p></div><div class="profile-section"><h3>Credentials</h3><p style="margin:6px 0;font-size:15px;"><strong>School:</strong> ${p.medicalSchool}</p><p style="margin:6px 0;font-size:15px;"><strong>Board Cert:</strong> ${p.boardCert}</p><p style="margin:6px 0;font-size:15px;"><strong>Experience:</strong> ${p.experience} years</p></div><div class="profile-section"><h3>Professional Reviews</h3>${p.professionalReviews.map(r=>`<div class="review-card"><div style="display:flex;justify-content:space-between;margin-bottom:8px;"><strong style="font-size:15px;">${r.reviewer}</strong><span style="color:#86868b;font-size:13px;">${r.date}</span></div><div class="rating">${'★'.repeat(r.rating)}</div><p class="review-text">${r.text}</p></div>`).join('')}</div><button class="book-button" onclick="showBooking()">Book Appointment</button><button class="report-button" onclick="showReport()">Report Doctor</button></div></div>`;scrollToTop();}
function showBooking(){document.getElementById('appContainer').innerHTML=`<div class="feature-page active"><div class="page-header"><button class="back-btn" onclick="viewProfile(${currentProvider.id},'${currentProvider.specialty}')">← Back</button><h2>Book Appointment</h2></div><div class="page-content" style="padding-bottom:100px;"><h2 style="font-size:22px;margin-bottom:8px;">${currentProvider.name}</h2><p style="color:#86868b;margin-bottom:24px;font-size:15px;">Schedule your appointment</p><div class="booking-section"><h3>Select Date</h3><div style="display:flex;justify-content:space-between;margin-bottom:12px;font-size:12px;font-weight:600;color:#86868b;"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div><div class="date-grid" id="dateGrid"></div></div><div class="booking-section"><h3>Select Time</h3><div id="timeSlots"><div class="time-slot" onclick="selectTime(this)">9:00 AM</div><div class="time-slot" onclick="selectTime(this)">10:30 AM</div><div class="time-slot" onclick="selectTime(this)">1:00 PM</div><div class="time-slot" onclick="selectTime(this)">2:30 PM</div><div class="time-slot" onclick="selectTime(this)">4:00 PM</div></div></div><div class="booking-section"><h3>Reason for Visit</h3><textarea id="reasonText" style="width:100%;padding:14px;border:1px solid #e5e5e7;border-radius:10px;font-size:16px;min-height:100px;font-family:inherit;" placeholder="Describe your symptoms or reason for visit..."></textarea></div><button class="btn-primary" style="margin:20px 0;" onclick="confirmBooking()">Confirm Appointment</button></div></div>`;generateDates();scrollToTop();}
function generateDates(){const grid=document.getElementById('dateGrid'),today=new Date();const days=['S','M','T','W','T','F','S'];let html='';for(let i=0;i<14;i++){const date=new Date(today);date.setDate(today.getDate()+i);const dayLetter=days[date.getDay()];html+=`<div class="date-cell ${i===0?'disabled':''}" onclick="selectDate(this,'${date.toISOString()}')"><div style="font-size:10px;color:#86868b;">${dayLetter}</div><div style="font-weight:600;font-size:16px;">${date.getDate()}</div></div>`;}grid.innerHTML=html;}
function selectDate(cell,dateStr){if(cell.classList.contains('disabled'))return;document.querySelectorAll('.date-cell').forEach(c=>c.classList.remove('selected'));cell.classList.add('selected');selectedDate=dateStr;}
function selectTime(slot){document.querySelectorAll('.time-slot').forEach(s=>s.classList.remove('selected'));slot.classList.add('selected');selectedTime=slot.textContent;}
function confirmBooking(){if(!selectedDate||!selectedTime){alert('Please select date and time');return;}const reason=document.getElementById('reasonText').value;if(!reason){alert('Please describe your reason');return;}const apptDate=new Date(selectedDate);const appointment={id:Date.now(),provider:currentProvider.name,providerAvatar:currentProvider.avatar,providerGradient:currentProvider.gradient,specialty:currentProvider.specialtyName,date:apptDate.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'}),time:selectedTime,reason:reason,address:currentProvider.address};bookedAppointments.push(appointment);updateAppointmentCounts();document.getElementById('appContainer').innerHTML=`<div class="feature-page active"><div class="page-header"><button class="back-btn" onclick="showPage('search')">← Back</button><h2>Confirmed</h2></div><div class="page-content"><div style="text-align:center;padding:60px 20px;animation:fadeIn 0.5s;"><div style="font-size:90px;margin-bottom:24px;">✅</div><h2 style="font-size:30px;margin-bottom:18px;color:#43a047;">Appointment Confirmed!</h2><div style="background:white;border-radius:16px;padding:26px;margin:28px 0;text-align:left;box-shadow:0 2px 8px rgba(0,0,0,0.1);"><h3 style="font-size:19px;margin-bottom:18px;color:#1d1d1f;">Appointment Details</h3><div style="padding:14px 0;border-bottom:1px solid #f5f5f7;"><strong style="font-size:15px;">Provider:</strong><br><span style="font-size:16px;">${currentProvider.name}</span></div><div style="padding:14px 0;border-bottom:1px solid #f5f5f7;"><strong style="font-size:15px;">Date:</strong><br><span style="font-size:16px;">${appointment.date}</span></div><div style="padding:14px 0;border-bottom:1px solid #f5f5f7;"><strong style="font-size:15px;">Time:</strong><br><span style="font-size:16px;">${selectedTime}</span></div><div style="padding:14px 0;border-bottom:1px solid #f5f5f7;"><strong style="font-size:15px;">Location:</strong><br><span style="font-size:16px;">${currentProvider.address}</span></div><div style="padding:14px 0;"><strong style="font-size:15px;">Reason:</strong><br><span style="font-size:16px;">${reason}</span></div></div><p style="color:#86868b;margin-bottom:28px;font-size:15px;">A confirmation email has been sent.</p><button class="view-appointments-btn" onclick="viewAllAppointments()" style="background:linear-gradient(135deg,#1e88e5 0%,#1565c0 100%);color:white;border:none;padding:14px 24px;border-radius:12px;font-size:16px;font-weight:600;cursor:pointer;box-shadow:0 4px 16px rgba(30,136,229,0.3);margin-bottom:12px;width:100%;transition:all 0.35s cubic-bezier(0.4,0,0.2,1);">📅 View All Appointments (${bookedAppointments.length})</button><button class="btn-primary" onclick="showPage('search')">Back to Search</button></div></div></div>`;scrollToTop();}
function showReport(){document.getElementById('appContainer').innerHTML=`<div class="feature-page active"><div class="page-header"><button class="back-btn" onclick="viewProfile(${currentProvider.id},'${currentProvider.specialty}')">← Back</button><h2>Report Doctor</h2></div><div class="page-content"><h2 style="font-size:22px;margin-bottom:16px;">Report ${currentProvider.name}</h2><p style="color:#86868b;margin-bottom:20px;font-size:15px;line-height:1.6;">Please describe what happened and why you're filing this report.</p><div class="booking-section"><h3>Describe the Issue</h3><textarea id="reportText" style="width:100%;padding:14px;border:1px solid #e5e5e7;border-radius:10px;font-size:16px;min-height:200px;font-family:inherit;" placeholder="Please provide details..."></textarea></div><button class="btn-primary" onclick="submitReport()">Submit Report</button></div></div>`;scrollToTop();}
function submitReport(){const txt=document.getElementById('reportText').value;if(!txt||txt.length<20){alert('Please provide more details');return;}document.getElementById('appContainer').innerHTML=`<div class="feature-page active"><div class="page-header"><button class="back-btn" onclick="showPage('search')">← Back</button><h2>Processing</h2></div><div class="page-content"><div class="scanning-animation"><div style="font-size:56px;margin-bottom:20px;">⏳</div><h3>Processing Report...</h3><div class="scanner-bar"></div></div></div></div>`;setTimeout(()=>{document.getElementById('appContainer').innerHTML=`<div class="feature-page active"><div class="page-header"><button class="back-btn" onclick="showPage('search')">← Back</button><h2>Received</h2></div><div class="page-content"><div style="text-align:center;padding:60px 20px;animation:fadeIn 0.5s;"><div style="font-size:80px;margin-bottom:24px;">✅</div><h2 style="font-size:26px;margin-bottom:18px;">Thank You</h2><p style="font-size:16px;color:#86868b;line-height:1.7;margin-bottom:28px;">Your report has been received. TruHealth will review and take necessary action.</p><p style="font-size:15px;color:#86868b;font-family:monospace;background:#f5f5f7;padding:12px;border-radius:8px;">Report ID: ${Math.random().toString(36).substr(2,9).toUpperCase()}</p><button class="btn-primary" onclick="showPage('search')" style="margin-top:28px;">Back to Search</button></div></div></div>`;scrollToTop();},2000);}
function selectSymptom(symptom){aiContext={state:1,data:{symptom}};addMsg(`I have a ${symptom}`,'user');setTimeout(()=>{if(symptom==='fever')addMsg("I understand you have a fever.<br><br><strong>When did your fever start?</strong>",'ai');else if(symptom==='headache')addMsg("I'll help with your headache.<br><br><strong>When did it start?</strong>",'ai');else if(symptom==='nausea')addMsg("I can help with nausea.<br><br><strong>When did it start?</strong>",'ai');else if(symptom==='cough')addMsg("Let me help with your cough.<br><br><strong>When did it start?</strong>",'ai');else addMsg("I'll help with your sore throat.<br><br><strong>When did it start?</strong>",'ai');},800);}
function sendMessage(){const inp=document.getElementById('chatInput'),msg=inp.value.trim();if(!msg)return;addMsg(msg,'user');inp.value='';setTimeout(()=>{processAIResponse(msg.toLowerCase());},800);}
function processAIResponse(msg){if(aiContext.state===0){if(msg.includes('fever'))aiContext={state:1,data:{symptom:'fever'}};else if(msg.includes('headache'))aiContext={state:1,data:{symptom:'headache'}};else if(msg.includes('nausea'))aiContext={state:1,data:{symptom:'nausea'}};else if(msg.includes('cough'))aiContext={state:1,data:{symptom:'cough'}};else if(msg.includes('throat'))aiContext={state:1,data:{symptom:'sore throat'}};if(aiContext.state===1){if(aiContext.data.symptom==='fever')addMsg("When did your fever start?",'ai');else if(aiContext.data.symptom==='headache')addMsg("When did your headache start?",'ai');else if(aiContext.data.symptom==='nausea')addMsg("When did nausea start?",'ai');else if(aiContext.data.symptom==='cough')addMsg("When did your cough start?",'ai');else addMsg("When did your sore throat start?",'ai');}else{addMsg("I can help with fever, headache, nausea, cough, or sore throat. Click a symptom chip or describe.",'ai');}}else if(aiContext.state===1){aiContext.data.duration=msg;aiContext.state=2;if(aiContext.data.symptom==='fever')addMsg("<strong>Do you know your current temperature?</strong> (Tell me in °F or say 'no')",'ai');else{generateTreatmentPlan();}}else if(aiContext.state===2&&aiContext.data.symptom==='fever'){if(msg.match(/\d{2,3}/)){aiContext.data.temp=parseInt(msg.match(/\d{2,3}/)[0]);generateTreatmentPlan();}else{aiContext.data.temp=null;generateTreatmentPlan();}}}
function generateTreatmentPlan(){const{symptom,temp}=aiContext.data;let plan='';if(symptom==='fever'){if(temp&&temp>=103)plan=`<div class="treatment-step urgent"><div class="treatment-step-title">⚠️ HIGH FEVER ALERT</div><div class="treatment-step-content">Temperature of ${temp}°F is very high. Seek medical attention if you have difficulty breathing, chest pain, or severe headache.</div></div>`;plan+=`<div class="treatment-step"><div class="treatment-step-title">Step 1: Check Temperature</div><div class="treatment-step-content">${temp?`Your temperature is ${temp}°F. ${temp>=100.4?'This confirms fever.':'Below fever threshold.'}`:'Use thermometer to check (100.4°F+)'}</div></div><div class="treatment-step"><div class="treatment-step-title">Step 2: Take Medication</div><div class="treatment-step-content">• <strong>Acetaminophen:</strong> 325-650mg every 4-6 hours<br>• <strong>OR Ibuprofen:</strong> 200-400mg every 4-6 hours</div></div><div class="treatment-step"><div class="treatment-step-title">Step 3: Stay Hydrated</div><div class="treatment-step-content">• Drink 8-10 glasses of water daily<br>• Try broth or sports drinks<br>• Avoid alcohol and caffeine</div></div><div class="treatment-step"><div class="treatment-step-title">Step 4: Rest & Cool Down</div><div class="treatment-step-content">• Get plenty of sleep<br>• Keep room cool (68-72°F)<br>• Wear light clothing<br>• Use cool compress on forehead</div></div><div class="treatment-step warning"><div class="treatment-step-title">⚠️ See Doctor If:</div><div class="treatment-step-content">• Fever over 103°F persists<br>• Lasts more than 3 days<br>• Difficulty breathing<br>• Severe headache with stiff neck</div></div>`;}else if(symptom==='headache'){plan=`<div class="treatment-step"><div class="treatment-step-title">Step 1: Pain Relief</div><div class="treatment-step-content">• <strong>Ibuprofen:</strong> 200-400mg<br>• <strong>OR Acetaminophen:</strong> 500mg<br>Take with food</div></div><div class="treatment-step"><div class="treatment-step-title">Step 2: Hydrate</div><div class="treatment-step-content">Drink a full glass of water right away. Dehydration causes headaches.</div></div><div class="treatment-step"><div class="treatment-step-title">Step 3: Rest in Dark Room</div><div class="treatment-step-content">• Lie down and close eyes<br>• Turn off lights<br>• Apply cold compress to forehead<br>• Breathe deeply</div></div><div class="treatment-step warning"><div class="treatment-step-title">⚠️ Emergency If:</div><div class="treatment-step-content">• Sudden severe headache (worst ever)<br>• Headache with fever AND stiff neck<br>• Vision changes or confusion</div></div>`;}else if(symptom==='nausea'){plan=`<div class="treatment-step"><div class="treatment-step-title">Step 1: Stop Eating</div><div class="treatment-step-content">Give your stomach a rest for 30-60 minutes. Sit upright or lie on left side.</div></div><div class="treatment-step"><div class="treatment-step-title">Step 2: Clear Liquids</div><div class="treatment-step-content">Sip water or clear broth slowly. Take small sips every 5-10 minutes.</div></div><div class="treatment-step"><div class="treatment-step-title">Step 3: Natural Remedies</div><div class="treatment-step-content">• <strong>Ginger:</strong> Tea or candies<br>• <strong>Peppermint:</strong> Tea or smell peppermint<br>• <strong>Fresh Air:</strong> Open window</div></div><div class="treatment-step"><div class="treatment-step-title">Step 4: Bland Foods</div><div class="treatment-step-content">When better: bananas, rice, applesauce, toast. Avoid fatty or spicy foods.</div></div>`;}else if(symptom==='cough'){plan=`<div class="treatment-step"><div class="treatment-step-title">Step 1: Soothe Throat</div><div class="treatment-step-content">• <strong>Honey:</strong> 1 tablespoon in warm tea<br>• <strong>Warm liquids:</strong> Herbal tea with lemon<br>• <strong>Lozenges:</strong> Menthol or honey</div></div><div class="treatment-step"><div class="treatment-step-title">Step 2: Improve Air Quality</div><div class="treatment-step-content">• <strong>Humidifier:</strong> Add moisture to air<br>• <strong>Steam:</strong> Breathe from hot shower<br>• Avoid smoke and strong perfumes</div></div><div class="treatment-step"><div class="treatment-step-title">Step 3: Medication</div><div class="treatment-step-content">• <strong>Dry cough:</strong> Dextromethorphan<br>• <strong>Wet cough:</strong> Expectorant (guaifenesin)</div></div>`;}else{plan=`<div class="treatment-step"><div class="treatment-step-title">Step 1: Salt Water Gargle</div><div class="treatment-step-content">1/4-1/2 tsp salt in 8oz warm water. Gargle 30 seconds, repeat every 2-3 hours.</div></div><div class="treatment-step"><div class="treatment-step-title">Step 2: Stay Hydrated</div><div class="treatment-step-content">• Warm liquids (tea, broth)<br>• Honey in warm water<br>• Avoid alcohol and caffeine</div></div><div class="treatment-step"><div class="treatment-step-title">Step 3: Humidify & Rest Voice</div><div class="treatment-step-content">Use humidifier. Rest voice - whisper if needed. Keep head elevated when sleeping.</div></div><div class="treatment-step"><div class="treatment-step-title">Step 4: Pain Relief</div><div class="treatment-step-content">• <strong>Ibuprofen:</strong> 200-400mg every 6 hours<br>• <strong>OR Acetaminophen:</strong> 325-650mg every 4-6 hours</div></div>`;} 
addMsg(plan,'ai');aiContext={state:0,data:{}};}
function addMsg(txt,sender){const c=document.getElementById('chatContainer'),m=document.createElement('div');m.className=`message ${sender}`;m.innerHTML=`<div class="message-bubble">${txt}</div>`;c.appendChild(m);c.scrollTop=c.scrollHeight;const appDiv=document.getElementById('app');if(appDiv){setTimeout(()=>appDiv.scrollTop=appDiv.scrollHeight,100);}}
function showCallScreen(){document.getElementById('callScreen').classList.add('active');scrollToTop();const chatInput=document.querySelector('.chat-input-container');const callBtn=document.querySelector('.chat-with-doctor-btn');if(chatInput)chatInput.style.display='none';if(callBtn)callBtn.style.display='none';}
function hideCallScreen(){document.getElementById('callScreen').classList.remove('active');document.getElementById('careTypeContent').style.display='block';document.getElementById('providerSelectContent').style.display='none';document.getElementById('connectionTypeContent').style.display='none';const chatInput=document.querySelector('.chat-input-container');const callBtn=document.querySelector('.chat-with-doctor-btn');if(chatInput)chatInput.style.display='flex';if(callBtn)callBtn.style.display='block';}
let selectedDoctor=null;
function selectCareType(type){document.getElementById('careTypeContent').style.display='none';document.getElementById('providerSelectContent').style.display='block';const doctorList=document.getElementById('doctorList');doctorList.innerHTML=allProviders.map(p=>`<div class="provider-card" onclick="selectDoctorForCall(${p.id},'${p.name}','${p.avatar}','${p.specialty}')"><div class="provider-avatar" style="background:${p.gradient}">${p.avatar}</div><div class="provider-details"><h4>${p.name}</h4><p style="color:#86868b;font-size:15px;margin-bottom:6px;">${p.specialtyName}</p><div style="margin:6px 0;"><span class="rating">${'★'.repeat(Math.floor(p.rating))} ${p.rating}</span> <span style="color:#86868b;font-size:13px;">(${p.reviews} reviews)</span></div><div style="font-size:15px;color:#1e88e5;font-weight:600;">Available now</div></div></div>`).join('');}
function selectDoctorForCall(id,name,avatar,specialty){selectedDoctor={id,name,avatar,specialty};document.getElementById('providerSelectContent').style.display='none';document.getElementById('connectionTypeContent').style.display='block';}
function initiateCall(){document.getElementById('connectionTypeContent').style.display='none';document.getElementById('callLoading').classList.add('active');setTimeout(()=>{document.getElementById('callLoading').classList.remove('active');document.getElementById('activeCall').classList.add('active');scrollToTop();document.getElementById('callDoctorName').textContent=selectedDoctor.name;document.getElementById('callAvatar').textContent=selectedDoctor.avatar;callTimer=0;callInterval=setInterval(()=>{callTimer++;const m=Math.floor(callTimer/60),s=callTimer%60;document.getElementById('callTimer').textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;},1000);},3000);}
function initiateChat(){document.getElementById('connectionTypeContent').style.display='none';document.getElementById('callLoading').classList.add('active');setTimeout(()=>{document.getElementById('callLoading').classList.remove('active');document.getElementById('activeChat').classList.add('active');document.getElementById('chatDoctorName').textContent=selectedDoctor.name;document.getElementById('chatDoctorGreeting').textContent=selectedDoctor.name;document.getElementById('doctorChatMessages').innerHTML=`<div class="imessage-bubble doctor">Hello! I'm ${selectedDoctor.name}. What can I help you with?</div>`;},3000);}
function endCall(){clearInterval(callInterval);document.getElementById('activeCall').classList.remove('active');hideCallScreen();}
function endChat(){document.getElementById('activeChat').classList.remove('active');hideCallScreen();}
function sendDoctorMessage(){const inp=document.getElementById('doctorChatInput'),msg=inp.value.trim();if(!msg)return;const cont=document.getElementById('doctorChatMessages');cont.innerHTML+=`<div class="imessage-bubble user">${msg}</div>`;inp.value='';cont.scrollTop=cont.scrollHeight;setTimeout(()=>{cont.innerHTML+=`<div class="imessage-bubble doctor">I understand. Can you tell me more about when this started?</div>`;cont.scrollTop=cont.scrollHeight;},1000);}
function analyzeBill(){document.getElementById('uploadSection').style.display='none';document.getElementById('scanningSection').style.display='block';setTimeout(()=>{document.getElementById('scanningSection').style.display='none';const billData=generateRandomBill();analyzedBills.push(billData);updateBillCount();showBillAnalysis(billData);},3000);}
function generateRandomBill(){const providers=['St. Mary\'s Hospital','City Medical Center','Downtown Clinic','Westside Health','Community Hospital'];const procedures=['Emergency Room Visit','Surgery','Lab Tests','X-Rays','Physical Therapy'];const originalAmounts=[3245,8950,1680,5420,12750];const savings=[1450,4230,780,2340,6890];const idx=Math.floor(Math.random()*providers.length);return{id:Date.now(),provider:providers[idx],procedure:procedures[idx],originalAmount:originalAmounts[idx],savings:savings[idx],newAmount:originalAmounts[idx]-savings[idx],date:new Date().toLocaleDateString()};}
function showBillAnalysis(bill){document.getElementById('analysisSection').innerHTML=`<div class="savings-badge"><h3>$${bill.savings.toLocaleString()} Saved!</h3><p style="font-size:16px;margin-top:8px;">We found 5 significant errors</p></div><div class="analysis-result"><h3 style="font-size:19px;margin-bottom:16px;">Bill Details</h3><div style="padding:16px;background:rgba(30,136,229,0.08);border-left:4px solid #1e88e5;border-radius:12px;margin-bottom:16px;"><h4 style="font-size:17px;margin-bottom:8px;font-weight:700;">${bill.provider}</h4><p style="font-size:15px;color:#1d1d1f;"><strong>Procedure:</strong> ${bill.procedure}<br><strong>Date:</strong> ${bill.date}</p></div><h3 style="font-size:19px;margin-bottom:16px;">Errors Identified</h3><div style="padding:16px;background:#f8d7da;border-left:4px solid #dc3545;border-radius:8px;margin-bottom:12px;"><h4 style="color:#721c24;margin-bottom:8px;font-size:16px;">❌ Error 1: Wrong Procedure Code</h4><p style="font-size:15px;color:#721c24;line-height:1.6;"><strong>Charge:</strong> Incorrect billing code used<br><strong>Why wrong:</strong> Should be standard rate, not emergency rate.<br><strong>Savings:</strong> $${Math.floor(bill.savings*0.4).toLocaleString()}</p></div><div style="padding:16px;background:#fff3cd;border-left:4px solid #ffc107;border-radius:8px;margin-bottom:12px;"><h4 style="color:#856404;margin-bottom:8px;font-size:16px;">⚠️ Error 2: Duplicate Charge</h4><p style="font-size:15px;color:#856404;line-height:1.6;"><strong>Charge:</strong> Service billed twice<br><strong>Why wrong:</strong> Only one service provided.<br><strong>Savings:</strong> $${Math.floor(bill.savings*0.25).toLocaleString()}</p></div><div style="padding:16px;background:#fff3cd;border-left:4px solid #ffc107;border-radius:8px;margin-bottom:12px;"><h4 style="color:#856404;margin-bottom:8px;font-size:16px;">⚠️ Error 3: Excessive Pricing</h4><p style="font-size:15px;color:#856404;line-height:1.6;"><strong>Charge:</strong> Supplies marked up 800%<br><strong>Why wrong:</strong> Far exceeds standard rates.<br><strong>Savings:</strong> $${Math.floor(bill.savings*0.15).toLocaleString()}</p></div><div style="padding:16px;background:#fff3cd;border-left:4px solid #ffc107;border-radius:8px;margin-bottom:12px;"><h4 style="color:#856404;margin-bottom:8px;font-size:16px;">⚠️ Error 4: Upcoding</h4><p style="font-size:15px;color:#856404;line-height:1.6;"><strong>Charge:</strong> Service level inflated<br><strong>Why wrong:</strong> Should be lower tier billing.<br><strong>Savings:</strong> $${Math.floor(bill.savings*0.12).toLocaleString()}</p></div><div style="padding:16px;background:#d1ecf1;border-left:4px solid #17a2b8;border-radius:8px;"><h4 style="color:#0c5460;margin-bottom:8px;font-size:16px;">ℹ️ Error 5: Missing Discount</h4><p style="font-size:15px;color:#0c5460;line-height:1.6;"><strong>Charge:</strong> In-network discount not applied<br><strong>Why wrong:</strong> Should receive negotiated rate.<br><strong>Savings:</strong> $${Math.floor(bill.savings*0.08).toLocaleString()}</p></div></div><div class="analysis-result"><h3 style="font-size:19px;margin-bottom:16px;">Bill Summary</h3><div style="background:#f5f5f7;border-radius:12px;padding:20px;"><div style="display:flex;justify-content:space-between;padding:14px 0;border-bottom:1px solid #ddd;font-size:16px;"><strong>Original Total:</strong><span style="text-decoration:line-through;font-size:18px;">$${bill.originalAmount.toLocaleString()}</span></div><div style="padding:14px 0;border-bottom:1px solid #ddd;font-size:15px;"><div style="display:flex;justify-content:space-between;margin:6px 0;"><span>Error Corrections</span><span style="color:#dc3545;">-$${bill.savings.toLocaleString()}</span></div></div><div style="display:flex;justify-content:space-between;padding:16px 0;"><strong style="font-size:17px;">Total Savings:</strong><span style="font-size:26px;font-weight:700;color:#43a047;">-$${bill.savings.toLocaleString()}</span></div><div style="display:flex;justify-content:space-between;padding:16px 0;border-top:2px solid #1e88e5;"><strong style="font-size:19px;color:#1e88e5;">New Total:</strong><span style="font-size:30px;font-weight:700;color:#1e88e5;">$${bill.newAmount.toLocaleString()}</span></div></div></div><button class="btn-primary" style="background:linear-gradient(135deg,#43a047 0%,#2e7d32 100%);margin-bottom:12px;" onclick="disputeCharges(${bill.id})">Dispute Charges</button><button class="btn-primary" onclick="viewAllBills()">View All Bills (${analyzedBills.length})</button>`;document.getElementById('analysisSection').style.display='block';scrollToTop();}
function viewAllBills(){if(analyzedBills.length===0){alert("No bills analyzed yet. Upload a bill to get started!");return;}document.getElementById('uploadSection').style.display='none';document.getElementById('scanningSection').style.display='none';document.getElementById('analysisSection').innerHTML=`<h2 style="font-size:24px;margin-bottom:20px;font-weight:700;">Your Bills</h2><div class="bill-list">${analyzedBills.map(bill=>`<div class="bill-item" onclick="showBillAnalysis(${JSON.stringify(bill).replace(/"/g,'&quot;')})"><div class="bill-icon">📄</div><div class="bill-details"><h4>${bill.provider}</h4><p>${bill.procedure} • ${bill.date}</p></div><div style="text-align:right;"><div class="bill-amount">$${bill.newAmount.toLocaleString()}</div><div class="bill-savings">Saved $${bill.savings.toLocaleString()}</div></div></div>`).join('')}</div><button class="upload-another-btn" onclick="resetBill()">📤 Upload Another Bill</button>`;document.getElementById('analysisSection').style.display='block';scrollToTop();}
function disputeCharges(billId){const bill=analyzedBills.find(b=>b.id===billId);document.getElementById('analysisSection').innerHTML=`<div style="text-align:center;padding:50px 20px;"><div id="disputeStep1" style="animation:fadeIn 0.5s;"><div style="font-size:70px;margin-bottom:24px;">📤</div><h3 style="font-size:24px;margin-bottom:14px;">Sending to Representative</h3><p style="color:#86868b;font-size:16px;line-height:1.5;">Your bill from ${bill.provider} is being transmitted...</p><div class="scanner-bar" style="margin-top:24px;"></div></div><div id="disputeStep2" style="display:none;animation:fadeIn 0.5s;"><div style="font-size:70px;margin-bottom:24px;">🤝</div><h3 style="font-size:24px;margin-bottom:14px;">Negotiating</h3><p style="color:#86868b;font-size:16px;line-height:1.5;">Our rep is contacting ${bill.provider}...</p><div class="scanner-bar" style="margin-top:24px;"></div></div><div id="disputeStep3" style="display:none;animation:fadeIn 0.5s;"><div style="font-size:70px;margin-bottom:24px;">✉️</div><h3 style="font-size:24px;margin-bottom:14px;">Sending Dispute Letter</h3><p style="color:#86868b;font-size:16px;line-height:1.5;">Official documentation is being submitted...</p><div class="scanner-bar" style="margin-top:24px;"></div></div><div id="disputeComplete" style="display:none;animation:fadeIn 0.5s;"><div style="font-size:90px;margin-bottom:28px;">✅</div><h2 style="font-size:32px;margin-bottom:20px;color:#43a047;">Dispute Submitted!</h2><div style="background:white;border-radius:16px;padding:26px;margin:28px 0;text-align:left;box-shadow:0 2px 8px rgba(0,0,0,0.1);"><h3 style="font-size:19px;margin-bottom:18px;">What Happens Next</h3><p style="margin-bottom:14px;line-height:1.7;font-size:16px;"><strong>Provider:</strong> ${bill.provider}</p><p style="margin-bottom:14px;line-height:1.7;font-size:16px;"><strong>Timeframe:</strong> <span style="color:#1e88e5;font-weight:700;">14-21 business days</span></p><p style="margin-bottom:14px;line-height:1.7;font-size:16px;"><strong>Updates:</strong> Email notifications at each stage</p><p style="margin-bottom:14px;line-height:1.7;font-size:16px;"><strong>Success Rate:</strong> 94% result in reductions</p><p style="line-height:1.7;font-size:16px;"><strong>Case ID:</strong> <span style="font-family:monospace;background:#f5f5f7;padding:6px 10px;border-radius:6px;font-size:15px;">${Math.random().toString(36).substr(2,9).toUpperCase()}-2026</span></p></div><button class="btn-primary" onclick="viewAllBills()">View All Bills</button></div></div>`;document.getElementById('analysisSection').style.display='block';setTimeout(()=>{document.getElementById('disputeStep1').style.display='none';document.getElementById('disputeStep2').style.display='block';},3000);setTimeout(()=>{document.getElementById('disputeStep2').style.display='none';document.getElementById('disputeStep3').style.display='block';},6000);setTimeout(()=>{document.getElementById('disputeStep3').style.display='none';document.getElementById('disputeComplete').style.display='block';scrollToTop();},9000);}
function resetBill(){document.getElementById('analysisSection').style.display='none';document.getElementById('uploadSection').style.display='block';scrollToTop();}
showPage('home');
// Add this at the end of app-mobile.js to inject logo into page headers after page load
document.addEventListener('DOMContentLoaded', function() {
    const originalShowPage = window.showPage;
    window.showPage = function(p) {
        originalShowPage(p);
        setTimeout(() => {
            const pageHeaders = document.querySelectorAll('.page-header');
            pageHeaders.forEach(header => {
                if (!header.querySelector('.header-logo')) {
                    const logo = document.createElement('img');
                    logo.src = 'TruHealth_Logo.png';
                    logo.className = 'header-logo';
                    logo.alt = 'TruHealth';
                    
                    // Insert logo in center
                    const h2 = header.querySelector('h2');
                    if (h2) {
                        h2.style.display = 'none';
                    }
                    header.appendChild(logo);
                }
            });
        }, 50);
    };
});
function updateBillCount(){const countElement=document.getElementById('billCount');if(countElement){countElement.textContent=analyzedBills.length;}}

// Profile Page and Functions
function showProfile() {
    document.getElementById('appContainer').innerHTML = `
        <div class="feature-page active">
            <div class="page-header">
                <button class="back-btn" onclick="showPage('home')">← Back</button>
                <h2>My Profile</h2>
            </div>
            <div class="page-content">
                ${userProfile.profileComplete ? 
                    '<div class="profile-complete-badge"><span>✓</span><span>Profile Complete</span></div>' 
                    : ''
                }
                
                <h2 style="font-size:24px;margin-bottom:8px;font-weight:700;">Your Information</h2>
                <p style="color:#86868b;margin-bottom:24px;font-size:15px;">
                    Complete your profile for faster bookings and personalized care
                </p>
                
                <div class="profile-section">
                    <label class="profile-label">Full Name</label>
                    <input type="text" class="profile-input" id="profileName" 
                        value="${userProfile.fullName}" 
                        placeholder="John Doe">
                </div>
                
                <div class="profile-section">
                    <label class="profile-label">Date of Birth</label>
                    <input type="date" class="profile-input" id="profileDOB" 
                        value="${userProfile.dateOfBirth}">
                </div>
                
                <div class="profile-section">
                    <label class="profile-label">Address</label>
                    <input type="text" class="profile-input" id="profileAddress" 
                        value="${userProfile.address}" 
                        placeholder="123 Main St, City, State 12345">
                </div>
                
                <div class="profile-section">
                    <label class="profile-label">Phone Number</label>
                    <input type="tel" class="profile-input" id="profilePhone" 
                        value="${userProfile.phone}" 
                        placeholder="(555) 123-4567">
                </div>
                
                <div class="profile-section">
                    <label class="profile-label">Insurance Provider</label>
                    <select class="profile-input" id="profileInsurance">
                        <option value="">Select insurance provider</option>
                        ${insuranceProviders.map(provider => 
                            `<option value="${provider}" ${userProfile.insuranceProvider === provider ? 'selected' : ''}>${provider}</option>`
                        ).join('')}
                    </select>
                </div>
                
                <button class="btn-primary" onclick="saveProfile()" style="margin-bottom:12px;">
                    Save Profile
                </button>
                
                ${userProfile.profileComplete ? `
                    <button class="btn-primary" onclick="clearProfile()" 
                        style="background:linear-gradient(135deg,#ff3b30 0%,#ff6b6b 100%);">
                        Clear Profile
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    window.scrollTo(0, 0);
}

function saveProfile() {
    const name = document.getElementById('profileName').value.trim();
    const dob = document.getElementById('profileDOB').value;
    const address = document.getElementById('profileAddress').value.trim();
    const phone = document.getElementById('profilePhone').value.trim();
    const insurance = document.getElementById('profileInsurance').value;
    
    if (!name || !dob || !address || !phone || !insurance) {
        alert('Please fill in all fields');
        return;
    }
    
    userProfile.fullName = name;
    userProfile.dateOfBirth = dob;
    userProfile.address = address;
    userProfile.phone = phone;
    userProfile.insuranceProvider = insurance;
    userProfile.profileComplete = true;
    
    saveUserProfile();
    
    // Show success message
    document.getElementById('appContainer').innerHTML = `
        <div class="feature-page active">
            <div class="page-header">
                <button class="back-btn" onclick="showPage('home')">← Back</button>
                <h2>Profile Saved</h2>
            </div>
            <div class="page-content">
                <div style="text-align:center;padding:60px 20px;">
                    <div style="font-size:90px;margin-bottom:24px;">✅</div>
                    <h2 style="font-size:30px;margin-bottom:18px;color:#43a047;">Profile Saved!</h2>
                    <p style="color:#86868b;font-size:16px;margin-bottom:32px;">
                        Your information has been securely saved.<br>
                        We'll use this to make booking faster and easier.
                    </p>
                    <button class="btn-primary" onclick="showPage('home')">
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    `;
    window.scrollTo(0, 0);
}

function clearProfile() {
    if (confirm('Are you sure you want to clear your profile? This cannot be undone.')) {
        userProfile = {
            fullName: '',
            dateOfBirth: '',
            address: '',
            phone: '',
            insuranceProvider: '',
            profileComplete: false
        };
        saveUserProfile();
        showProfile();
    }
}

// Appointment Tracking Functions
function updateAppointmentCounts() {
    const homeCount = document.getElementById('homeApptCount');
    const searchCount = document.getElementById('searchApptCount');
    if (homeCount) homeCount.textContent = bookedAppointments.length;
    if (searchCount) searchCount.textContent = bookedAppointments.length;
}

function viewAllAppointments() {
    if (bookedAppointments.length === 0) {
        alert('No appointments booked yet. Book your first appointment!');
        return;
    }
    
    document.getElementById('appContainer').innerHTML = `
        <div class="feature-page active">
            <div class="page-header">
                <button class="back-btn" onclick="showPage('home')">← Back</button>
                <h2>My Appointments</h2>
            </div>
            <div class="page-content">
                <h2 style="font-size:24px;margin-bottom:8px;font-weight:700;">Your Appointments (${bookedAppointments.length})</h2>
                <p style="color:#86868b;margin-bottom:24px;font-size:15px;">
                    Manage your upcoming healthcare visits
                </p>
                
                <div class="bill-list">
                    ${bookedAppointments.map(appt => `
                        <div class="bill-item" onclick="viewAppointmentDetails(${appt.id})">
                            <div class="provider-avatar" style="background:${appt.providerGradient};width:60px;height:60px;border-radius:16px;font-size:32px;display:flex;align-items:center;justify-content:center;">
                                ${appt.providerAvatar}
                            </div>
                            <div class="bill-details">
                                <h4>${appt.provider}</h4>
                                <p style="color:#86868b;font-size:14px;">${appt.specialty}</p>
                                <p style="color:#1e88e5;font-weight:600;margin-top:4px;font-size:15px;">${appt.date}</p>
                                <p style="color:#43a047;font-weight:600;font-size:15px;">${appt.time}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <button class="btn-primary" onclick="showPage('search')" style="margin-top:20px;">
                    Book Another Appointment
                </button>
            </div>
        </div>
    `;
    window.scrollTo(0, 0);
}

function viewAppointmentDetails(appointmentId) {
    const appt = bookedAppointments.find(a => a.id === appointmentId);
    if (!appt) return;
    
    document.getElementById('appContainer').innerHTML = `
        <div class="feature-page active">
            <div class="page-header">
                <button class="back-btn" onclick="viewAllAppointments()">← Back</button>
                <h2>Appointment Details</h2>
            </div>
            <div class="page-content">
                <div style="text-align:center;margin-bottom:32px;">
                    <div class="provider-avatar" style="background:${appt.providerGradient};width:100px;height:100px;margin:0 auto 16px;font-size:50px;border-radius:20px;display:flex;align-items:center;justify-content:center;">
                        ${appt.providerAvatar}
                    </div>
                    <h2 style="font-size:24px;margin-bottom:8px;">${appt.provider}</h2>
                    <p style="color:#86868b;font-size:16px;">${appt.specialty}</p>
                </div>
                
                <div style="background:white;border-radius:16px;padding:26px;margin-bottom:20px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    <h3 style="font-size:19px;margin-bottom:18px;color:#1d1d1f;">Appointment Information</h3>
                    
                    <div style="padding:14px 0;border-bottom:1px solid #f5f5f7;">
                        <strong style="font-size:15px;">Date:</strong><br>
                        <span style="font-size:16px;color:#1e88e5;font-weight:600;">${appt.date}</span>
                    </div>
                    
                    <div style="padding:14px 0;border-bottom:1px solid #f5f5f7;">
                        <strong style="font-size:15px;">Time:</strong><br>
                        <span style="font-size:16px;color:#43a047;font-weight:600;">${appt.time}</span>
                    </div>
                    
                    <div style="padding:14px 0;border-bottom:1px solid #f5f5f7;">
                        <strong style="font-size:15px;">Location:</strong><br>
                        <span style="font-size:16px;">${appt.address}</span>
                    </div>
                    
                    <div style="padding:14px 0;">
                        <strong style="font-size:15px;">Reason for Visit:</strong><br>
                        <span style="font-size:16px;">${appt.reason}</span>
                    </div>
                </div>
                
                <button class="btn-primary" onclick="viewAllAppointments()" style="margin-bottom:12px;">
                    Back to All Appointments
                </button>
                
                <button class="btn-primary" onclick="cancelAppointment(${appt.id})" 
                    style="background:linear-gradient(135deg,#ff3b30 0%,#ff6b6b 100%);">
                    Cancel Appointment
                </button>
            </div>
        </div>
    `;
    window.scrollTo(0, 0);
}

function cancelAppointment(appointmentId) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
        bookedAppointments = bookedAppointments.filter(a => a.id !== appointmentId);
        updateAppointmentCounts();
        
        document.getElementById('appContainer').innerHTML = `
            <div class="feature-page active">
                <div class="page-header">
                    <button class="back-btn" onclick="viewAllAppointments()">← Back</button>
                    <h2>Appointment Cancelled</h2>
                </div>
                <div class="page-content">
                    <div style="text-align:center;padding:60px 20px;">
                        <div style="font-size:90px;margin-bottom:24px;">❌</div>
                        <h2 style="font-size:30px;margin-bottom:18px;color:#ff3b30;">Appointment Cancelled</h2>
                        <p style="color:#86868b;font-size:16px;margin-bottom:32px;">
                            Your appointment has been cancelled.<br>
                            You can book a new one anytime.
                        </p>
                        <button class="btn-primary" onclick="showPage('search')">
                            Book New Appointment
                        </button>
                    </div>
                </div>
            </div>
        `;
        window.scrollTo(0, 0);
    }
}
// 5 Fake Medical Bills with Detailed Errors
const availableBills = [
    {
        id: 'bill001',
        provider: 'St. Mary\'s Hospital',
        procedure: 'Emergency Room Visit',
        date: 'January 15, 2026',
        originalAmount: 4850,
        errors: [
            {type: 'critical', title: 'Wrong Diagnosis Code', description: 'Billed as complex ER visit (99285) instead of moderate level (99284)', savings: 1200},
            {type: 'warning', title: 'Duplicate Lab Test', description: 'CBC blood test charged twice - only performed once according to medical records', savings: 180},
            {type: 'warning', title: 'Excessive Supply Charges', description: 'Basic medical supplies marked up 400% over standard hospital rates', savings: 95},
            {type: 'warning', title: 'Upcoded Imaging', description: 'X-ray billed at highest complexity level, should be standard rate', savings: 225},
            {type: 'info', title: 'Missing Insurance Discount', description: 'In-network contractual discount not applied to final total', savings: 340}
        ]
    },
    {
        id: 'bill002',
        provider: 'City Medical Center',
        procedure: 'Outpatient Surgery',
        date: 'February 3, 2026',
        originalAmount: 12750,
        errors: [
            {type: 'critical', title: 'Wrong Procedure Billed', description: 'Charged for laparoscopic procedure, records show open surgery at lower cost', savings: 4500},
            {type: 'critical', title: 'Duplicate Anesthesia Charge', description: 'Anesthesia time billed twice for the same 2-hour period', savings: 890},
            {type: 'warning', title: 'Inflated Facility Fee', description: 'Operating room time charged at premium rate instead of standard contract rate', savings: 1200},
            {type: 'warning', title: 'Unnecessary Medication', description: 'Post-operative medication listed but not administered per nursing notes', savings: 340},
            {type: 'info', title: 'Incorrect Room Classification', description: 'Recovery room billed as ICU-level care instead of standard post-op', savings: 580}
        ]
    },
    {
        id: 'bill003',
        provider: 'Downtown Clinic',
        procedure: 'Physical Therapy (6 sessions)',
        date: 'January 28, 2026',
        originalAmount: 1680,
        errors: [
            {type: 'warning', title: 'Overbilled Session Count', description: 'Charged for 8 sessions when records show only 6 were completed', savings: 420},
            {type: 'warning', title: 'Wrong Insurance Rate', description: 'Billed at out-of-network rate despite in-network provider status', savings: 280},
            {type: 'warning', title: 'Duplicate Equipment Fee', description: 'Therapy equipment charged per session AND as lump sum charge', savings: 150},
            {type: 'info', title: 'Excessive Evaluation Fee', description: 'Initial evaluation overcharged by 45% above standard rate', savings: 85},
            {type: 'info', title: 'Missing Group Discount', description: 'Multi-session package discount not applied as advertised', savings: 125}
        ]
    },
    {
        id: 'bill004',
        provider: 'Westside Imaging Center',
        procedure: 'MRI with Contrast',
        date: 'February 10, 2026',
        originalAmount: 3200,
        errors: [
            {type: 'critical', title: 'Wrong Body Part Billed', description: 'Charged for full spine MRI, radiology report shows only lower back performed', savings: 1100},
            {type: 'warning', title: 'Unnecessary Contrast Charge', description: 'Contrast dye billed but clinical notes indicate it was not used', savings: 450},
            {type: 'warning', title: 'Inflated Radiologist Fee', description: 'Interpretation fee 60% above usual and customary rate for area', savings: 280},
            {type: 'info', title: 'Duplicate Facility Fee', description: 'Technical component and facility fee overlap for same service', savings: 220},
            {type: 'info', title: 'Missing Insurance Negotiation', description: 'Pre-negotiated insurance rate not applied to claim', savings: 310}
        ]
    },
    {
        id: 'bill005',
        provider: 'Community Hospital',
        procedure: 'Overnight Observation',
        date: 'January 22, 2026',
        originalAmount: 5420,
        errors: [
            {type: 'critical', title: 'Incorrect Admission Status', description: 'Billed as inpatient admission, records show observation status only', savings: 1850},
            {type: 'warning', title: 'Excessive Pharmacy Charges', description: 'Basic medications marked up 800-1200% over wholesale cost', savings: 340},
            {type: 'warning', title: 'Duplicate Nursing Care', description: 'Nursing services charged twice for same overnight shift', savings: 280},
            {type: 'warning', title: 'Upcoded Physician Visits', description: 'Routine check-ins billed as comprehensive examinations', savings: 420},
            {type: 'info', title: 'Wrong Insurance Tier', description: 'Charged Tier 2 copay when policy shows Tier 1 coverage', savings: 150}
        ]
    }
];

// Bill Selection and Analysis Functions
function analyzeBill() {
    // Pick a random bill
    const randomBill = availableBills[Math.floor(Math.random() * availableBills.length)];
    
    // Show scanning animation immediately
    document.getElementById('uploadSection').style.display = 'none';
    document.getElementById('scanningSection').style.display = 'block';
    
    setTimeout(() => {
        document.getElementById('scanningSection').style.display = 'none';
        
        const totalSavings = randomBill.errors.reduce((sum, err) => sum + err.savings, 0);
        const newAmount = randomBill.originalAmount - totalSavings;
        
        const analyzedBill = {
            id: Date.now(),
            billId: randomBill.id,
            provider: randomBill.provider,
            procedure: randomBill.procedure,
            date: randomBill.date,
            originalAmount: randomBill.originalAmount,
            savings: totalSavings,
            newAmount: newAmount,
            errors: randomBill.errors,
            disputed: false
        };
        
        analyzedBills.push(analyzedBill);
        updateBillCounts();
        showDetailedBillAnalysis(analyzedBill);
    }, 3000);
}

function showDetailedBillAnalysis(bill) {
    const errorHTML = bill.errors.map(err => {
        let bgColor, borderColor, textColor, icon;
        if (err.type === 'critical') {
            bgColor = '#f8d7da'; borderColor = '#dc3545'; textColor = '#721c24'; icon = '❌';
        } else if (err.type === 'warning') {
            bgColor = '#fff3cd'; borderColor = '#ffc107'; textColor = '#856404'; icon = '⚠️';
        } else {
            bgColor = '#d1ecf1'; borderColor = '#17a2b8'; textColor = '#0c5460'; icon = 'ℹ️';
        }
        
        return `<div style="padding:16px;background:${bgColor};border-left:4px solid ${borderColor};border-radius:8px;margin-bottom:12px;">
            <h4 style="color:${textColor};margin-bottom:8px;font-size:16px;">${icon} ${err.title}</h4>
            <p style="font-size:15px;color:${textColor};line-height:1.6;">
                <strong>Issue:</strong> ${err.description}<br>
                <strong>Savings:</strong> $${err.savings.toLocaleString()}
            </p>
        </div>`;
    }).join('');
    
    const isDisputed = disputedBillIds.includes(bill.billId);
    
    document.getElementById('analysisSection').innerHTML = `
        <div class="savings-badge">
            <h3>$${bill.savings.toLocaleString()} Saved!</h3>
            <p style="font-size:16px;margin-top:8px;">We found ${bill.errors.length} significant errors</p>
        </div>
        
        <div class="analysis-result">
            <h3 style="font-size:19px;margin-bottom:16px;">Bill Details</h3>
            <div style="padding:16px;background:rgba(30,136,229,0.08);border-left:4px solid #1e88e5;border-radius:12px;margin-bottom:16px;">
                <h4 style="font-size:17px;margin-bottom:8px;font-weight:700;">${bill.provider}</h4>
                <p style="font-size:15px;color:#1d1d1f;">
                    <strong>Procedure:</strong> ${bill.procedure}<br>
                    <strong>Date:</strong> ${bill.date}
                </p>
            </div>
            
            <h3 style="font-size:19px;margin-bottom:16px;">Errors Identified</h3>
            ${errorHTML}
        </div>
        
        <div class="analysis-result">
            <h3 style="font-size:19px;margin-bottom:16px;">Bill Summary</h3>
            <div style="background:#f5f5f7;border-radius:12px;padding:20px;">
                <div style="display:flex;justify-content:space-between;padding:14px 0;border-bottom:1px solid #ddd;">
                    <strong>Original Total:</strong>
                    <span style="text-decoration:line-through;font-size:18px;">$${bill.originalAmount.toLocaleString()}</span>
                </div>
                <div style="padding:14px 0;border-bottom:1px solid #ddd;">
                    ${bill.errors.map(err => 
                        `<div style="display:flex;justify-content:space-between;margin:6px 0;">
                            <span>${err.title}</span>
                            <span style="color:#dc3545;">-$${err.savings.toLocaleString()}</span>
                        </div>`
                    ).join('')}
                </div>
                <div style="display:flex;justify-content:space-between;padding:16px 0;">
                    <strong>Total Savings:</strong>
                    <span style="font-size:26px;font-weight:700;color:#43a047;">-$${bill.savings.toLocaleString()}</span>
                </div>
                <div style="display:flex;justify-content:space-between;padding:16px 0;border-top:2px solid #1e88e5;">
                    <strong style="font-size:19px;color:#1e88e5;">New Total:</strong>
                    <span style="font-size:30px;font-weight:700;color:#1e88e5;">$${bill.newAmount.toLocaleString()}</span>
                </div>
            </div>
        </div>
        
        ${isDisputed ? `
            <div style="background:rgba(67,160,71,0.1);border:2px solid #43a047;border-radius:16px;padding:20px;margin-bottom:16px;text-align:center;">
                <div style="font-size:48px;margin-bottom:12px;">✅</div>
                <h3 style="color:#43a047;font-size:20px;margin-bottom:8px;">Already Disputed</h3>
                <p style="color:#2e7d32;font-size:15px;">This bill has been submitted for dispute</p>
            </div>
        ` : `
            <button class="btn-primary" style="background:linear-gradient(135deg,#43a047 0%,#2e7d32 100%);margin-bottom:12px;" 
                onclick="disputeDetailedBill('${bill.billId}')">
                Dispute Charges
            </button>
        `}
        
        <button class="btn-primary" onclick="viewAllBills()">
            View All Bills (${analyzedBills.length})
        </button>
    `;
    
    document.getElementById('analysisSection').style.display = 'block';
    window.scrollTo(0, 0);
}

function disputeDetailedBill(billId) {
    const bill = analyzedBills.find(b => b.billId === billId);
    if (!bill) return;
    
    scrollToTop();
    
    document.getElementById('analysisSection').innerHTML = `
        <div style="text-align:center;padding:50px 20px;">
            <div id="disputeStep1">
                <div style="font-size:70px;margin-bottom:24px;">📤</div>
                <h3 style="font-size:24px;margin-bottom:14px;">Sending to Representative</h3>
                <p style="color:#86868b;">Your bill from ${bill.provider} is being transmitted...</p>
                <div class="scanner-bar" style="margin-top:24px;"></div>
            </div>
            
            <div id="disputeStep2" style="display:none;">
                <div style="font-size:70px;margin-bottom:24px;">🤝</div>
                <h3 style="font-size:24px;margin-bottom:14px;">Negotiating</h3>
                <p style="color:#86868b;">Our rep is contacting ${bill.provider}...</p>
                <div class="scanner-bar" style="margin-top:24px;"></div>
            </div>
            
            <div id="disputeStep3" style="display:none;">
                <div style="font-size:70px;margin-bottom:24px;">✉️</div>
                <h3 style="font-size:24px;margin-bottom:14px;">Sending Dispute Letter</h3>
                <p style="color:#86868b;">Official documentation is being submitted...</p>
                <div class="scanner-bar" style="margin-top:24px;"></div>
            </div>
            
            <div id="disputeComplete" style="display:none;">
                <div style="font-size:90px;margin-bottom:28px;">✅</div>
                <h2 style="font-size:32px;margin-bottom:20px;color:#43a047;">Dispute Submitted!</h2>
                <div style="background:white;border-radius:16px;padding:26px;margin:28px 0;text-align:left;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    <h3 style="font-size:19px;margin-bottom:18px;">What Happens Next</h3>
                    <p style="margin-bottom:14px;line-height:1.7;">
                        <strong>Provider:</strong> ${bill.provider}
                    </p>
                    <p style="margin-bottom:14px;line-height:1.7;">
                        <strong>Amount:</strong> $${bill.originalAmount.toLocaleString()} → $${bill.newAmount.toLocaleString()}
                    </p>
                    <p style="margin-bottom:14px;line-height:1.7;">
                        <strong>Timeframe:</strong> <span style="color:#1e88e5;font-weight:700;">14-21 business days</span>
                    </p>
                    <p style="margin-bottom:14px;line-height:1.7;">
                        <strong>Success Rate:</strong> 94% result in reductions
                    </p>
                    <p style="line-height:1.7;">
                        <strong>Case ID:</strong> 
                        <span style="font-family:monospace;background:#f5f5f7;padding:6px 10px;border-radius:6px;">
                            ${Math.random().toString(36).substr(2,9).toUpperCase()}-2026
                        </span>
                    </p>
                </div>
                <button class="btn-primary" onclick="viewAllBills()">View All Bills</button>
            </div>
        </div>
    `;
    
    setTimeout(() => {
        document.getElementById('disputeStep1').style.display = 'none';
        document.getElementById('disputeStep2').style.display = 'block';
    }, 3000);
    
    setTimeout(() => {
        document.getElementById('disputeStep2').style.display = 'none';
        document.getElementById('disputeStep3').style.display = 'block';
    }, 6000);
    
    setTimeout(() => {
        document.getElementById('disputeStep3').style.display = 'none';
        document.getElementById('disputeComplete').style.display = 'block';
        
        // Mark as disputed
        if (!disputedBillIds.includes(billId)) {
            disputedBillIds.push(billId);
        }
        const billIndex = analyzedBills.findIndex(b => b.billId === billId);
        if (billIndex >= 0) {
            analyzedBills[billIndex].disputed = true;
        }
        
        window.scrollTo(0, 0);
    }, 9000);
}

function viewAllBills() {
    if (analyzedBills.length === 0) {
        alert('No bills analyzed yet. Upload a bill to get started!');
        return;
    }
    
    document.getElementById('uploadSection').style.display = 'none';
    document.getElementById('scanningSection').style.display = 'none';
    
    document.getElementById('analysisSection').innerHTML = `
        <h2 style="font-size:24px;margin-bottom:20px;font-weight:700;">Your Bills (${analyzedBills.length})</h2>
        
        <div class="bill-list">
            ${analyzedBills.map(bill => {
                const isDisputed = bill.disputed || disputedBillIds.includes(bill.billId);
                return `<div class="bill-item" onclick='showDetailedBillAnalysis(${JSON.stringify(bill).replace(/'/g, "\\'")}); scrollToTop();'>
                    <div class="bill-icon">${isDisputed ? '✅' : '📄'}</div>
                    <div class="bill-details">
                        <h4>${bill.provider}</h4>
                        <p>${bill.procedure} • ${bill.date}</p>
                        ${isDisputed ? '<p style="color:#1e88e5;font-weight:600;margin-top:4px;">✓ Disputed</p>' : ''}
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:18px;font-weight:700;">$${bill.newAmount.toLocaleString()}</div>
                        <div style="font-size:14px;color:#43a047;font-weight:600;">Saved $${bill.savings.toLocaleString()}</div>
                    </div>
                </div>`;
            }).join('')}
        </div>
        
        <button class="btn-primary" onclick="resetBill()">📤 Upload Another Bill</button>
    `;
    
    document.getElementById('analysisSection').style.display = 'block';
    window.scrollTo(0, 0);
}

function resetBill() {
    document.getElementById('analysisSection').style.display = 'none';
    document.getElementById('uploadSection').style.display = 'block';
    window.scrollTo(0, 0);
}

function updateBillCount() {
    const countElement = document.getElementById('billCount');
    if (countElement) {
        countElement.textContent = analyzedBills.length;
    }
}

function updateBillCounts() {
    const homeCount = document.getElementById('homeBillCount');
    const billCount = document.getElementById('billCount');
    if (homeCount) homeCount.textContent = analyzedBills.length;
    if (billCount) billCount.textContent = analyzedBills.length;
}
