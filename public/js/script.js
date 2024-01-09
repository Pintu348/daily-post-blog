const socket = io();
    //  socket.on("connect", () => {
    //     console.log("this is your home page");
    // });  
    // socket.emit("test", { email: "pintu@gmail.com" }); 
    socket.on("postLiked", (data) => {
        const postLiked = document.getElementById(`count${data.id}`);
        if (data.likes) {
            if(data.likes == 1)
            {
            postLiked.innerHTML = data.likes + " Like";
            }
            else{
            postLiked.innerHTML = data.likes + " Likes";
            }
        }
        else {
            postLiked.innerHTML = '';
        }
});

async function favoritePost(id) {
    try {
        const res = await fetch("/favoritePost", {
            method: "POST",
            body: JSON.stringify({
                id: id
            }),
            headers: {
                "Content-type": "application/json"
            }
        })
        const value = await res.json();
        const list = document.getElementById(`btn${id}`);
        list.setAttribute("class", value.attribute);
        list.setAttribute("title", value.title);
    }
    catch (err) {
        location.replace("/login");
    }
}
async function likedPost(id) {      
    try {
        const res = await fetch("/likedPost", {
            method: "POST",
            body: JSON.stringify({
                postId: id
            }),
            headers: {
                "Content-type": "application/json"
            }
        })
        const value = await res.json();
        const list = document.getElementById(`lbtn${id}`);
        list.setAttribute("class", value.attribute);
        const liked = document.getElementById(`count${id}`);
        if(value.likesCount>0)
        {
            if(value.likesCount==1)
            {
                    liked.innerHTML = value.likesCount + " Like";
            }
            else{
            liked.innerHTML = value.likesCount + " Likes";
            }
        }
        else{
            liked.innerHTML = " "
        }
    }
    catch (err) {
        location.replace("/login");
    }
}  