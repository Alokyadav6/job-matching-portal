
function showSection(sectionId) {
    document.getElementById("signupSection").classList.add("hidden");
    document.getElementById("loginSection").classList.add("hidden");

    document.getElementById(sectionId).classList.remove("hidden");
}



function signup() {

    const role = document.getElementById("signupRole").value;
    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const mobile = document.getElementById("signupMobile").value;
    const password = document.getElementById("signupPassword").value;

    if (!name || !email || !mobile || !password) {
        alert("Please fill all fields");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const exists = users.find(user => user.email === email);

    if (exists) {
        alert("User already exists");
        return;
    }

    users.push({
        role,
        name,
        email,
        mobile,
        password
    });

    localStorage.setItem("users", JSON.stringify(users));

    alert("Account Created Successfully");
}



function login() {

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
        u => u.email === email && u.password === password
    );

    if (!user) {
        alert("Invalid Email or Password");
        return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));

    if (user.role === "recruiter") {

        document.getElementById("recruiterDashboard")
            .classList.remove("hidden");

        document.getElementById("jobSeekerDashboard")
            .classList.add("hidden");

        loadPostedJobs();

    } else {

        document.getElementById("jobSeekerDashboard")
            .classList.remove("hidden");

        document.getElementById("recruiterDashboard")
            .classList.add("hidden");

        loadRecommendedJobs();
        loadAppliedJobs();
    }

    document.getElementById("loginSection")
        .classList.add("hidden");
}



function logout() {

    localStorage.removeItem("currentUser");

    document.getElementById("recruiterDashboard")
        .classList.add("hidden");

    document.getElementById("jobSeekerDashboard")
        .classList.add("hidden");

    alert("Logged Out Successfully");
}



function saveRecruiterProfile() {

    const company =
        document.getElementById("companyName").value;

    const designation =
        document.getElementById("recruiterDesignation").value;

    localStorage.setItem(
        "recruiterProfile",
        JSON.stringify({
            company,
            designation
        })
    );

    alert("Recruiter Profile Saved");
}



function saveProfile() {

    const education =
        document.getElementById("education").value;

    const skills =
        document.getElementById("skills").value;

    const resume =
        document.getElementById("resume").value;

    localStorage.setItem(
        "jobSeekerProfile",
        JSON.stringify({
            education,
            skills,
            resume
        })
    );

    alert("Profile Saved");

    loadRecommendedJobs();
}



function postJob() {

    const title =
        document.getElementById("jobTitle").value;

    const skills =
        document.getElementById("jobSkills").value;

    const salary =
        document.getElementById("jobSalary").value;

    const experience =
        document.getElementById("jobExperience").value;

    const description =
        document.getElementById("jobDescription").value;

    if (
        !title ||
        !skills ||
        !salary ||
        !experience ||
        !description
    ) {
        alert("Fill all fields");
        return;
    }

    let jobs =
        JSON.parse(localStorage.getItem("jobs")) || [];

    jobs.push({
        title,
        skills,
        salary,
        experience,
        description
    });

    localStorage.setItem(
        "jobs",
        JSON.stringify(jobs)
    );

    alert("Job Posted Successfully");

    loadPostedJobs();
}



function loadPostedJobs() {

    let jobs =
        JSON.parse(localStorage.getItem("jobs")) || [];

    let container =
        document.getElementById("postedJobs");

    container.innerHTML = "";

    jobs.forEach(job => {

        container.innerHTML += `
        <div class="job-card">

            <h4>${job.title}</h4>

            <p><strong>Skills:</strong>
            ${job.skills}</p>

            <p><strong>Salary:</strong>
            ${job.salary}</p>

            <p><strong>Experience:</strong>
            ${job.experience}</p>

        </div>
        `;
    });
}



function calculateMatch(
    seekerSkills,
    jobSkills
) {

    const seeker =
        seekerSkills
        .toLowerCase()
        .split(",")
        .map(skill => skill.trim());

    const required =
        jobSkills
        .toLowerCase()
        .split(",")
        .map(skill => skill.trim());

    let matched = 0;

    required.forEach(skill => {

        if (seeker.includes(skill)) {
            matched++;
        }
    });

    return Math.round(
        (matched / required.length) * 100
    );
}



function loadRecommendedJobs() {

    const profile =
        JSON.parse(
            localStorage.getItem(
                "jobSeekerProfile"
            )
        ) || {};

    const seekerSkills =
        profile.skills || "";

    const jobs =
        JSON.parse(
            localStorage.getItem("jobs")
        ) || [];

    const container =
        document.getElementById(
            "jobsContainer"
        );

    container.innerHTML = "";

    jobs.forEach((job, index) => {

        const match =
            calculateMatch(
                seekerSkills,
                job.skills
            );

        container.innerHTML += `
        <div class="job-card">

            <h4>${job.title}</h4>

            <p><strong>Skills:</strong>
            ${job.skills}</p>

            <p>${job.description}</p>

            <p class="match-score">
            Match Score: ${match}%
            </p>

            <button
                onclick="applyJob(${index})">
                Apply Now
            </button>

        </div>
        `;
    });
}



function applyJob(index) {

    const jobs =
        JSON.parse(
            localStorage.getItem("jobs")
        ) || [];

    let applied =
        JSON.parse(
            localStorage.getItem(
                "appliedJobs"
            )
        ) || [];

    applied.push(jobs[index]);

    localStorage.setItem(
        "appliedJobs",
        JSON.stringify(applied)
    );

    alert("Application Submitted");

    loadAppliedJobs();
}

// ===== APPLIED JOBS =====

function loadAppliedJobs() {

    const applied =
        JSON.parse(
            localStorage.getItem(
                "appliedJobs"
            )
        ) || [];

    const container =
        document.getElementById(
            "appliedJobs"
        );

    container.innerHTML = "";

    applied.forEach(job => {

        container.innerHTML += `
        <div class="job-card">

            <h4>${job.title}</h4>

            <p>
            Applied Successfully ✅
            </p>

        </div>
        `;
    });
}



window.onload = function () {

    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "currentUser"
            )
        );

    if (!currentUser) return;

    if (
        currentUser.role ===
        "recruiter"
    ) {

        document.getElementById(
            "recruiterDashboard"
        ).classList.remove("hidden");

        loadPostedJobs();

    } else {

        document.getElementById(
            "jobSeekerDashboard"
        ).classList.remove("hidden");

        loadRecommendedJobs();
        loadAppliedJobs();
    }
}