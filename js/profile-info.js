function goToRg() {
    window.location.href = "register.html";
}
function goToNextPage() {
    window.location.href = "profile.html";
}

// Faculty options for graduates
const facultyOptions = [
    'ՏՀՏԷ',
    'ՄՄՏՀԴ',
    'ԷԷ',
    'ԼՔՏ',
    'ԿՄ',
    'ԻՔՏ'
];

// Department options for teachers
const departmentOptions = [
    'Ծրագրային ապահովման ամբիոն',
    'Համակարգչային համակարգերի ամբիոն',
    'Տեղեկատվական տեխնոլոգիաների ամբիոն',
    'Արհեստական բանականության ամբիոն',
    'Մաթեմատիկայի ամբիոն',
    'Ֆիզիկայի ամբիոն'
];

function updateFormFields(role) {
    const yearsLabel = document.getElementById('years-label');
    const yearRangeBox = document.querySelector('.year-range-box');
    const facultyLabel = document.getElementById('faculty-label');
    const facultySelect = document.getElementById('faculty');

    if (role === 'teacher') {
        // Change to teacher mode
        yearsLabel.style.display = 'none';
        yearRangeBox.style.display = 'none';
        facultyLabel.textContent = 'Ամբիոն';

        // Update faculty select to show departments
        facultySelect.innerHTML = '';
        departmentOptions.forEach(dept => {
            const option = document.createElement('option');
            option.textContent = dept;
            facultySelect.appendChild(option);
        });
    } else {
        // Change to graduate mode
        yearsLabel.style.display = 'block';
        yearRangeBox.style.display = 'flex';
        yearsLabel.textContent = 'Ուսման տարիներ';
        facultyLabel.textContent = 'Ֆակուլտետ/Ինստիտուտ';

        // Update faculty select to show faculties
        facultySelect.innerHTML = '';
        facultyOptions.forEach(faculty => {
            const option = document.createElement('option');
            option.textContent = faculty;
            facultySelect.appendChild(option);
        });
    }
}

document.querySelectorAll(".role-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".role-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const role = btn.dataset.role;
        document.getElementById("role").value = role;
        updateFormFields(role);
    });
});


const photoInput = document.getElementById("photo");
const box = document.querySelector(".upload-box");

photoInput.addEventListener("change", () => {
    if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();

        reader.onload = e => {
            box.innerHTML = `<img src="${e.target.result}" class="preview-photo">`;
        };

        reader.readAsDataURL(photoInput.files[0]);
    }
});