document.querySelector(".addBtn").addEventListener('click',newElement);




//Making the List Check:
var checkList = document.querySelector('ul');
checkList.addEventListener('click',function(el){
    if(el.target.tagName === 'LI')
        el.target.classList.toggle('checked');       
},false);

//Closing the List Values ON-CLICK of CLOSE button:
var close = document.getElementsByClassName("close");
for(var i=0;i< close.length;i++)
{
    close[i].onclick = function(){
        var current = this.parentElement;
        current.style.display = 'none';
    }
}

//Creating New List Items:
function newElement()
{
    var newList = document.createElement("li");
    var input = document.querySelector("#myInput").value;
    var newText = document.createTextNode(input);
    newList.appendChild(newText);

    if(input === '')
        alert("Type something to Add to the List");
    else
        document.querySelector("#myUL").appendChild(newList);
    
    input.textContent="";
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    newList.appendChild(span);

    for (i = 0; i < close.length; i++) 
    {
        close[i].onclick = function() {
        var div = this.parentElement;
        div.style.display = "none";
        }
    }
}
