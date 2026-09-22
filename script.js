/**
 * Core Logic Controller
 * Enterprise-grade DOM Manipulation & State Routing
 */

let currentModuleState = 'home';

/**
 * State router for modular application views
 */
function navigateModule(targetIdentifier) {
    document.querySelectorAll('.screen').forEach(view => view.classList.remove('active'));
    document.getElementById(targetIdentifier + '-screen').classList.add('active');
    
    document.getElementById('bottom-nav').style.display = 'block';
    
    const actionNode = document.getElementById('chatbot-fab');
    if(targetIdentifier === 'report') actionNode.style.display = 'none';
    else actionNode.style.display = 'flex';

    document.getElementById('back-btn').classList.add('hidden');
    document.getElementById('header-icon').classList.remove('hidden');
    document.getElementById('header-title').innerText = 'CivicConnect';
    document.getElementById('points-badge').style.display = 'flex';

    document.querySelectorAll('.nav-tab').forEach(indicator => {
        indicator.classList.remove('text-indigo-600');
        indicator.classList.add('text-slate-400');
    });
    
    if(targetIdentifier !== 'report' && targetIdentifier !== 'issue-detail') {
        document.getElementById('tab-' + targetIdentifier).classList.remove('text-slate-400');
        document.getElementById('tab-' + targetIdentifier).classList.add('text-indigo-600');
        currentModuleState = targetIdentifier;
    }
}

/**
 * Renders the telemetry inspection view for a discrete record
 */
function renderDetailView(reference, heading, spatial, department, status, timestamp, context) {
    document.querySelectorAll('.screen').forEach(view => view.classList.remove('active'));
    document.getElementById('issue-detail-screen').classList.add('active');
    
    document.getElementById('bottom-nav').style.display = 'none';
    document.getElementById('chatbot-fab').style.display = 'none';

    document.getElementById('back-btn').classList.remove('hidden');
    document.getElementById('header-icon').classList.add('hidden');
    document.getElementById('header-title').innerText = 'Ticket ' + reference;
    document.getElementById('points-badge').style.display = 'none';

    document.getElementById('detail-id').innerText = '#' + reference;
    document.getElementById('detail-title').innerText = heading;
    document.getElementById('detail-location').innerText = spatial;
    document.getElementById('detail-dept').innerText = department;
    document.getElementById('detail-date').innerText = timestamp;
    document.getElementById('detail-desc').innerText = context || "Insufficient data available.";

    const statusNode = document.getElementById('detail-status');
    statusNode.innerText = status;
    
    if(status.includes("Resolved")) {
        statusNode.className = "bg-emerald-100/90 text-emerald-800 text-[10px] px-3 py-1.5 rounded-lg font-bold border border-emerald-200 shadow-sm backdrop-blur-sm tracking-widest uppercase";
    } else if(status.includes("Pending")) {
        statusNode.className = "bg-rose-100/90 text-rose-800 text-[10px] px-3 py-1.5 rounded-lg font-bold border border-rose-200 shadow-sm backdrop-blur-sm tracking-widest uppercase";
    } else {
        statusNode.className = "bg-amber-100/90 text-amber-800 text-[10px] px-3 py-1.5 rounded-lg font-bold border border-amber-200 shadow-sm backdrop-blur-sm tracking-widest uppercase";
    }
}

function navigateHome() {
    navigateModule('home');
}

/**
 * Orchestrates Assistant interface visibility
 */
function toggleAssistantOverlay() {
    const overlayNode = document.getElementById('chatbot-window');
    const toggleIcon = document.querySelector('#chatbot-fab i');
    
    if(overlayNode.classList.contains('hidden')) {
        overlayNode.classList.remove('hidden');
        overlayNode.classList.add('chat-pop');
        toggleIcon.className = "fa-solid fa-xmark";
    } else {
        overlayNode.classList.add('hidden');
        overlayNode.classList.remove('chat-pop');
        toggleIcon.className = "fa-solid fa-headset";
    }
}

function handleQueryKeydown(eventInfo) {
    if(eventInfo.key === 'Enter') dispatchQuery();
}

function dispatchQuery() {
    const bufferNode = document.getElementById('chat-input');
    const payload = bufferNode.value.trim();
    if(!payload) return;

    const terminalOutput = document.getElementById('chat-messages');
    
    terminalOutput.innerHTML += `
        <div class="bg-indigo-600 text-white text-sm p-3.5 rounded-2xl rounded-tr-sm self-end max-w-[85%] shadow-md ml-auto font-medium">
            ${payload}
        </div>
    `;
    bufferNode.value = '';
    terminalOutput.scrollTop = terminalOutput.scrollHeight;

    // Friendly AI Chatbot Responses
    setTimeout(() => {
        let responseVector = "I'm sorry, I didn't understand. Try asking about 'rewards', 'how to report', or 'status'.";
        const parsedVector = payload.toLowerCase();

        if(parsedVector.includes('reward') || parsedVector.includes('ledger') || parsedVector.includes('point')) {
            responseVector = "You earn 50 Civic Credits for every verified report that gets resolved. You can redeem these in the Rewards tab!";
        } else if(parsedVector.includes('report') || parsedVector.includes('initialize') || parsedVector.includes('how')) {
            responseVector = "To report an issue, click the big camera icon at the bottom. Our AI handles the rest automatically!";
        } else if(parsedVector.includes('status') || parsedVector.includes('ticket')) {
            responseVector = "You can check the live status of your tickets on the Home screen.";
        } else if(parsedVector.includes('hi') || parsedVector.includes('hello')) {
            responseVector = "Hello there! Let me know if you need help navigating CivicConnect.";
        }

        terminalOutput.innerHTML += `
            <div class="bg-white border border-slate-100 text-slate-800 text-sm p-4 rounded-2xl rounded-tl-sm self-start max-w-[85%] shadow-sm relative mt-2 font-medium leading-relaxed">
                ${responseVector}
            </div>
        `;
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }, 1200);
}

/**
 * Executes logical flow for data submission and analysis
 */
function executeProcessingPipeline() {
    const payloadData = document.getElementById('issue-desc').value;
    if(!payloadData) {
        alert("Please describe the issue briefly for the AI to analyze.");
        return;
    }

    const stateOverlay = document.getElementById('processing-overlay');
    const consoleOutput = document.getElementById('loading-text');
    const metricBar = document.getElementById('loading-bar');
    
    stateOverlay.style.display = 'flex';
    metricBar.style.width = '15%';

    setTimeout(() => {
        consoleOutput.innerHTML = "<i class='fa-solid fa-satellite mr-2 text-lg'></i> Authenticating spatial coordinates...";
        metricBar.style.width = '45%';
    }, 1200);

    setTimeout(() => {
        consoleOutput.innerHTML = "<i class='fa-solid fa-network-wired mr-2 text-lg'></i> Resolving departmental endpoint...";
        metricBar.style.width = '85%';
    }, 2800);

    setTimeout(() => {
        metricBar.style.width = '100%';
        consoleOutput.innerHTML = "<i class='fa-solid fa-circle-check text-emerald-500 mr-2 text-xl'></i> Submission Confirmed";
        
        setTimeout(() => {
            stateOverlay.style.display = 'none';
            document.getElementById('issue-desc').value = '';
            injectDatasetRecord(payloadData);
            navigateModule('home');
        }, 1200);
    }, 4500);
}

/**
 * Injects structured data into the frontend view with Advanced Keyword Matching
 */
function injectDatasetRecord(stringPayload) {
    const datasetContainer = document.getElementById('tickets-list');
    
    let routingTarget = "Municipal Base";
    let sanitizedTitle = stringPayload.substring(0, 22) + "...";
    let hashId = "CC-" + Math.floor(Math.random() * 9000 + 1000);
    let spatialData = "10.3621° N, 77.9695° E";
    
    const stringLower = stringPayload.toLowerCase();
    
    // Enhanced Keyword Mapping for accurate department classification
    if(stringLower.includes("water") || stringLower.includes("pipe") || stringLower.includes("drain") || stringLower.includes("leak") || stringLower.includes("overflow") || stringLower.includes("sewage")) {
        routingTarget = "Hydro Dept";
        sanitizedTitle = "Liquid Infrastructure";
    } else if(stringLower.includes("wire") || stringLower.includes("light") || stringLower.includes("power") || stringLower.includes("current") || stringLower.includes("eb") || stringLower.includes("electricity")) {
        routingTarget = "Grid Operations";
        sanitizedTitle = "Circuit Anomaly";
    } else if(stringLower.includes("road") || stringLower.includes("pothole") || stringLower.includes("damage") || stringLower.includes("patch") || stringLower.includes("street") || stringLower.includes("bridge")) {
        routingTarget = "Public Works";
        sanitizedTitle = "Surface Deformation";
    } else if(stringLower.includes("garbage") || stringLower.includes("trash") || stringLower.includes("dustbin") || stringLower.includes("waste") || stringLower.includes("smell") || stringLower.includes("cleaning")) {
        routingTarget = "Sanitation Core";
        sanitizedTitle = "Waste Management";
    } else {
        routingTarget = "Municipal Base";
        sanitizedTitle = "General Grievance";
    }

    const cleanString = stringPayload.replace(/'/g, "\\'");

    const dataComponent = `
        <div onclick="renderDetailView('${hashId}', '${sanitizedTitle}', '${spatialData}', '${routingTarget}', 'Pending Analysis', 'Just now', '${cleanString}')" class="glass-panel p-5 rounded-2xl hover:shadow-md hover:bg-white/80 transition-all duration-300 cursor-pointer active:scale-[0.98] animate-pulse">
            <div class="flex justify-between items-start mb-4">
                <span class="bg-rose-100/80 text-rose-800 text-[10px] px-3 py-1.5 rounded-full font-bold shadow-sm border border-rose-200/50 uppercase tracking-widest">Pending</span>
                <span class="text-xs text-slate-400 font-medium">Just now</span>
            </div>
            <h4 class="font-extrabold text-slate-800 text-lg">${sanitizedTitle}</h4>
            <p class="text-sm text-slate-500 mt-1 mb-4 font-medium"><i class="fa-solid fa-location-dot text-rose-400 mr-1.5"></i> ${spatialData}</p>
            <div class="flex justify-between items-center border-t border-slate-200/50 pt-3">
                <span class="text-xs font-bold text-indigo-700 bg-indigo-50/80 border border-indigo-100 px-2.5 py-1.5 rounded-lg">Target: ${routingTarget}</span>
                <span class="text-xs text-slate-400 font-mono font-bold">#${hashId}</span>
            </div>
        </div>
    `;
    
    datasetContainer.insertAdjacentHTML('afterbegin', dataComponent);
    
    const metricsElement = document.getElementById('stat-reported');
    metricsElement.innerText = parseInt(metricsElement.innerText) + 1;
}