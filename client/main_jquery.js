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

        var listElement = $('.list-courses');
        listElement.html(htmls.join(''));

    } catch (error) {
        errorElement.html('<p style="color: red; font-style: italic">Xảy ra lỗi khi lấy dữ liệu!</p>');
    }
}

display();

var createBtn = $('#create');
var updateBtn = $('#update');
var courseName = $('input[name="name"]');
var description = $('input[name="description"]');
var coin = $('input[name="coin"]');
var errorElement = $('.error');

function generateUuid() {
    return 'xxxx-xxxx-xxx-xxxx'.replace(/[x]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Xử lý validate khi blur vào ô input
function handleBlurInput(input) {
    var errorElement = input.parent().children()[3];
    input.blur(function () {
        if (input.val().trim() === '') {
            $(errorElement).attr('style', 'display: block; color: red; font-style: italic;');
            $(errorElement).text('Yêu cầu nhập!');
            input.addClass('invalid');
        } else {
            $(errorElement).attr('style', 'display: none;');
            input.removeClass('invalid');
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
createBtn.click(async function () {
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
            coin: Number(coin.val())
        }
        try {
            await axios({
                method: "POST",
                url: 'http://localhost:3000/courses',
                data: newCourse,
            })
            display();
            courseName.val('');
            description.val('');
            coin.val('');
        } catch (error) {
            errorElement.html('<p style="color: red; font-style: italic">Xảy ra lỗi khi thêm!</p>');
        }
    }

    function isRequired(input) {
        var errorElement = input.parent().children()[3];

        if (input.val().trim() === '') {
            $(errorElement).attr('style', 'display: block; color: red; font-style: italic;');
            $(errorElement).text('Yêu cầu nhập!');
            input.addClass('invalid');
            return true;
        } else {
            $(errorElement).attr('style', 'display: none;');
            input.removeClass('invalid');
            return false;
        }
    }
})

var editId;
// Xử lý khi kích vào button Sửa
async function onUpdate(id) {
    editId = id;
    try {
        // tìm khóa học muốn sửa
        var courseById = await axios.get(`http://localhost:3000/courses/${editId}`);
        courseById = courseById.data;

        courseName.val(courseById.name);
        description.val(courseById.description);
        coin.val(courseById.coin);

        createBtn.attr('style', 'display: none');
        updateBtn.attr('style', 'display: block');
    } catch (error) {
        errorElement.html('<p style="color: red; font-style: italic">Xảy ra lỗi khi lấy dữ liệu!</p>');
    }
}

updateBtn.click(async function () {
    var editCourse = {
        id: editId,
        name: courseName.val(),
        description: description.val(),
        coin: Number(coin.val())
    }
    try {
        await axios({
            method: "PUT",
            url: `http://localhost:3000/courses/${editId}`,
            data: editCourse,
        })
        display();
        createBtn.attr('style', 'display: block');
        updateBtn.attr('style', 'display: none');
        courseName.val('');
        description.val('');
        coin.val('');
    } catch (error) {
        errorElement.html('<p style="color: red; font-style: italic">Xảy ra lỗi khi sửa!</p>');
    }
})

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
            errorElement.html('<p style="color: red; font-style: italic">Xảy ra lỗi khi xóa!</p>');
        }
    }
}