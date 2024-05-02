let signup = document.querySelector(".signup");
let login = document.querySelector(".login");
let slider = document.querySelector(".slider");
let formSection = document.querySelector(".form-section");
const login_email = document.getElementById("login_email");
const login_password = document.getElementById("login_password");
const reg_email = document.getElementById("reg_email");
const reg_pass = document.getElementById("reg_pass");
const reg_comPass = document.getElementById("reg_comPass");

signup.addEventListener("click", () => {
  slider.classList.add("moveslider");
  formSection.classList.add("form-section-move");
});

login.addEventListener("click", () => {
  slider.classList.remove("moveslider");
  formSection.classList.remove("form-section-move");
});

const registerUser = async () => {
  try {
    const email = reg_email.value;
    const password = reg_pass.value;
    const comPass = reg_comPass.value;

    if (password != comPass) {
      alert("please enter your password correctly");
    }

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    };

    const response = await fetch(
      "https://swiggy-mock.onrender.com/register",
      requestOptions
    );
    if (!response.ok) {
      throw new Error("Failed to register user");
    }

    const data = await response.json();

    console.log(data); // Log the response data
    if (data.message === "new user is registered") {
      alert("new user is registered");
      slider.classList.add("moveslider");
      formSection.classList.add("form-section-move");
    }
  } catch (error) {
    console.error(error);
  }
};

const loginUser = async () => {
  try {
    const email = login_email.value;
    const password = login_password.value;

    // console.log(email, password);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    };

    const response = await fetch(
      "https://swiggy-mock.onrender.com/login",
      requestOptions
    );
    if (!response.ok) {
      throw new Error("Failed to login user");
    }

    const data = await response.json();
    console.log(data); // Log the response data
    if (data.message === "user login successfully") {
      localStorage.setItem("token", data.token);
      alert("Login Successfull");
      window.location.href = "./dashboard.html";
    }
  } catch (error) {
    console.error(error);
  }
};
