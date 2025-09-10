// Load and display the orbital warp probe roadmap
document.addEventListener('DOMContentLoaded', async function() {
    try {
        await loadRoadmap();
    } catch (error) {
        console.error('Error loading roadmap:', error);
        displayError();
    }
});

async function loadRoadmap() {
    const roadmapContainer = document.getElementById('roadmap-container');
    
    try {
        // Fetch the NDJSON file
        const response = await fetch('orbital-warp-probe-roadmap.ndjson');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        const roadmapData = parseNDJSON(text);
        
        if (roadmapData.length === 0) {
            throw new Error('No roadmap data found');
        }
        
        displayRoadmap(roadmapData, roadmapContainer);
        
    } catch (error) {
        console.error('Failed to load roadmap:', error);
        displayError(roadmapContainer);
    }
}

function parseNDJSON(text) {
    const lines = text.trim().split('\n');
    const data = [];
    
    for (const line of lines) {
        if (line.trim()) {
            try {
                data.push(JSON.parse(line));
            } catch (error) {
                console.warn('Failed to parse line:', line, error);
            }
        }
    }
    
    return data;
}

function displayRoadmap(roadmapData, container) {
    const timelineDiv = document.createElement('div');
    timelineDiv.className = 'roadmap-timeline';
    
    roadmapData.forEach((item, index) => {
        const roadmapItem = createRoadmapItem(item, index);
        timelineDiv.appendChild(roadmapItem);
    });
    
    container.innerHTML = '';
    container.appendChild(timelineDiv);
    
    // Add animation delay for each item
    const items = container.querySelectorAll('.roadmap-item');
    items.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

function createRoadmapItem(data, index) {
    const item = document.createElement('div');
    item.className = `roadmap-item status-${data.status}`;
    
    item.innerHTML = `
        <div class="roadmap-header">
            <span class="roadmap-phase">${escapeHtml(data.phase)}</span>
            <span class="roadmap-timeframe">${escapeHtml(data.timeframe)}</span>
        </div>
        <h3 class="roadmap-title">${escapeHtml(data.title)}</h3>
        <p class="roadmap-description">${escapeHtml(data.description)}</p>
        <div class="roadmap-goals">
            <h4>Key Goals:</h4>
            <ul>
                ${data.goals.map(goal => `<li>${escapeHtml(goal)}</li>`).join('')}
            </ul>
        </div>
        <div style="margin-top: 1rem;">
            <span class="status-badge status-${data.status}">
                ${formatStatus(data.status)}
            </span>
        </div>
    `;
    
    return item;
}

function formatStatus(status) {
    const statusMap = {
        'in-progress': 'In Progress',
        'planned': 'Planned',
        'conceptual': 'Conceptual',
        'visionary': 'Visionary'
    };
    
    return statusMap[status] || status;
}

function displayError(container) {
    if (!container) {
        container = document.getElementById('roadmap-container');
    }
    
    container.innerHTML = `
        <div class="error-message" style="
            text-align: center;
            padding: 2rem;
            background: #f8d7da;
            color: #721c24;
            border-radius: 10px;
            border: 1px solid #f5c6cb;
        ">
            <h3>Unable to Load Mission Roadmap</h3>
            <p>We're experiencing technical difficulties loading our mission roadmap. Please try again later.</p>
        </div>
    `;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 120; // Account for fixed header
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Add scroll effect to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(30, 60, 114, 0.95)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.1)';
    }
});

// Load mission statement and roadmap on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const missionUrl = 'mission.ndjson';
  const missionEl = document.getElementById('mission-intro');
  const roadmapContainer = document.getElementById('roadmap-container');

  fetch(missionUrl).then(r => {
    if (!r.ok) throw new Error('Network response was not ok');
    return r.text();
  }).then(text => {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const milestones = [];
    let missionStatement = '';

    for (const line of lines) {
      try {
        const obj = JSON.parse(line);
        if (obj.type === 'mission' && obj.statement) missionStatement = obj.statement;
        else if (obj.type === 'milestone') milestones.push(obj);
      } catch (e) {
        console.warn('Skipping invalid NDJSON line', e);
      }
    }

    if (missionStatement) missionEl.textContent = missionStatement;
    else missionEl.textContent = 'Mission statement unavailable.';

    // Render roadmap
    roadmapContainer.innerHTML = '';
    if (milestones.length === 0) {
      roadmapContainer.innerHTML = '<p class="loading">No roadmap items found.</p>';
      return;
    }

    const list = document.createElement('div');
    list.className = 'roadmap-grid';
    milestones.sort((a,b)=> (a.year||0) - (b.year||0));
    for (const m of milestones) {
      const card = document.createElement('div');
      card.className = 'roadmap-item';
      card.innerHTML = `<h3>${m.year} — ${escapeHtml(m.title||'Untitled')}</h3>
                        <p>${escapeHtml(m.description||'')}</p>`;
      list.appendChild(card);
    }
    roadmapContainer.appendChild(list);
  }).catch(err => {
    missionEl.textContent = 'Failed to load mission statement.';
    roadmapContainer.innerHTML = `<p class="loading">Failed to load roadmap: ${escapeHtml(err.message)}</p>`;
    console.error(err);
  });

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
});