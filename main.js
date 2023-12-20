var courses = [
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

function display() {
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

    var listElement = $('.list-courses');
    listElement.html(htmls.join(''));
}

display();

var createBtn = $('#create');
var updateBtn = $('#update');
var courseName = $('input[name="name"]');
var description = $('input[name="description"]');
var coin = $('input[name="coin"]');

function generateUuid() {
    return 'xxxx-xxxx-xxx-xxxx'.replace(/[x]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Xử lý validate khi blur hoặc nhập vào ô input
function handleBlurInput(input) {
    var errorElement = input.parent().children()[3];
    input.blur(function () {
        if (input.val().trim() === '') {
            $(errorElement).attr('style', 'color: red; font-style: italic;');
            $(errorElement).text('Yêu cầu nhập!');
            input.addClass('invalid');
        }
    })

    input.on('input', function () {
        $(errorElement).attr('style', 'display: none;');
        input.removeClass('invalid');
    })
}

handleBlurInput(courseName);
handleBlurInput(description);
handleBlurInput(coin);

// Xử lý khi kích vào button Thêm
createBtn.click(function (e) {
    e.preventDefault();
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
            name: courseName.val(),
            description: description.val(),
            coin: coin.val()
        }
        courses.push(newCourse);
        display();
        courseName.val('');
        description.val('');
        coin.val('');
    }

    function isRequired(input) {
        var errorElement = input.parent().children()[3];

        if (input.val().trim() === '') {
            $(errorElement).attr('style', 'color: red; font-style: italic;');
            $(errorElement).text('Yêu cầu nhập!');
            input.addClass('invalid');
            return true;
        }
    }
})

var editId;
// Xử lý khi kích vào button Sửa
function onUpdate(id) {
    editId = id;
    // tìm khóa học muốn sửa
    var courseById = courses.find(function (course) {
        return course.id === editId;
    })

    courseName.val(courseById.name);
    description.val(courseById.description);
    coin.val(courseById.coin);

    createBtn.attr('style', 'display: none');
    updateBtn.attr('style', 'display: block');
}

// Xử lý sửa khóa học
updateBtn.click(function (e) {
    e.preventDefault();
    var editCourse = {
        id: editId,
        name: courseName.val(),
        description: description.val(),
        coin: coin.val()
    }
    var idx = courses.findIndex(function (course) {
        return course.id === editId;
    })
    courses.splice(idx, 1, editCourse);
    display();
    createBtn.attr('style', 'display: block');
    updateBtn.attr('style', 'display: none');
    courseName.val('');
    description.val('');
    coin.val('');
})

// Xử lý khi kích vào button Xóa
function onDelete(id) {
    if (confirm("Bạn có chắc muốn xóa?")) {
        var idx = courses.findIndex(function (course) {
            return course.id === id;
        })
        courses.splice(idx, 1);
        display();
    }
}