

document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.getElementById("sidebar");
  const pageContent = document.getElementById("page-content-wrapper");
  const toggleButton = document.getElementById("toggle-sidebar");

  toggleButton.addEventListener("click", function () {
    document.body.classList.toggle("sidebar-hidden");
  });
});

// document.addEventListener("DOMContentLoaded", function () {
//   const pwShowHide = document.querySelectorAll(".fa-eye-slash");

//   pwShowHide.forEach((icon) => {
//     icon.addEventListener("click", function () {
//       let getPwInput = this.parentElement.querySelector("input");

//       if (getPwInput.type === "password") {
//         getPwInput.type = "text";
//         this.classList.replace("fa-eye-slash", "fa-eye");
//       } else {
//         getPwInput.type = "password";
//         this.classList.replace("fa-eye", "fa-eye-slash");
//       }
//     });
//   });
// });



 


// function deleteStudent(id){
//   var x=id.parentNode.parentNode;
//   x.parentNode.removeChild(x);

// }
// const signUpButton = document.getElementById('get');

// const container = document.getElementById('container');

// signUpButton.addEventListener('click', () => {
// 	container.classList.add("right-panel-active");
// });

// signInButton.addEventListener('click', () => {
// 	container.classList.remove("right-panel-active");
// });

const edit=document.getElementById('edit');
const delet=document.getElementById('delete');

if (edit) {
    edit.addEventListener('mouseenter', () => {
      edit.classList.add("fa-flip");
    });
  
    edit.addEventListener('mouseleave', () => {
      edit.classList.remove("fa-flip");
    });
  }
  
  if (delet) {
    delet.addEventListener('mouseenter', () => {
      delet.classList.add("fa-bounce");
    });
  
    delet.addEventListener('mouseleave', () => {
      delet.classList.remove("fa-bounce");
    });
  }

// const { match } = require("assert");

    // let emailInp=document.getElementById('exampleInputEmail1');
    // let passlInp=document.getElementById('exampleInputPassword1');
    // let btn=document.getElementById('btn');
    
    // btn.addEventListener("mousemove",function(){
    //     if(emailInp.value !=="as0531869@gmail.com" || passlInp.value!=="123456")
    //     {
    //         let randomNumber1=Math.floor(Math.random()*301)
    //         let randomNumber2=Math.floor(Math.random()*301)
    
    //         btn.style=`position:absolute;top:${randomNumber1}px;left:${randomNumber2}`
    //     }
    //     else{
    //         btn.style=`position:relative;top:0px;left:0px`
    //     }
    // })

