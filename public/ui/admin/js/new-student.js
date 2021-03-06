$(document).ready(function() {
  const student_form = $("form");

  student_form.submit(function(e) {
    e.preventDefault();
    // Form validation
    let valid = $(this).validate({
      rules: {
        firstname: "required",
        lastname: "required",
        matric: "required",
        email: {
          required: true,
          email: true
        },
        gender: "required",
        department: "required",
        faculty: "required",
        adm_year: {
          required: true,
          number: true
        },
        grad_year: {
          required: true,
          number: true
        },
        cgpa: "required"
      },
      messages: {
        name: "Please specify your name",
        email: {
          required: "We need your email address to contact you",
          email: "Your email address must be in the format of name@domain.com"
        },
        adm_year: {
          number: "Please enter a valid year"
        },
        grad_year: {
          number: "Please enter a valid year"
        }
      }
    });

    if (valid.form()) {
      const student_email = $("#email").val();
      const matric_number = $("#matric").val();

      $.when(
        $.get(`${baseUrl}students?email=${student_email}`),
        $.get(`${baseUrl}students?matric=${matric_number}`)
      ).then(function(res1, res2) {
        if (res1[0].length === 0 && res2[0].length === 0) {
          const url = `${baseUrl}students`;
          const password = generatePassword();
          const encrypted = CryptoJS.AES.encrypt(password, student_email);

          // Get form values
          let formData = {
            firstname: $("#firstname")
              .val()
              .toLowerCase(),
            lastname: $("#lastname")
              .val()
              .toLowerCase(),
            matric: matric_number,
            password: encrypted.toString(),
            email: student_email,
            gender: $("#gender")
              .val()
              .toLowerCase(),
            department: $("#department")
              .val()
              .toLowerCase(),
            faculty: $("#faculty")
              .val()
              .toLowerCase(),
            adm_year: $("#adm-year").val(),
            grad_year: $("#grad-year").val(),
            cgpa: $("#cgpa").val(),
            createdAt: new Date(),
            updatedAt: new Date()
          };

          // Create student
          $.ajax({
            type: "POST",
            url,
            data: formData
          })
            .done(res => {
              $("form")[0].reset();
              const email = res.email;
              let name = res.firstname;

              Email.send({
                Host: "smtp.gmail.com",
                Username: "ekrresaochuko@gmail.com",
                Password: "Aurora@845",
                To: email,
                From: "support@decagonuniversity.com",
                Subject: "Decagon University: Transcript Request",
                Body: `Hello ${name.toUpperCase()},<p>You have been registered to use our online platform to request for your transcripts.</p>
                <p>Your password is <strong>${password}</strong></p><p>Please guard it closely as we will not be liable for any breach as a result of stolen password.</p><p>Below is the link to sign in to apply for your transcripts.</p><br><a href="https://decagon-transcript.herokuapp.com/" target="_blank">https://decagon-transcript.herokuapp.com/</a><br><br>Regards,<br>Decagon University`
              }).then(message => {
                swal({
                  title: "Good job!",
                  text: "Student created successfully",
                  icon: "success",
                  button: "Close"
                });
              });
            })
            .fail(err => {
              swal({
                title: "Oops!",
                text: "An error occurred. Please try again!",
                icon: "error",
                button: "Close"
              });
            });
        } else {
          swal({
            title: "Error!",
            text: "Student with this email/matric number has been registered!",
            icon: "error",
            button: "Close"
          });
          return;
        }
      });

      return;
    }
  });
});

function generatePassword() {
  return Math.random()
    .toString(36)
    .slice(-8);
}
