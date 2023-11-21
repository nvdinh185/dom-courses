var topics = [
    {
        topic: 'Front-end',
        courses: [
            {
                id: '1',
                name: 'Javascript',
                description: 'Đây là khóa học Javascript cơ bản',
                coin: 100
            },
            {
                id: '2',
                name: 'HTML - CSS',
                description: 'Đây là khóa học HTML - CSS',
                coin: 200
            },
            {
                id: '3',
                name: 'ReactJS',
                description: 'Đây là khóa học ReactJS',
                coin: 0
            },
        ]
    },
    {
        topic: 'Back-end',
        courses: [
            {
                id: '1',
                name: 'NodeJS',
                description: 'Đây là khóa học NodeJS',
                coin: 300
            },
            {
                id: '2',
                name: 'PHP',
                description: 'Đây là khóa học PHP',
                coin: 150
            }
        ]
    }
]

var listCourses = topics.reduce(function (course, topic) {
    return course.concat(topic.courses);
}, []);

listCourses.forEach(function (course, idx) {
    course.id = idx + 1 + '';
})

function display() {
    var htmls = listCourses.map(function (course) {
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

/**
 * Hàm để xử lý khi blur hoặc nhập vào ô input
 * @param {*} input 
 */
function handleBlurInput(input) {
    var errorElement = input.parentElement.querySelector('.form-message');
    input.onblur = function () {
        if (input.value.trim() === '') {
            errorElement.setAttribute('style', 'color: red; font-style: italic;');
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
createBtn.onclick = function () {
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
        listCourses.push(newCourse);
        display();
        courseName.value = '';
        description.value = '';
        coin.value = '';
    }

    function isRequired(input) {
        var errorElement = input.parentElement.querySelector('.form-message');
        if (input.value.trim() === '') {
            errorElement.setAttribute('style', 'color: red; font-style: italic;');
            errorElement.innerText = 'Yêu cầu nhập!';
            input.classList.add('invalid');
            return true;
        }
    }
}

var editId;
// Xử lý khi kích vào button Sửa
function onUpdate(id) {
    editId = id;
    // tìm khóa học muốn sửa
    var courseById = listCourses.find(function (course) {
        return course.id === editId;
    })

    courseName.value = courseById.name;
    description.value = courseById.description;
    coin.value = courseById.coin;

    createBtn.setAttribute('style', 'display: none');
    updateBtn.setAttribute('style', 'display: block');
}

updateBtn.onclick = function () {
    var editCourse = {
        id: editId,
        name: courseName.value,
        description: description.value,
        coin: coin.value
    }
    var idx = listCourses.findIndex(function (course) {
        return course.id === editId;
    })
    listCourses.splice(idx, 1, editCourse);
    display();
    createBtn.setAttribute('style', 'display: block');
    updateBtn.setAttribute('style', 'display: none');
    courseName.value = '';
    description.value = '';
    coin.value = '';
}

// Xử lý khi kích vào button Xóa
function onDelete(id) {
    if (confirm("Bạn có chắc muốn xóa?")) {
        var idx = listCourses.findIndex(function (course) {
            return course.id === id;
        })
        listCourses.splice(idx, 1);
        display();
    }
}