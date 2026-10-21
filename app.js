/**
 * AYESHA & AHMED — LUXURY WEDDING INVITATION APPLICATION
 * 
 * Configured for direct RSVP routing via WhatsApp or Email:
 * - Direct WhatsApp formatted message dispatch
 * - Direct Email formatted message dispatch (mailto & web submit)
 * - Countdown Timer
 * - Save the date (.ics calendar file generation)
 * - Ambient wedding music synthesizer (Web Audio API)
 * - Shimmering floating particles & scroll reveal animations
 */

// ========================================================
// 1. CONFIGURATION (WhatsApp & Email Destination)
// ========================================================
const WEDDING_CONFIG = {
  // Enter the host's WhatsApp number (with country code, without + or spaces)
  // e.g., '923146173491' for Pakistani numbers
  whatsappNumber: '923146173491',

  // Enter the couple's email address where RSVPs will be received
  emailAddress: 'wahib.antal.wedding2026@gmail.com',

  // Wedding Date for the Countdown (Year-Month-DayTHour:Minute:Second)
  weddingDate: '2026-11-20T19:00:00'
};

document.addEventListener('DOMContentLoaded', () => {

  // ========================================================
  // 2. COUNTDOWN TIMER
  // ========================================================
  const countDays = document.getElementById('countDays');
  const countHours = document.getElementById('countHours');
  const countMins = document.getElementById('countMins');
  const countSecs = document.getElementById('countSecs');

  function updateCountdown() {
    const target = new Date(WEDDING_CONFIG.weddingDate).getTime();
    const now = new Date().getTime();
    const diff = target - now;

    if (diff <= 0) {
      if (countDays) countDays.textContent = '00';
      if (countHours) countHours.textContent = '00';
      if (countMins) countMins.textContent = '00';
      if (countSecs) countSecs.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (countDays) countDays.textContent = String(days).padStart(2, '0');
    if (countHours) countHours.textContent = String(hours).padStart(2, '0');
    if (countMins) countMins.textContent = String(minutes).padStart(2, '0');
    if (countSecs) countSecs.textContent = String(seconds).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // ========================================================
  // 3. RSVP FORM & DIRECT ROUTING (WhatsApp & Email)
  // ========================================================
  const rsvpForm = document.getElementById('rsvpForm');
  const checkAllEvents = document.getElementById('checkAllEvents');
  const eventChecks = document.querySelectorAll('.event-check');
  const submitEmailBtn = document.getElementById('submitEmailBtn');
  const rsvpSuccessBanner = document.getElementById('rsvpSuccessBanner');
  const successGuestSummary = document.getElementById('successGuestSummary');

  // "All Celebrations" toggle handling
  if (checkAllEvents) {
    checkAllEvents.addEventListener('change', () => {
      if (checkAllEvents.checked) {
        eventChecks.forEach(cb => cb.checked = false);
      }
    });

    eventChecks.forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.checked) {
          checkAllEvents.checked = false;
        }
      });
    });
  }

  // Gather Form Inputs
  function getRsvpFormData() {
    const name = document.getElementById('rsvpName').value.trim();
    const phone = document.getElementById('rsvpPhone').value.trim();
    const guests = document.getElementById('rsvpGuests').value;
    const attendance = document.querySelector('input[name="attendance"]:checked')?.value || 'Joyfully Accept';
    const dietary = document.getElementById('rsvpDietary').value.trim() || 'None';
    const message = document.getElementById('rsvpMessage').value.trim() || 'Warmest congratulations to the couple!';

    const selectedEvents = [];
    if (checkAllEvents && checkAllEvents.checked) {
      selectedEvents.push('Both Celebrations (Baraat & Walima)');
    } else {
      eventChecks.forEach(cb => {
        if (cb.checked) selectedEvents.push(cb.value);
      });
    }

    if (selectedEvents.length === 0) {
      selectedEvents.push('Both Celebrations (Baraat & Walima)');
    }

    return {
      timestamp: new Date().toLocaleString(),
      name,
      phone,
      guests,
      attendance,
      events: selectedEvents.join(', '),
      dietary,
      message
    };
  }

  // Validate form
  function validateForm(data) {
    if (!data.name) {
      alert('Please enter your full name.');
      document.getElementById('rsvpName').focus();
      return false;
    }
    if (!data.phone) {
      alert('Please enter your WhatsApp/phone number.');
      document.getElementById('rsvpPhone').focus();
      return false;
    }
    return true;
  }

  // Show Success Banner
  function showSuccess(data, medium = 'WhatsApp') {
    if (rsvpForm) rsvpForm.style.display = 'none';
    if (rsvpSuccessBanner) {
      rsvpSuccessBanner.style.display = 'block';
      if (successGuestSummary) {
        successGuestSummary.innerHTML = `Thank you <strong>${data.name}</strong> (${data.guests} guest/s)! Your RSVP has been confirmed for <em>${data.events}</em> and dispatched via <strong>${medium}</strong> to Wahib & Antal.`;
      }
    }
  }

  // 1. Submit via WhatsApp
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = getRsvpFormData();
      if (!validateForm(data)) return;

      const waText = 
`✨ *WEDDING RSVP CONFIRMATION* ✨
👰🤵 *Wahib Maqbool & Antal Hayaat*

👤 *Guest Name:* ${data.name}
📱 *Phone / WhatsApp:* ${data.phone}
👥 *Number of Guests:* ${data.guests}
💫 *Attendance:* ${data.attendance}
🎉 *Events Attending:* ${data.events}
🍽️ *Dietary / Preferences:* ${data.dietary}
💌 *Dua & Warm Wishes:* ${data.message}

Sent at: ${data.timestamp}`;

      const targetPhone = WEDDING_CONFIG.whatsappNumber.replace(/[^0-9]/g, '');
      const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(waText)}`;

      showSuccess(data, 'WhatsApp');
      window.open(waUrl, '_blank');
    });
  }

  // 2. Submit via Email
  if (submitEmailBtn) {
    submitEmailBtn.addEventListener('click', () => {
      const data = getRsvpFormData();
      if (!validateForm(data)) return;

      const subject = `Wedding RSVP: ${data.name} - ${data.attendance}`;
      const body = 
`Wedding RSVP Confirmation for Wahib Maqbool & Antal Hayaat

Guest Name: ${data.name}
Phone / WhatsApp: ${data.phone}
Number of Guests: ${data.guests}
Attendance: ${data.attendance}
Events Attending: ${data.events}
Dietary / Special Notes: ${data.dietary}
Message / Dua: ${data.message}

Submitted on: ${data.timestamp}`;

      // Open user's default email client pre-addressed to the wedding email
      const mailtoUrl = `mailto:${encodeURIComponent(WEDDING_CONFIG.emailAddress)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      showSuccess(data, 'Email');
      window.location.href = mailtoUrl;
    });
  }

  // Reset RSVP form
  window.resetRsvpForm = function() {
    if (rsvpForm) {
      rsvpForm.reset();
      rsvpForm.style.display = 'flex';
    }
    if (rsvpSuccessBanner) {
      rsvpSuccessBanner.style.display = 'none';
    }
    if (checkAllEvents) checkAllEvents.checked = true;
  };

  // Preselect single event from event card
  window.preselectEvent = function(eventName) {
    if (checkAllEvents) checkAllEvents.checked = false;
    eventChecks.forEach(cb => {
      cb.checked = (cb.value === eventName);
    });
  };

  // ========================================================
  // 4. SAVE THE DATE (.ICS CALENDAR EXPORT)
  // ========================================================
  const saveTheDateBtn = document.getElementById('saveTheDateBtn');
  if (saveTheDateBtn) {
    saveTheDateBtn.addEventListener('click', () => {
      const icsData = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wahib & Antal Wedding//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY:Wedding of Wahib Maqbool & Antal Hayaat
DESCRIPTION:Celebrating the wedding ceremonies of Wahib & Antal! Events: Baraat & Walima.
LOCATION:Nishat Chunian Limited, 31 College Rd, Gulberg 2, Lahore, Pakistan
DTSTART:20261120T140000Z
DTEND:20261120T180000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'Wahib_Antal_Wedding_SaveTheDate.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // ========================================================
  // 5. AMBIENT WEDDING HARP / CHIMES SYNTHESIZER
  // ========================================================
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  let audioCtx = null;
  let isPlayingMusic = false;
  let musicInterval = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Pentatonic notes for calming wedding harp chimes
  const notes = [
    261.63, // C4
    293.66, // D4
    329.63, // E4
    392.00, // G4
    440.00, // A4
    523.25, // C5
    587.33, // D5
    659.25  // E5
  ];

  function playGentleChime(freq, delay = 0, duration = 3.5) {
    if (!audioCtx || !isPlayingMusic) return;

    setTimeout(() => {
      if (!isPlayingMusic) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    }, delay * 1000);
  }

  function startMusicLoop() {
    isPlayingMusic = true;
    updateMusicButtonState(true);

    const playArpeggio = () => {
      const chord = [
        notes[Math.floor(Math.random() * notes.length)],
        notes[Math.floor(Math.random() * notes.length)],
        notes[Math.floor(Math.random() * notes.length)]
      ];
      chord.forEach((n, i) => playGentleChime(n, i * 0.4, 4.0));
    };

    playArpeggio();
    musicInterval = setInterval(playArpeggio, 3600);
  }

  function stopMusicLoop() {
    isPlayingMusic = false;
    updateMusicButtonState(false);
    if (musicInterval) clearInterval(musicInterval);
  }

  function updateMusicButtonState(active) {
    if (!audioToggleBtn) return;
    const stateSpan = audioToggleBtn.querySelector('.music-state');
    const icon = audioToggleBtn.querySelector('i');
    if (active) {
      if (stateSpan) stateSpan.textContent = 'ON';
      if (icon) {
        icon.className = 'fa-solid fa-volume-high';
        icon.style.color = 'var(--gold-primary)';
      }
    } else {
      if (stateSpan) stateSpan.textContent = 'OFF';
      if (icon) {
        icon.className = 'fa-solid fa-volume-xmark';
        icon.style.color = '#B8C0B9';
      }
    }
  }

  if (audioToggleBtn) {
    updateMusicButtonState(false);

    audioToggleBtn.addEventListener('click', () => {
      initAudio();
      if (!isPlayingMusic) {
        startMusicLoop();
      } else {
        stopMusicLoop();
      }
    });
  }

  // ========================================================
  // 6. FLOATING PETALS / PARTICLES IN HERO
  // ========================================================
  const particlesContainer = document.getElementById('particles');
  if (particlesContainer) {
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');
      const size = Math.random() * 5 + 3;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.animationDelay = `${Math.random() * 8}s`;
      p.style.animationDuration = `${Math.random() * 6 + 6}s`;
      particlesContainer.appendChild(p);
    }
  }

  // ========================================================
  // 7. SCROLL REVEAL (INTERSECTION OBSERVER)
  // ========================================================
  const revealElements = document.querySelectorAll('.reveal-item');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

});
