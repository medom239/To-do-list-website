let textArea=document.querySelector(".add-task textarea");
let noContent=document.querySelector(".no-content");
let Add_btn=document.querySelector(".add-task button");
let tasks=document.querySelector(".tasks");
let alltasks=[];
if(window.localStorage.getItem("alltasks")){
    alltasks=JSON.parse(window.localStorage.getItem("alltasks"));
    
    alltasks.forEach((task) =>{
        createTask(task);
    })
    
    sortingTasks();
}
if(localStorage.getItem("backgroundColor")){
    document.body.style.backgroundImage=window.localStorage.getItem("backgroundColor");
}else{
    document.body.style.backgroundImage="url('To-do\ backgrounds/sun rising.jpg')";
}

function num_done(){
    return alltasks.filter((t) => t.complete === true).length;
}

function addTask(){
    /* save at local storage */
    
    if(textArea.value.trim() === ""){
        noContent.classList.add("visible");
    }else{
        const taskObj={
            id:Date.now(),
            text:textArea.value,
            complete:false
                }
                alltasks.push(taskObj);
                window.localStorage.setItem("alltasks",JSON.stringify(alltasks));
                
                /*       */ 
                createTask(taskObj);
                textArea.value="";
                num_done();
            }
            state();
        };
        
        
        function createTask(Obj){
            let div=`
            <div class="task">
            <input type="checkbox" class="done" ${Obj.complete?"checked" :''}>
            <textarea class="tasktext ${Obj.complete?"doneTemplate":''}" data-id='${Obj.id}' disabled>${Obj.text}</textarea>
            <div class="btns">
            <button class="edit" title=edit><i class="fa-solid fa-pen"></i></button>
            <button class="delete" title="delete"><i class="fa-solid fa-trash"></i></button>
            </div>
            </div>
            `
            
            tasks.insertAdjacentHTML("afterbegin",div);
            
            
            let taskText=tasks.firstElementChild.querySelector(".tasktext");
            taskText.style.height=taskText.scrollHeight + "px";
        }
        
        Add_btn.addEventListener("click",addTask);
        
        textArea.addEventListener("keydown",(e) =>{
            if(e.key ==="Enter" && !e.shiftKey){
                e.preventDefault();
                addTask();
            }
            
        })
        textArea.addEventListener("input",()=>{
            if(textArea.value.trim() !== ""){
                noContent.classList.remove("visible");
            }
        })
        
        
        /* delete btn */ 
        tasks.addEventListener("click",(e) =>{
            
            let div=e.target.closest(".task");
            if (!div) return;
            let content=div.querySelector(".tasktext");
            let id=content.dataset.id;
            
            if(e.target.closest(".delete")){
                div.remove();
                alltasks=alltasks.filter((task) =>task.id != id);
                window.localStorage.setItem("alltasks",JSON.stringify(alltasks));
                num_done();
            }
            if(e.target.closest(".done")){
                let Objct=alltasks.find((t) => t.id == id ) ;  /*شوف هنا انت ليه محطتش اقواس حوالين فانكشن ال t*/ /*{}*/ 
                Objct.complete = !Objct.complete ;
                
                if(div.dataset.timeoutId){       /*افتكر انت كتبت السطر ده ليه(عشان مشكله الضغط السريع على زر checkbox)*/ 
                    clearTimeout(Number(div.dataset.timeoutId));
                }
                
                if(Objct.complete === true){
                    content.classList.add("doneTemplate");
                    div.classList.add("completed");
                    let timeOut=setTimeout(() =>{
                        div.classList.remove("completed");
                        
                        sortingTasks();
                    },1000 );
                    
                    div.dataset.timeoutId =timeOut;
                }else{
                    content.classList.remove("doneTemplate");
                    div.classList.remove("completed");
                    sortingTasks();
                }
                window.localStorage.setItem("alltasks",JSON.stringify(alltasks));
                // state();
            }
            state();
            if( alltasks.length > 0 && num_done() === alltasks.length){
                confetti();
            }
            
            if(e.target.closest(".edit")){
                let editBtn=e.target.closest(".edit");
                content.classList.toggle("editable");
                if(content.classList.contains("editable")){
            editBtn.innerHTML='<i class="fa-solid fa-thumbs-up"></i>';
            content.disabled=false;
            content.focus();
            
            content.setSelectionRange(            /* ده كود عشان يخلي الفوكس يكون في نهايه التاسك مش في بدايته*/ 
                content.value.length,
                content.value.length );
            }
            else{
                saveEdit(content,div,id,editBtn);
            }
            
            
        }
    });
    
    tasks.addEventListener("keydown", (e) => {
        
        if (e.key === "Enter" && !e.shiftKey) {
            
            let content = e.target.closest(".tasktext");
            if (!content) return;
            
            if (!content.classList.contains("editable")) return;
            
            e.preventDefault();
            
            let div = content.closest(".task");
            let id = content.dataset.id;
            let editBtn = div.querySelector(".edit");
            
            saveEdit(content, div, id, editBtn);
            content.classList.remove("editable"); 
        }
        
    });
    
    function saveEdit(content,div,id,editBtn){
        content.disabled=true;
        editBtn.innerHTML='<i class="fa-solid fa-pen"></i>';
        
        let taskObj=alltasks.find((t) => t.id ==id);
        if(content.value.trim() !==""){
            taskObj.text=content.value;
            // content.style.height="auto";
            content.style.minHeight="37px";
            content.style.height=content.scrollHeight +"px";
        }else{
            alltasks=alltasks.filter((t) => t.id != id);
            div.remove();
        }
        window.localStorage.setItem("alltasks",JSON.stringify(alltasks));
        state();
    };
    
    
    let stateWord=document.querySelector(".state p");
    let complete_counter=document.querySelector(".complete_counter");
    const noTaskImage=document.createElement("img");
    noTaskImage.src="https://cdn-icons-png.flaticon.com/512/8476/8476679.png";
    noTaskImage.classList.add("no_tasksYet"); 
    function state(){
        complete_counter.innerHTML=`<P>${num_done()} <span>/</span> ${alltasks.length}</P>
        <span class="remaining">${alltasks.length - num_done()} Remaining</span>`;
        
        if(alltasks.length === 0){
            stateWord.innerHTML="No tasks yet ";
            
        }else if(num_done() === alltasks.length){
            stateWord.innerHTML="All done! Great job 🎉";
            
        }else if(num_done() === 0){
            stateWord.innerHTML="Let's get started!";
        }else{
            stateWord.innerHTML=`Keep it up 👏` ;
        }
        
        if( alltasks.length > 0 && num_done() === alltasks.length){
            complete_counter.classList.add("allDone");
        }else{
            complete_counter.classList.remove("allDone");
        }
        
        if(alltasks.length === 0){
            if (!tasks.contains(noTaskImage)) {
                tasks.appendChild(noTaskImage);
            }
        }else{
            if(tasks.contains(noTaskImage)){
                tasks.removeChild(noTaskImage);
            }
        }

        checkScreenSize();
    }
    state();

    // if(window.innerWidth <= 826 && window.innerWidth >=769){
    //     if(num_done() === alltasks.length){
    //         stateWord.style.fontSize="22px";
    //     }
    // }
    /* ده لحل مشكله الريسبونسف ديزاين حيث ان ال في المنطقه المذكوره في الكود الريماننج بيتداخل مع كلام ال ستييت  ف حطيتله خلفيه عشان يفضل ظاهر*/ 
    let remaining=document.querySelector(".remaining");
    function checkScreenSize(){
        let remaining=document.querySelector(".remaining");

    if(window.innerWidth <= 826 && window.innerWidth >= 769){
        if(num_done() === alltasks.length){
            remaining.style.backgroundColor = "green";
        }else{
            remaining.style.backgroundColor = "";
        }
    }else{
        remaining.style.backgroundColor = "";
    }

}

checkScreenSize();

window.addEventListener("resize", checkScreenSize);


    
            /* الجزء ده تبع الثيمز ولكن حطيتها هنا لان لازم تتحط بعد فنكشن ال state*/     
    if(localStorage.getItem("bodyTheme")){
        document.body.classList.add(`${localStorage.getItem("bodyTheme")}`);
        
        // if(localStorage.getItem("bodyTheme") == "evenningTheme" || localStorage.getItem("bodyTheme") == "blueskyTheme"){
        //         remaining.style.color="white";
        //     }else{
        //             remaining.style.color="";
        //         }
            }                     
            /*,==================================================================*/ 

function confetti(){
    const count = 200,
    defaults = { origin: { y: .7 } };
    
    function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, { particleCount: Math.floor(count * particleRatio) }));
    }
    fire(.25, {
        spread: 26,
        startVelocity: 55
    });
    fire(.2, { spread: 60 });
    fire(.35, {
        spread: 100,
        decay: .91,
        scalar: .8
    });
    fire(.1, {
        spread: 120,
        startVelocity: 25,
        decay: .92,
        scalar: 1.2
    });
    fire(.1, {
        spread: 120,
        startVelocity: 45
    });
}


let menu_toggle=document.querySelector(".menu_toggle");
let shortcutBtns=document.querySelector(".shortcut_btns .btns");
menu_toggle.addEventListener("click",() =>{
    shortcutBtns.classList.toggle("Btn_seen");
    
    menu_toggle.innerHTML=shortcutBtns.classList.contains("Btn_seen")?'<i class="fa-solid fa-x"></i>':'<i class="fa-solid fa-bars"></i>';
});

shortcutBtns.addEventListener("click",(e) =>{
    if(e.target.closest(".finishALL")){
        if(alltasks.length === 0) return;
        alltasks.forEach((obj) =>{
            obj.complete =true;
            let id=obj.id;
            let taskElement=tasks.querySelector(`.tasktext[data-id ='${id}']`);
            let div=taskElement.closest(".task");
            taskElement.classList.add("doneTemplate");
            let inp=div.querySelector("input[type=checkbox]");
            inp.checked =true;
        })
        window.localStorage.setItem("alltasks",JSON.stringify(alltasks));
        confetti();
        state();
    }
    
    if(e.target.closest(".deleteALL")){
        if(alltasks.length === 0) return;
        
        let confiirm=confirm("that will delete all tasks");
        if(!confiirm) return;
        alltasks=[];
        window.localStorage.setItem("alltasks",JSON.stringify(alltasks));
        tasks.innerHTML="";
        state();
        
    }
    
    if(e.target.closest(".deleteCompleted")){
        if(num_done() == 0) return;
        
        let confiirm=confirm("that will delete the completed tasks");
        if(!confiirm) return;
        
        alltasks=alltasks.filter((t) => t.complete !== true);
        window.localStorage.setItem("alltasks",JSON.stringify(alltasks));
        let done_textTasks=tasks.querySelectorAll(".doneTemplate");
        done_textTasks.forEach((one) =>{
            let done_tasks=one.closest(".task");
            done_tasks.remove();
        })
        state();
        
    }
})

function sortingTasks(){   /*افهم الكود ده ولازم تراجع على الاراي سورتنج*/ 
    alltasks.sort((a,b) =>{
        return Number(a.complete) - Number(b.complete);
    });
    
    let currentOrder = [...tasks.children].map(el => el.querySelector(".tasktext")?.dataset.id);
    let desiredOrder = alltasks.map(obj => String(obj.id));
    
    //لو الترتيب already صحيح، مفيش داعي تلمس أي حاجة خالص
    if(JSON.stringify(currentOrder) === JSON.stringify(desiredOrder)){
        window.localStorage.setItem("alltasks", JSON.stringify(alltasks));
        return;
    }
    
    alltasks.forEach((obj) =>{
        let textTask=tasks.querySelector(`.tasktext[data-id ="${obj.id}"]`);
        
        if (textTask) {
            let task = textTask.closest(".task");
            if(task.classList.contains("completed")) return;
            tasks.appendChild(task);
        }
    })
    
    
    window.localStorage.setItem("alltasks",JSON.stringify(alltasks));
}

    /* themes كود ال*/ 
// let eachbtn=document.querySelectorAll(".shortcut_btns .btns button");
let themes_arrow=document.querySelector(".themes_arrow");
let selected;
let themes_btns=document.querySelector(".themes-btns");
let Butns=themes_btns.querySelectorAll("button");
themes_btns.querySelector(".sunSight").classList.add("selected_theme");

themes_btns.addEventListener("click",(e) => {
    let bodyTheme;
    if(e.target.closest(".sunSight")){
        document.body.style.backgroundImage="url('To-do\ backgrounds/sun rising.jpg')";
        document.body.classList.remove("evenningTheme","seeTheme","blueskyTheme");
        bodyTheme="";
        remaining.style.color="";
    }
    
    if(e.target.closest(".evenning")){
        document.body.style.backgroundImage="url('To-do\ backgrounds/enhanced_night_city.png')";
        document.body.classList.remove("seeTheme","blueskyTheme");
        document.body.classList.add("evenningTheme");
        bodyTheme="evenningTheme";
        remaining.style.color="white";
    }
    
    if(e.target.closest(".blueSky")){
        document.body.style.backgroundImage="url('To-do\ backgrounds/pexels-pixabay-355465.jpg')";
        document.body.classList.remove("evenningTheme","seeTheme");
        document.body.classList.add("blueskyTheme");
        bodyTheme="blueskyTheme";
        remaining.style.color="white";
        
    }
    
    if(e.target.closest(".see")){
        document.body.style.backgroundImage="url('To-do\ backgrounds/pexels-photo-30855449.avif')";
        document.body.classList.remove("evenningTheme","blueskyTheme");
        document.body.classList.add("seeTheme");
        bodyTheme="seeTheme";
        remaining.style.color="";
    }
    
    if(e.target.closest("button")){
        selected=e.target.closest("button");
        
    }
    if(e.target.closest("button")){
        Butns.forEach((btn) =>{
            btn.classList.remove("selected_theme");
            e.target.closest("button").classList.add("selected_theme");
        })
    }
    // console.log(document.body.classList[0]);
    localStorage.setItem("bodyTheme",bodyTheme);
    localStorage.setItem("selectedTheme",selected.classList[0]);
    window.localStorage.setItem("backgroundColor",document.body.style.backgroundImage);
})
if(window.localStorage.getItem("backgroundColor")){
    Butns.forEach((btn) =>{
        btn.classList.remove("selected_theme");
    })
    selected=themes_btns.querySelector(`.${localStorage.getItem("selectedTheme")}`);
    selected.classList.add("selected_theme");
}
let arrowIcon=themes_arrow.querySelector("i");
themes_arrow.addEventListener("click",() =>{
    themes_btns.classList.toggle("themes-btnsAppeare");
    if(arrowIcon.classList.contains("fa-arrow-down-long")){
        arrowIcon.classList.remove("fa-arrow-down-long");
        arrowIcon.classList.add("fa-arrow-up-long");
    }else{
        arrowIcon.classList.remove("fa-arrow-up-long");
        arrowIcon.classList.add("fa-arrow-down-long");
    }
})

// window.addEventListener("resize",(() => {
//     console.log(innerWidth);
// }))