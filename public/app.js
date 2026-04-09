document.addEventListener('DOMContentLoaded', () => {
    
    // Theme Manager Initialization
    const currentTheme = localStorage.getItem('nexus_theme') || 'dark';
    if(currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    const landingScreen = document.getElementById('landing-screen');
    const loginScreen = document.getElementById('login-screen');
    const dashboardApp = document.getElementById('dashboard-app');
    
    let dashboardInitialized = false;

    // Auto-login persistence check
    if(localStorage.getItem('nexus_user_logged_in') === 'true') {
        landingScreen.style.display = 'none';
        landingScreen.classList.remove('active');
        dashboardApp.style.display = 'flex';
        dashboardApp.style.opacity = '1';
        setTimeout(() => {
            if (!dashboardInitialized) {
                initDashboard();
                dashboardInitialized = true;
            }
        }, 100);
    }
    
    // Dropdown Toggles
    const toggleDropdown = (btnId, dropdownId) => {
        const btn = document.getElementById(btnId);
        const dropdown = document.getElementById(dropdownId);
        if(btn && dropdown) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                // Close others
                document.querySelectorAll('.dropdown-menu').forEach(d => {
                    if(d.id !== dropdownId) d.classList.remove('active');
                });
                dropdown.classList.toggle('active');
            });
        }
    };
    toggleDropdown('notif-btn', 'notif-dropdown');
    toggleDropdown('settings-btn', 'settings-dropdown');
    
    // Close dropdowns on document click
    document.addEventListener('click', (e) => {
        if(!e.target.closest('.dropdown-menu') && !e.target.closest('.icon-btn')) {
            document.querySelectorAll('.dropdown-menu').forEach(d => d.classList.remove('active'));
        }
    });
    
    // Landing Page Actions
    const gotoLoginBtn = document.getElementById('goto-login-btn');
    const heroLoginBtn = document.getElementById('hero-login-btn');
    const gotoRegisterBtn = document.getElementById('goto-register-btn');
    const heroRegisterBtn = document.getElementById('hero-register-btn');
    
    // Login / Register toggle logic
    const loginContainer = document.getElementById('login-form-container');
    const registerContainer = document.getElementById('register-form-container');
    const showRegister = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');

    if(showRegister) {
        showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            loginContainer.style.display = 'none';
            registerContainer.style.display = 'block';
        });
    }

    if(showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            registerContainer.style.display = 'none';
            loginContainer.style.display = 'block';
        });
    }
    
    const showAuthScreen = (showRegisterView = false) => {
        landingScreen.classList.remove('active');
        if(showRegisterView && registerContainer && loginContainer) {
            loginContainer.style.display = 'none';
            registerContainer.style.display = 'block';
        } else if (registerContainer && loginContainer) {
            registerContainer.style.display = 'none';
            loginContainer.style.display = 'block';
        }

        setTimeout(() => {
            landingScreen.style.display = 'none';
            loginScreen.style.display = 'flex';
            setTimeout(() => loginScreen.classList.add('active'), 50);
        }, 500);
    };

    if(gotoLoginBtn) gotoLoginBtn.addEventListener('click', () => showAuthScreen(false));
    if(heroLoginBtn) heroLoginBtn.addEventListener('click', () => showAuthScreen(false));
    if(gotoRegisterBtn) gotoRegisterBtn.addEventListener('click', () => showAuthScreen(true));
    if(heroRegisterBtn) heroRegisterBtn.addEventListener('click', () => showAuthScreen(true));

    // Login Page Actions
    const backToLandingBtn = document.getElementById('back-to-landing');
    if(backToLandingBtn) {
        backToLandingBtn.addEventListener('click', () => {
            loginScreen.classList.remove('active');
            setTimeout(() => {
                loginScreen.style.display = 'none';
                landingScreen.style.display = 'flex';
                setTimeout(() => landingScreen.classList.add('active'), 50);
            }, 500);
        });
    }

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    const authSubmitHandler = (form, loadingText) => {
        if(!form) return;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Simulate Authentication
            const btn = form.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${loadingText}`;
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                localStorage.setItem('nexus_user_logged_in', 'true');
                loginScreen.classList.remove('active');
                setTimeout(() => {
                    loginScreen.style.display = 'none';
                    dashboardApp.style.display = 'flex';
                    setTimeout(() => {
                        dashboardApp.style.opacity = '1';
                        if (!dashboardInitialized) {
                            initDashboard();
                            dashboardInitialized = true;
                        }
                    }, 50);
                }, 500);
            }, 1000); 
        });
    };

    authSubmitHandler(loginForm, 'Logging in...');
    authSubmitHandler(registerForm, 'Creating Account...');

    // Logout Action
    const logoutBtn = document.getElementById('logout-btn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('nexus_user_logged_in');
            dashboardApp.style.opacity = '0';
            setTimeout(() => {
                dashboardApp.style.display = 'none';
                landingScreen.style.display = 'flex';
                setTimeout(() => landingScreen.classList.add('active'), 50);
            }, 500);
        });
    }


    // --- Navigation Logic ---
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view-section');

    const switchView = (targetViewId, clickedItem) => {
        if(clickedItem) {
            navItems.forEach(n => n.classList.remove('active'));
            clickedItem.classList.add('active');
        } else {
            // Un-highlight all nav items if triggered by an external link not mapping directly to nav-item
            navItems.forEach(n => n.classList.remove('active'));
            // manually match
            const associatedItem = document.querySelector(`.nav-item[data-view="${targetViewId.replace('-view','')}"]`);
            if(associatedItem) associatedItem.classList.add('active');
        }

        views.forEach(v => {
            v.classList.remove('active');
            setTimeout(() => v.style.display = 'none', 50);
        });

        const targetView = document.getElementById(targetViewId);
        if (targetView) {
            setTimeout(() => {
                targetView.style.display = 'block';
                setTimeout(() => targetView.classList.add('active'), 10);
            }, 50);
        }
    };

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            switchView(item.getAttribute('data-view') + '-view', item);
        });
    });

    // Profile Dropdown Link
    const openProfileBtn = document.getElementById('open-profile-btn');
    if(openProfileBtn) {
        openProfileBtn.addEventListener('click', () => {
            switchView('profile-view', null);
            document.getElementById('settings-dropdown').classList.remove('active');
        });
    }

    // Theme Toggle Handler
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if(themeToggleBtn) {
        const themeStatusText = document.getElementById('theme-status-text');
        
        // Init text
        if(currentTheme === 'light') {
            if(themeStatusText) themeStatusText.innerText = "Light Mode is on";
        }
        
        themeToggleBtn.addEventListener('click', () => {
            let activeTheme = document.documentElement.getAttribute('data-theme');
            if(activeTheme === 'light') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('nexus_theme', 'dark');
                if(themeStatusText) themeStatusText.innerText = "Dark Mode is on";
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('nexus_theme', 'light');
                if(themeStatusText) themeStatusText.innerText = "Light Mode is on";
            }
            
            // Re-render chart to pick up theme dynamically (delayed to allow CSS paint)
            if(dashboardInitialized) { 
                setTimeout(() => renderSubs(), 50); 
            }
        });
    }




    // --- Dashboard Initializer & Logic ---
    function initDashboard() {


        // Upcoming Calendar Latest Releases (April 2026)
        const calendarList = document.getElementById('calendar-list');
        const releases = [
            { day: '10', month: 'Apr', title: 'O\'Romeo', desc: 'Romantic action-adventure starring Shahid Kapoor.', platform: 'Amazon Prime' },
            { day: '10', month: 'Apr', title: 'Thaai Kizhavi', desc: 'Tamil comedy-drama starring Radikaa Sarathkumar.', platform: 'JioHotstar' },
            { day: '06', month: 'Apr', title: 'Repu Udayam 10 Gantalaku', desc: 'Telugu thriller starring Abhinav Gomatam.', platform: 'Amazon Prime' },
            { day: '03', month: 'Apr', title: 'Maamla Legal Hai (Season 2)', desc: 'Sequel to the hit courtroom comedy series.', platform: 'Netflix' },
            { day: '03', month: 'Apr', title: 'Sitaare Zameen Par', desc: 'Highly anticipated sports comedy-drama.', platform: 'SonyLIV' }
        ];

        if (calendarList) {
            calendarList.innerHTML = '';
            releases.forEach(rel => {
                calendarList.innerHTML += `
                    <div class="release-item">
                        <div class="release-date">
                            <div class="day">${rel.day}</div>
                            <div class="month">${rel.month}</div>
                        </div>
                        <div class="release-content">
                            <h4>${rel.title}</h4>
                            <p>${rel.desc}</p>
                        </div>
                        <div class="release-platform">${rel.platform}</div>
                    </div>
                `;
            });
        }

        // Expense Tracker Logic
        const subBody = document.getElementById('sub-table-body');
        const spendDisplay = document.getElementById('total-spend-display');
        const addSubForm = document.getElementById('add-sub-form');
        
        let personalSubs = [];

        async function fetchSubs() {
            try {
                const res = await fetch('http://localhost:8081/api/subscriptions');
                if(res.ok) {
                    personalSubs = await res.json();
                }
            } catch(e) {
                console.log("No backend detected! Loading fallback data.");
                if(personalSubs.length === 0) {
                    personalSubs = [
                        { id: null, name: 'Netflix Premium', category: 'Movie/OTT', date: '2026-08-01', duration: '1 Month', cost: 649 },
                        { id: null, name: 'Equinox Gym', category: 'Fitness/Gym', date: '2026-08-05', duration: '3 Months', cost: 3000 }
                    ];
                }
            }
            renderSubs();
        }

        function renderSubs() {
            if (!subBody) return;
            subBody.innerHTML = '';
            let total = 0;
            let categories = {
                'Movie/OTT': 0,
                'Fitness/Gym': 0,
                'Bills/Rent': 0,
                'Other': 0
            };

            personalSubs.forEach((s, idx) => {
                const cost = parseFloat(s.cost);
                total += cost;
                
                if(categories[s.category] !== undefined) {
                    categories[s.category] += cost;
                } else {
                    categories['Other'] += cost;
                }

                subBody.innerHTML += `
                    <tr>
                        <td style="font-weight: 700;">${s.name}</td>
                        <td>${s.category}</td>
                        <td>${s.date}</td>
                        <td>${s.duration}</td>
                        <td style="color: var(--neon-cyan); font-family: monospace; font-size: 16px;">₹${Number(s.cost).toLocaleString('en-IN')}</td>
                        <td><button class="action-btn" onclick="window.deleteSub('${s.id || ''}', ${idx})" style="color: var(--neon-red); border-color: var(--neon-red)">Remove</button></td>
                    </tr>
                `;
            });

            // Update Spend Display
            if(spendDisplay) spendDisplay.innerText = '₹' + total.toLocaleString('en-IN');

            // Update Budget Limit Progress Dynamic
            const budgetInput = document.getElementById('budget-input');
            const userBudget = budgetInput && budgetInput.value ? parseFloat(budgetInput.value) : 10000;
            const budgetText = document.getElementById('budget-spent-text');
            const percentText = document.getElementById('budget-percent-text');
            const progressFill = document.getElementById('budget-progress-fill');
            
            if(budgetText && percentText && progressFill) {
                budgetText.innerText = '₹' + total.toLocaleString('en-IN') + ' spent';
                let percent = Math.min((total / userBudget) * 100, 100).toFixed(0);
                percentText.innerText = percent + '%';
                progressFill.style.width = percent + '%';
                if(percent >= 90) progressFill.style.background = 'var(--neon-red)';
                else progressFill.style.background = 'linear-gradient(90deg, var(--neon-purple), var(--neon-cyan))';
            }

            // Render Dynamic Category Chart
            const ctxCat = document.getElementById('categoryChart');
            if (ctxCat) {
                if(window.catChartInstance) window.catChartInstance.destroy();
                
                const cssStyle = getComputedStyle(document.documentElement);
                const color1 = cssStyle.getPropertyValue('--chart-1').trim() || '#00E676';
                const color2 = cssStyle.getPropertyValue('--chart-2').trim() || '#00f0ff';
                const color3 = cssStyle.getPropertyValue('--chart-3').trim() || '#8a2be2';
                const color4 = cssStyle.getPropertyValue('--chart-4').trim() || '#ff007f';
                
                Chart.defaults.color = cssStyle.getPropertyValue('--text-muted').trim() || '#94a3b8';
                Chart.defaults.font.family = "'Outfit', sans-serif";

                window.catChartInstance = new Chart(ctxCat, {
                    type: 'doughnut',
                    data: {
                        labels: Object.keys(categories),
                        datasets: [{
                            data: Object.values(categories),
                            backgroundColor: [color1, color2, color3, color4],
                            borderWidth: 0,
                            hoverOffset: 10
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '75%',
                        plugins: {
                            legend: {
                                position: 'right',
                                labels: { padding: 20, usePointStyle: true }
                            }
                        }
                    }
                });
            }
        }

        if(!window.deleteSub) {
            window.deleteSub = async (id, idx) => {
                if(id && id !== 'undefined' && id !== '') {
                    try {
                        await fetch(`http://localhost:8081/api/subscriptions/${id}`, { method: 'DELETE' });
                    } catch(e) {}
                } else {
                    personalSubs.splice(idx, 1);
                }
                fetchSubs();
            };
        }

        if(addSubForm) {
            const newForm = addSubForm.cloneNode(true);
            addSubForm.parentNode.replaceChild(newForm, addSubForm);
            
            newForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const name = document.getElementById('sub-name').value;
                const cost = document.getElementById('sub-cost').value;
                const category = document.getElementById('sub-category').value;
                const date = document.getElementById('sub-date').value;
                const duration = document.getElementById('sub-duration').value;
                
                const newEntry = { name, cost: parseFloat(cost), category, date, duration };
                
                try {
                    const res = await fetch('http://localhost:8081/api/subscriptions', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newEntry)
                    });
                    if(!res.ok) throw new Error("Failed");
                } catch(e) {
                    personalSubs.push(newEntry);
                }
                
                fetchSubs();
                newForm.reset();
            });
        }
        
        const bInput = document.getElementById('budget-input');
        if(bInput) {
            bInput.addEventListener('input', () => {
                renderSubs();
            });
        }
        
        fetchSubs();
    }
});
