async function display() {
    try {
        var courses = await axios.get('http://localhost:3000/courses');
        courses = courses.data;
        var htmls = courses.map(function (course) {
            return `
            <li>
                <h2>${course.name}</h2>
                <h3>Mô tả: ${course.description}</h3>
                <p>Giá: ${course.coin}</p>
                <button onclick="onUpdate('${course.id}')">Sửa</button>
                <button onclick="onDelete('${course.id}')">Xóa</button>
            </li>
        `
        })

        var listElement = document.querySelector('.list-courses');
        listElement.innerHTML = htmls.join('');

    } catch (error) {
        var errorElement = document.querySelector('.error');
        errorElement.innerHTML = '<p style="color: red; font-style: italic">Xảy ra lỗi khi lấy dữ liệu!</p>';
    }
}

display();

var createBtn = document.querySelector('#create');
var updateBtn = document.querySelector('#update');
var courseName = document.querySelector('input[name="name"]');
var description = document.querySelector('input[name="description"]');
var coin = document.querySelector('input[name="coin"]');

function generateUuid() {
    return 'xxxx-xxxx-xxx-xxxx'.replace(/[x]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Xử lý validate khi blur hoặc nhập vào ô input
function handleBlurInput(input) {
    var errorElement = input.parentElement.querySelector('.form-message');
    input.onblur = function () {
        if (input.value.trim() === '') {
            errorElement.setAttribute('style', 'display: block; color: red; font-style: italic;');
            errorElement.innerText = 'Yêu cầu nhập!';
            input.classList.add('invalid');
        }
    }

    input.oninput = function () {
        errorElement.setAttribute('style', 'display: none;');
        input.classList.remove('invalid');
    }
}

handleBlurInput(courseName);
handleBlurInput(description);
handleBlurInput(coin);

// Xử lý khi kích vào button Thêm
createBtn.onclick = async function () {
    var check = true;
    if (isRequired(courseName)) {
        check = false;
    }
    if (isRequired(description)) {
        check = false;
    }
    if (isRequired(coin)) {
        check = false;
    }
    if (check) {
        var newCourse = {
            id: generateUuid(),
            name: courseName.value,
            description: description.value,
            coin: coin.value
        }
        try {
            await axios({
                method: "POST",
                url: 'http://localhost:3000/courses',
                data: newCourse,
            })
            display();
            courseName.value = '';
            description.value = '';
            coin.value = '';
        } catch (error) {
            var errorElement = document.querySelector('.error');
            errorElement.innerHTML = '<p style="color: red; font-style: italic">Xảy ra lỗi khi thêm!</p>';
        }
    }

    function isRequired(input) {
        var errorElement = input.parentElement.querySelector('.form-message');
        if (input.value.trim() === '') {
            errorElement.setAttribute('style', 'display: block; color: red; font-style: italic;');
            errorElement.innerText = 'Yêu cầu nhập!';
            input.classList.add('invalid');
            return true;
        }
    }
}

var editId;
// Xử lý khi kích vào button Sửa
async function onUpdate(id) {
    editId = id;
    try {
        // lấy khóa học muốn sửa
        var courseById = await axios.get(`http://localhost:3000/course-by-id/${editId}`);
        courseById = courseById.data;

        courseName.value = courseById.name;
        description.value = courseById.description;
        coin.value = courseById.coin;

        createBtn.setAttribute('style', 'display: none');
        updateBtn.setAttribute('style', 'display: block');
    } catch (error) {
        var errorElement = document.querySelector('.error');
        errorElement.innerHTML = '<p style="color: red; font-style: italic">Xảy ra lỗi khi lấy dữ liệu!</p>';
    }
}

// Xử lý sửa khóa học
updateBtn.onclick = async function () {
    var editCourse = {
        id: editId,
        name: courseName.value,
        description: description.value,
        coin: coin.value
    }
    try {
        await axios({
            method: "PUT",
            url: 'http://localhost:3000/courses',
            data: editCourse,
        })
        display();
        createBtn.setAttribute('style', 'display: block');
        updateBtn.setAttribute('style', 'display: none');
        courseName.value = '';
        description.value = '';
        coin.value = '';
    } catch (error) {
        var errorElement = document.querySelector('.error');
        errorElement.innerHTML = '<p style="color: red; font-style: italic">Xảy ra lỗi khi sửa!</p>';
    }
}

// Xử lý khi kích vào button Xóa
async function onDelete(id) {
    if (confirm("Bạn có chắc muốn xóa?")) {
        try {
            await axios({
                method: "DELETE",
                url: `http://localhost:3000/courses/${id}`,
            })
            display();
        } catch (error) {
            var errorElement = document.querySelector('.error');
            errorElement.innerHTML = '<p style="color: red; font-style: italic">Xảy ra lỗi khi xóa!</p>';
        }
    }
}