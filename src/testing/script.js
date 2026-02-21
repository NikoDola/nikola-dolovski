
const todoElement = document.querySelectorAll(".todo")
const observer = new IntersectionObserver((entries)=> {
  entries.forEach((entry) => {
    if(entry.isIntersecting){
      entry.target.classList.add('todoShow')
    }else{
      entry.target.classList.remove('todoShow')
    }
  })
}, {
  threshold:0.5
})

todoElement.forEach(el => observer.observe(el))