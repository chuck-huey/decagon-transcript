const urlParams = new URLSearchParams(window.location.search);
const getUrl = `http://localhost:3000/students?email=${urlParams.get("email")}`;

if (urlParams.has("email")) {
  $.get(getUrl, function(data) {
    let student = data[0];
    $("#firstname").val(data[0].firstname);
    $("#lastname").val(data[0].lastname);
    $("#matric").val(data[0].matric_number);
    $("#email").val(data[0].email);
    $("#gender")
      .val(data[0].gender)
      .attr("selected", "selected");
    $("#department").val(data[0].department);
    $("#faculty").val(data[0].faculty);
    $("#adm-year").val(data[0].year_of_admission);
    $("#grad-year").val(data[0].graduation_year);
    $("#cgpa").val(data[0].graduation_year);
  });
}

$(document).ready(function() {
  let successDiv = $(".success");
  let errorDiv = $(".error");

  const student_form = $("form");
  student_form.submit(function(e) {
    e.preventDefault();
    let firstname = $("#firstname").val();
    let lastname = $("#lastname").val();
    let matric = $("#matric").val();
    let email = $("#email").val();
    let gender = $("#gender").val();
    let department = $("#department").val();
    let faculty = $("#faculty").val();
    let adm_year = $("#adm-year").val();
    let grad_year = $("#grad-year").val();
    let cgpa = $("#cgpa").val();
    const url = $(this).attr("action");

    let formdata = {
      firstname,
      lastname,
      matric,
      email,
      gender,
      department,
      faculty,
      adm_year,
      grad_year,
      cgpa,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    $.ajax({
      type: "POST",
      url,
      data: formdata
    })
      .done(res => {
        successDiv.fadeIn().text("Student Added Successfully");
      })
      .fail(err => {
        errorDiv.fadeIn().text("There was an error. Please try again");
      });
  });
});

function name(params) {}