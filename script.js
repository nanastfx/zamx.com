const loading = document.getElementById('loading');
const intro = document.getElementById('intro');
const main = document.getElementById('main');
const audio = document.getElementById('audio');
const themeIcon = document.getElementById('themeIcon');

const texts = ["Hello, I'm Azam Tukam.", "welcome to my website."];

function typeText(el, words) {
  let index = 0, char = 0, isComplete = false;
  function type() {
    if (!isComplete && index < words.length) {
      if (char <= words[index].length) {
        el.textContent = words[index].slice(0, char++);
        setTimeout(type, 80);
      } else {
        index++; char = 0;
        setTimeout(type, 1000);
      }
    } else if (!isComplete) {
      isComplete = true;
      el.innerHTML += "<br><span style='color: rgba(255, 255, 255, 0.9); font-weight: 500;'>Transforming Ideas into Digital Solutions</span>";
    }
  }
  type();
}

function toggleTheme() {
  const body = document.body;
  const currentTheme = body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  body.setAttribute('data-theme', newTheme);
  themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  
  localStorage.setItem('theme', newTheme);
}

function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.body.setAttribute('data-theme', savedTheme);
  themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

window.onload = () => {
  loadTheme();
  setTimeout(() => {
    loading.style.display = 'none';
    intro.style.display = 'block';
    typeText(document.getElementById("introTyping"), texts);
  }, 4000);
};

function goToMain() {
  intro.style.display = 'none';
  main.style.display = 'block';
  audio.play().catch(e => console.log('Audio autoplay prevented'));
  typeText(document.getElementById("mainTyping"), texts);
}

function showSection(section) {
  document.querySelectorAll('.main-content').forEach(el => el.style.display = 'none');
  document.getElementById(section).style.display = 'block';
}

function backToMain() {
  document.querySelectorAll('.main-content').forEach(el => el.style.display = 'none');
  main.style.display = 'block';
}

function copyNumber(number) {
  navigator.clipboard.writeText(number).then(() => {
    showNotification(`<i class="fas fa-check-circle"></i> Number copied: ${number}`);
  }).catch(() => {
    showNotification(`<i class="fas fa-exclamation-circle"></i> Failed to copy. Please copy manually: ${number}`);
  });
}

function downloadQRIS() {
  const qrisImage = document.getElementById('qrisImage');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  
  img.crossOrigin = 'anonymous';
  img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    const link = document.createElement('a');
    link.download = 'IMG-QRIS-Payment.png';
    link.href = canvas.toDataURL();
    link.click();
    
    showNotification(`<i class="fas fa-download"></i> QRIS downloaded successfully!`);
  };
  
  img.src = qrisImage.src;
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerHTML = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'notificationSlide 0.6s cubic-bezier(0.4, 0, 0.2, 1) reverse';
    setTimeout(() => notification.remove(), 600);
  }, 3000);
}

// ===== 🔍 NIK PARSER FUNCTIONS =====
function showNIKParser() {
  document.querySelectorAll('.main-content').forEach(el => el.style.display = 'none');
  
  const nikParserHTML = `
    <div class="section-title">
      <i class="fas fa-id-card"></i>
      NIK Parser Tools
    </div>
    
    <div class="nik-container">
      <div class="nik-input-section">
        <label for="nikInput" class="nik-label">Enter NIK Number</label>
        <input type="text" id="nikInput" placeholder="Enter 16-digit NIK" maxlength="16" class="nik-input">
        <button onclick="parseNIK()" class="btn-primary nik-button">
          <i class="fas fa-search"></i> Parse NIK
        </button>
      </div>
      
      <div class="nik-result-section">
        <div class="nik-result-header">
          <strong>Parsing Result</strong>
          <button onclick="copyNIKResult()" class="btn-secondary">
            <i class="fas fa-copy"></i> Copy Result
          </button>
        </div>
        <div id="nikResult" class="nik-result"></div>
      </div>
    </div>
    
    <button class="btn-secondary" onclick="backToMain()">
      <i class="fas fa-arrow-left"></i> Back to Main
    </button>
  `;
  
  const nikSection = document.getElementById('nikparser');
  nikSection.innerHTML = nikParserHTML;
  nikSection.style.display = 'block';
}

function parseNIK() {
  const nik = document.getElementById('nikInput').value;
  const resultDiv = document.getElementById('nikResult');
  
  if (!nik) {
    resultDiv.innerHTML = '<div class="nik-error">Please enter a NIK number</div>';
    return;
  }
  
  if (nik.length !== 16) {
    resultDiv.innerHTML = '<div class="nik-error">NIK must be 16 digits</div>';
    return;
  }
  
  // Simple NIK parsing logic (bisa diganti dengan library yang lebih advanced)
  try {
    const provinceCode = nik.substring(0, 2);
    const regencyCode = nik.substring(2, 4);
    const districtCode = nik.substring(4, 6);
    const birthDate = nik.substring(6, 12);
    const uniqueCode = nik.substring(12, 16);
    
    // Parse birth date
    const day = parseInt(birthDate.substring(0, 2));
    const month = parseInt(birthDate.substring(2, 4));
    const year = parseInt(birthDate.substring(4, 6));
    
    const fullYear = year + (year < 25 ? 2000 : 1900);
    const gender = day > 40 ? 'Female' : 'Male';
    const actualDay = day > 40 ? day - 40 : day;
    
    const result = {
      "NIK": nik,
      "Province Code": provinceCode,
      "Regency Code": regencyCode,
      "District Code": districtCode,
      "Birth Info": {
        "Date": `${actualDay.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${fullYear}`,
        "Day": actualDay,
        "Month": month,
        "Year": fullYear,
        "Gender": gender
      },
      "Unique Code": uniqueCode
    };
    
    resultDiv.innerHTML = `<pre class="nik-success">${JSON.stringify(result, null, 2)}</pre>`;
    resultDiv.classList.add('fade-in');
    
  } catch (error) {
    resultDiv.innerHTML = '<div class="nik-error">Error parsing NIK. Please check the format.</div>';
  }
}

function copyNIKResult() {
  const resultText = document.getElementById('nikResult').innerText;
  if (!resultText || resultText.includes('Please enter') || resultText.includes('Error')) {
    showNotification('<i class="fas fa-exclamation-triangle"></i> No valid result to copy');
    return;
  }
  
  navigator.clipboard.writeText(resultText).then(() => {
    showNotification('<i class="fas fa-check"></i> NIK result copied to clipboard!');
  }).catch(err => {
    showNotification('<i class="fas fa-times"></i> Failed to copy result');
  });
    }

// ===== 📱 IPHONE QUOTED GENERATOR =====
/*function showIphoneGenerator() {
  document.querySelectorAll('.main-content').forEach(el => el.style.display = 'none');
  
  const iphoneHTML = `
    <div class="section-title">
      <i class="fas fa-mobile-alt"></i>
      iPhone Chat Generator
    </div>
    
    <div class="iphone-container">
      <div class="iphone-input-group">
        <label class="iphone-label">Time (e.g., 18:00)</label>
        <input type="text" id="iqcTime" placeholder="Enter time (e.g., 18:00)" class="iphone-input" value="18:00">
      </div>
      
      <div class="iphone-input-group">
        <label class="iphone-label">Battery Percentage</label>
        <input type="number" id="iqcBattery" placeholder="Enter battery percentage (1-100)" class="iphone-input" min="1" max="100" value="85">
      </div>
      
      <div class="iphone-input-group">
        <label class="iphone-label">Carrier Name</label>
        <input type="text" id="iqcCarrier" placeholder="Enter carrier (e.g., Indosat)" class="iphone-input" value="Indosat">
      </div>
      
      <div class="iphone-input-group">
        <label class="iphone-label">Message Text</label>
        <textarea id="iqcMessage" placeholder="Enter your message..." rows="3" class="iphone-textarea">Hello, this is a test message from iPhone Chat Generator!</textarea>
      </div>
      
      <button onclick="generateIphoneChat()" class="btn-primary" id="iqcGenerateBtn" style="width: 100%;">
        <i class="fas fa-bolt"></i> Generate iPhone Chat
      </button>
      
      <div class="iphone-info" style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 10px; margin-top: 1rem;">
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">
          <i class="fas fa-info-circle"></i> This feature generates realistic iPhone chat screenshots with custom messages.
        </p>
      </div>
      
      <div id="iqcResult" class="iphone-result"></div>
    </div>
    
    <button class="btn-secondary" onclick="backToMain()">
      <i class="fas fa-arrow-left"></i> Back to Main
    </button>
  `;
  
  const iphoneSection = document.getElementById('iphonegenerator');
  iphoneSection.innerHTML = iphoneHTML;
  iphoneSection.style.display = 'block';
}

async function generateIphoneChat() {
  const time = document.getElementById('iqcTime').value.trim();
  const battery = document.getElementById('iqcBattery').value.trim();
  const carrier = document.getElementById('iqcCarrier').value.trim();
  const msg = document.getElementById('iqcMessage').value.trim();
  const resultBox = document.getElementById('iqcResult');
  const btn = document.getElementById('iqcGenerateBtn');
  
  resultBox.innerHTML = "";

  // Validation
  if (!time || !battery || !carrier || !msg) {
    showNotification('<i class="fas fa-exclamation-triangle"></i> Please fill all fields');
    return;
  }

  // Time format validation
  if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
    showNotification('<i class="fas fa-exclamation-triangle"></i> Please enter valid time format (HH:MM)');
    return;
  }

  // Battery validation
  const batteryNum = parseInt(battery);
  if (isNaN(batteryNum) || batteryNum < 1 || batteryNum > 100) {
    showNotification('<i class="fas fa-exclamation-triangle"></i> Battery must be between 1-100');
    return;
  }

  // Disable button and show loading
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
  }

  resultBox.innerHTML = `
    <div class="iphone-status">
      <i class="fas fa-spinner fa-spin"></i> Starting generation process...
    </div>
  `;

  // Prepare API parameters
  const params = new URLSearchParams();
  params.append('time', time);
  params.append('batteryPercentage', battery);
  params.append('carrierName', carrier);
  params.append('messageText', msg);
  params.append('emojiStyle', 'apple');
  
  const originalUrl = `https://brat.siputzx.my.id/iphone-quoted?${params.toString()}`;

  console.log('API URL:', originalUrl);

  async function tryFetch(url, attempt = 1, maxAttempts = 3) {
    try {
      resultBox.innerHTML = `<div class="iphone-status">Attempt ${attempt}/${maxAttempts} - Processing...</div>`;
      
      const response = await fetch(url, { 
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      
      // Check if blob is valid image
      if (blob.size === 0) {
        throw new Error('Empty response from server');
      }
      
      return blob;
      
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      
      if (attempt < maxAttempts) {
        resultBox.innerHTML += `<div class="iphone-status">Retrying in ${attempt} second(s)...</div>`;
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        return tryFetch(url, attempt + 1, maxAttempts);
      }
      
      throw error;
    }
  }

  let blob = null;
  let errorMessage = '';

  try {
    // Try direct fetch first
    blob = await tryFetch(originalUrl, 1, 3);
    
  } catch (directError) {
    console.warn('Direct fetch failed, trying CORS proxy...');
    
    try {
      // Try with CORS proxy
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(originalUrl)}`;
      blob = await tryFetch(proxyUrl, 1, 2);
      
    } catch (proxyError) {
      console.error('All fetch attempts failed:', proxyError);
      errorMessage = proxyError.message;
    }
  }

  // Re-enable button
  if (btn) {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-bolt"></i> Generate iPhone Chat';
  }

  if (!blob) {
    const fallbackHTML = `
      <div class="nik-error" style="text-align: center; padding: 2rem;">
        <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
        <h3>Generation Failed</h3>
        <p>Unable to generate image at the moment.</p>
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 1rem;">
          Error: ${errorMessage || 'Service temporarily unavailable'}
        </p>
        <div style="margin-top: 1.5rem;">
          <button onclick="showFallbackPreview()" class="btn-secondary">
            <i class="fas fa-eye"></i> Show Preview
          </button>
        </div>
      </div>
    `;
    
    resultBox.innerHTML = fallbackHTML;
    showNotification('<i class="fas fa-times"></i> Generation failed - Service unavailable');
    return;
  }

  try {
    const imgUrl = URL.createObjectURL(blob);
    
    // Create image element to verify it loads
    const img = new Image();
    img.onload = function() {
      resultBox.innerHTML = `
        <div style="text-align: center;">
          <h3 style="color: var(--text-primary); margin-bottom: 1rem;">
            <i class="fas fa-check-circle"></i> Successfully Generated!
          </h3>
          <p style="color: var(--text-secondary); margin-bottom: 1rem;">
            Time: ${time} | Battery: ${battery}% | Carrier: ${carrier}
          </p>
          <img src="${imgUrl}" class="iphone-image" alt="iPhone chat image" style="max-width: 300px;"/>
          <div class="iphone-actions">
            <a href="${imgUrl}" download="iphone_chat_${time.replace(':', '')}_${battery}.png">
              <button class="btn-primary">
                <i class="fas fa-download"></i> Download Image
              </button>
            </a>
            <button onclick="window.open('${imgUrl}', '_blank')" class="btn-secondary">
              <i class="fas fa-external-link-alt"></i> Open in New Tab
            </button>
          </div>
        </div>
      `;
      
      showNotification('<i class="fas fa-check"></i> iPhone chat generated successfully!');
    };
    
    img.onerror = function() {
      throw new Error('Generated image failed to load');
    };
    
    img.src = imgUrl;
    
  } catch (e) {
    console.error('Failed to display image:', e);
    resultBox.innerHTML = `
      <div class="nik-error">
        <i class="fas fa-exclamation-triangle"></i> Failed to display generated image
      </div>
    `;
    showNotification('<i class="fas fa-times"></i> Failed to display image');
  }
}

// Fallback preview function
function showFallbackPreview() {
  const resultBox = document.getElementById('iqcResult');
  const time = document.getElementById('iqcTime').value.trim();
  const battery = document.getElementById('iqcBattery').value.trim();
  const carrier = document.getElementById('iqcCarrier').value.trim();
  const msg = document.getElementById('iqcMessage').value.trim();
  
  resultBox.innerHTML = `
    <div style="text-align: center; padding: 2rem;">
      <h3 style="color: var(--text-primary); margin-bottom: 1rem;">
        <i class="fas fa-mobile-alt"></i> Preview (Offline)
      </h3>
      <div style="background: #000; color: #fff; padding: 2rem; border-radius: 20px; max-width: 300px; margin: 0 auto; font-family: -apple-system, sans-serif;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 2rem;">
          <span>${time}</span>
          <span>${battery}%</span>
        </div>
        <div style="text-align: center; margin-bottom: 1rem;">
          <strong>${carrier}</strong>
        </div>
        <div style="background: #1c1c1e; padding: 1rem; border-radius: 10px; margin-bottom: 1rem;">
          ${msg}
        </div>
        <div style="color: #8e8e93; font-size: 0.9rem;">
          This is a preview. Actual image generation service is currently unavailable.
        </div>
      </div>
      <div style="margin-top: 1.5rem;">
        <button onclick="generateIphoneChat()" class="btn-primary">
          <i class="fas fa-redo"></i> Try Again
        </button>
      </div>
    </div>
  `;
}*/

// ===== 📱 IPHONE QUOTED GENERATOR (URL REDIRECT) =====
function showIphoneGenerator() {
  document.querySelectorAll('.main-content').forEach(el => el.style.display = 'none');
  
  const iphoneHTML = `
    <div class="section-title">
      <i class="fas fa-mobile-alt"></i>
      iPhone Quoted Generator
    </div>
    
    <div class="iphone-container">
      <div class="iphone-input-group">
        <label class="iphone-label">Time (e.g., 11:26)</label>
        <input type="text" id="iqcTime" placeholder="Enter time (e.g., 11:26)" class="iphone-input" value="11:26" oninput="updatePreviewUrl()">
      </div>
      
      <div class="iphone-input-group">
        <label class="iphone-label">Battery Percentage</label>
        <input type="number" id="iqcBattery" placeholder="Enter battery (1-100)" class="iphone-input" min="1" max="100" value="88" oninput="updatePreviewUrl()">
      </div>
      
      <div class="iphone-input-group">
        <label class="iphone-label">Carrier Name</label>
        <input type="text" id="iqcCarrier" placeholder="Enter carrier name" class="iphone-input" value="INDOSAT OOREDOO" oninput="updatePreviewUrl()">
      </div>
      
      <div class="iphone-input-group">
        <label class="iphone-label">Message Text</label>
        <textarea id="iqcMessage" placeholder="Enter your message..." rows="3" class="iphone-textarea" oninput="updatePreviewUrl()">Hello, this is a test message!</textarea>
      </div>
      
      <div class="iphone-input-group">
        <label class="iphone-label">Signal Strength (1-5)</label>
        <input type="number" id="iqcSignal" placeholder="Enter signal (1-5)" class="iphone-input" min="1" max="5" value="4" oninput="updatePreviewUrl()">
      </div>
      
      <!-- Preview URL -->
      <div id="urlPreview" class="iphone-info" style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 10px; margin-top: 1rem; display: none;">
        <p style="color: var(--text-secondary); font-size: 0.8rem; margin: 0 0 0.5rem 0;">
          <i class="fas fa-link"></i> Generated URL:
        </p>
        <div style="background: rgba(0,0,0,0.3); padding: 0.8rem; border-radius: 8px; margin-bottom: 1rem;">
          <code id="previewUrlText" style="color: #4ecdc4; font-size: 0.75rem; word-break: break-all;"></code>
        </div>
        <button onclick="redirectToGeneratedUrl()" class="btn-primary" id="seeResultsBtn" style="width: 100%;">
          <i class="fas fa-external-link-alt"></i> See Results
        </button>
      </div>
      
      <div class="iphone-info" style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 10px; margin-top: 1rem;">
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">
          <i class="fas fa-info-circle"></i> Fill the form above to generate iPhone quoted image URL
        </p>
      </div>
    </div>
    
    <button class="btn-secondary" onclick="backToMain()">
      <i class="fas fa-arrow-left"></i> Back to Main
    </button>
  `;
  
  const iphoneSection = document.getElementById('iphonegenerator');
  iphoneSection.innerHTML = iphoneHTML;
  iphoneSection.style.display = 'block';
  
  // Initialize preview URL
  updatePreviewUrl();
}

function updatePreviewUrl() {
  const time = document.getElementById('iqcTime').value.trim();
  const battery = document.getElementById('iqcBattery').value.trim();
  const carrier = document.getElementById('iqcCarrier').value.trim();
  const message = document.getElementById('iqcMessage').value.trim();
  const signal = document.getElementById('iqcSignal').value.trim();
  const urlPreview = document.getElementById('urlPreview');
  const previewUrlText = document.getElementById('previewUrlText');
  
  // Basic validation
  if (!time || !battery || !carrier) {
    urlPreview.style.display = 'none';
    return;
  }
  
  // Build URL parameters
  const params = new URLSearchParams();
  params.append('time', time);
  params.append('batteryPercentage', battery);
  params.append('carrierName', carrier);
  params.append('messageText', message);
  params.append('signalStrength', signal);
  params.append('emojiStyle', 'apple');
  
  const baseUrl = 'https://brat.siputzx.my.id/iphone-quoted';
  const fullUrl = `${baseUrl}?${params.toString()}`;
  
  // Display preview
  previewUrlText.textContent = fullUrl;
  urlPreview.style.display = 'block';
}

function redirectToGeneratedUrl() {
  const time = document.getElementById('iqcTime').value.trim();
  const battery = document.getElementById('iqcBattery').value.trim();
  const carrier = document.getElementById('iqcCarrier').value.trim();
  const message = document.getElementById('iqcMessage').value.trim();
  const signal = document.getElementById('iqcSignal').value.trim();
  
  // Validation
  if (!time || !battery || !carrier) {
    showNotification('<i class="fas fa-exclamation-triangle"></i> Please fill required fields');
    return;
  }
  
  // Build final URL
  const params = new URLSearchParams();
  params.append('time', time);
  params.append('batteryPercentage', battery);
  params.append('carrierName', carrier);
  params.append('messageText', message);
  params.append('signalStrength', signal);
  params.append('emojiStyle', 'apple');
  
  const baseUrl = 'https://brat.siputzx.my.id/iphone-quoted';
  const finalUrl = `${baseUrl}?${params.toString()}`;
  
  // Show loading
  const btn = document.getElementById('seeResultsBtn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Redirecting...';
  }
  
  showNotification('<i class="fas fa-external-link-alt"></i> Redirecting to generated image...');
  
  // Redirect after short delay
  setTimeout(() => {
    window.open(finalUrl, '_blank');
    
    // Reset button
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-external-link-alt"></i> See Results';
    }
  }, 1000);
}

// ===== 📱 IPHONE QUOTED GENERATOR (CLIENT-SIDE) =====
/*function showIphoneGenerator() {
  document.querySelectorAll('.main-content').forEach(el => el.style.display = 'none');
  
  const iphoneHTML = `
    <div class="section-title">
      <i class="fas fa-mobile-alt"></i>
      iPhone Chat Generator
    </div>
    
    <div class="iphone-container">
      <div class="iphone-input-group">
        <label class="iphone-label">Time (e.g., 18:00)</label>
        <input type="text" id="iqcTime" placeholder="Enter time (e.g., 18:00)" class="iphone-input" value="18:00">
      </div>
      
      <div class="iphone-input-group">
        <label class="iphone-label">Battery Percentage</label>
        <input type="number" id="iqcBattery" placeholder="Enter battery percentage (1-100)" class="iphone-input" min="1" max="100" value="85">
      </div>
      
      <div class="iphone-input-group">
        <label class="iphone-label">Carrier Name</label>
        <input type="text" id="iqcCarrier" placeholder="Enter carrier (e.g., Indosat)" class="iphone-input" value="Indosat">
      </div>
      
      <div class="iphone-input-group">
        <label class="iphone-label">Message Text</label>
        <textarea id="iqcMessage" placeholder="Enter your message..." rows="3" class="iphone-textarea">Hello, this is a test message from iPhone Chat Generator!</textarea>
      </div>
      
      <button onclick="generateIphoneChatClientSide()" class="btn-primary" id="iqcGenerateBtn" style="width: 100%;">
        <i class="fas fa-bolt"></i> Generate iPhone Chat (Client-side)
      </button>
      
      <div class="iphone-info" style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 10px; margin-top: 1rem;">
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">
          <i class="fas fa-info-circle"></i> Generates iPhone-style chat screenshots directly in your browser.
        </p>
      </div>
      
      <div id="iqcResult" class="iphone-result"></div>
      
      <!-- Hidden template for screenshot -->
      <div id="iphoneTemplate" style="display: none;"></div>
    </div>
    
    <button class="btn-secondary" onclick="backToMain()">
      <i class="fas fa-arrow-left"></i> Back to Main
    </button>
  `;
  
  const iphoneSection = document.getElementById('iphonegenerator');
  iphoneSection.innerHTML = iphoneHTML;
  iphoneSection.style.display = 'block';
}

async function generateIphoneChatClientSide() {
  const time = document.getElementById('iqcTime').value.trim();
  const battery = document.getElementById('iqcBattery').value.trim();
  const carrier = document.getElementById('iqcCarrier').value.trim();
  const msg = document.getElementById('iqcMessage').value.trim();
  const resultBox = document.getElementById('iqcResult');
  const btn = document.getElementById('iqcGenerateBtn');
  const template = document.getElementById('iphoneTemplate');
  
  resultBox.innerHTML = "";

  // Validation
  if (!time || !battery || !carrier || !msg) {
    showNotification('<i class="fas fa-exclamation-triangle"></i> Please fill all fields');
    return;
  }

  // Disable button and show loading
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
  }

  resultBox.innerHTML = `
    <div class="iphone-status">
      <i class="fas fa-spinner fa-spin"></i> Creating iPhone chat screenshot...
    </div>
  `;

  try {
    // Create iPhone template
    template.innerHTML = `
      <div style="
        width: 375px;
        height: 667px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 40px;
        padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        position: relative;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        margin: 0 auto;
      ">
        <!-- Status Bar -->
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 20px;
          background: rgba(0,0,0,0.8);
          border-radius: 20px 20px 0 0;
          color: white;
          font-size: 14px;
          font-weight: 600;
        ">
          <span>${time}</span>
          <span>${carrier}</span>
          <div style="display: flex; align-items: center; gap: 5px;">
            <i class="fas fa-signal"></i>
            <i class="fas fa-wifi"></i>
            <span>${battery}%</span>
            <i class="fas fa-battery-three-quarters"></i>
          </div>
        </div>

        <!-- Chat Container -->
        <div style="
          background: white;
          height: calc(100% - 60px);
          border-radius: 0 0 20px 20px;
          padding: 20px;
          display: flex;
          flex-direction: column;
        ">
          <!-- Chat Header -->
          <div style="
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #e5e5e7;
            margin-bottom: 20px;
          ">
            <div style="font-weight: bold; font-size: 18px; color: #000;">iMessage</div>
            <div style="font-size: 14px; color: #8e8e93;">${carrier}</div>
          </div>

          <!-- Messages -->
          <div style="flex: 1; display: flex; flex-direction: column; gap: 15px;">
            <!-- Received Message -->
            <div style="align-self: flex-start; max-width: 70%;">
              <div style="
                background: #e5e5e7;
                padding: 12px 16px;
                border-radius: 18px;
                border-bottom-left-radius: 4px;
                color: #000;
                font-size: 16px;
                line-height: 1.4;
              ">
                Hey there! How are you doing?
              </div>
              <div style="font-size: 12px; color: #8e8e93; margin-top: 4px; text-align: left;">
                17:45
              </div>
            </div>

            <!-- Sent Message -->
            <div style="align-self: flex-end; max-width: 70%;">
              <div style="
                background: #007aff;
                padding: 12px 16px;
                border-radius: 18px;
                border-bottom-right-radius: 4px;
                color: white;
                font-size: 16px;
                line-height: 1.4;
              ">
                ${msg}
              </div>
              <div style="font-size: 12px; color: #8e8e93; margin-top: 4px; text-align: right;">
                ${time}
              </div>
            </div>

            <!-- Typing Indicator -->
            <div style="align-self: flex-start; max-width: 70%;">
              <div style="
                background: #e5e5e7;
                padding: 12px 16px;
                border-radius: 18px;
                border-bottom-left-radius: 4px;
                color: #8e8e93;
                font-size: 16px;
              ">
                <i class="fas fa-ellipsis-h"></i>
              </div>
            </div>
          </div>

          <!-- Input Bar -->
          <div style="
            display: flex;
            gap: 10px;
            padding: 15px 0 0 0;
            border-top: 1px solid #e5e5e7;
          ">
            <div style="
              flex: 1;
              background: #e5e5e7;
              border-radius: 20px;
              padding: 12px 20px;
              color: #8e8e93;
              font-size: 16px;
            ">
              iMessage
            </div>
            <div style="
              width: 40px;
              height: 40px;
              background: #007aff;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
            ">
              <i class="fas fa-arrow-up"></i>
            </div>
          </div>
        </div>

        <!-- Home Indicator -->
        <div style="
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          width: 134px;
          height: 5px;
          background: black;
          border-radius: 3px;
          opacity: 0.3;
        "></div>
      </div>
    `;

    // Wait a bit for the template to render
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate screenshot
    const canvas = await html2canvas(template.firstChild, {
      backgroundColor: null,
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: true,
      logging: false
    });

    // Convert to blob
    canvas.toBlob(async (blob) => {
      const imgUrl = URL.createObjectURL(blob);
      
      resultBox.innerHTML = `
        <div style="text-align: center;">
          <h3 style="color: var(--text-primary); margin-bottom: 1rem;">
            <i class="fas fa-check-circle"></i> Successfully Generated!
          </h3>
          <p style="color: var(--text-secondary); margin-bottom: 1rem;">
            Time: ${time} | Battery: ${battery}% | Carrier: ${carrier}
          </p>
          <img src="${imgUrl}" class="iphone-image" alt="iPhone chat image" style="max-width: 300px; border: 2px solid rgba(255,255,255,0.3); border-radius: 20px;"/>
          <div class="iphone-actions">
            <a href="${imgUrl}" download="iphone_chat_${Date.now()}.png">
              <button class="btn-primary">
                <i class="fas fa-download"></i> Download Image
              </button>
            </a>
            <button onclick="window.open('${imgUrl}', '_blank')" class="btn-secondary">
              <i class="fas fa-external-link-alt"></i> Open in New Tab
            </button>
            <button onclick="regenerateIphoneChat()" class="btn-secondary">
              <i class="fas fa-redo"></i> Generate Again
            </button>
          </div>
        </div>
      `;
      
      // Clean up
      template.innerHTML = '';
      
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-bolt"></i> Generate iPhone Chat (Client-side)';
      }
      
      showNotification('<i class="fas fa-check"></i> iPhone chat generated successfully!');
      
    }, 'image/png', 0.9);

  } catch (error) {
    console.error('Generation failed:', error);
    
    resultBox.innerHTML = `
      <div class="nik-error" style="text-align: center; padding: 2rem;">
        <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
        <h3>Generation Failed</h3>
        <p>${error.message}</p>
        <div style="margin-top: 1.5rem;">
          <button onclick="generateIphoneChatClientSide()" class="btn-primary">
            <i class="fas fa-redo"></i> Try Again
          </button>
        </div>
      </div>
    `;
    
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-bolt"></i> Generate iPhone Chat (Client-side)';
    }
    
    showNotification('<i class="fas fa-times"></i> Generation failed');
  }
}

function regenerateIphoneChat() {
  generateIphoneChatClientSide();
}*/

// ===== 🤖 AI ASSISTANT =====
function showAIAssistant() {
  document.querySelectorAll('.main-content').forEach(el => el.style.display = 'none');
  
  const aiHTML = `
    <div class="section-title">
      <i class="fas fa-robot"></i>
      AI Assistant
    </div>
    
    <div class="ai-container">
      <div class="ai-sidebar">
        <div class="ai-sidebar-header">
          <h2><i class="fas fa-robot"></i> zamx</h2>
        </div>
        
        <button class="ai-new-chat-btn" id="aiNewChatBtn">
          <i class="fas fa-plus"></i> New Chat
        </button>
        
        <div class="ai-chat-history">
          <h3 style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">
            <i class="fas fa-history"></i> Chat History
          </h3>
          <div class="ai-history-list" id="aiHistoryList">
            <!-- History items will be added here -->
          </div>
        </div>
      </div>

      <div class="ai-main-content">
        <div class="ai-top-nav">
          <h1>ZAM AI Assistant</h1>
          <div class="ai-nav-actions">
            <button class="ai-theme-toggle" id="aiThemeToggle">
              <i class="fas fa-moon"></i>
            </button>
          </div>
        </div>

        <div class="ai-chat-container">
          <div class="ai-chat-messages" id="aiChatMessages">
            <div class="ai-welcome-message">
              <div class="ai-bot-avatar">
                <i class="fas fa-robot"></i>
              </div>
              <div class="ai-message-content">
                <h3 style="margin-bottom: 0.5rem;">Welcome to zam-ai!</h3>
                <p style="margin: 0;">I'm your AI assistant created by Azam el tukam. I can help you with coding, homework, general questions, and analyze images or files. How can I assist you today?</p>
              </div>
            </div>
          </div>
        </div>

        <div class="ai-message-input-container">
          <div class="ai-input-wrapper">
            <input type="file" id="aiFileInput" accept="*/*" style="display: none;">
            <button class="ai-file-upload-btn" id="aiFileUploadBtn" title="Upload file">
              <i class="fas fa-paperclip"></i>
            </button>
            <input type="text" id="aiMessageInput" placeholder="Type your message..." />
            <button class="ai-send-btn" id="aiSendBtn">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
          <div class="ai-file-preview" id="aiFilePreview">
            <div class="ai-file-info">
              <span class="ai-file-name" id="aiFileName"></span>
              <button class="ai-remove-file" id="aiRemoveFile">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="ai-loading-overlay" id="aiLoadingOverlay">
      <div class="ai-loading-spinner">
        <i class="fas fa-robot"></i>
        <p>zam-ai is thinking...</p>
      </div>
    </div>

    <button class="btn-secondary" onclick="backToMain()">
      <i class="fas fa-arrow-left"></i> Back to Main
    </button>
  `;
  
  const aiSection = document.getElementById('aiassistant');
  aiSection.innerHTML = aiHTML;
  aiSection.style.display = 'block';
  
  // Initialize AI Assistant
  initializeAIAssistant();
}

function initializeAIAssistant() {
  // This is a simplified version - you can expand this with the full AI functionality
  const messageInput = document.getElementById('aiMessageInput');
  const sendBtn = document.getElementById('aiSendBtn');
  const fileInput = document.getElementById('aiFileInput');
  const fileUploadBtn = document.getElementById('aiFileUploadBtn');
  const removeFileBtn = document.getElementById('aiRemoveFile');
  const filePreview = document.getElementById('aiFilePreview');
  const fileName = document.getElementById('aiFileName');
  const newChatBtn = document.getElementById('aiNewChatBtn');
  const themeToggle = document.getElementById('aiThemeToggle');
  
  // File upload handling
  fileUploadBtn.addEventListener('click', () => {
    fileInput.click();
  });
  
  fileInput.addEventListener('change', (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      fileName.textContent = file.name;
      filePreview.style.display = 'block';
    }
  });
  
  removeFileBtn.addEventListener('click', () => {
    fileInput.value = '';
    filePreview.style.display = 'none';
  });
  
  // Send message handling
  function sendMessage() {
    const message = messageInput.value.trim();
    const file = fileInput.files[0];
    
    if (!message && !file) return;
    
    // Add user message
    addAIMessage('user', message, file);
    
    // Clear input
    messageInput.value = '';
    fileInput.value = '';
    filePreview.style.display = 'none';
    
    // Show loading
    const loadingOverlay = document.getElementById('aiLoadingOverlay');
    loadingOverlay.style.display = 'flex';
    
    // Simulate AI response (replace with actual AI API call)
    setTimeout(() => {
      const responses = [
        "I understand your question! As an AI assistant, I can help you with various tasks including coding, analysis, and general knowledge.",
        "That's an interesting query! I'd be happy to help you with that. Could you provide more details?",
        "Great question! Based on my analysis, here's what I can suggest...",
        "I've processed your request. Here's the information you're looking for:",
        "As your AI assistant, I'm here to help! Let me break this down for you..."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addAIMessage('bot', randomResponse);
      
      // Hide loading
      loadingOverlay.style.display = 'none';
    }, 2000);
  }
  
  // Enter key to send message
  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  
  // Send button click
  sendBtn.addEventListener('click', sendMessage);
  
  // New chat button
  newChatBtn.addEventListener('click', () => {
    const chatMessages = document.getElementById('aiChatMessages');
    chatMessages.innerHTML = `
      <div class="ai-welcome-message">
        <div class="ai-bot-avatar">
          <i class="fas fa-robot"></i>
        </div>
        <div class="ai-message-content">
          <h3 style="margin-bottom: 0.5rem;">New Chat Started!</h3>
          <p style="margin: 0;">I'm ready to help you with anything you need. What would you like to know or work on today?</p>
        </div>
      </div>
    `;
  });
  
  // Theme toggle for AI section
  themeToggle.addEventListener('click', () => {
    const icon = themeToggle.querySelector('i');
    if (icon.classList.contains('fa-moon')) {
      icon.className = 'fas fa-sun';
      showNotification('<i class="fas fa-sun"></i> AI Assistant theme changed');
    } else {
      icon.className = 'fas fa-moon';
      showNotification('<i class="fas fa-moon"></i> AI Assistant theme changed');
    }
  });
}

function addAIMessage(sender, text, file = null) {
  const chatMessages = document.getElementById('aiChatMessages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `ai-message ${sender}`;

  const avatarDiv = document.createElement('div');
  avatarDiv.className = 'ai-message-avatar';
  avatarDiv.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

  const contentDiv = document.createElement('div');
  contentDiv.className = 'ai-message-content';

  if (file && sender === 'user') {
    const fileDiv = document.createElement('div');
    fileDiv.className = 'file-attachment';
    fileDiv.innerHTML = `<i class="fas fa-file"></i> <span>${file.name}</span>`;
    contentDiv.appendChild(fileDiv);
  }

  if (text) {
    const textDiv = document.createElement('div');
    textDiv.innerHTML = formatAIMessage(text);
    contentDiv.appendChild(textDiv);
  }

  messageDiv.appendChild(avatarDiv);
  messageDiv.appendChild(contentDiv);
  chatMessages.appendChild(messageDiv);

  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatAIMessage(text) {
  // Simple formatting for demonstration
  let formattedText = text;
  
  // Convert code blocks
  formattedText = formattedText.replace(/```(\w+)?\s*\n?([\s\S]*?)```/g, (match, language, code) => {
    const lang = language || 'text';
    const codeId = 'ai_code_' + Math.random().toString(36).substr(2, 9);
    
    return `
      <div class="ai-code-block-container">
        <div class="ai-code-header">
          <span class="ai-code-language">${lang.toUpperCase()}</span>
          <button class="ai-copy-code-btn" onclick="copyAICode('${codeId}')">
            <i class="fas fa-copy"></i> Copy
          </button>
        </div>
        <pre><code id="${codeId}">${code.trim()}</code></pre>
      </div>
    `;
  });
  
  // Convert inline code
  formattedText = formattedText.replace(/`([^`\n]+)`/g, '<code class="ai-inline-code">$1</code>');
  
  // Convert newlines to <br>
  formattedText = formattedText.replace(/\n/g, '<br>');
  
  return formattedText;
}

function copyAICode(codeId) {
  const codeElement = document.getElementById(codeId);
  if (codeElement) {
    const text = codeElement.textContent;
    navigator.clipboard.writeText(text).then(() => {
      const copyBtn = codeElement.closest('.ai-code-block-container').querySelector('.ai-copy-code-btn');
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
      copyBtn.style.background = '#10b981';
      
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
        copyBtn.style.background = '';
      }, 2000);
    });
  }
}

// ===== 🔐 PASSWORD GENERATOR =====
function showPasswordGenerator() {
  document.querySelectorAll('.main-content').forEach(el => el.style.display = 'none');
  
  const passwordHTML = `
    <div class="section-title">
      <i class="fas fa-key"></i>
      Password Generator
    </div>
    
    <div class="tool-container">
      <div class="password-settings">
        <div class="setting-group">
          <label class="setting-label">Password Length</label>
          <input type="range" id="lengthSlider" min="8" max="32" value="12" class="slider">
          <span id="lengthValue" class="value-display">12</span>
        </div>
        
        <div class="setting-group">
          <label class="setting-label">Include Uppercase</label>
          <input type="checkbox" id="uppercase" checked class="checkbox">
        </div>
        
        <div class="setting-group">
          <label class="setting-label">Include Lowercase</label>
          <input type="checkbox" id="lowercase" checked class="checkbox">
        </div>
        
        <div class="setting-group">
          <label class="setting-label">Include Numbers</label>
          <input type="checkbox" id="numbers" checked class="checkbox">
        </div>
        
        <div class="setting-group">
          <label class="setting-label">Include Symbols</label>
          <input type="checkbox" id="symbols" checked class="checkbox">
        </div>
      </div>
      
      <button onclick="generatePassword()" class="btn-primary generate-btn">
        <i class="fas fa-bolt"></i> Generate Password
      </button>
      
      <div class="password-result">
        <input type="text" id="passwordOutput" readonly class="password-output">
        <button onclick="copyPassword()" class="btn-secondary copy-btn">
          <i class="fas fa-copy"></i>
        </button>
      </div>
      
      <div class="password-strength">
        <div class="strength-bar">
          <div id="strengthFill" class="strength-fill"></div>
        </div>
        <span id="strengthText" class="strength-text">Strength: Medium</span>
      </div>
    </div>
    
    <button class="btn-secondary" onclick="backToMain()">
      <i class="fas fa-arrow-left"></i> Back to Main
    </button>
  `;
  
  const passSection = document.getElementById('passwordgenerator');
  passSection.innerHTML = passwordHTML;
  passSection.style.display = 'block';
  
  // Update slider value
  document.getElementById('lengthSlider').addEventListener('input', function() {
    document.getElementById('lengthValue').textContent = this.value;
  });
}

function generatePassword() {
  const length = parseInt(document.getElementById('lengthSlider').value);
  const uppercase = document.getElementById('uppercase').checked;
  const lowercase = document.getElementById('lowercase').checked;
  const numbers = document.getElementById('numbers').checked;
  const symbols = document.getElementById('symbols').checked;
  
  const chars = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };
  
  let charPool = '';
  if (uppercase) charPool += chars.uppercase;
  if (lowercase) charPool += chars.lowercase;
  if (numbers) charPool += chars.numbers;
  if (symbols) charPool += chars.symbols;
  
  if (!charPool) {
    showNotification('<i class="fas fa-exclamation-triangle"></i> Select at least one character type');
    return;
  }
  
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charPool.charAt(Math.floor(Math.random() * charPool.length));
  }
  
  document.getElementById('passwordOutput').value = password;
  updatePasswordStrength(password);
}

function copyPassword() {
  const password = document.getElementById('passwordOutput').value;
  if (!password) {
    showNotification('<i class="fas fa-exclamation-triangle"></i> No password to copy');
    return;
  }
  
  navigator.clipboard.writeText(password).then(() => {
    showNotification('<i class="fas fa-check"></i> Password copied!');
  });
}

function updatePasswordStrength(password) {
  let strength = 0;
  
  if (password.length >= 12) strength += 25;
  if (password.match(/[a-z]/)) strength += 25;
  if (password.match(/[A-Z]/)) strength += 25;
  if (password.match(/[0-9]/)) strength += 15;
  if (password.match(/[^a-zA-Z0-9]/)) strength += 10;
  
  const strengthFill = document.getElementById('strengthFill');
  const strengthText = document.getElementById('strengthText');
  
  strengthFill.style.width = strength + '%';
  
  if (strength >= 80) {
    strengthFill.style.background = '#4ecdc4';
    strengthText.textContent = 'Strength: Strong';
  } else if (strength >= 60) {
    strengthFill.style.background = '#ffd93d';
    strengthText.textContent = 'Strength: Good';
  } else if (strength >= 40) {
    strengthFill.style.background = '#ff9f43';
    strengthText.textContent = 'Strength: Medium';
  } else {
    strengthFill.style.background = '#ff6b6b';
    strengthText.textContent = 'Strength: Weak';
  }
}

// ===== 🔐 ADMIN PANEL =====
/*const ADMIN_PASSWORD = "admin123"; // Ganti dengan password kuat

function showAdminPanel() {
  document.querySelectorAll('.main-content').forEach(el => el.style.display = 'none');
  
  // Cek apakah sudah login
  const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
  
  if (isLoggedIn) {
    showAdminDashboard();
  } else {
    showAdminLoginForm();
  }
}

function showAdminLoginForm() {
  const adminHTML = `
    <div class="section-title">
      <i class="fas fa-user-shield"></i>
      Admin Login
    </div>

    <div class="tool-container">
      <div class="admin-login-form">
        <div class="setting-group">
          <label class="setting-label">Admin Password</label>
          <input type="password" id="adminPassword" placeholder="Enter admin password" class="password-input">
        </div>
        
        <button onclick="attemptAdminLogin()" class="btn-primary nik-button">
          <i class="fas fa-sign-in-alt"></i> Login
        </button>
        
        <div id="adminLoginResult" class="nik-result" style="margin-top: 1rem; display: none;"></div>
      </div>
    </div>

    <button class="btn-secondary" onclick="backToMain()">
      <i class="fas fa-arrow-left"></i> Back to Main
    </button>
  `;
  
  const adminSection = document.getElementById('admin');
  adminSection.innerHTML = adminHTML;
  adminSection.style.display = 'block';
}

function attemptAdminLogin() {
  const password = document.getElementById('adminPassword').value;
  const resultDiv = document.getElementById('adminLoginResult');
  
  if (!password) {
    resultDiv.innerHTML = '<div class="nik-error">Please enter password</div>';
    resultDiv.style.display = 'block';
    return;
  }
  
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem('adminLoggedIn', 'true');
    showAdminDashboard();
  } else {
    resultDiv.innerHTML = '<div class="nik-error">❌ Invalid password</div>';
    resultDiv.style.display = 'block';
  }
}

function showAdminDashboard() {
  // Hitung statistics
  const requests = JSON.parse(localStorage.getItem('telegram_requests') || '{"count": 0}');
  const totalRequests = requests.count;
  
  const adminHTML = `
    <div class="section-title">
      <i class="fas fa-cog"></i>
      Admin Dashboard
    </div>

    <div class="tool-container">
      <div class="admin-stats">
        <h4><i class="fas fa-chart-bar"></i> Statistics</h4>
        <div class="stat-grid">
          <div class="stat-item">
            <span class="stat-number">${totalRequests}</span>
            <span class="stat-label">Total Requests</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">${getActiveUsers()}</span>
            <span class="stat-label">Active Users</span>
          </div>
        </div>
      </div>

      <div class="admin-actions">
        <button class="admin-btn" onclick="resetAllLimits()">
          <i class="fas fa-refresh"></i>
          <div>
            <strong>Reset All Limits</strong>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">Reset request limits for all users</div>
          </div>
        </button>
        
        <button class="admin-btn" onclick="clearAllData()">
          <i class="fas fa-trash"></i>
          <div>
            <strong>Clear All Data</strong>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">Clear all stored data</div>
          </div>
        </button>
        
        <button class="admin-btn btn-danger" onclick="adminLogout()">
          <i class="fas fa-sign-out-alt"></i>
          <div>
            <strong>Logout</strong>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">Sign out from admin panel</div>
          </div>
        </button>
      </div>
    </div>

    <button class="btn-secondary" onclick="backToMain()">
      <i class="fas fa-arrow-left"></i> Back to Main
    </button>
  `;
  
  const adminSection = document.getElementById('admin');
  adminSection.innerHTML = adminHTML;
  adminSection.style.display = 'block';
}

function getActiveUsers() {
  // Simple active users count (based on localStorage data)
  let count = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes('telegram_requests')) {
      count++;
    }
  }
  return count;
}

function resetAllLimits() {
  // Clear all request limits
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes('telegram_requests')) {
      localStorage.removeItem(key);
    }
  }
  showNotification('✅ All limits reset successfully!');
  showAdminDashboard(); // Refresh view
}

function clearAllData() {
  if (confirm('Are you sure you want to clear ALL data? This cannot be undone!')) {
    localStorage.clear();
    showNotification('✅ All data cleared successfully!');
    showAdminDashboard();
  }
}

function adminLogout() {
  localStorage.removeItem('adminLoggedIn');
  showNotification('✅ Logged out successfully!');
  showAdminLoginForm();
}*/

// ===== 🎵 MUSIC PLAYER =====
/*function showMusicPlayer() {
  document.querySelectorAll('.main-content').forEach(el => el.style.display = 'none');
  
  const musicHTML = `
    <div class="section-title">
      <i class="fas fa-music"></i>
      Music Player
    </div>

    <div class="music-container">
      <div class="music-player">
        <div class="music-cover" id="musicCover">
          🎵
        </div>
        
        <div class="music-info">
          <div class="music-title" id="musicTitle">Select a song</div>
          <div class="music-artist" id="musicArtist">-</div>
        </div>

        <div class="progress-container" id="progressContainer">
          <div class="progress-bar" id="progressBar"></div>
        </div>
        
        <div class="time-display">
          <span id="currentTime">0:00</span>
          <span id="duration">0:00</span>
        </div>

        <div class="controls">
          <button class="control-btn" onclick="previousTrack()">
            <i class="fas fa-step-backward"></i>
          </button>
          
          <button class="control-btn play-pause" onclick="togglePlay()">
            <i class="fas fa-play" id="playIcon"></i>
          </button>
          
          <button class="control-btn" onclick="nextTrack()">
            <i class="fas fa-step-forward"></i>
          </button>
        </div>

        <div class="volume-control">
          <i class="fas fa-volume-up"></i>
          <input type="range" class="volume-slider" id="volumeSlider" min="0" max="1" step="0.1" value="0.7">
        </div>

        <button class="random-btn" id="randomBtn" onclick="toggleRandom()">
          <i class="fas fa-random"></i> Random
        </button>

        <div class="playlist" id="playlist">
          <h4 style="text-align: left; margin-bottom: 1rem; color: var(--text-primary);">
            <i class="fas fa-list"></i> Playlist
          </h4>
          ${generatePlaylistHTML()}
        </div>
      </div>
    </div>

    <button class="btn-secondary" onclick="backToMain()">
      <i class="fas fa-arrow-left"></i> Back to Main
    </button>
  `;
  
  const musicSection = document.getElementById('musicplayer');
  musicSection.innerHTML = musicHTML;
  musicSection.style.display = 'block';
  
  // Initialize music player
  initializeMusicPlayer();
}

function generatePlaylistHTML() {
  return defaultPlaylist.map((track, index) => `
    <div class="playlist-item ${index === currentTrackIndex ? 'active' : ''}" onclick="playTrack(${index})">
      <div class="playlist-cover">${track.cover}</div>
      <div class="playlist-info">
        <div class="playlist-title">${track.title}</div>
        <div class="playlist-artist">${track.artist}</div>
      </div>
      <div class="playlist-duration">${track.duration}</div>
    </div>
  `).join('');
}

function initializeMusicPlayer() {
  // Volume control
  const volumeSlider = document.getElementById('volumeSlider');
  volumeSlider.addEventListener('input', function() {
    if (currentAudio) {
      currentAudio.volume = this.value;
    }
  });

  // Progress bar click
  const progressContainer = document.getElementById('progressContainer');
  progressContainer.addEventListener('click', function(e) {
    if (!currentAudio) return;
    
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = currentAudio.duration;
    
    currentAudio.currentTime = (clickX / width) * duration;
  });
}

function playTrack(index) {
  // Stop current audio if playing
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  currentTrackIndex = index;
  const track = defaultPlaylist[index];

  // Update UI
  document.getElementById('musicTitle').textContent = track.title;
  document.getElementById('musicArtist').textContent = track.artist;
  document.getElementById('musicCover').textContent = track.cover;

  // Update playlist active state
  document.querySelectorAll('.playlist-item').forEach((item, i) => {
    item.classList.toggle('active', i === index);
  });

  // Create new audio element
  currentAudio = new Audio(track.url);
  currentAudio.volume = document.getElementById('volumeSlider').value;

  // Audio event listeners
  currentAudio.addEventListener('loadedmetadata', function() {
    document.getElementById('duration').textContent = formatTime(this.duration);
  });

  currentAudio.addEventListener('timeupdate', function() {
    const progressPercent = (this.currentTime / this.duration) * 100;
    document.getElementById('progressBar').style.width = `${progressPercent}%`;
    document.getElementById('currentTime').textContent = formatTime(this.currentTime);
  });

  currentAudio.addEventListener('ended', function() {
    nextTrack();
  });

  // Play the audio
  currentAudio.play();
  isPlaying = true;
  updatePlayButton();
}

function togglePlay() {
  if (!currentAudio) {
    playTrack(0);
    return;
  }

  if (isPlaying) {
    currentAudio.pause();
  } else {
    currentAudio.play();
  }
  
  isPlaying = !isPlaying;
  updatePlayButton();
}

function updatePlayButton() {
  const playIcon = document.getElementById('playIcon');
  playIcon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
}

function previousTrack() {
  let newIndex;
  if (isRandom) {
    newIndex = Math.floor(Math.random() * defaultPlaylist.length);
  } else {
    newIndex = currentTrackIndex - 1;
    if (newIndex < 0) newIndex = defaultPlaylist.length - 1;
  }
  playTrack(newIndex);
}

function nextTrack() {
  let newIndex;
  if (isRandom) {
    newIndex = Math.floor(Math.random() * defaultPlaylist.length);
  } else {
    newIndex = currentTrackIndex + 1;
    if (newIndex >= defaultPlaylist.length) newIndex = 0;
  }
  playTrack(newIndex);
}

function toggleRandom() {
  isRandom = !isRandom;
  const randomBtn = document.getElementById('randomBtn');
  randomBtn.classList.toggle('active', isRandom);
  randomBtn.innerHTML = isRandom ? 
    '<i class="fas fa-random"></i> Random ON' : 
    '<i class="fas fa-random"></i> Random';
}

function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
  if (document.getElementById('musicplayer').style.display === 'block') {
    switch(e.code) {
      case 'Space':
        e.preventDefault();
        togglePlay();
        break;
      case 'ArrowLeft':
        previousTrack();
        break;
      case 'ArrowRight':
        nextTrack();
        break;
    }
  }
});*/

// ===== 🎵 MUSIC PLAYER VARIABLES =====
let currentAudio = null;
let currentTrackIndex = 0;
let isPlaying = false;
let isRandom = false;

const defaultPlaylist = [
  {
    title: "Lofi Study",
    artist: "Chill Vibes",
    cover: "🎵",
    url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_d5ba5c7c95.mp3?filename=lofi-study-112191.mp3",
    duration: "2:45"
  },
  {
    title: "Relaxing Piano", 
    artist: "Peaceful Music",
    cover: "🎹",
    url: "https://cdn.pixabay.com/download/audio/2022/11/11/audio_526e4b8e5c.mp3?filename=relaxing-piano-121912.mp3",
    duration: "3:20"
  },
  {
    title: "Ambient Space",
    artist: "Cosmic Sounds", 
    cover: "🌌",
    url: "https://cdn.pixabay.com/download/audio/2022/10/25/audio_6a8e4f0b1e.mp3?filename=ambient-space-120994.mp3",
    duration: "4:15"
  }
];

// ===== 🎵 MUSIC PLAYER FUNCTIONS =====
function showMusicPlayer() {
  document.querySelectorAll('.main-content').forEach(el => el.style.display = 'none');
  
  const musicHTML = `
    <div class="section-title">
      <i class="fas fa-music"></i>
      Music Player
    </div>

    <div class="music-container">
      <div class="music-player">
        <div class="music-cover" id="musicCover">
          🎵
        </div>
        
        <div class="music-info">
          <div class="music-title" id="musicTitle">Select a song</div>
          <div class="music-artist" id="musicArtist">-</div>
        </div>

        <div class="progress-container" id="progressContainer">
          <div class="progress-bar" id="progressBar"></div>
        </div>
        
        <div class="time-display">
          <span id="currentTime">0:00</span>
          <span id="duration">0:00</span>
        </div>

        <div class="controls">
          <button class="control-btn" onclick="previousTrack()">
            <i class="fas fa-step-backward"></i>
          </button>
          
          <button class="control-btn play-pause" onclick="togglePlay()">
            <i class="fas fa-play" id="playIcon"></i>
          </button>
          
          <button class="control-btn" onclick="nextTrack()">
            <i class="fas fa-step-forward"></i>
          </button>
        </div>

        <div class="volume-control">
          <i class="fas fa-volume-up"></i>
          <input type="range" class="volume-slider" id="volumeSlider" min="0" max="1" step="0.1" value="0.7">
        </div>

        <button class="random-btn" id="randomBtn" onclick="toggleRandom()">
          <i class="fas fa-random"></i> Random
        </button>

        <div class="playlist" id="playlist">
          <h4 style="text-align: left; margin-bottom: 1rem; color: var(--text-primary);">
            <i class="fas fa-list"></i> Playlist
          </h4>
          ${generatePlaylistHTML()}
        </div>
      </div>
    </div>

    <button class="btn-secondary" onclick="backToMain()">
      <i class="fas fa-arrow-left"></i> Back to Main
    </button>
  `;
  
  const musicSection = document.getElementById('musicplayer');
  musicSection.innerHTML = musicHTML;
  musicSection.style.display = 'block';
  
  // Initialize music player
  initializeMusicPlayer();
}

function generatePlaylistHTML() {
  return defaultPlaylist.map((track, index) => `
    <div class="playlist-item ${index === currentTrackIndex ? 'active' : ''}" onclick="playTrack(${index})">
      <div style="width: 40px; height: 40px; border-radius: 5px; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
        ${track.cover}
      </div>
      <div class="playlist-info">
        <div class="playlist-title">${track.title}</div>
        <div class="playlist-artist">${track.artist}</div>
      </div>
      <div class="playlist-duration">${track.duration}</div>
    </div>
  `).join('');
}

function initializeMusicPlayer() {
  // Volume control
  const volumeSlider = document.getElementById('volumeSlider');
  if (volumeSlider) {
    volumeSlider.addEventListener('input', function() {
      if (currentAudio) {
        currentAudio.volume = this.value;
      }
    });
  }

  // Progress bar click
  const progressContainer = document.getElementById('progressContainer');
  if (progressContainer) {
    progressContainer.addEventListener('click', function(e) {
      if (!currentAudio) return;
      
      const width = this.clientWidth;
      const clickX = e.offsetX;
      const duration = currentAudio.duration;
      
      currentAudio.currentTime = (clickX / width) * duration;
    });
  }
}

function playTrack(index) {
  // Stop current audio if playing
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  currentTrackIndex = index;
  const track = defaultPlaylist[index];

  // Update UI
  document.getElementById('musicTitle').textContent = track.title;
  document.getElementById('musicArtist').textContent = track.artist;
  document.getElementById('musicCover').textContent = track.cover;

  // Update playlist active state
  document.querySelectorAll('.playlist-item').forEach((item, i) => {
    item.classList.toggle('active', i === index);
  });

  // Create new audio element
  currentAudio = new Audio(track.url);
  currentAudio.volume = document.getElementById('volumeSlider').value;

  // Audio event listeners
  currentAudio.addEventListener('loadedmetadata', function() {
    document.getElementById('duration').textContent = formatTime(this.duration);
  });

  currentAudio.addEventListener('timeupdate', function() {
    const progressPercent = (this.currentTime / this.duration) * 100;
    document.getElementById('progressBar').style.width = `${progressPercent}%`;
    document.getElementById('currentTime').textContent = formatTime(this.currentTime);
  });

  currentAudio.addEventListener('ended', function() {
    nextTrack();
  });

  // Play the audio
  currentAudio.play().catch(e => {
    console.log('Audio play failed:', e);
    showNotification('<i class="fas fa-exclamation-triangle"></i> Cannot play audio. Please try another track.');
  });
  
  isPlaying = true;
  updatePlayButton();
}

function togglePlay() {
  if (!currentAudio) {
    playTrack(0);
    return;
  }

  if (isPlaying) {
    currentAudio.pause();
  } else {
    currentAudio.play().catch(e => {
      console.log('Audio play failed:', e);
    });
  }
  
  isPlaying = !isPlaying;
  updatePlayButton();
}

function updatePlayButton() {
  const playIcon = document.getElementById('playIcon');
  if (playIcon) {
    playIcon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
  }
}

function previousTrack() {
  let newIndex;
  if (isRandom) {
    newIndex = Math.floor(Math.random() * defaultPlaylist.length);
  } else {
    newIndex = currentTrackIndex - 1;
    if (newIndex < 0) newIndex = defaultPlaylist.length - 1;
  }
  playTrack(newIndex);
}

function nextTrack() {
  let newIndex;
  if (isRandom) {
    newIndex = Math.floor(Math.random() * defaultPlaylist.length);
  } else {
    newIndex = currentTrackIndex + 1;
    if (newIndex >= defaultPlaylist.length) newIndex = 0;
  }
  playTrack(newIndex);
}

function toggleRandom() {
  isRandom = !isRandom;
  const randomBtn = document.getElementById('randomBtn');
  if (randomBtn) {
    randomBtn.classList.toggle('active', isRandom);
    randomBtn.innerHTML = isRandom ? 
      '<i class="fas fa-random"></i> Random ON' : 
      '<i class="fas fa-random"></i> Random';
  }
}

function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ===== 📶 QR WIFI READER =====
function showQRWiFiReader() {
  document.querySelectorAll('.main-content').forEach(el => el.style.display = 'none');
  
  const qrHTML = `
    <div class="section-title">
      <i class="fas fa-wifi"></i>
      QR WiFi Reader
    </div>

    <div class="qrwifi-container">
      <div class="upload-container" id="dropArea">
        <i class="fas fa-qrcode" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
        <p style="color: var(--text-secondary); margin-bottom: 1rem;">
          Drag & drop QR code WiFi atau klik untuk upload
        </p>
        <input type="file" id="fileInput" class="file-input" accept="image/*">
        <button class="upload-btn" id="uploadButton">
          <i class="fas fa-upload"></i> Upload Gambar
        </button>
      </div>

      <div class="loading" id="loading">
        <div class="loading-spinner"></div>
        <p style="color: var(--text-secondary);">Memproses QR code...</p>
      </div>

      <div class="preview-container">
        <img id="preview" src="" alt="Preview QR Code">
      </div>

      <div class="wifi-result" id="wifiResult">
        <h4 style="color: var(--text-primary); margin-bottom: 1rem;">
          <i class="fas fa-network-wired"></i> Informasi WiFi
        </h4>
        <div class="wifi-info">
          <span class="wifi-label">SSID:</span>
          <span class="wifi-value" id="wifiSsid">-</span>
        </div>
        <div class="wifi-info">
          <span class="wifi-label">Password:</span>
          <span class="wifi-value" id="wifiPassword">-</span>
        </div>
        <div class="wifi-info">
          <span class="wifi-label">Enkripsi:</span>
          <span class="wifi-value" id="wifiEncryption">-</span>
        </div>
        <div class="wifi-info">
          <span class="wifi-label">Hidden:</span>
          <span class="wifi-value" id="wifiHidden">-</span>
        </div>
      </div>

      <div class="raw-data" id="rawData"></div>
      <button class="copy-btn" id="copyButton">
        <i class="fas fa-copy"></i> Salin Data QR
      </button>

      <div class="error-container" id="errorContainer">
        <p id="errorMessage"></p>
      </div>

      <div class="instructions">
        <h4><i class="fas fa-info-circle"></i> Cara Menggunakan:</h4>
        <ol>
          <li>Upload gambar QR code WiFi</li>
          <li>Tunggu proses scanning selesai</li>
          <li>Informasi WiFi akan ditampilkan otomatis</li>
          <li>Salin password untuk connect ke WiFi</li>
        </ol>
      </div>
    </div>

    <button class="btn-secondary" onclick="backToMain()">
      <i class="fas fa-arrow-left"></i> Back to Main
    </button>
  `;
  
  const qrSection = document.getElementById('qrwifi');
  qrSection.innerHTML = qrHTML;
  qrSection.style.display = 'block';
  
  // Initialize QR reader functionality
  initializeQRReader();
}

function initializeQRReader() {
  const fileInput = document.getElementById('fileInput');
  const uploadButton = document.getElementById('uploadButton');
  const dropArea = document.getElementById('dropArea');
  const preview = document.getElementById('preview');
  const loading = document.getElementById('loading');
  const wifiResult = document.getElementById('wifiResult');
  const rawData = document.getElementById('rawData');
  const copyButton = document.getElementById('copyButton');
  const errorContainer = document.getElementById('errorContainer');
  const errorMessage = document.getElementById('errorMessage');

  // Upload button click
  uploadButton.addEventListener('click', () => {
    fileInput.click();
  });

  // File input change
  fileInput.addEventListener('change', handleFileSelect);

  // Drag and drop functionality
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => dropArea.classList.add('highlight'), false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => dropArea.classList.remove('highlight'), false);
  });

  dropArea.addEventListener('drop', handleDrop, false);

  function handleDrop(e) {
    const files = e.dataTransfer.files;
    if (files.length) {
      fileInput.files = files;
      handleFileSelect(e);
    }
  }

  // Copy button
  copyButton.addEventListener('click', () => {
    const text = rawData.textContent;
    navigator.clipboard.writeText(text).then(() => {
      copyButton.innerHTML = '<i class="fas fa-check"></i> Tersalin!';
      setTimeout(() => {
        copyButton.innerHTML = '<i class="fas fa-copy"></i> Salin Data QR';
      }, 2000);
    });
  });

  function handleFileSelect(event) {
    const file = event.target.files[0] || event.dataTransfer.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      showError('Silakan upload file gambar (JPG, PNG, dll).');
      return;
    }

    // Reset UI
    wifiResult.style.display = 'none';
    rawData.style.display = 'none';
    copyButton.style.display = 'none';
    errorContainer.style.display = 'none';
    loading.style.display = 'block';

    const reader = new FileReader();
    reader.onload = function(e) {
      preview.src = e.target.result;
      preview.style.display = 'block';
      processQRCode(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  function processQRCode(imageData) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      
      // Use jsQR library to decode
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      
      loading.style.display = 'none';

      if (code) {
        rawData.textContent = code.data;
        rawData.style.display = 'block';
        copyButton.style.display = 'block';
        parseWifiQRCode(code.data);
      } else {
        showError('Tidak dapat membaca QR code. Pastikan gambar jelas dan mengandung QR code WiFi yang valid.');
      }
    };
    img.onerror = function() {
      loading.style.display = 'none';
      showError('Gagal memuat gambar. Silakan coba dengan gambar lain.');
    };
    img.src = imageData;
  }

  function parseWifiQRCode(data) {
    let ssid = '-';
    let password = '-';
    let encryption = '-';
    let hidden = 'Tidak';

    // Standard WiFi QR code format
    const wifiRegex = /^WIFI:T:([^;]+);S:([^;]+);P:([^;]+);(?:H:([^;]+);)?/;
    const match = data.match(wifiRegex);

    if (match) {
      encryption = decodeURIComponent(match[1]);
      ssid = decodeURIComponent(match[2]);
      password = decodeURIComponent(match[3]);
      hidden = match[4] ? (match[4].toLowerCase() === 'true' ? 'Ya' : 'Tidak') : 'Tidak';
    } else {
      // Alternative format
      const ssidMatch = data.match(/(?:^|;)S:([^;]+)(?:;|$)/);
      const pwdMatch = data.match(/(?:^|;)P:([^;]+)(?:;|$)/);
      const encMatch = data.match(/(?:^|;)T:([^;]+)(?:;|$)/);
      const hiddenMatch = data.match(/(?:^|;)H:([^;]+)(?:;|$)/);
      
      if (ssidMatch) ssid = decodeURIComponent(ssidMatch[1]);
      if (pwdMatch) password = decodeURIComponent(pwdMatch[1]);
      if (encMatch) encryption = decodeURIComponent(encMatch[1]);
      if (hiddenMatch) hidden = hiddenMatch[1].toLowerCase() === 'true' ? 'Ya' : 'Tidak';

      if (!ssidMatch && !pwdMatch && !encMatch) {
        showError('Format QR code tidak dikenali. Data mentah telah ditampilkan di bawah.');
        wifiResult.style.display = 'block';
        return;
      }
    }

    // Update UI
    document.getElementById('wifiSsid').textContent = ssid;
    document.getElementById('wifiPassword').textContent = password;
    document.getElementById('wifiEncryption').textContent = encryption;
    document.getElementById('wifiHidden').textContent = hidden;
    
    wifiResult.style.display = 'block';
    errorContainer.style.display = 'none';
  }

  function showError(message) {
    errorMessage.textContent = message;
    errorContainer.style.display = 'block';
    wifiResult.style.display = 'none';
    loading.style.display = 'none';
  }
}

// Load jsQR library dynamically
function loadJSQR() {
  return new Promise((resolve, reject) => {
    if (typeof jsQR !== 'undefined') {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}



// ===== 🔐 TEXT ENCRYPTION =====
function showTextEncryption() {
  document.querySelectorAll('.main-content').forEach(el => el.style.display = 'none');
  
  const encryptionHTML = `
    <div class="section-title">
      <i class="fas fa-lock"></i>
      Text Encryption
    </div>
    
    <div class="tool-container">
      <div class="encryption-tabs">
        <button class="tab-btn active" onclick="switchEncryptionTab('base64')">Base64</button>
        <button class="tab-btn" onclick="switchEncryptionTab('caesar')">Caesar Cipher</button>
      </div>
      
      <div id="base64Tab" class="tab-content active">
        <textarea id="base64Input" placeholder="Enter text to encode/decode..." class="text-area"></textarea>
        <div class="encryption-buttons">
          <button onclick="base64Encode()" class="btn-primary">
            <i class="fas fa-lock"></i> Encode
          </button>
          <button onclick="base64Decode()" class="btn-secondary">
            <i class="fas fa-unlock"></i> Decode
          </button>
        </div>
        <textarea id="base64Output" readonly placeholder="Result will appear here..." class="text-area output"></textarea>
      </div>
      
      <div id="caesarTab" class="tab-content">
        <div class="caesar-controls">
          <label class="setting-label">Shift Amount</label>
          <input type="number" id="caesarShift" min="1" max="25" value="3" class="number-input">
        </div>
        <textarea id="caesarInput" placeholder="Enter text to encrypt/decrypt..." class="text-area"></textarea>
        <div class="encryption-buttons">
          <button onclick="caesarEncrypt()" class="btn-primary">
            <i class="fas fa-lock"></i> Encrypt
          </button>
          <button onclick="caesarDecrypt()" class="btn-secondary">
            <i class="fas fa-unlock"></i> Decrypt
          </button>
        </div>
        <textarea id="caesarOutput" readonly placeholder="Result will appear here..." class="text-area output"></textarea>
      </div>
      
      <button onclick="copyEncryptionResult()" class="btn-secondary">
        <i class="fas fa-copy"></i> Copy Result
      </button>
    </div>
    
    <button class="btn-secondary" onclick="backToMain()">
      <i class="fas fa-arrow-left"></i> Back to Main
    </button>
  `;
  
  const encryptSection = document.getElementById('textencryption');
  encryptSection.innerHTML = encryptionHTML;
  encryptSection.style.display = 'block';
}

function switchEncryptionTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  
  event.target.classList.add('active');
  document.getElementById(tabName + 'Tab').classList.add('active');
}

function base64Encode() {
  const input = document.getElementById('base64Input').value;
  const encoded = btoa(unescape(encodeURIComponent(input)));
  document.getElementById('base64Output').value = encoded;
}

function base64Decode() {
  const input = document.getElementById('base64Input').value;
  try {
    const decoded = decodeURIComponent(escape(atob(input)));
    document.getElementById('base64Output').value = decoded;
  } catch (error) {
    document.getElementById('base64Output').value = 'Error: Invalid Base64 input';
  }
}

function caesarEncrypt() {
  const input = document.getElementById('caesarInput').value;
  const shift = parseInt(document.getElementById('caesarShift').value);
  let result = '';
  
  for (let i = 0; i < input.length; i++) {
    let char = input[i];
    if (char.match(/[a-z]/i)) {
      const code = input.charCodeAt(i);
      if (code >= 65 && code <= 90) {
        char = String.fromCharCode(((code - 65 + shift) % 26) + 65);
      } else if (code >= 97 && code <= 122) {
        char = String.fromCharCode(((code - 97 + shift) % 26) + 97);
      }
    }
    result += char;
  }
  
  document.getElementById('caesarOutput').value = result;
}

function caesarDecrypt() {
  const input = document.getElementById('caesarInput').value;
  const shift = parseInt(document.getElementById('caesarShift').value);
  let result = '';
  
  for (let i = 0; i < input.length; i++) {
    let char = input[i];
    if (char.match(/[a-z]/i)) {
      const code = input.charCodeAt(i);
      if (code >= 65 && code <= 90) {
        char = String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
      } else if (code >= 97 && code <= 122) {
        char = String.fromCharCode(((code - 97 - shift + 26) % 26) + 97);
      }
    }
    result += char;
  }
  
  document.getElementById('caesarOutput').value = result;
}

function copyEncryptionResult() {
  const activeTab = document.querySelector('.tab-content.active');
  const output = activeTab.querySelector('.output').value;
  
  if (!output) {
    showNotification('<i class="fas fa-exclamation-triangle"></i> No result to copy');
    return;
  }
  
  navigator.clipboard.writeText(output).then(() => {
    showNotification('<i class="fas fa-check"></i> Result copied!');
  });
}

// ===== KALKULATOR =====
function showCalculator() {
  document.querySelectorAll('.main-content').forEach(el => el.style.display = 'none');
  
  const calculatorHTML = `
    <div class="section-title">
      <i class="fas fa-calculator"></i>
      Calculator
    </div>
    
    <div class="calculator-container">
      <input type="text" placeholder="0" id="output-screen" readonly>
      <div class="calculator-buttons">
        <button onclick="calcClr()" class="calc-btn">CL</button>
        <button onclick="calcDel()" class="calc-btn">DEL</button>
        <button onclick="calcDisplay('%')" class="calc-btn">%</button>
        <button onclick="calcDisplay('/')" class="calc-btn">/</button>
        <button onclick="calcDisplay('7')" class="calc-btn">7</button>
        <button onclick="calcDisplay('8')" class="calc-btn">8</button>
        <button onclick="calcDisplay('9')" class="calc-btn">9</button>
        <button onclick="calcDisplay('*')" class="calc-btn">×</button>
        <button onclick="calcDisplay('4')" class="calc-btn">4</button>
        <button onclick="calcDisplay('5')" class="calc-btn">5</button>
        <button onclick="calcDisplay('6')" class="calc-btn">6</button>
        <button onclick="calcDisplay('-')" class="calc-btn">-</button>
        <button onclick="calcDisplay('1')" class="calc-btn">1</button>
        <button onclick="calcDisplay('2')" class="calc-btn">2</button>
        <button onclick="calcDisplay('3')" class="calc-btn">3</button>
        <button onclick="calcDisplay('+')" class="calc-btn">+</button>
        <button onclick="calcDisplay('.')" class="calc-btn">.</button>
        <button onclick="calcDisplay('0')" class="calc-btn">0</button>
        <button onclick="calcCalculate()" class="calc-btn equal">=</button>
      </div>
    </div>
    
    <button class="btn-secondary" onclick="backToMain()">
      <i class="fas fa-arrow-left"></i> Back to Main
    </button>
  `;
  
  const calcSection = document.getElementById('calculator');
  calcSection.innerHTML = calculatorHTML;
  calcSection.style.display = 'block';
}

// Fungsi kalkulator
function calcDisplay(num) {
  const output = document.getElementById('output-screen');
  output.value += num;
}

function calcCalculate() {
  try {
    const output = document.getElementById('output-screen');
    output.value = eval(output.value);
  } catch (err) {
    showNotification('<i class="fas fa-exclamation-triangle"></i> Invalid calculation');
  }
}

function calcClr() {
  document.getElementById('output-screen').value = '';
}

function calcDel() {
  const output = document.getElementById('output-screen');
  output.value = output.value.slice(0, -1);
}

// ===== TIC TAC TOE =====
function showTicTacToe() {
  document.querySelectorAll('.main-content').forEach(el => el.style.display = 'none');
  
  const tictactoeHTML = `
    <div class="section-title">
      <i class="fas fa-gamepad"></i>
      Tic Tac Toe
    </div>
    
    <div class="tictactoe-container">
      <div id="tictactoe-board"></div>
      <div id="tictactoe-output">Player X's turn</div>
      <div class="tictactoe-controls">
        <button class="btn-primary" onclick="resetTicTacToe()">
          <i class="fas fa-redo"></i> Restart Game
        </button>
        <button class="btn-secondary" onclick="switchTicTacToeMode()">
          <i class="fas fa-robot"></i> Mode: <span id="mode-text">PvP</span>
        </button>
      </div>
    </div>
    
    <button class="btn-secondary" onclick="backToMain()">
      <i class="fas fa-arrow-left"></i> Back to Main
    </button>
  `;
  
  const tttSection = document.getElementById('tictactoe');
  tttSection.innerHTML = tictactoeHTML;
  tttSection.style.display = 'block';
  
  initializeTicTacToe();
}

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let vsAI = false;

function initializeTicTacToe() {
  const board = document.getElementById('tictactoe-board');
  board.innerHTML = '';
  board.style.display = 'grid';
  
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'tictactoe-cell';
    cell.id = `cell-${i}`;
    cell.addEventListener('click', () => makeMove(i));
    board.appendChild(cell);
  }
  
  resetTicTacToe();
}

function makeMove(index) {
  if (!gameActive || gameBoard[index] !== '') return;
  
  gameBoard[index] = currentPlayer;
  document.getElementById(`cell-${index}`).textContent = currentPlayer;
  document.getElementById(`cell-${index}`).classList.add(`player-${currentPlayer}`);
  
  if (checkWinner()) {
    document.getElementById('tictactoe-output').textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    return;
  }
  
  if (gameBoard.every(cell => cell !== '')) {
    document.getElementById('tictactoe-output').textContent = "It's a draw!";
    gameActive = false;
    return;
  }
  
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  document.getElementById('tictactoe-output').textContent = `Player ${currentPlayer}'s turn`;
  
  if (vsAI && currentPlayer === 'O' && gameActive) {
    setTimeout(makeAIMove, 500);
  }
}

function makeAIMove() {
  const emptyCells = gameBoard.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
  if (emptyCells.length === 0) return;
  
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  makeMove(emptyCells[randomIndex]);
}

function checkWinner() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  
  return winPatterns.some(pattern => {
    const [a, b, c] = pattern;
    return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
  });
}

function resetTicTacToe() {
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameActive = true;
  
  for (let i = 0; i < 9; i++) {
    const cell = document.getElementById(`cell-${i}`);
    if (cell) {
      cell.textContent = '';
      cell.classList.remove('player-X', 'player-O');
    }
  }
  
  document.getElementById('tictactoe-output').textContent = "Player X's turn";
  
  if (vsAI && currentPlayer === 'O') {
    setTimeout(makeAIMove, 500);
  }
}

function switchTicTacToeMode() {
  vsAI = !vsAI;
  document.getElementById('mode-text').textContent = vsAI ? 'PvAI' : 'PvP';
  resetTicTacToe();
}

// ===== 📱 TELEGRAM REQUEST FEATURE =====
/*const TELEGRAM_BOT_TOKEN = '8470962705:AAEM_nC-i9q4kdqFbGX3TR_jJwaSufqb2_g';
const TELEGRAM_CHAT_ID = '7710986992';
const MAX_REQUESTS = 3; // Maksimal 3 request
const TIME_WINDOW = 12 * 60 * 60 * 1000; // 12 jam dalam milidetik

function showRequestFeature() {
  document.querySelectorAll('.main-content').forEach(el => el.style.display = 'none');
  
  const requestCount = getRequestCount();
  const remainingRequests = MAX_REQUESTS - requestCount.count;
  const timeLeft = getTimeLeft(requestCount.lastRequest);
  
  const requestHTML = `
    <div class="section-title">
      <i class="fas fa-paper-plane"></i>
      Request Feature
    </div>

    <div class="tool-container">
      <div class="request-info" style="
        background: ${remainingRequests > 0 ? 'rgba(78, 205, 196, 0.1)' : 'rgba(255, 107, 107, 0.1)'};
        border: 1px solid ${remainingRequests > 0 ? 'rgba(78, 205, 196, 0.3)' : 'rgba(255, 107, 107, 0.3)'};
        border-radius: 10px;
        padding: 1rem;
        margin-bottom: 1rem;
        text-align: center;
      ">
        <div style="font-size: 2rem; font-weight: bold; color: ${remainingRequests > 0 ? '#4ecdc4' : '#ff6b6b'}">
          ${remainingRequests} / ${MAX_REQUESTS}
        </div>
        <div style="color: var(--text-secondary); font-size: 0.9rem;">
          Requests remaining (resets in ${timeLeft})
        </div>
        ${remainingRequests === 0 ? `
          <div style="color: #ff6b6b; margin-top: 0.5rem; font-weight: 600;">
            <i class="fas fa-clock"></i> Limit reached. Try again later.
          </div>
        ` : ''}
      </div>
      
      <div class="nik-input-section">
        <label for="requestInput" class="nik-label">Your Request Message</label>
        <textarea 
          id="requestInput" 
          placeholder="Describe your feature request or bug report..." 
          class="text-area" 
          rows="4"
          ${remainingRequests === 0 ? 'disabled' : ''}
        ></textarea>
        
        <div class="setting-group">
          <label class="setting-label">Your Name (optional)</label>
          <input 
            type="text" 
            id="requesterName" 
            placeholder="Enter your name" 
            class="nik-input"
            ${remainingRequests === 0 ? 'disabled' : ''}
          >
        </div>
        
        <button 
          onclick="sendTelegramRequest()" 
          class="btn-primary nik-button"
          ${remainingRequests === 0 ? 'disabled' : ''}
          style="${remainingRequests === 0 ? 'opacity: 0.5; cursor: not-allowed;' : ''}"
        >
          <i class="fas fa-paper-plane"></i> 
          ${remainingRequests === 0 ? 'Limit Reached' : 'Send Request'}
        </button>
      </div>
      
      <div id="requestResult" class="nik-result" style="margin-top: 1rem; display: none;"></div>
    </div>

    <button class="btn-secondary" onclick="backToMain()">
      <i class="fas fa-arrow-left"></i> Back to Main
    </button>
  `;
  
  const requestSection = document.getElementById('request');
  requestSection.innerHTML = requestHTML;
  requestSection.style.display = 'block';
}

// Fungsi untuk mendapatkan jumlah request
function getRequestCount() {
  const now = Date.now();
  const requests = JSON.parse(localStorage.getItem('telegram_requests') || '{"count": 0, "lastRequest": 0}');
  
  // Reset jika sudah lewat 12 jam
  if (now - requests.lastRequest > TIME_WINDOW) {
    return { count: 0, lastRequest: now };
  }
  
  return requests;
}

// Fungsi untuk update jumlah request
function updateRequestCount() {
  const requests = getRequestCount();
  requests.count += 1;
  requests.lastRequest = Date.now();
  localStorage.setItem('telegram_requests', JSON.stringify(requests));
  return requests;
}

// Fungsi untuk menghitung sisa waktu
function getTimeLeft(lastRequest) {
  const now = Date.now();
  const timePassed = now - lastRequest;
  const timeLeft = TIME_WINDOW - timePassed;
  
  if (timeLeft <= 0) return '0 hours';
  
  const hours = Math.floor(timeLeft / (60 * 60 * 1000));
  const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
  
  return `${hours}h ${minutes}m`;
}

async function sendTelegramRequest() {
  const message = document.getElementById('requestInput').value;
  const name = document.getElementById('requesterName').value || 'Anonymous';
  const resultDiv = document.getElementById('requestResult');
  
  // Cek limit
  const requestCount = getRequestCount();
  if (requestCount.count >= MAX_REQUESTS) {
    resultDiv.innerHTML = '<div class="nik-error">❌ Request limit reached (3 per 12 hours). Please try again later.</div>';
    resultDiv.style.display = 'block';
    return;
  }

  if (!message) {
    resultDiv.innerHTML = '<div class="nik-error">Please enter your request message</div>';
    resultDiv.style.display = 'block';
    return;
  }
  
  if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN === '8470962705:AAEM_nC-i9q4kdqFbGX3TR_jJwaSufqb2_g') {
    resultDiv.innerHTML = '<div class="nik-error">Telegram bot not configured</div>';
    resultDiv.style.display = 'block';
    return;
  }
  
  // Update request count
  updateRequestCount();
  
  const requestData = {
    name: name,
    message: message,
    timestamp: new Date().toLocaleString(),
    userAgent: navigator.userAgent,
    requestNumber: requestCount.count + 1
  };
  
  const telegramMessage = `
🆕 *New Feature Request* (#${requestData.requestNumber}/3)

👤 *From:* ${requestData.name}
⏰ *Time:* ${requestData.timestamp}
📱 *Browser:* ${requestData.userAgent}

💬 *Message:*
${requestData.message}

⏳ *Requests used:* ${requestCount.count + 1}/3 (Resets in 12 hours)
  `;
  
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: telegramMessage,
        parse_mode: 'Markdown'
      })
    });
    
    const result = await response.json();
    
    if (result.ok) {
      resultDiv.innerHTML = `
        <div class="nik-success">
          ✅ Request sent successfully! 
          <br><small>Requests remaining: ${MAX_REQUESTS - (requestCount.count + 1)}/3</small>
        </div>
      `;
      document.getElementById('requestInput').value = '';
      document.getElementById('requesterName').value = '';
      
      // Refresh tampilan untuk update limit
      setTimeout(() => {
        showRequestFeature();
      }, 2000);
    } else {
      resultDiv.innerHTML = '<div class="nik-error">❌ Failed to send request. Please try again later.</div>';
    }
  } catch (error) {
    resultDiv.innerHTML = '<div class="nik-error">❌ Network error. Please check your connection.</div>';
  }
  
  resultDiv.style.display = 'block';
  
  setTimeout(() => {
    resultDiv.style.display = 'none';
  }, 5000);
}*/
// ===== 📱 TELEGRAM REQUEST FEATURE =====
const TELEGRAM_BOT_TOKEN = '8470962705:AAEM_nC-i9q4kdqFbGX3TR_jJwaSufqb2_g';
const TELEGRAM_CHAT_ID = '7710986992';
const MAX_REQUESTS = 3;
const TIME_WINDOW = 12 * 60 * 60 * 1000;

// Fungsi untuk mendapatkan jumlah request
function getRequestCount() {
  const now = Date.now();
  const requests = JSON.parse(localStorage.getItem('telegram_requests') || '{"count": 0, "lastRequest": 0}');
  
  if (now - requests.lastRequest > TIME_WINDOW) {
    return { count: 0, lastRequest: now };
  }
  
  return requests;
}

// Fungsi untuk update jumlah request
function updateRequestCount() {
  const requests = getRequestCount();
  requests.count += 1;
  requests.lastRequest = Date.now();
  localStorage.setItem('telegram_requests', JSON.stringify(requests));
  return requests;
}

// Fungsi untuk menghitung sisa waktu
function getTimeLeft(lastRequest) {
  const now = Date.now();
  const timePassed = now - lastRequest;
  const timeLeft = TIME_WINDOW - timePassed;
  
  if (timeLeft <= 0) return '0 hours';
  
  const hours = Math.floor(timeLeft / (60 * 60 * 1000));
  const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
  
  return `${hours}h ${minutes}m`;
}

// Fungsi utama show request feature
function showRequestFeature() {
  document.querySelectorAll('.main-content').forEach(el => el.style.display = 'none');
  
  const requestCount = getRequestCount();
  const remainingRequests = MAX_REQUESTS - requestCount.count;
  const timeLeft = getTimeLeft(requestCount.lastRequest);

  const requestHTML = `
    <div class="section-title">
      <i class="fas fa-paper-plane"></i>
      Request Feature
    </div>

    <div class="tool-container">
      <div class="request-info" style="
        background: ${remainingRequests > 0 ? 'rgba(78, 205, 196, 0.1)' : 'rgba(255, 107, 107, 0.1)'};
        border: 1px solid ${remainingRequests > 0 ? 'rgba(78, 205, 196, 0.3)' : 'rgba(255, 107, 107, 0.3)'};
        border-radius: 10px;
        padding: 1rem;
        margin-bottom: 1rem;
        text-align: center;
      ">
        <div style="font-size: 2rem; font-weight: bold; color: ${remainingRequests > 0 ? '#4ecdc4' : '#ff6b6b'}">
          ${remainingRequests} / ${MAX_REQUESTS}
        </div>
        <div style="color: var(--text-secondary); font-size: 0.9rem;">
          Requests remaining (resets in ${timeLeft})
        </div>
        ${remainingRequests === 0 ? `
          <div style="color: #ff6b6b; margin-top: 0.5rem; font-weight: 600;">
            <i class="fas fa-clock"></i> Limit reached. Try again later.
          </div>
        ` : ''}
      </div>
      
      <div class="nik-input-section">
        <label for="requestInput" class="nik-label">Your Request Message</label>
        <textarea 
          id="requestInput" 
          placeholder="Describe your feature request or bug report..." 
          class="text-area" 
          rows="4"
          ${remainingRequests === 0 ? 'disabled' : ''}
        ></textarea>
        
        <div class="setting-group">
          <label class="setting-label">Your Name (optional)</label>
          <input 
            type="text" 
            id="requesterName" 
            placeholder="Enter your name" 
            class="nik-input"
            ${remainingRequests === 0 ? 'disabled' : ''}
          >
        </div>
        
        <button 
          onclick="sendTelegramRequest()" 
          class="btn-primary nik-button"
          ${remainingRequests === 0 ? 'disabled' : ''}
          style="${remainingRequests === 0 ? 'opacity: 0.5; cursor: not-allowed;' : ''}"
        >
          <i class="fas fa-paper-plane"></i> 
          ${remainingRequests === 0 ? 'Limit Reached' : 'Send Request'}
        </button>
      </div>
      
      <div id="requestResult" class="nik-result" style="margin-top: 1rem; display: none;"></div>
    </div>

    <button class="btn-secondary" onclick="backToMain()">
      <i class="fas fa-arrow-left"></i> Back to Main
    </button>
  `;
  
  const requestSection = document.getElementById('request');
  requestSection.innerHTML = requestHTML;
  requestSection.style.display = 'block';
}

// Fungsi kirim request ke Telegram
async function sendTelegramRequest() {
  const message = document.getElementById('requestInput').value;
  const name = document.getElementById('requesterName').value || 'Anonymous';
  const resultDiv = document.getElementById('requestResult');
  
  // Cek limit
  const requestCount = getRequestCount();
  if (requestCount.count >= MAX_REQUESTS) {
    resultDiv.innerHTML = '<div class="nik-error">❌ Request limit reached (3 per 12 hours). Please try again later.</div>';
    resultDiv.style.display = 'block';
    return;
  }

  if (!message) {
    resultDiv.innerHTML = '<div class="nik-error">Please enter your request message</div>';
    resultDiv.style.display = 'block';
    return;
  }
  
  // Update request count
  updateRequestCount();
  
  const requestData = {
    name: name,
    message: message,
    timestamp: new Date().toLocaleString(),
    userAgent: navigator.userAgent,
    requestNumber: requestCount.count + 1
  };
  
  const telegramMessage = `
🆕 *New Feature Request* (#${requestData.requestNumber}/3)

👤 *From:* ${requestData.name}
⏰ *Time:* ${requestData.timestamp}
📱 *Browser:* ${requestData.userAgent}

💬 *Message:*
${requestData.message}

⏳ *Requests used:* ${requestCount.count + 1}/3 (Resets in 12 hours)
  `;
  
  try {
    console.log("📨 Sending to Telegram...");
    
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: telegramMessage,
        parse_mode: 'Markdown'
      })
    });
    
    const result = await response.json();
    console.log("📡 Telegram response:", result);
    
    if (result.ok) {
      resultDiv.innerHTML = `
        <div class="nik-success">
          ✅ Request sent successfully! 
          <br><small>Requests remaining: ${MAX_REQUESTS - (requestCount.count + 1)}/3</small>
        </div>
      `;
      document.getElementById('requestInput').value = '';
      document.getElementById('requesterName').value = '';
      
      // Refresh tampilan untuk update limit
      setTimeout(() => {
        showRequestFeature();
      }, 2000);
    } else {
      resultDiv.innerHTML = `<div class="nik-error">❌ Telegram error: ${result.description || 'Unknown error'}</div>`;
    }
  } catch (error) {
    console.error("🌐 Network error:", error);
    resultDiv.innerHTML = '<div class="nik-error">❌ Network error. Please check your connection.</div>';
  }
  
  resultDiv.style.display = 'block';
  
  setTimeout(() => {
    resultDiv.style.display = 'none';
  }, 5000);
}

// ===== 🔐 ADMIN PANEL =====
const ADMIN_PASSWORD = "y3GIkpUYmYOyEbvfcSEMr1Q3OzJ2Dv1KPjo6";

function showAdminPanel() {
  document.querySelectorAll('.main-content').forEach(el => el.style.display = 'none');
  
  const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
  
  if (isLoggedIn) {
    showAdminDashboard();
  } else {
    showAdminLoginForm();
  }
}

function showAdminLoginForm() {
  const adminHTML = `
    <div class="section-title">
      <i class="fas fa-user-shield"></i>
      Admin Login
    </div>

    <div class="tool-container">
      <div class="admin-login-form">
        <div class="setting-group">
          <label class="setting-label">Admin Password</label>
          <input type="password" id="adminPassword" placeholder="Enter admin password" class="password-input">
        </div>
        
        <button onclick="attemptAdminLogin()" class="btn-primary nik-button">
          <i class="fas fa-sign-in-alt"></i> Login
        </button>
        
        <div id="adminLoginResult" class="nik-result" style="margin-top: 1rem; display: none;"></div>
      </div>
    </div>

    <button class="btn-secondary" onclick="backToMain()">
      <i class="fas fa-arrow-left"></i> Back to Main
    </button>
  `;
  
  const adminSection = document.getElementById('admin');
  adminSection.innerHTML = adminHTML;
  adminSection.style.display = 'block';
}

function attemptAdminLogin() {
  const password = document.getElementById('adminPassword').value;
  const resultDiv = document.getElementById('adminLoginResult');
  
  if (!password) {
    resultDiv.innerHTML = '<div class="nik-error">Please enter password</div>';
    resultDiv.style.display = 'block';
    return;
  }
  
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem('adminLoggedIn', 'true');
    showAdminDashboard();
  } else {
    resultDiv.innerHTML = '<div class="nik-error">❌ Invalid password</div>';
    resultDiv.style.display = 'block';
  }
}

function showAdminDashboard() {
  const requests = JSON.parse(localStorage.getItem('telegram_requests') || '{"count": 0}');
  const totalRequests = requests.count;
  
  const adminHTML = `
    <div class="section-title">
      <i class="fas fa-cog"></i>
      Admin Dashboard
    </div>

    <div class="tool-container">
      <div class="admin-stats">
        <h4><i class="fas fa-chart-bar"></i> Statistics</h4>
        <div class="stat-grid">
          <div class="stat-item">
            <span class="stat-number">${totalRequests}</span>
            <span class="stat-label">Total Requests</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">${getActiveUsers()}</span>
            <span class="stat-label">Active Users</span>
          </div>
        </div>
      </div>

      <div class="admin-actions">
        <button class="admin-btn" onclick="resetAllLimits()">
          <i class="fas fa-refresh"></i>
          <div>
            <strong>Reset All Limits</strong>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">Reset request limits for all users</div>
          </div>
        </button>
        
        <button class="admin-btn" onclick="clearAllData()">
          <i class="fas fa-trash"></i>
          <div>
            <strong>Clear All Data</strong>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">Clear all stored data</div>
          </div>
        </button>
        
        <button class="admin-btn btn-danger" onclick="adminLogout()">
          <i class="fas fa-sign-out-alt"></i>
          <div>
            <strong>Logout</strong>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">Sign out from admin panel</div>
          </div>
        </button>
      </div>
    </div>

    <button class="btn-secondary" onclick="backToMain()">
      <i class="fas fa-arrow-left"></i> Back to Main
    </button>
  `;
  
  const adminSection = document.getElementById('admin');
  adminSection.innerHTML = adminHTML;
  adminSection.style.display = 'block';
}

function getActiveUsers() {
  let count = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes('telegram_requests')) {
      count++;
    }
  }
  return count;
}

function resetAllLimits() {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes('telegram_requests')) {
      localStorage.removeItem(key);
    }
  }
  showNotification('✅ All limits reset successfully!');
  showAdminDashboard();
}

function clearAllData() {
  if (confirm('Are you sure you want to clear ALL data? This cannot be undone!')) {
    localStorage.clear();
    showNotification('✅ All data cleared successfully!');
    showAdminDashboard();
  }
}

function adminLogout() {
  localStorage.removeItem('adminLoggedIn');
  showNotification('✅ Logged out successfully!');
  showAdminLoginForm();
}

// ... (kode lainnya tetap di bawah)

document.addEventListener('DOMContentLoaded', function() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
      }
    });
  });

  document.querySelectorAll('.product-card, .payment-method').forEach(el => {
    observer.observe(el);
  });
});
