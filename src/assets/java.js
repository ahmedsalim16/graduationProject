



 function showPass(){
  pwshowhide=document.querySelectorAll(".fa-eye-slash");
  pwshowhide.forEach(icon=>{
    icon.addEventListener('click',()=>{
    let getpwInput=icon.parentElement.querySelector("input")
    if(getpwInput.type==="password"){
        getpwInput.type="text";
        icon.classList.replace("fa-eye-slash","fa-eye");
    }
    else{
        getpwInput.type="password";
        icon.classList.replace("fa-eye","fa-eye-slash");
    }
  })
  });

 }

 


// function deleteStudent(id){
//   var x=id.parentNode.parentNode;
//   x.parentNode.removeChild(x);

// }
const signUpButton = document.getElementById('get');

const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});



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

